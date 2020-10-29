import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from './models/user.entity';
import { Repository } from 'typeorm';
import { SafeUser } from '../user/models/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOneAndGetSafe(username: string): Promise<SafeUser | undefined> {
    const user = await this.userRepository.findOne({ username: username });
    return user ? this.getSafeUser(user): undefined;
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ username: username });
  }


  async findOneAndCheckRole(username: string, role: Role): Promise<SafeUser> {
   const user = await this.userRepository.findOne({ username: username });
   if (user && user.role === role){
     return this.getSafeUser(user);
   }
   else if(user){
     throw new UnauthorizedException();
   }
   else{
     throw new NotFoundException("User was not found");
   }
  }

  async findAll(): Promise<SafeUser[]> {
    const allUsers = await this.userRepository.find();
    return allUsers.map(user => {
      const safeUser = this.getSafeUser(user);
      return safeUser;
    });
  }

  async insertOne(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  /**
   * Takes in a user and returns all properties that dont expose
   * critical information such as password and salt
   * @param user User that is to be processed
   */
  private getSafeUser(user: User){
    const { password, salt, ...result } = user;
    return result;
  }

}
