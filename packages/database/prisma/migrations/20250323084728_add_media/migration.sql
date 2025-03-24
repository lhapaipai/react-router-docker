-- CreateEnum
CREATE TYPE "MediaOrigin" AS ENUM ('s3', 'local', 'other');

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "origin" "MediaOrigin" NOT NULL,
    "mimeType" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "size" INTEGER,
    "src" TEXT,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);
