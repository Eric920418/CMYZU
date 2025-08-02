/**
 * 建立預設使用者腳本
 * 用於建立管理員和教師的預設帳號
 */

import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// 載入環境變數
dotenv.config();

const prisma = new PrismaClient();

// 預設用戶資料
const defaultUsers = [
  {
    name: '系統管理員',
    email: 'admin@cmyzu.edu.tw',
    password: '123456',
    role: 'ADMIN' as const
  },
  {
    name: '張老師',
    email: 'teacher1@cmyzu.edu.tw',
    password: '123456',
    role: 'TEACHER' as const
  },
  {
    name: '王老師',
    email: 'teacher2@cmyzu.edu.tw',
    password: '123456',
    role: 'TEACHER' as const
  },
  {
    name: '李老師',
    email: 'teacher3@cmyzu.edu.tw',
    password: '123456',
    role: 'TEACHER' as const
  }
];

async function createDefaultUsers() {
  try {
    console.log('開始建立預設使用者...');

    for (const userData of defaultUsers) {
      // 檢查用戶是否已存在
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        console.log(`用戶 ${userData.email} 已存在，跳過建立`);
        continue;
      }

      // 加密密碼
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // 建立用戶
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
          active: true
        }
      });

      console.log(`✅ 成功建立 ${userData.role} 用戶: ${user.name} (${user.email})`);
    }

    console.log('\n🎉 預設使用者建立完成！');
    console.log('\n預設帳號資訊：');
    console.log('='.repeat(50));
    
    for (const userData of defaultUsers) {
      console.log(`角色: ${userData.role === 'ADMIN' ? '管理員' : '教師'}`);
      console.log(`姓名: ${userData.name}`);
      console.log(`帳號: ${userData.email}`);
      console.log(`密碼: ${userData.password}`);
      console.log('-'.repeat(30));
    }

    console.log('\n⚠️ 重要提醒：');
    console.log('1. 請在首次登錄後立即變更密碼');
    console.log('2. 請妥善保管這些帳號資訊');
    console.log('3. 建議定期變更密碼以確保安全');

  } catch (error) {
    console.error('❌ 建立預設使用者時發生錯誤:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// 執行腳本
if (require.main === module) {
  createDefaultUsers();
}

export { createDefaultUsers };