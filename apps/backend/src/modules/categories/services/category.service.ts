import { Injectable, ForbiddenException } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryDto } from '../dto/category.dto';
import { UserRole } from '@merge/types';

@Injectable()
export class CategoryService {
  constructor(private readonly repository: CategoryRepository) {}

  async createCategory(user: any, dto: CreateCategoryDto) {
    if (user.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only Super Admins can create service categories');
    }
    return this.repository.create(dto);
  }

  async getAllCategories() {
    return this.repository.findAll();
  }
}
