-- CreateTable
CREATE TABLE "reels" (
    "id" UUID NOT NULL,
    "telegram_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "users" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "reels_pkey" PRIMARY KEY ("id")
);
