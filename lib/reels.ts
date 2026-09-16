import { v7 as uuidv7 } from "uuid"
import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"

export interface ReelUser {
  name: string
  exclude: boolean
}

export async function createReel({ name, telegramId, users = [] }: { name: string; telegramId: number | bigint; users?: ReelUser[] }) {
  return prisma.reel.create({
    data: {
      id: uuidv7(),
      telegramId: BigInt(telegramId),
      name,
      users: users as unknown as Prisma.InputJsonValue,
    },
  })
}
