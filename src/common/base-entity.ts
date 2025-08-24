import {
  AfterInsert,
  AfterLoad,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity as TypeORMBaseEntity,
  UpdateDateColumn,
} from "typeorm";

export class BaseEntity extends TypeORMBaseEntity {
  @PrimaryGeneratedColumn("increment", { type: "int" })
  id: number;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    update: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @Column({ type: "boolean", default: true })
  enable: boolean;

  @Column({ type: "boolean", default: false })
  deleted: boolean;

  __entity?: string;

  @AfterLoad()
  @AfterInsert()
  setEntityName(): void {
    this.__entity = this.constructor.name;
  }
}
