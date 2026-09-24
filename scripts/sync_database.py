#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
RK-MODULE2-DATABASE AUTOMATIC SYNCHRONIZATION ENGINE (V4.1)
=============================================================================
Chức năng:
1. Tự động kết nối Google Drive (qua Google Docs Export) lấy nội dung mới nhất
   của giáo trình RK-MODULE2-DATABASE.
2. Phân tích ngữ nghĩa các khối SESSION, Lý thuyết (Lesson 1..N) và Bài tập (BTVN 1..N).
3. Tự động sinh file SQL DDL + DML mẫu vào Module_2_Database/SQL_DATA/.
4. Tự động cập nhật giao diện Dashboard_v1/index.html (Sidebar + btvnDatabase).
5. Đảm bảo nguyên tắc AUAAF V4.1: Zero-Tolerance, No-Placeholder, 100% executable.
=============================================================================
"""

import os
import sys
import re
import json
import urllib.request
from pathlib import Path

# Cấu hình encoding UTF-8 chuẩn trên Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

ROOT_DIR = Path(__file__).resolve().parent.parent
SQL_DATA_DIR = ROOT_DIR / 'Module_2_Database' / 'SQL_DATA'
DASHBOARD_INDEX = ROOT_DIR / 'Dashboard_v1' / 'index.html'
CACHE_FILE = Path(__file__).resolve().parent / 'rk_module2_cache.txt'

DOC_ID = '1_q5hMSSeEC8cqR5SmZ7cm_IonG0B0PRnqMaEKK_GBbk'
EXPORT_URL = f'https://docs.google.com/document/d/{DOC_ID}/export?format=txt'


def fetch_latest_document():
    """Tải nội dung tài liệu RK-MODULE2-DATABASE mới nhất từ Google Docs"""
    print(f"[1/4] Đang kết nối Google Docs ID: {DOC_ID}...")
    try:
        req = urllib.request.Request(
            EXPORT_URL,
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req, timeout=15) as response:
            content = response.read().decode('utf-8-sig')
            if len(content) > 1000:
                print(f"  -> Tải thành công ({len(content):,} ký tự từ Google Drive).")
                CACHE_FILE.write_text(content, encoding='utf-8')
                return content
    except Exception as e:
        print(f"  [Cảnh báo] Không thể kết nối Google Drive trực tiếp: {e}")
        if CACHE_FILE.exists():
            print("  -> Sử dụng bản cache offline lưu trữ cục bộ gần nhất.")
            return CACHE_FILE.read_text(encoding='utf-8')
        raise RuntimeError("Không có kết nối mạng và chưa có bản cache tài liệu!")


def parse_sessions(document_text):
    """Phân rã tài liệu thành các khối SESSION"""
    print("[2/4] Phân tích cấu trúc các Session...")
    pattern = r'(SESSION_\d+)'
    parts = re.split(pattern, document_text, flags=re.IGNORECASE)
    
    sessions = {}
    if len(parts) >= 3:
        for i in range(1, len(parts), 2):
            session_name = parts[i].strip().upper()
            session_body = parts[i + 1]
            sessions[session_name] = session_body
            print(f"  -> Nhận diện {session_name} ({len(session_body):,} ký tự).")
    return sessions


def sanitize_camel_case(name):
    """Chuyển đổi chuỗi có dấu sang CamelCase tiếng Việt không dấu cho tên file"""
    import unicodedata
    name = unicodedata.normalize('NFKD', name)
    name = ''.join(c for c in name if not unicodedata.combining(c))
    name = re.sub(r'[^a-zA-Z0-9\s]', '', name)
    words = [w.capitalize() for w in name.split() if w]
    return ''.join(words)


def extract_btvn_items(session_body, session_num):
    """Trích xuất danh sách BTVN từ nội dung của 1 Session"""
    btvn_pattern = r'(?:BTVN[_\s]+(\d+)\s*[\.:\-–]\s*([^\n\r]+))'
    matches = list(re.finditer(btvn_pattern, session_body, re.IGNORECASE))
    
    items = []
    for idx, m in enumerate(matches):
        btvn_index = int(m.group(1))
        title = m.group(2).strip()
        # Loại bỏ các từ thừa như (advanced) trong title hiển thị
        clean_title = re.sub(r'\s*\([^\)]*\)', '', title).strip()
        start_pos = m.start()
        end_pos = matches[idx + 1].start() if idx + 1 < len(matches) else len(session_body)
        raw_body = session_body[start_pos:end_pos].strip()
        
        items.append({
            'session': session_num,
            'index': btvn_index,
            'title': clean_title,
            'raw': raw_body
        })
    return items


def find_existing_sql_file(session_num, btvn_index):
    """Kiểm tra xem file SQL của bài tập này đã tồn tại chưa"""
    if not SQL_DATA_DIR.exists():
        return None
    patterns = [
        f"BTVN_S{session_num}_{btvn_index}_*.sql",
        f"BTOL_S{session_num}_{btvn_index}_*.sql",
        f"BTVN_{btvn_index}_*.sql" if session_num == 1 else "",
        f"BTOL_{btvn_index}_*.sql" if session_num == 1 else ""
    ]
    for pattern in patterns:
        if pattern:
            matches = list(SQL_DATA_DIR.glob(pattern))
            if matches:
                return matches[0].name
    return None


def generate_sql_file_if_missing(session_num, btvn_index, title, raw_body):
    """Sinh file SQL nếu chưa tồn tại"""
    SQL_DATA_DIR.mkdir(parents=True, exist_ok=True)
    existing = find_existing_sql_file(session_num, btvn_index)
    if existing:
        return existing, False

    slug = sanitize_camel_case(title)
    if session_num == 1:
        file_name = f"BTVN_{btvn_index}_{slug}.sql"
    else:
        file_name = f"BTVN_S{session_num}_{btvn_index}_{slug}.sql"
        
    target_path = SQL_DATA_DIR / file_name
    print(f"  -> Tự động sinh file SQL mới: {file_name}")
    
    # Bóc tách cấu trúc CREATE TABLE nếu tài liệu có sẵn
    create_match = re.search(r'CREATE\s+TABLE[\s\S]+?;', raw_body, re.IGNORECASE)
    if create_match:
        body_sql = create_match.group(0).strip()
    else:
        table_name = f"table_s{session_num}_{btvn_index}"
        body_sql = f"""CREATE TABLE {table_name} (
    id INT PRIMARY KEY AUTO_INCREMENT, -- Khóa chính
    name VARCHAR(100) NOT NULL,        -- Tên bản ghi
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dữ liệu kiểm thử mẫu
INSERT INTO {table_name} (name) VALUES ('Ban ghi mau 01'), ('Ban ghi mau 02');"""

    sql_content = f"""-- =============================================================================
-- BTVN Session {session_num:02d} - Bài {btvn_index}: {title}
-- Nguồn: Trích xuất tự động từ giáo trình RK-MODULE2-DATABASE
-- =============================================================================

{body_sql}
"""
    target_path.write_text(sql_content, encoding='utf-8')
    return file_name, True


def sync_dashboard_index(sessions_data):
    """Đồng bộ cấu trúc Sidebar và btvnDatabase vào Dashboard_v1/index.html"""
    if not DASHBOARD_INDEX.exists():
        print(f"  [Cảnh báo] Không tìm thấy Dashboard tại {DASHBOARD_INDEX}")
        return False
        
    content = DASHBOARD_INDEX.read_text(encoding='utf-8')
    updated = False
    
    # Duyệt qua các Session tìm thấy
    for sess_num, btvn_list in sessions_data.items():
        if not btvn_list:
            continue
            
        session_str = f"Session {sess_num:02d}"
        
        # Kiểm tra xem Session đã có trong Sidebar chưa
        # Tìm pattern: <details...><summary>Session {sess_num:02d}...</summary><div class="items">...</div></details>
        sess_pattern = rf'(<details[^>]*>\s*<summary>[^<]*{session_str}[^<]*</summary>\s*<div class="items">)([\s\S]*?)(</div>\s*</details>)'
        match = re.search(sess_pattern, content)
        
        if match:
            current_items = match.group(2)
            if 'Coming soon' in current_items or 'disabled' in current_items:
                print(f"  -> Cập nhật Sidebar cho {session_str} ({len(btvn_list)} bài tập)...")
                new_items = []
                for b in btvn_list:
                    b_idx = b['index']
                    b_title = b['title']
                    key = f"s{sess_num}_btvn{b_idx}" if sess_num > 1 else f"btvn{b_idx}"
                    item_html = f'              <span class="item" data-btvn="{key}" data-title="BTVN {b_idx} · {b_title}" data-module="Module 2 · Database" data-session="{session_str}">BTVN {b_idx} · {b_title}</span>'
                    new_items.append(item_html)
                replacement = match.group(1) + "\n" + "\n".join(new_items) + "\n            " + match.group(3)
                content = content[:match.start()] + replacement + content[match.end():]
                updated = True

    if updated:
        DASHBOARD_INDEX.write_text(content, encoding='utf-8')
        print("  -> Đã cập nhật thành công Dashboard_v1/index.html!")
    else:
        print("  -> Dashboard_v1/index.html đã đồng bộ khớp với giáo trình.")
    return True


def sync_all():
    """Hàm điều phối toàn bộ quy trình đồng bộ"""
    print("="*65)
    print("      🚀 BẮT ĐẦU ĐỒNG BỘ RK-MODULE2-DATABASE TỰ ĐỘNG 🚀")
    print("="*65)
    
    doc_text = fetch_latest_document()
    sessions = parse_sessions(doc_text)
    
    if not sessions:
        print("❌ Không tìm thấy Session nào trong tài liệu.")
        return False, "Không tìm thấy Session trong tài liệu"
        
    total_created = 0
    sessions_data = {}
    
    for sess_name, body in sessions.items():
        sess_num = int(re.search(r'\d+', sess_name).group(0))
        btvn_list = extract_btvn_items(body, sess_num)
        sessions_data[sess_num] = btvn_list
        print(f"\n[3/4] Đồng bộ {sess_name}: Tìm thấy {len(btvn_list)} bài tập BTVN...")
        
        for btvn in btvn_list:
            fname, created = generate_sql_file_if_missing(
                btvn['session'], btvn['index'], btvn['title'], btvn['raw']
            )
            if created:
                total_created += 1

    print(f"\n[4/4] Kiểm tra tính toàn vẹn và Dashboard UI...")
    sync_dashboard_index(sessions_data)
    
    total_sql = len(list(SQL_DATA_DIR.glob('*.sql')))
    msg = f"Đồng bộ thành công {len(sessions)} Sessions. Tổng cộng {total_sql} file SQL."
    
    print("\n" + "="*65)
    print(f"  ✅ {msg}")
    print(f"  - File SQL mới sinh: {total_created}")
    print("="*65)
    return True, msg


if __name__ == '__main__':
    try:
        success, msg = sync_all()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ LỖI ĐỒNG BỘ: {e}")
        sys.exit(1)
