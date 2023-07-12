/*
  Warnings:

  - Added the required column `maxTicketsPerUser` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saleStartTime` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "maxTicketsPerUser" INTEGER NOT NULL,
ADD COLUMN     "saleStartTime" TIMESTAMP(3) NOT NULL;
