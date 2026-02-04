import { prisma } from "@/lib/db"

export class PageModel {
  static async getByUserId(userId: string) {
    return prisma.page.findUnique({
      where: { userId: parseInt(userId) },
    })
  }

  static async updateLayout(
    userId: string,
    layout: Record<string, any>
  ) {
    return prisma.page.update({
      where: { userId: parseInt(userId) },
      data: { layout },
    })
  }

  static async togglePublish(userId: string, published: boolean) {
    return prisma.page.update({
      where: { userId: parseInt(userId) },
      data: { published },
    })
  }
}
