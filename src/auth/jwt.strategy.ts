import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "../../constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

/**
 * For the jwt-strategy, Passport first verifies the JWT's signature and decodes the JSON. 
 * It then invokes the validate() method passing the decoded JSON as its single parameter. 
 * Based on the way JWT signing works, we're guaranteed that we're receiving a valid token 
 * that we have previously signed and issued to a valid user.
 * 
 * This is also the place we may decide to do further token validation
 */
    async validate(payload){
        return { id: payload.id, username: payload.username, role: payload.role};
    }
}