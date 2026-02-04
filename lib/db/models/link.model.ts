import { prisma } from "@/lib/db"

export class LinkModel {
  static async create(userId: string, data: {
    title: string
    url: string
    icon?: string
  }) {
    const count = await prisma.link.count({
      where: { userId: parseInt(userId) },
    })

    return prisma.link.create({
      data: {
        ...data,
        userId: parseInt(userId),
        order: count,
      },
    })
  }

  static async update(id: string, data: Partial<{
    title: string
    url: string
    icon: string
    visible: boolean
  }>) {
    return prisma.link.update({
      where: { id },
      data,
    })
  }

  static async reorder(userId: string, ids: string[]) {
    const updates = ids.map((id, index) =>
      prisma.link.update({
        where: { id },
        data: { order: index },
      })
    )

    return prisma.$transaction(updates)
  }

  static async delete(id: string) {
    return prisma.link.delete({ where: { id } })
  }
}
