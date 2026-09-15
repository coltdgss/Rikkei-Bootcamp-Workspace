import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SKILL_MEMORY_PATH = path.resolve(__dirname, '../knowledge_base/learned_skills_memory.json');

/**
 * Bộ Nhớ Quản Lý & Nạp Kỹ Năng Đã Được Người Dùng Huấn Luyện (AI Skill Memory Engine)
 */
export const SkillMemory = {
  /**
   * Nạp và hiển thị toàn bộ kỹ năng đã học được từ người dùng
   */
  loadSkills() {
    if (!fs.existsSync(SKILL_MEMORY_PATH)) {
      return { totalSkills: 0, skills: [] };
    }
    try {
      const data = JSON.parse(fs.readFileSync(SKILL_MEMORY_PATH, 'utf-8'));
      return data;
    } catch (e) {
      return { totalSkills: 0, skills: [] };
    }
  },

  /**
   * In bảng kỹ năng đã học ra màn hình khi khởi động bot
   */
  printSkillMemorySummary() {
    const memory = this.loadSkills();
    console.log('\n================================================================');
    console.log(`🧠 [BỘ NHỚ KỸ NĂNG AI] ĐÃ NẠP ${memory.totalSkills} KỸ NĂNG DO BẠN HUẤN LUYỆN:`);
    console.log('================================================================');
    
    memory.skills.forEach((s, idx) => {
      console.log(`${idx + 1}. [${s.id}] ${s.title}`);
      console.log(`   - Tác giả dạy: ${s.taughtBy}`);
      console.log(`   - Quy tắc áp dụng: ${s.rule.slice(0, 85)}...`);
    });
    console.log('================================================================\n');
  },

  /**
   * Thêm hoặc cập nhật một kỹ năng mới do người dùng dạy
   */
  teachNewSkill({ id, name, title, taughtBy, rule }) {
    const memory = this.loadSkills();
    const existingIndex = memory.skills.findIndex(s => s.id === id || s.name === name);

    const newSkill = {
      id: id || `SKILL-${String(memory.skills.length + 1).padStart(3, '0')}`,
      name,
      title,
      taughtBy: taughtBy || 'User',
      rule,
      status: 'ACTIVE',
      learnedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      memory.skills[existingIndex] = newSkill;
    } else {
      memory.skills.push(newSkill);
    }

    memory.totalSkills = memory.skills.length;
    memory.updatedAt = new Date().toISOString();

    fs.writeFileSync(SKILL_MEMORY_PATH, JSON.stringify(memory, null, 2), 'utf-8');
    console.log(`[SkillMemory] 💡 Đã ghi nhớ kỹ năng mới: [${newSkill.id}] ${newSkill.title}`);
    return newSkill;
  }
};
