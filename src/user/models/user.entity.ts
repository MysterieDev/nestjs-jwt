import { Entity, PrimaryGeneratedColumn, Column, Unique, BaseEntity } from "typeorm";


@Entity()
export class User {
    @Unique(["username", "email"])

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string; 

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    role: Role
}

export enum Role{
    Admin = "ADMIN",
    User = "USER"
}