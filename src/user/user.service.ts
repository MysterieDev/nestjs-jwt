import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  findOne(username: string): Promise<User | undefined> {
      return this.userRepository.findOne({ username: username});
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  insertOne(user: User): Promise<User>{
    return this.userRepository.save(user);
  }
  
  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

}

