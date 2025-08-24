import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { runSeeds } from "../../db/seeds";
import { CustomLoggerService } from "../logger/logger.service";

@Injectable()
export class SeederService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: CustomLoggerService
  ) {}

  async seed(): Promise<void> {
    this.logger.log("🌱 Starting database seeding process...");

    try {
      await runSeeds(this.dataSource, this.logger);
      this.logger.log("🎉 Database seeding completed successfully!");
    } catch (error) {
      this.logger.error("❌ Database seeding failed:", error);
      throw error;
    }
  }
}
