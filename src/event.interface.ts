interface SmartContract {
  multisig: string;
  scAddress: string;
  saleParams: {
    endTime: number;
    saleSize: number;
    isPresale: boolean;
    startTime: number;
    metadataList: any[];
    saleCurrency: {
      xtz: any;
    };
    pricePerToken: number;
    maxMintPerUser: number;
  };
  collectionAddress: string;
}

interface TicketCollection {
  id: number;
  collectionName: string;
  eventId: number;
  smartContract: SmartContract;
}

interface Event {
  id: number;
  eventId: number;
  title: string;
  startDatetime: Date;
  endDatetime: Date;
  locationName: string;
  address: string;
  totalTicketsCount: number;
  maxTicketsPerUser: number;
  saleStartTime: Date;
  assetUrl: string;
  lineup: string[];
  ticketCollection: TicketCollection[];
}

interface EventWithTicketCollections {
  eventId: number;
  title: string;
  startDatetime: string;
  endDatetime: string;
  address: string;
  locationName: string;
  totalTicketsCount: number;
  assetUrl: string;
  lineUp: string[] | null;
  ticketCollections: {
    collectionName: string;
    scAddress: string;
    collectionAddress: string;
    pricePerToken: number;
    maxMintPerUser: number;
    saleSize: number;
  }[];
}

export { SmartContract, TicketCollection, Event, EventWithTicketCollections };
