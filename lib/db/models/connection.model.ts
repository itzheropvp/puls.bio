import { prisma } from "@/lib/db"

export class ConnectionModel {
  static async upsert(userId: string, data: {
    provider: string
    username?: string
    avatarUrl?: string
    profileUrl?: string
  }) {
    return prisma.connection.upsert({
      where: {
        userId_provider: {
          userId: parseInt(userId),
          provider: data.provider,
        },
      },
      update: data,
      create: {
        ...data,
        userId: parseInt(userId),
      },
    })
  }

  static async toggleVisibility(
    userId: string,
    provider: string,
    visible: boolean
  ) {
    return prisma.connection.update({
      where: {
        userId_provider: {
          userId: parseInt(userId),
          provider,
        },
      },
      data: { visible },
    })
  }
}
