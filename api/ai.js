// =============================================================================
// VERCEL SERVERLESS FUNCTION: /api/ai
// Tích hợp Google Gemini AI bảo mật cho RK Workspace Learning Dashboard
// =============================================================================

export default async function handler(req, res) {
  // Thiết lập CORS header cho phép gọi từ mọi client
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const hasKey = Boolean(process.env.GEMINI_API_KEY);
    res.status(200).json({
      status: 'online',
      provider: 'Google Gemini AI',
      hasSystemKey: hasKey,
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash'
    });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Phương thức không được hỗ trợ. Vui lòng dùng POST.' });
    return;
  }

  try {
    const { action, sql, btvnTitle, schema, customKey } = req.body || {};
    
    // Ưu tiên key từ biến môi trường Vercel (.env), fallback sang customKey nếu người dùng nhập thủ công
    const apiKey = process.env.GEMINI_API_KEY || customKey;
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

    if (!apiKey) {
      res.status(400).json({
        error: 'Chưa cấu hình GEMINI_API_KEY trên hệ thống hoặc biến môi trường Vercel.'
      });
      return;
    }

    if (!sql || !sql.trim()) {
      res.status(400).json({
        error: 'Vui lòng nhập câu lệnh SQL vào ô soạn thảo trước khi yêu cầu AI chấm điểm.'
      });
      return;
    }

    // Xây dựng prompt chuyên môn dựa trên hành động được chọn
    let systemInstruction = `Bạn là Trợ giảng AI chuyên gia Cơ sở dữ liệu và SQL của Rikkei Academy. Hãy phân tích câu lệnh SQL của học viên đối với bài tập "${btvnTitle || 'Bài tập SQL'}".`;
    
    let prompt = '';
    switch (action) {
      case 'score':
        prompt = `
${systemInstruction}
Nhiệm vụ: Chấm điểm câu lệnh SQL dưới đây theo thang điểm 10.
Nội dung bài tập: ${btvnTitle}
Cấu trúc bảng tham chiếu: ${schema || 'Theo đề bài'}
Mã SQL học viên viết:
\`\`\`sql
${sql}
\`\`\`

Yêu cầu xuất ra định dạng rõ ràng:
1. ĐIỂM SỐ: [X/10]
2. ĐÁNH GIÁ CHUNG: Tóm tắt 2-3 câu về mức độ chính xác của câu lệnh.
3. ƯU ĐIỂM: Những điểm làm đúng (cú pháp, ràng buộc, tối ưu).
4. NHƯỢC ĐIỂM HOẶC LỖI CẦN CẢI THIỆN (nếu có).
5. GỢI Ý NÂNG CẤO: Cách viết chuẩn hơn hoặc tối ưu hơn theo MySQL 8.0.
`;
        break;

      case 'explain':
        prompt = `
${systemInstruction}
Nhiệm vụ: Giải thích chi tiết, dễ hiểu từng câu lệnh SQL cho người mới bắt đầu học.
Mã SQL học viên viết:
\`\`\`sql
${sql}
\`\`\`

Yêu cầu:
- Giải thích mục đích của từng khối lệnh (CREATE, INSERT, SELECT, JOIN, GROUP BY...).
- Chỉ rõ cách MySQL thực thi từng bước (Pipeline) và ý nghĩa của từng mệnh đề.
- Ngôn ngữ: Tiếng Việt sư phạm, dễ hiểu, thân thiện.
`;
        break;

      case 'fix':
        prompt = `
${systemInstruction}
Nhiệm vụ: Kiểm tra lỗi cú pháp, logic hoặc vi phạm ràng buộc trong câu lệnh SQL và đưa ra bản sửa hoàn chỉnh.
Mã SQL học viên viết:
\`\`\`sql
${sql}
\`\`\`

Yêu cầu:
1. CHỈ RA LỖI (nếu có): Vị trí dòng lỗi và nguyên nhân (ví dụ thiếu dấu phẩy, sai kiểu dữ liệu, thiếu WHERE, sai tên cột...).
2. BẢN CODE ĐÃ SỬA HOÀN CHỈNH (trong khối \`\`\`sql ... \`\`\`): Chạy được ngay 100% trên MySQL 8.0.
3. LƯU Ý KHI LÀM BÀI: Mẹo tránh mắc lại lỗi tương tự.
`;
        break;

      case 'design':
        prompt = `
${systemInstruction}
Nhiệm vụ: Đánh giá thiết kế cơ sở dữ liệu và cấu trúc bảng của học viên.
Mã SQL học viên viết:
\`\`\`sql
${sql}
\`\`\`

Yêu cầu:
1. ĐÁNH GIÁ MÔ HÌNH: Khóa chính (PRIMARY KEY), khóa ngoại (FOREIGN KEY), các ràng buộc (NOT NULL, CHECK, UNIQUE, DEFAULT).
2. MỨC ĐỘ CHUẨN HOÁ: Đánh giá đạt chuẩn 1NF, 2NF, 3NF hay chưa? Có bị dư thừa dữ liệu không?
3. KHẢ NĂNG MỞ RỘNG VÀ ĐÁNH CHỈ MỤC (INDEX): Gợi ý thêm index hoặc tối ưu kiểu dữ liệu nếu cần.
`;
        break;

      default:
        prompt = `
${systemInstruction}
Hãy phân tích và đưa ra nhận xét chuyên môn về câu lệnh SQL sau:
\`\`\`sql
${sql}
\`\`\`
`;
    }

    // Gọi API của Google Gemini
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const errMsg = data.error?.message || `Lỗi từ Google Gemini API (Mã: ${response.status})`;
      res.status(response.status).json({ error: errMsg, details: data });
      return;
    }

    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!replyText) {
      res.status(500).json({ error: 'Không nhận được văn bản phản hồi từ Google Gemini.' });
      return;
    }

    res.status(200).json({
      success: true,
      result: replyText,
      provider: 'Google Gemini AI (' + model + ')'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Lỗi máy chủ nội bộ khi kết nối AI: ' + (error.message || error)
    });
  }
}
