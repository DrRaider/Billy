import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Event, EventWithTicketCollections } from './event.interface';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import { UpdateEventDto } from './update-event.dto';

dayjs.extend(customParseFormat);

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async listEvents(
    from: string | null,
    to: string | null,
  ): Promise<EventWithTicketCollections[]> {
    const data = (await this.prisma.event.findMany({
      where: {
        saleStartTime: {
          lte: to ? dayjs(to, 'DD/MM/YYYY').format() : dayjs().format(),
          gte: from ? dayjs(from, 'DD/MM/YYYY').format() : dayjs(0).format(),
        },
      },
      include: {
        ticketCollection: true,
      },
    })) as unknown as Event[];

    return this.transformDataToEventWithTicketCollections(data);
  }

  async getEvent(id: number): Promise<EventWithTicketCollections> {
    const data = (await this.prisma.event.findUnique({
      where: {
        eventId: id,
      },
      include: {
        ticketCollection: true,
      },
    })) as unknown as Event;

    if (!data) {
      throw new Error('Event not found');
    }

    const [eventWithTicketCollections] =
      this.transformDataToEventWithTicketCollections([data]);
    return eventWithTicketCollections;
  }

  async updateEvent(id: number, updateEventDto: UpdateEventDto): Promise<any> {
    return await this.prisma.event.update({
      where: {
        eventId: id,
      },
      data: {
        title: updateEventDto.title,
        lineup: updateEventDto.lineup,
        assetUrl: updateEventDto.assetUrl,
        ticketCollection: {
          updateMany: updateEventDto.collectionNames.map((name) => {
            return {
              where: {
                collectionName: name.from,
              },
              data: {
                collectionName: name.to,
              },
            };
          }),
        },
      },
    });
  }

  private transformDataToEventWithTicketCollections(
    events: Event[],
  ): EventWithTicketCollections[] {
    return events.map((event) => {
      const {
        eventId,
        title,
        startDatetime,
        endDatetime,
        address,
        locationName,
        totalTicketsCount,
        assetUrl,
        lineup,
        ticketCollection,
      } = event;

      const transformedEvent: EventWithTicketCollections = {
        eventId,
        title,
        startDatetime: new Date(startDatetime).toISOString(),
        endDatetime: new Date(endDatetime).toISOString(),
        address,
        locationName,
        totalTicketsCount,
        assetUrl,
        lineUp: lineup,
        ticketCollections: ticketCollection.map((ticket) => {
          const {
            collectionName,
            smartContract: {
              scAddress,
              collectionAddress,
              saleParams: { pricePerToken, maxMintPerUser, saleSize },
            },
          } = ticket;

          return {
            collectionName,
            scAddress,
            collectionAddress,
            pricePerToken,
            maxMintPerUser,
            saleSize,
          };
        }),
      };

      return transformedEvent;
    });
  }
}
