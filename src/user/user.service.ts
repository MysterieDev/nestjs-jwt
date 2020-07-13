import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UserService {
  private readonly users: User[];

  constructor() {
    this.users = [
    { userId: 1, username: 'john', passsword: 'changeme' },
    { userId: 2, username: 'john2', passsword: 'changeme' }];
  }

  async findOne(username: string): Promise<User | undefined> {
      return this.users.find(user => user.username === username);
  }
}


