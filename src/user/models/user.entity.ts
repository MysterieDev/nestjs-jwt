import { Entity, PrimaryGeneratedColumn, Column, Unique, BaseEntity } from "typeorm";


@Entity()
@Unique(['email', 'username'])
export class User {
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

    @Column() 
    salt: string;
}

export enum Role{
    Admin = "ADMIN",
    User = "USER"
}