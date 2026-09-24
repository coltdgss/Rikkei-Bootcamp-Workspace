import sys

patch_module = """def build_module_index(module_dir):
    html_files = scan_html_files(module_dir)
    groups = {}
    for path in html_files:
        rel = path.relative_to(module_dir)
        if len(rel.parts) > 1:
            group = rel.parts[0]
        else:
            group = 'Root'
        groups.setdefault(group, []).append(rel)

    title = f'Dashboard Bài Tập - {module_dir.name}'
    header = f'🚀 Danh Sách Bài Tập {module_dir.name.replace("_", " ")}'
    if module_dir.name == 'Module_1_Frontend':
        title = 'Dashboard Bài Tập - Module 1'
        header = '🚀 Danh Sách Bài Tập Module 1: Frontend Basic'

    lines = [
        '<!DOCTYPE html>',
        '<html lang="vi">',
        '<head>',
        '  <meta charset="UTF-8" />',
        '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
        f'  <title>{title}</title>',
        '  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">',
        '  <style>',
        '    :root {',
        '      --bg-main: #121212;',
        '      --bg-card: #1f1f1f;',
        '      --text-main: #e0e0e0;',
        '      --text-muted: #aaaaaa;',
        '      --accent: #ff5252;',
        '      --link: #64b5f6;',
        '      --badge-bg: #333333;',
        '      --badge-text: #cccccc;',
        '      --shadow: rgba(0,0,0,0.5);',
        '      --border: #333333;',
        '    }',
        '    :root.light-mode {',
        '      --bg-main: #f4f7f6;',
        '      --bg-card: #ffffff;',
        '      --text-main: #333333;',
        '      --text-muted: #555555;',
        '      --accent: #d32f2f;',
        '      --link: #0066cc;',
        '      --badge-bg: #eeeeee;',
        '      --badge-text: #555555;',
        '      --shadow: rgba(0,0,0,0.1);',
        '      --border: #dddddd;',
        '    }',
        '    body { font-family: "Inter", sans-serif; background-color: var(--bg-main); color: var(--text-main); padding: 20px; transition: background-color 0.3s, color 0.3s; margin: 0; }',
        '    .container { max-width: 900px; margin: 20px auto; background: var(--bg-card); padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px var(--shadow); transition: background-color 0.3s; position: relative; }',
        '    h1 { text-align: center; color: var(--accent); margin-top: 0; }',
        '    .session { margin-bottom: 24px; border-left: 4px solid var(--accent); padding-left: 15px; }',
        '    .session h2 { font-size: 1.2rem; color: var(--text-main); margin-bottom: 10px; }',
        '    ul { list-style-type: none; padding: 0; }',
        '    li { margin: 10px 0; display: flex; align-items: center; flex-wrap: wrap; gap: 10px; }',
        '    a.exercise-link { text-decoration: none; color: var(--link); font-weight: 600; font-size: 1.05rem; }',
        '    a.exercise-link:hover { color: var(--accent); text-decoration: underline; }',
        '    .badge { background: var(--badge-bg); padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; color: var(--badge-text); border: 1px solid var(--border); }',
        '    .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 15px; }',
        '    .back-btn { display: inline-block; padding: 10px 20px; background: var(--accent); color: #fff !important; text-decoration: none; border-radius: 8px; font-weight: 600; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 6px var(--shadow); }',
        '    .back-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 12px var(--shadow); }',
        '    /* 3D Toggle Switch */',
        '    .theme-switch-wrapper { display: flex; align-items: center; gap: 10px; font-weight: 600; color: var(--text-muted); }',
        '    .theme-switch { display: inline-block; height: 34px; position: relative; width: 64px; }',
        '    .theme-switch input { display: none; }',
        '    .slider { background-color: #2c3e50; bottom: 0; cursor: pointer; left: 0; position: absolute; right: 0; top: 0; transition: .4s; border-radius: 34px; box-shadow: inset 0 2px 5px rgba(0,0,0,0.5), 0 1px 1px rgba(255,255,255,0.1); }',
        '    .slider:before { background-color: #1a1a1a; bottom: 4px; content: "🌙"; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 14px; height: 26px; left: 4px; position: absolute; transition: .4s; width: 26px; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.3); transform: translateX(30px); }',
        '    input:checked + .slider { background-color: #ddd; box-shadow: inset 0 2px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(255,255,255,0.7); }',
        '    input:checked + .slider:before { transform: translateX(0); background-color: #fff; content: "☀️"; color: #333; }',
        '  </style>',
        '</head>',
        '<body>',
        '  <div class="container">',
        '    <div class="top-bar">',
        '      <a href="../index.html" class="back-btn">← Quay lại System Center</a>',
        '      <div class="theme-switch-wrapper">',
        '        <label class="theme-switch" for="checkbox">',
        '          <input type="checkbox" id="checkbox" />',
        '          <div class="slider"></div>',
        '        </label>',
        '      </div>',
        '    </div>',
        f'    <h1>{header}</h1>',
    ]

    if not groups:
        lines += [
            '    <div class="session">',
            '      <h2>Hiện chưa có bài tập nào</h2>',
            '      <ul>',
            '        <li><i>Hãy copy các file bài tập vào thư mục này rồi chạy chức năng số 1.</i></li>',
            '      </ul>',
            '    </div>',
        ]
    else:
        for group, rel_paths in groups.items():
            label = label_group_name(group)
            lines += [
                '    <div class="session">',
                f'      <h2>{label}</h2>',
                '      <ul>',
            ]
            for rel in rel_paths:
                href = rel.as_posix()
                name = label_file_name(rel)
                lines.append(f'        <li><a class="exercise-link" href="{href}">{name}</a> <span class="badge">{label}</span></li>')
            lines += ['      </ul>', '    </div>']

    lines += [
        '  </div>',
        '  <script>',
        '    const toggleSwitch = document.querySelector(".theme-switch input[type=\'checkbox\']");',
        '    const currentTheme = localStorage.getItem("theme");',
        '    if (currentTheme) {',
        '        document.documentElement.classList.add(currentTheme);',
        '        if (currentTheme === "light-mode") { toggleSwitch.checked = true; }',
        '    } else {',
        '        document.documentElement.classList.add("dark-mode");',
        '        localStorage.setItem("theme", "dark-mode");',
        '    }',
        '    function switchTheme(e) {',
        '        if (e.target.checked) {',
        '            document.documentElement.classList.add("light-mode");',
        '            document.documentElement.classList.remove("dark-mode");',
        '            localStorage.setItem("theme", "light-mode");',
        '        } else {',
        '            document.documentElement.classList.add("dark-mode");',
        '            document.documentElement.classList.remove("light-mode");',
        '            localStorage.setItem("theme", "dark-mode");',
        '        }',
        '    }',
        '    toggleSwitch.addEventListener("change", switchTheme, false);',
        '  </script>',
        '</body>',
        '</html>'
    ]
    index_path = module_dir / 'index.html'
    index_path.write_text('\\n'.join(lines), encoding='utf-8')
    return index_path"""

patch_root = """def build_root_index(module_dirs):
    title = 'RBW Dashboard - System Center'
    lines = [
        '<!DOCTYPE html>',
        '<html lang="vi">',
        '<head>',
        '  <meta charset="UTF-8" />',
        '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
        f'  <title>{title}</title>',
        '  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Fira+Code&display=swap" rel="stylesheet">',
        '  <style>',
        '    :root {',
        '      --bg-dark: #121212;',
        '      --bg-board: #1e1e1e;',
        '      --accent: #4af626;',
        '      --text-main: #e0e0e0;',
        '      --text-muted: #858585;',
        '      --border: #333;',
        '      --card-bg: #1f1f1f;',
        '      --header-bg: #000;',
        '      --bb-bg: #1a1a1a;',
        '      --bb-border: #3e2723;',
        '      --bb-text: #d4d4d4;',
        '      --cmd-bg: #000;',
        '    }',
        '    :root.light-mode {',
        '      --bg-dark: #f4f7f6;',
        '      --bg-board: #fff;',
        '      --accent: #2e7d32;',
        '      --text-main: #333;',
        '      --text-muted: #666;',
        '      --border: #ddd;',
        '      --card-bg: #fff;',
        '      --header-bg: #e8f5e9;',
        '      --bb-bg: #f9f9f9;',
        '      --bb-border: #8d6e63;',
        '      --bb-text: #333;',
        '      --cmd-bg: #eee;',
        '    }',
        '    body { font-family: "Inter", sans-serif; background-color: var(--bg-dark); color: var(--text-main); margin: 0; padding: 0; display: flex; flex-direction: column; align-items: center; min-height: 100vh; transition: background-color 0.3s, color 0.3s; }',
        '    header { width: 100%; background: var(--header-bg); padding: 30px 0; text-align: center; border-bottom: 2px solid var(--accent); box-shadow: 0 4px 20px rgba(0,0,0,0.15); position: relative; transition: background-color 0.3s; }',
        '    h1 { margin: 0; font-size: 2.5rem; color: var(--accent); text-transform: uppercase; letter-spacing: 2px; }',
        '    .container { max-width: 1200px; width: 90%; margin: 40px auto; display: grid; grid-template-columns: 1fr 400px; gap: 40px; }',
        '    @media(max-width: 900px) { .container { grid-template-columns: 1fr; } }',
        '    .modules-section { display: flex; flex-direction: column; gap: 20px; }',
        '    .module-card { background: var(--card-bg); border-left: 5px solid var(--accent); border-radius: 8px; padding: 25px; transition: transform 0.2s, box-shadow 0.2s, background-color 0.3s; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-top: 1px solid var(--border); border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); }',
        '    .module-card:hover { transform: translateY(-4px); box-shadow: 0 10px 25px rgba(0,0,0,0.2); }',
        '    .module-card h2 { margin-top: 0; margin-bottom: 10px; color: var(--text-main); font-size: 1.5rem; }',
        '    .module-card a { display: inline-block; margin-top: 15px; padding: 10px 20px; background: rgba(74,246,38,0.1); border: 1px solid var(--accent); color: var(--accent); text-decoration: none; border-radius: 6px; font-weight: 600; transition: all 0.2s; }',
        '    .module-card a:hover { background: var(--accent); color: #fff; box-shadow: 0 0 15px rgba(0,0,0,0.2); }',
        '    .blackboard { background: var(--bb-bg); border: 12px solid var(--bb-border); border-radius: 8px; padding: 25px; font-family: "Fira Code", monospace; box-shadow: inset 0 0 20px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.2); position: relative; height: fit-content; transition: background-color 0.3s, border-color 0.3s; }',
        '    .blackboard::after { content: ""; position: absolute; bottom: -15px; left: 50%; transform: translateX(-50%); width: 80%; height: 10px; background: var(--bb-border); border-radius: 0 0 8px 8px; transition: background-color 0.3s; }',
        '    .blackboard h3 { color: var(--accent); border-bottom: 1px dashed var(--border); padding-bottom: 10px; margin-top: 0; font-size: 1.3rem; text-align: center; }',
        '    .instruction-step { margin-bottom: 20px; font-size: 0.95rem; line-height: 1.6; color: var(--bb-text); }',
        '    .highlight { color: var(--accent); font-weight: bold; }',
        '    .cmd-box { background: var(--cmd-bg); padding: 10px; border-radius: 6px; color: #f6d365; display: inline-block; margin-top: 8px; border: 1px solid var(--border); font-size: 0.9rem; transition: background-color 0.3s; }',
        '    /* 3D Toggle Switch */',
        '    .theme-switch-wrapper { position: absolute; right: 30px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; }',
        '    .theme-switch { display: inline-block; height: 34px; position: relative; width: 64px; }',
        '    .theme-switch input { display: none; }',
        '    .slider { background-color: #2c3e50; bottom: 0; cursor: pointer; left: 0; position: absolute; right: 0; top: 0; transition: .4s; border-radius: 34px; box-shadow: inset 0 2px 5px rgba(0,0,0,0.5), 0 1px 1px rgba(255,255,255,0.1); }',
        '    .slider:before { background-color: #1a1a1a; bottom: 4px; content: "🌙"; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 14px; height: 26px; left: 4px; position: absolute; transition: .4s; width: 26px; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.3); transform: translateX(30px); }',
        '    input:checked + .slider { background-color: #ddd; box-shadow: inset 0 2px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(255,255,255,0.7); }',
        '    input:checked + .slider:before { transform: translateX(0); background-color: #fff; content: "☀️"; color: #333; }',
        '    @media(max-width: 600px) { .theme-switch-wrapper { top: 15px; right: 15px; transform: none; } header { padding-top: 60px; } }',
        '  </style>',
        '</head>',
        '<body>',
        '  <header>',
        '    <div class="theme-switch-wrapper">',
        '      <label class="theme-switch" for="checkbox">',
        '        <input type="checkbox" id="checkbox" />',
        '        <div class="slider"></div>',
        '      </label>',
        '    </div>',
        '    <h1>Rikkei Bootcamp Workspace</h1>',
        '    <p style="color: var(--text-muted); font-size: 1.1rem; margin-top: 10px;">Central Learning Dashboard</p>',
        '  </header>',
        '  <div class="container">',
        '    <div class="modules-section">',
    ]

    if not module_dirs:
        lines.append('      <div class="module-card"><h2>Chưa có module nào</h2><p>Hãy tạo các thư mục bắt đầu bằng Module_.</p></div>')
    else:
        for mdir in sorted(module_dirs):
            name_display = mdir.name.replace('_', ' ')
            lines.extend([
                '      <div class="module-card">',
                f'        <h2>{name_display}</h2>',
                f'        <p>Truy cập vào các phiên học và bài tập của {name_display}.</p>',
                f'        <a href="{mdir.name}/index.html">Vào Module →</a>',
                '      </div>'
            ])

    lines.extend([
        '    </div>',
        '    <div class="blackboard-section">',
        '      <div class="blackboard">',
        '        <h3>📋 HƯỚNG DẪN ĐỒNG BỘ</h3>',
        '        <div class="instruction-step">',
        '          1. Mở Terminal / Command Prompt tại thư mục dự án.',
        '        </div>',
        '        <div class="instruction-step">',
        '          2. Chạy tệp lệnh Menu Hệ Thống:<br/>',
        '          <div class="cmd-box">.\\\\run_menu.bat</div>',
        '        </div>',
        '        <div class="instruction-step">',
        '          3. Nhập số tương ứng trên <span class="highlight">Bảng Đen CLI</span>:',
        '          <ul style="padding-left: 20px; list-style-type: square; color: var(--accent); margin-top: 10px;">',
        '            <li style="margin-bottom: 8px;"><b>Phím 1</b>: Cập nhật dữ liệu bài tập mới vào Dashboard.</li>',
        '            <li style="margin-bottom: 8px;"><b>Phím 2</b>: Thêm nút Quay Lại cho các bài tập.</li>',
        '            <li><b>Phím 3</b>: Đẩy toàn bộ tiến độ lên GitHub.</li>',
        '          </ul>',
        '        </div>',
        '        <div class="instruction-step" style="color: #ff8b94; font-style: italic; margin-top: 30px; font-size: 0.85rem; border-top: 1px solid var(--border); padding-top: 15px;">',
        '          *Lưu ý: Không thể chạy trực tiếp từ trình duyệt vì lý do bảo mật. Vui lòng thao tác trên Terminal.*',
        '        </div>',
        '      </div>',
        '    </div>',
        '  </div>',
        '  <script>',
        '    const toggleSwitch = document.querySelector(".theme-switch input[type=\'checkbox\']");',
        '    const currentTheme = localStorage.getItem("theme");',
        '    if (currentTheme) {',
        '        document.documentElement.classList.add(currentTheme);',
        '        if (currentTheme === "light-mode") { toggleSwitch.checked = true; }',
        '    } else {',
        '        document.documentElement.classList.add("dark-mode");',
        '        localStorage.setItem("theme", "dark-mode");',
        '    }',
        '    function switchTheme(e) {',
        '        if (e.target.checked) {',
        '            document.documentElement.classList.add("light-mode");',
        '            document.documentElement.classList.remove("dark-mode");',
        '            localStorage.setItem("theme", "light-mode");',
        '        } else {',
        '            document.documentElement.classList.add("dark-mode");',
        '            document.documentElement.classList.remove("light-mode");',
        '            localStorage.setItem("theme", "dark-mode");',
        '        }',
        '    }',
        '    toggleSwitch.addEventListener("change", switchTheme, false);',
        '  </script>',
        '</body>',
        '</html>'
    ])
    
    root_index = ROOT / 'index.html'
    root_index.write_text('\\n'.join(lines), encoding='utf-8')
    return root_index"""

with open('scripts/system_menu.py', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Replace build_module_index
content = re.sub(r'def build_module_index\(module_dir\):.*?return index_path', patch_module, content, flags=re.DOTALL)

# Replace build_root_index
content = re.sub(r'def build_root_index\(module_dirs\):.*?return root_index', patch_root, content, flags=re.DOTALL)

with open('scripts/system_menu.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch applied successfully.")
