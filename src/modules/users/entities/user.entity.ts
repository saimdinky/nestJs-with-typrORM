import { Column, Entity, ManyToMany, JoinTable } from "typeorm";
import { IsEmail, IsNotEmpty } from "class-validator";
import { Role } from "../../roles/entities/role.entity";
import { BaseEntity } from "../../../common/base-entity";

@Entity("users")
export class User extends BaseEntity {
  @IsNotEmpty()
  @Column({ type: "varchar", length: 100, nullable: false })
  name: string;

  @IsNotEmpty()
  @Column({ type: "varchar", length: 100, nullable: false })
  password: string;

  @Column({ type: "varchar", length: 100, nullable: false, unique: true })
  @IsEmail()
  email: string;

  @ManyToMany(() => Role)
  @JoinTable({
    name: "user_roles",
    joinColumn: { name: "user_id" },
    inverseJoinColumn: { name: "role_id" },
  })
  roles: Role[];
}
