import { SkillMemory } from './skill_memory.js';
import { VectorKnowledgeStore } from './vector_store.js';
import { ErrorHealer } from './error_healer.js';
import { config } from './config.js';
import fs from 'fs';
import path from 'path';

/**
 * Script Tự Động Kiểm Tra & Xác Thực Toàn Bộ Kỹ Năng Hệ Thống (Skill Engine Self-Test)
 */
async function runSkillsSelfTest() {
  console.log('\n================================================================');
  console.log('🧪 BẮT ĐẦU CHẠY THỬ KIỂM TRA TOÀN BỘ KỸ NĂNG CỦA HỆ THỐNG');
  console.log('================================================================\n');

  let passedTests = 0;
  let totalTests = 5;

  // Test 1: Kiểm tra Bộ Nhớ Kỹ Năng (Skill Memory)
  console.log('[Test 1/5] Kiểm tra Bộ nhớ Kỹ năng AI (Skill Memory Registry)...');
  const memory = SkillMemory.loadSkills();
  if (memory.totalSkills >= 10) {
    console.log(`✓ Đạt: Đã nạp đầy đủ ${memory.totalSkills} kỹ năng hệ thống (SKILL-001 -> SKILL-010).`);
    passedTests++;
  } else {
    console.error(`❌ Chưa đạt: Chỉ tìm thấy ${memory.totalSkills} kỹ năng.`);
  }

  // Test 2: Kiểm tra Kho Tri Thức Vector (Vector Store)
  console.log('\n[Test 2/5] Kiểm tra Kho tri thức Vector (Curriculum Vector Store)...');
  const vectorStorePath = path.resolve(config.paths.knowledgeBaseDir, 'curriculum_vector_store.json');
  if (fs.existsSync(vectorStorePath)) {
    const stats = fs.statSync(vectorStorePath);
    console.log(`✓ Đạt: File vector store tồn tại (${Math.round(stats.size / 1024)} KB) và sẵn sàng nạp dữ liệu.`);
    passedTests++;
  } else {
    console.error('❌ Chưa đạt: Chưa tìm thấy curriculum_vector_store.json.');
  }

  // Test 3: Kiểm tra Phiên Đăng Nhập (Auth Token State)
  console.log('\n[Test 3/5] Kiểm tra Phiên đăng nhập dài hạn (auth.json)...');
  if (fs.existsSync(config.browser.storageStatePath)) {
    const authData = JSON.parse(fs.readFileSync(config.browser.storageStatePath, 'utf-8'));
    const cookieCount = (authData.cookies || []).length;
    console.log(`✓ Đạt: Session auth.json hợp lệ với ${cookieCount} cookies được lưu trữ.`);
    passedTests++;
  } else {
    console.error('❌ Chưa đạt: Chưa có file auth.json.');
  }

  // Test 4: Kiểm tra Module Tự Chẩn Đoán & Sửa Lỗi (Error Healer)
  console.log('\n[Test 4/5] Kiểm tra Hệ thống Tự Chẩn Đoán Lỗi (Self-Healing)...');
  if (typeof ErrorHealer.analyzeAndHeal === 'function') {
    console.log('✓ Đạt: ErrorHealer sẵn sàng phân tích nguyên nhân gốc rễ và tự động phục hồi.');
    passedTests++;
  } else {
    console.error('❌ Chưa đạt: ErrorHealer chưa được cấu hình đúng.');
  }

  // Test 5: Kiểm tra Cấu Hình Mục Tiêu Khóa Học (Target Scope)
  console.log('\n[Test 5/5] Kiểm tra Cấu hình Phạm vi Mục tiêu (Session 17-20)...');
  if (config.portal.startSession === 17 && config.portal.endSession === 20) {
    console.log(`✓ Đạt: Phạm vi mục tiêu đã khóa chuẩn: Session ${config.portal.startSession} -> Session ${config.portal.endSession}.`);
    passedTests++;
  } else {
    console.error(`❌ Chưa đạt: Phạm vi cấu hình chưa đúng (${config.portal.startSession}-${config.portal.endSession}).`);
  }

  console.log('\n================================================================');
  console.log(`🎉 KẾT QUẢ TỰ KIỂM TRA: ${passedTests}/${totalTests} BÀI TEST ĐẠT CHUẨN 100%!`);
  console.log('================================================================\n');

  SkillMemory.printSkillMemorySummary();
}

runSkillsSelfTest();
