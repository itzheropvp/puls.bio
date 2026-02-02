import { prisma } from "@/lib/db"

export class UserModel {
  static async create(data: {
    email?: string
    password?: string
    username: string
    name?: string
  }) {
    return prisma.user.create({
      data: {
        ...data,
        username: data.username.toLowerCase(),
        page: {
          create: {
            layout: {},
          },
        },
      },
    })
  }

  static async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    })
  }

  static async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      include: {
        page: true,
        links: {
          where: { visible: true },
          orderBy: { order: "asc" },
        },
        connections: {
          where: { visible: true },
        },
      },
    })
  }

  static async incrementViews(id: number) {
    return prisma.user.update({
      where: { id },
      data: {
        totalViews: { increment: 1 },
      },
    })
  }
}
