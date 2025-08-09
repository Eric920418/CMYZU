import { prisma } from './prisma';

// 創建校友
export async function createAlumni(data: {
  name: string;
  position: string;
  description: string;
  imageUrl: string | null;
  achievements: string[];
  isActive: boolean;
  authorId: string;
}) {
  const alumni = await prisma.alumni.create({
    data: {
      name: data.name,
      position: data.position,
      description: data.description,
      imageUrl: data.imageUrl,
      achievements: data.achievements,
      isActive: data.isActive,
      authorId: data.authorId,
    },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return alumni;
}

// 獲取所有校友
export async function getAllAlumni() {
  const alumni = await prisma.alumni.findMany({
    include: {
      author: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return alumni;
}

// 獲取單一校友
export async function getAlumniById(id: string) {
  const alumni = await prisma.alumni.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return alumni;
}

// 更新校友
export async function updateAlumni(
  id: string,
  data: {
    name?: string;
    position?: string;
    description?: string;
    imageUrl?: string | null;
    achievements?: string[];
    isActive?: boolean;
  }
) {
  const alumni = await prisma.alumni.update({
    where: { id },
    data,
    include: {
      author: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return alumni;
}

// 刪除校友
export async function deleteAlumni(id: string) {
  await prisma.alumni.delete({
    where: { id },
  });
}

// 批量刪除校友
export async function batchDeleteAlumni(ids: string[]) {
  const result = await prisma.alumni.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  return result.count;
}

// 獲取已啟用的校友（前台使用）
export async function getActiveAlumni() {
  const alumni = await prisma.alumni.findMany({
    where: {
      isActive: true,
    },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return alumni;
}

// 切換校友狀態
export async function toggleAlumniStatus(id: string) {
  const alumni = await prisma.alumni.findUnique({
    where: { id },
  });

  if (!alumni) {
    throw new Error('校友不存在');
  }

  const updatedAlumni = await prisma.alumni.update({
    where: { id },
    data: {
      isActive: !alumni.isActive,
    },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return updatedAlumni;
}

export type AlumniWithAuthor = Awaited<ReturnType<typeof getAllAlumni>>[0];
