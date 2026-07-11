import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApartmentService } from './services/apartment.service';
import { CreateApartmentDto, CreateBuildingDto, CreateUnitDto } from './dto/apartment.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('apartments')
@UseGuards(AuthGuard)
export class ApartmentController {
  constructor(private readonly apartmentService: ApartmentService) {}

  @Post()
  async create(@Req() req, @Body() dto: CreateApartmentDto) {
    return this.apartmentService.createApartment(req.user, dto);
  }

  @Post('buildings')
  async createBuilding(@Req() req, @Body() dto: CreateBuildingDto) {
    return this.apartmentService.createBuilding(req.user, dto);
  }

  @Post('units')
  async createUnit(@Req() req, @Body() dto: CreateUnitDto) {
    return this.apartmentService.createUnit(req.user, dto);
  }

  @Get(':id')
  async getOne(@Req() req, @Param('id') id: string) {
    return this.apartmentService.getApartmentDetails(req.user, id);
  }
}
