/*
  Warnings:

  - A unique constraint covering the columns `[eventId]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eventId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TicketCollection" DROP CONSTRAINT "TicketCollection_eventId_fkey";

-- AlterTable
CREATE SEQUENCE event_id_seq;
ALTER TABLE "Event" ADD COLUMN     "eventId" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('event_id_seq');
ALTER SEQUENCE event_id_seq OWNED BY "Event"."id";

-- CreateIndex
CREATE UNIQUE INDEX "Event_eventId_key" ON "Event"("eventId");

-- AddForeignKey
ALTER TABLE "TicketCollection" ADD CONSTRAINT "TicketCollection_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;
