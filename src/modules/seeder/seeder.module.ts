import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SeederService } from "./seeder.service";
import { LoggerModule } from "../logger/logger.module";
import { User } from "../users/entities/user.entity";
import { Role } from "../roles/entities/role.entity";
import { Permission } from "../permissions/entities/permission.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission]), LoggerModule],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
