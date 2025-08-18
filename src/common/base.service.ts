import {
  Repository,
  FindOptionsWhere,
  FindManyOptions,
  DeepPartial,
} from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { BaseEntity } from './base-entity';
import { CustomLoggerService } from '../modules/logger/logger.service';

export class BaseService<T extends BaseEntity> {
  constructor(
    protected readonly repository: Repository<T>,
    protected readonly entityName: string,
    protected readonly logger: CustomLoggerService,
  ) {}

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find({
      where: { deleted: false, enable: true } as FindOptionsWhere<T>,
      ...options,
    });
  }

  async findById(id: number, relations?: string[]): Promise<T> {
    const entity = await this.repository.findOne({
      where: { id, deleted: false, enable: true } as FindOptionsWhere<T>,
      relations,
    });

    if (!entity) {
      throw new NotFoundException(`${this.entityName} with ID ${id} not found`);
    }

    return entity;
  }

  async findByIdOptional(id: number, relations?: string[]): Promise<T | null> {
    return this.repository.findOne({
      where: { id, deleted: false, enable: true } as FindOptionsWhere<T>,
      relations,
    });
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: number, data: DeepPartial<T>): Promise<T> {
    await this.repository.update(id, data as any);
    return this.findById(id);
  }

  async softDelete(id: number): Promise<void> {
    await this.repository.update(id, { deleted: true } as any);
  }

  async hardDelete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
