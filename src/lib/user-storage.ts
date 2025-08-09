import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import type { User } from '@prisma/client';

// 用戶資料介面（從 Prisma 匯入）
export type { User } from '@prisma/client';

// 登入資料介面
export interface LoginData {
  email: string;
  password: string;
}

// 變更密碼資料介面
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// 不再需要檔案系統操作，全部使用 Prisma

// 根據 email 查找用戶
export async function findUserByEmail(email: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: { email },
  });
}

// 根據 id 查找用戶
export async function findUserById(id: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: { id },
  });
}

// 驗證用戶登入
export async function validateUser(loginData: LoginData): Promise<User | null> {
  const user = await findUserByEmail(loginData.email);

  if (!user || !user.active) {
    return null;
  }

  // 檢查用戶角色 - 只允許管理員和教師登錄
  if (user.role !== 'ADMIN' && user.role !== 'TEACHER') {
    return null;
  }

  // 驗證密碼
  const isPasswordValid = await bcrypt.compare(
    loginData.password,
    user.password
  );

  if (!isPasswordValid) {
    return null;
  }

  // 更新最後登入時間
  await updateUser(user.id, { updatedAt: new Date() });

  return user;
}

// 更新用戶資料
export async function updateUser(
  userId: string,
  updates: Partial<Omit<User, 'id'>>
): Promise<User | null> {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    });
    return updatedUser;
  } catch (error) {
    console.error('更新用戶失敗:', error);
    return null;
  }
}

// 變更密碼
export async function changePassword(
  userId: string,
  passwordData: ChangePasswordData
): Promise<{ success: boolean; message: string }> {
  const user = await findUserById(userId);

  if (!user) {
    return { success: false, message: '用戶不存在' };
  }

  // 驗證當前密碼
  const isCurrentPasswordValid = await bcrypt.compare(
    passwordData.currentPassword,
    user.password
  );

  if (!isCurrentPasswordValid) {
    return { success: false, message: '當前密碼錯誤' };
  }

  // 檢查新密碼不能與當前密碼相同
  const isSamePassword = await bcrypt.compare(
    passwordData.newPassword,
    user.password
  );
  if (isSamePassword) {
    return { success: false, message: '新密碼不能與當前密碼相同' };
  }

  // 加密新密碼
  const hashedNewPassword = await bcrypt.hash(passwordData.newPassword, 12);

  // 更新密碼
  const result = await updateUser(userId, { password: hashedNewPassword });

  if (!result) {
    return { success: false, message: '密碼更新失敗' };
  }

  return { success: true, message: '密碼變更成功' };
}

// 獲取用戶的安全資料 (不含密碼)
export function getSafeUserData(user: User): Omit<User, 'password'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...safeUser } = user;
  return safeUser;
}
