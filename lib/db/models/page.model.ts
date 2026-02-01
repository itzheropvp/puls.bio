import { prisma } from "@/lib/db"

export class PageModel {
  static async getByUserId(userId: string) {
    return prisma.page.findUnique({
      where: { userId },
    })
  }

  static async updateLayout(
    userId: string,
    layout: Record<string, any>
  ) {
    return prisma.page.update({
      where: { userId },
      data: { layout },
    })
  }

  static async togglePublish(userId: string, published: boolean) {
    return prisma.page.update({
      where: { userId },
      data: { published },
    })
  }
}
