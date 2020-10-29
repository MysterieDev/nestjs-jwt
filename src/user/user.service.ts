import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User, SafeUser } from './models/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDataDto } from '../auth/models/auth.dto';
import { SQL_ERROR } from 'src/utils/error-codes';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOneAndGetSafe(username: string): Promise<SafeUser> {
    const user = await this.userRepository.findOne({ username: username });
    if (user) {
      return user;
    } else {
      throw new NotFoundException();
    }
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ username: username });
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

  async updateOne(user: User, data: Partial<SafeUser>): Promise<User> {
    return this.userRepository.save({ ...user, ...data });
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async updateUser(username: string, updateData: Partial<UpdateUserDataDto>) {
    const oldUser = await this.findOne(username);
    if (!oldUser) {
      throw new NotFoundException();
    }
    try {
      let user = await this.updateOne(oldUser, updateData);
      const { password, salt, role, id, ...result } = user;
      return result;
    } catch (e) {
      if (e.code === SQL_ERROR.DUPLICATE) {
        throw new ConflictException('User or Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * Checks the role of a given users against the role parameter
   * @param username the username
   * @param role the role to check the user against
   */
  async findOneAndCheckRole(username: string, role: Role): Promise<SafeUser> {
    const user = await this.userRepository.findOne({ username: username });
    if (user && user.role === role) {
      return this.getSafeUser(user);
    } else if (user) {
      throw new UnauthorizedException();
    } else {
      throw new NotFoundException('User was not found');
    }
  }
  /**
   * Returns an Array of All Users with the given role
   * @param role The desired role group
   */
  async findAllWithRole(role: Role): Promise<SafeUser[]> {
    const allUsers = await this.userRepository.find();
    return allUsers
      .filter(user => user.role === role)
      .map(user => {
        const safeUser = this.getSafeUser(user);
        return safeUser;
      });
  }

  /**
   * Takes in a user and returns all properties that dont expose
   * critical information such as password and salt
   * @param user User that is to be processed
   */
  private getSafeUser(user: User) {
    const { password, salt, ...result } = user;
    return result;
  }
}
