/*
  Warnings:

  - You are about to drop the column `smartContractId` on the `TicketCollection` table. All the data in the column will be lost.
  - You are about to drop the `SaleCurrency` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SaleParams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SmartContract` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `smartContract` to the `TicketCollection` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SaleParams" DROP CONSTRAINT "SaleParams_saleCurrencyId_fkey";

-- DropForeignKey
ALTER TABLE "SmartContract" DROP CONSTRAINT "SmartContract_saleParamsId_fkey";

-- DropForeignKey
ALTER TABLE "TicketCollection" DROP CONSTRAINT "TicketCollection_smartContractId_fkey";

-- DropIndex
DROP INDEX "TicketCollection_smartContractId_key";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Event_id_seq";

-- AlterTable
ALTER TABLE "TicketCollection" DROP COLUMN "smartContractId",
ADD COLUMN     "smartContract" JSONB NOT NULL;

-- DropTable
DROP TABLE "SaleCurrency";

-- DropTable
DROP TABLE "SaleParams";

-- DropTable
DROP TABLE "SmartContract";
