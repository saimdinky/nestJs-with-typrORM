import { BaseEntity } from "../../../common/base-entity";
import { Column, Entity } from "typeorm";

@Entity("permissions")
export class Permission extends BaseEntity {
  @Column({ type: "varchar", length: 255, nullable: false, unique: true })
  name: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  url: string;

  @Column({ type: "varchar", length: 500, nullable: false })
  regex: string;
}
