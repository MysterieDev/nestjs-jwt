import { UserService } from './../user/user.service';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, Role } from 'src/user/models/user.entity';
import { UserDto, LoginDto } from 'src/user/models/user.dto';
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    
    constructor(private userService: UserService, private jwtService: JwtService){}
    

    async validateUser(loginData: LoginDto): Promise<any>{
        const user = await this.userService.findOne(loginData.username);
        if(user){
        const hashedPassword = await this.hashPassword(loginData.password, user.salt);
        if(user && user.password === hashedPassword) {
            const { password, salt, ...result } = user;
            return result;
        }
        else{
            return null;
        }
        }
        else {
            throw new NotFoundException()
        }
    }

    async login(user: User){
        const payload = { username: user.username, sub: user.id, role: user.role };
        return {
          access_token: this.jwtService.sign(payload),
        };
    }
    

    async signUp(user: UserDto){
        const {username, email, password} = user;
        const newUser = new User(); 
        newUser.username = username;
        newUser.salt = await bcrypt.genSalt();
        newUser.password = await this.hashPassword(password, newUser.salt);
        newUser.email = email;
        newUser.role = Role.User;

        return this.userService.insertOne(newUser);
    }

    private async hashPassword(password: string, salt: string): Promise<string>{
        return bcrypt.hash(password, salt)
    }
}
