import { Role } from "./user.entity";

export interface UserDto{
    username: string;
    email: string;
    password: string;
    role?: Role;
}

export interface LoginDto{
    username: string;
    password: string;
}