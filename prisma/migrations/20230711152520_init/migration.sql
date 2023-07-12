-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "startDatetime" TIMESTAMP(3) NOT NULL,
    "endDatetime" TIMESTAMP(3) NOT NULL,
    "locationName" TEXT,
    "address" TEXT NOT NULL,
    "totalTicketsCount" INTEGER NOT NULL,
    "assetUrl" TEXT NOT NULL,
    "lineup" TEXT[],

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketCollection" (
    "id" SERIAL NOT NULL,
    "collectionName" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,
    "smartContractId" INTEGER NOT NULL,

    CONSTRAINT "TicketCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmartContract" (
    "id" SERIAL NOT NULL,
    "crowdsale" TEXT NOT NULL,
    "collection" TEXT NOT NULL,
    "multisig" TEXT NOT NULL,
    "saleParamsId" INTEGER NOT NULL,

    CONSTRAINT "SmartContract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleParams" (
    "id" SERIAL NOT NULL,
    "isPresale" BOOLEAN NOT NULL,
    "metadataList" TEXT[],
    "pricePerToken" INTEGER NOT NULL,
    "maxMintPerUser" INTEGER NOT NULL,
    "saleSize" INTEGER NOT NULL,
    "saleCurrencyId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SaleParams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleCurrency" (
    "id" SERIAL NOT NULL,
    "xtz" TEXT,

    CONSTRAINT "SaleCurrency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TicketCollection_eventId_key" ON "TicketCollection"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "TicketCollection_smartContractId_key" ON "TicketCollection"("smartContractId");

-- CreateIndex
CREATE UNIQUE INDEX "SmartContract_saleParamsId_key" ON "SmartContract"("saleParamsId");

-- CreateIndex
CREATE UNIQUE INDEX "SaleParams_saleCurrencyId_key" ON "SaleParams"("saleCurrencyId");

-- AddForeignKey
ALTER TABLE "TicketCollection" ADD CONSTRAINT "TicketCollection_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketCollection" ADD CONSTRAINT "TicketCollection_smartContractId_fkey" FOREIGN KEY ("smartContractId") REFERENCES "SmartContract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmartContract" ADD CONSTRAINT "SmartContract_saleParamsId_fkey" FOREIGN KEY ("saleParamsId") REFERENCES "SaleParams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleParams" ADD CONSTRAINT "SaleParams_saleCurrencyId_fkey" FOREIGN KEY ("saleCurrencyId") REFERENCES "SaleCurrency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
