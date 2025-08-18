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
  @PrimaryGeneratedColumn("identity", { type: "int" })
  id: number;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp with time zone",
    default: () => "now()",
    update: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp with time zone",
    default: () => "now()",
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
