import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, Role } from 'src/user/models/user.entity';
import { UserDto, LoginDto } from 'src/user/models/user.dto';


@Injectable()
export class AuthService {
    
    constructor(private userService: UserService, private jwtService: JwtService){}
    

    async validateUser(loginData: LoginDto): Promise<any>{
        const user = await this.userService.findOne(loginData.username);
        if(user && user.password === loginData.password) {
            const { password, ...result } = user;
            return result;
        }
        return null;
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
        newUser.password = password;
        newUser.email = email;
        newUser.role = Role.User;
        return this.userService.insertOne(newUser);
    }
}
