import { BaseEntity } from "../../../common/base-entity";
import { Permission } from "../../permissions/entities/permission.entity";
import { Column, Entity, ManyToMany, JoinTable } from "typeorm";

@Entity("roles")
export class Role extends BaseEntity {
  @Column({ type: "varchar", length: 255, nullable: false, unique: true })
  name: string;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: "role_permission",
    joinColumn: { name: "role_id" },
    inverseJoinColumn: { name: "permission_id" },
  })
  permissions: Permission[];
}
