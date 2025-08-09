// 主視覺內容存儲系統 - 使用 Prisma 實現
import { PrismaClient } from '@prisma/client';
import type { HeroContent } from '../types/dashboard';

const prisma = new PrismaClient();

export interface CreateHeroContentData {
  locale: string;
  titlePrefix: string;
  titleMain: string;
  subtitle: string;
  backgroundImage?: string;
  gradientFrom: string;
  gradientTo: string;
  glassEffect: boolean;
}

export interface UpdateHeroContentData extends Partial<CreateHeroContentData> {}

export interface HeroContentSearchParams {
  locale?: string;
  isActive?: boolean;
}

class HeroStoragePrisma {
  // 獲取主視覺內容（根據語言）
  async getHeroByLocale(locale: string): Promise<HeroContent | null> {
    const heroContent = await prisma.heroContent.findFirst({
      where: {
        locale,
        isActive: true,
      },
    });

    return heroContent as HeroContent | null;
  }

  // 獲取所有主視覺內容
  async getAllHero(): Promise<HeroContent[]> {
    const heroContents = await prisma.heroContent.findMany({
      orderBy: [{ locale: 'asc' }, { updatedAt: 'desc' }],
    });

    return heroContents as HeroContent[];
  }

  // 創建主視覺內容
  async createHero(data: CreateHeroContentData): Promise<HeroContent> {
    // 如果已存在該語言的主視覺，先將其設為非活動
    await prisma.heroContent.updateMany({
      where: { locale: data.locale },
      data: { isActive: false },
    });

    const heroContent = await prisma.heroContent.create({
      data: {
        ...data,
        isActive: true,
      },
    });

    return heroContent as HeroContent;
  }

  // 更新主視覺內容
  async updateHero(
    id: string,
    data: UpdateHeroContentData
  ): Promise<HeroContent | null> {
    try {
      const heroContent = await prisma.heroContent.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });

      return heroContent as HeroContent;
    } catch (error) {
      console.error('更新主視覺失敗:', error);
      return null;
    }
  }

  // 刪除主視覺內容
  async deleteHero(id: string): Promise<boolean> {
    try {
      await prisma.heroContent.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error('刪除主視覺失敗:', error);
      return false;
    }
  }

  // 切換主視覺狀態
  async toggleHeroStatus(id: string): Promise<HeroContent | null> {
    try {
      const current = await prisma.heroContent.findUnique({
        where: { id },
      });

      if (!current) return null;

      const heroContent = await prisma.heroContent.update({
        where: { id },
        data: {
          isActive: !current.isActive,
          updatedAt: new Date(),
        },
      });

      return heroContent as HeroContent;
    } catch (error) {
      console.error('切換主視覺狀態失敗:', error);
      return null;
    }
  }

  // 初始化預設主視覺內容
  async initializeDefaultHero(): Promise<void> {
    const existingZh = await this.getHeroByLocale('zh');
    const existingEn = await this.getHeroByLocale('en');

    if (!existingZh) {
      await this.createHero({
        locale: 'zh',
        titlePrefix: 'YZU',
        titleMain: '元智大學管理學院',
        subtitle:
          '致力於培養具有國際視野、創新思維與社會責任感的優秀人才，為學生提供最優質的教育環境與學習資源',
        gradientFrom: 'amber-600',
        gradientTo: 'white',
        glassEffect: true,
      });
    }

    if (!existingEn) {
      await this.createHero({
        locale: 'en',
        titlePrefix: 'YZU',
        titleMain: 'College of Management',
        subtitle:
          'Committed to cultivating outstanding talents with global vision, innovative thinking, and social responsibility, providing students with the highest quality educational environment and learning resources',
        gradientFrom: 'amber-600',
        gradientTo: 'white',
        glassEffect: true,
      });
    }
  }

  // 搜尋主視覺內容
  async searchHero(
    params: HeroContentSearchParams = {}
  ): Promise<HeroContent[]> {
    const { locale, isActive } = params;

    const where: any = {};

    if (locale) where.locale = locale;
    if (typeof isActive === 'boolean') where.isActive = isActive;

    const heroContents = await prisma.heroContent.findMany({
      where,
      orderBy: [{ locale: 'asc' }, { updatedAt: 'desc' }],
    });

    return heroContents as HeroContent[];
  }

  // 關閉資料庫連接
  async disconnect(): Promise<void> {
    await prisma.$disconnect();
  }
}

export const heroStoragePrisma = new HeroStoragePrisma();
