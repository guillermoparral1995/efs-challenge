-- CreateEnum
CREATE TYPE "Status" AS ENUM ('in_review', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "Application" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'in_review',

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);
