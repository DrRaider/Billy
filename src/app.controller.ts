import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { EventWithTicketCollections } from './event.interface';
import { UpdateEventDto } from './update-event.dto';

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
      throw new NotFoundException();
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
      console.log(err);
      throw new NotFoundException();
    }
  }
}
