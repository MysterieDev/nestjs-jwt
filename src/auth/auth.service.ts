import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    
    constructor(private userService: UserService){}
    

    async validateUser(username: string, password: string): Promise<any>{
        const user = await this.userService.findOne(username);
        if(user && user.password === password) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
}
