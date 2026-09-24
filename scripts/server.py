#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
RIKKEI WORKSPACE - INTELLIGENT DASHBOARD SERVER (V4.1)
=============================================================================
Tính năng:
1. Phục vụ Web Server tĩnh cho Dashboard v1 và các Module (Frontend, Database...).
2. Hỗ trợ API endpoint /api/sync để người dùng bấm nút trên Dashboard là tự động
   đồng bộ dữ liệu từ Google Drive (RK-MODULE2-DATABASE).
3. Hỗ trợ API endpoint /api/ollama kiểm tra tình trạng Local AI.
4. Tự động mở trình duyệt mặc định khi khởi động.
5. Không cần cài thêm bất kỳ thư viện ngoài nào (100% Python Standard Library).
=============================================================================
"""

import os
import sys
import json
import webbrowser
import threading
import urllib.request
from pathlib import Path
from http.server import HTTPServer, SimpleHTTPRequestHandler

# Cấu hình encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

ROOT_DIR = Path(__file__).resolve().parent.parent
DASHBOARD_DIR = ROOT_DIR / 'Dashboard_v1'

# Nạp module sync nội bộ
sys.path.insert(0, str(Path(__file__).resolve().parent))
try:
    import sync_database
except ImportError:
    sync_database = None

DEFAULT_PORT = 8000


class IntelligentWorkspaceHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Mặc định thư mục phục vụ là thư mục cha để iframe xem được cả Module 1, Module 2...
        super().__init__(*args, directory=str(ROOT_DIR), **kwargs)

    def do_GET(self):
        # Điều hướng trang chủ về Dashboard v1
        if self.path in ('/', '/index.html'):
            self.send_response(302)
            self.send_header('Location', '/Dashboard_v1/index.html')
            self.end_headers()
            return

        # API kiểm tra Ollama
        if self.path == '/api/ollama':
            self.handle_ollama_check()
            return

        # API đồng bộ dữ liệu
        if self.path == '/api/sync':
            self.handle_sync()
            return

        # Phục vụ file tĩnh
        super().do_GET()

    def do_POST(self):
        if self.path == '/api/sync':
            self.handle_sync()
            return
        self.send_error(404, "Endpoint not found")

    def handle_sync(self):
        """Xử lý yêu cầu đồng bộ từ nút bấm trên giao diện Web"""
        try:
            if not sync_database:
                raise RuntimeError("Module sync_database.py chưa sẵn sàng.")
            success, msg = sync_database.sync_all()
            response_data = {
                "success": success,
                "message": msg,
                "status": "COMPLETED"
            }
            status_code = 200 if success else 500
        except Exception as e:
            response_data = {
                "success": False,
                "message": f"Lỗi đồng bộ: {str(e)}",
                "status": "ERROR"
            }
            status_code = 500

        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode('utf-8'))

    def handle_ollama_check(self):
        """Kiểm tra tình trạng service Ollama local"""
        is_online = False
        models = []
        try:
            req = urllib.request.Request('http://127.0.0.1:11434/api/tags', timeout=2)
            with urllib.request.urlopen(req) as resp:
                if resp.status == 200:
                    data = json.loads(resp.read().decode('utf-8'))
                    is_online = True
                    models = [m.get('name') for m in data.get('models', [])]
        except Exception:
            pass

        response_data = {
            "online": is_online,
            "models": models,
            "recommended": "qwen2.5-coder:7b" if "qwen2.5-coder:7b" in models else (models[0] if models else "")
        }
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode('utf-8'))

    def end_headers(self):
        # Tắt cache để luôn nhận code mới nhất khi phát triển
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()


def start_server(port=DEFAULT_PORT):
    server_address = ('', port)
    try:
        httpd = HTTPServer(server_address, IntelligentWorkspaceHandler)
    except OSError:
        # Nếu cổng 8000 bận, chuyển sang cổng 8001
        port = port + 1
        server_address = ('', port)
        httpd = HTTPServer(server_address, IntelligentWorkspaceHandler)

    url = f"http://localhost:{port}/Dashboard_v1/index.html"
    print("="*65)
    print("   🎓 RIKKEI WORKSPACE - INTELLIGENT SERVER ĐÃ KHỞI CHẠY 🎓")
    print("="*65)
    print(f"  👉 Địa chỉ Dashboard: {url}")
    print(f"  👉 API Đồng bộ:      http://localhost:{port}/api/sync")
    print("  👉 Nhấn Ctrl + C để dừng máy chủ.")
    print("="*65)

    # Tự động mở trình duyệt sau 1 giây
    threading.Timer(1.0, lambda: webbrowser.open(url)).start()

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[Server] Đã tắt máy chủ web an toàn.")
        httpd.server_close()


if __name__ == '__main__':
    port_arg = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].isdigit() else DEFAULT_PORT
    start_server(port_arg)
