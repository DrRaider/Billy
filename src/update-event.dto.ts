export class UpdateEventDto {
  title: string;
  lineup: string[];
  assetUrl: string;
  collectionNames: [
    {
      from: string;
      to: string;
    },
  ];
}
