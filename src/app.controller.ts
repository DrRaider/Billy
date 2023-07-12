import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { EventWithTicketCollections } from './event.interface';
import { UpdateEventDto } from './update-event.dto';
import { Prisma } from '@prisma/client';

@Controller('events')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async listEvents(
    @Query('from') from: string | null,
    @Query('to') to: string | null,
  ): Promise<EventWithTicketCollections[]> {
    return await this.appService.listEvents(from, to);
  }

  @Get(':id')
  async getEventById(
    @Param('id') id: string,
  ): Promise<EventWithTicketCollections> {
    try {
      return await this.appService.getEvent(+id);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException(err.message);
    }
  }

  @Put(':id')
  async updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<EventWithTicketCollections> {
    try {
      return await this.appService.updateEvent(+id, updateEventDto);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException(`Event with id ${id} not found`);
      } else if (err instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException(err.message);
    }
  }
}
