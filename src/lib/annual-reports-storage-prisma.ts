import { AnnualReport } from '@prisma/client';
import { prisma } from '@/lib/prisma';

// 年報資料管理類別
export class AnnualReportsStorage {
  // 獲取所有年報（含作者資訊）
  async getAll(): Promise<AnnualReport[]> {
    try {
      return await prisma.annualReport.findMany({
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { year: 'desc' },
      });
    } catch (error) {
      console.error('Error getting all annual reports:', error);
      throw new Error('無法取得年報列表');
    }
  }

  // 獲取已啟用的年報（前台使用）
  async getPublished(): Promise<AnnualReport[]> {
    try {
      return await prisma.annualReport.findMany({
        where: { isActive: true },
        orderBy: { year: 'desc' },
      });
    } catch (error) {
      console.error('Error getting published annual reports:', error);
      throw new Error('無法取得已發布年報');
    }
  }

  // 根據 ID 獲取年報
  async getById(id: string): Promise<AnnualReport | null> {
    try {
      return await prisma.annualReport.findUnique({
        where: { id },
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
        },
      });
    } catch (error) {
      console.error('Error getting annual report by ID:', error);
      throw new Error('無法取得年報資料');
    }
  }

  // 根據年度獲取年報
  async getByYear(year: number): Promise<AnnualReport | null> {
    try {
      return await prisma.annualReport.findUnique({
        where: { year },
      });
    } catch (error) {
      console.error('Error getting annual report by year:', error);
      return null;
    }
  }

  // 創建新年報
  async create(data: {
    year: number;
    title: string;
    titleEn?: string;
    description?: string;
    descriptionEn?: string;
    fileUrl: string;
    fileName: string;
    fileSize?: number;
    authorId: string;
  }): Promise<AnnualReport> {
    try {
      // 檢查該年度是否已存在年報
      const existingReport = await this.getByYear(data.year);
      if (existingReport) {
        throw new Error(`${data.year} 年度年報已存在`);
      }

      return await prisma.annualReport.create({
        data: {
          year: data.year,
          title: data.title,
          titleEn: data.titleEn,
          description: data.description,
          descriptionEn: data.descriptionEn,
          fileUrl: data.fileUrl,
          fileName: data.fileName,
          fileSize: data.fileSize,
          authorId: data.authorId,
        },
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
        },
      });
    } catch (error) {
      console.error('Error creating annual report:', error);
      throw error;
    }
  }

  // 更新年報
  async update(
    id: string,
    data: {
      year?: number;
      title?: string;
      titleEn?: string;
      description?: string;
      descriptionEn?: string;
      fileUrl?: string;
      fileName?: string;
      fileSize?: number;
      isActive?: boolean;
    }
  ): Promise<AnnualReport> {
    try {
      // 如果要更新年度，檢查是否與其他年報衝突
      if (data.year) {
        const existingReport = await this.getByYear(data.year);
        if (existingReport && existingReport.id !== id) {
          throw new Error(`${data.year} 年度年報已存在`);
        }
      }

      return await prisma.annualReport.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
        },
      });
    } catch (error) {
      console.error('Error updating annual report:', error);
      throw error;
    }
  }

  // 刪除年報
  async delete(id: string): Promise<AnnualReport> {
    try {
      return await prisma.annualReport.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error deleting annual report:', error);
      throw new Error('無法刪除年報');
    }
  }

  // 切換年報啟用狀態
  async toggleActive(id: string): Promise<AnnualReport> {
    try {
      const report = await this.getById(id);
      if (!report) {
        throw new Error('年報不存在');
      }

      return await this.update(id, { isActive: !report.isActive });
    } catch (error) {
      console.error('Error toggling annual report status:', error);
      throw error;
    }
  }

  // 批量操作
  async batchUpdate(
    ids: string[],
    data: { isActive?: boolean }
  ): Promise<number> {
    try {
      const result = await prisma.annualReport.updateMany({
        where: { id: { in: ids } },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
      return result.count;
    } catch (error) {
      console.error('Error batch updating annual reports:', error);
      throw new Error('批量更新失敗');
    }
  }

  // 批量刪除
  async batchDelete(ids: string[]): Promise<number> {
    try {
      const result = await prisma.annualReport.deleteMany({
        where: { id: { in: ids } },
      });
      return result.count;
    } catch (error) {
      console.error('Error batch deleting annual reports:', error);
      throw new Error('批量刪除失敗');
    }
  }

  // 初始化預設年報資料
  async seedData(authorId: string): Promise<void> {
    try {
      const existingReports = await this.getAll();
      if (existingReports.length > 0) {
        console.log('Annual reports already exist, skipping seed');
        return;
      }

      const defaultReports = [
        {
          year: 2023,
          title: '2023 年度報告',
          description: '展現學院 2023 年度重要發展成果與未來規劃',
          fileUrl: '/files/annual-report-2023.pdf',
          fileName: 'CMYZU-Annual-Report-2023.pdf',
          fileSize: 5242880, // 5MB
          authorId,
        },
        {
          year: 2022,
          title: '2022 年度報告',
          description: '回顧學院 2022 年度辦學成效與重要里程碑',
          fileUrl: '/files/annual-report-2022.pdf',
          fileName: 'CMYZU-Annual-Report-2022.pdf',
          fileSize: 4718592, // 4.5MB
          authorId,
        },
      ];

      for (const reportData of defaultReports) {
        try {
          await this.create(reportData);
        } catch (error) {
          console.log(`年報 ${reportData.year} 可能已存在，跳過`);
        }
      }

      console.log('Annual reports seed data created successfully');
    } catch (error) {
      console.error('Error seeding annual reports:', error);
    }
  }
}

// 導出單例實例
export const annualReportsStorage = new AnnualReportsStorage();
