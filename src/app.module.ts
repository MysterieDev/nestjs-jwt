import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [TypeOrmModule.forRoot(), AuthModule, UserModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
