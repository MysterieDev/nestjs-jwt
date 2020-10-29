import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  BaseEntity,
  Index,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Index({ unique: true })
  @Column()
  email: string;
  @Index({ unique: true })
  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  role: Role;

  @Column()
  salt: string;
}

export enum Role {
  Admin = 'ADMIN',
  User = 'USER',
}

export interface SafeUser {
  id: number;
  email: string;
  username: string;
  role: Role
}