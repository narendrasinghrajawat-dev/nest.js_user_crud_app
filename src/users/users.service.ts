import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private collection;

  constructor(private databaseService: DatabaseService) {
    this.collection = this.databaseService.getCollection('users');
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = {
      ...createUserDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await this.collection.save(user);
    return {
      _key: result._key,
      _id: result._id,
      ...user,
    };
  }

  async findAll(): Promise<User[]> {
    const cursor = await this.databaseService
      .getDatabase()
      .query(`FOR user IN users RETURN user`);
    return await cursor.all();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.collection.document(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.findOne(id);
    const updatedUser = {
      ...existingUser,
      ...updateUserDto,
      updatedAt: new Date(),
    };

    await this.collection.update(id, updatedUser);
    return updatedUser;
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.collection.remove(id);
      return { message: `User deleted successfully for ID: ${id}` };
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found`); 
    } 
  }
 
  async findByEmail(email: string): Promise<User | null> {
    const cursor = await this.databaseService
      .getDatabase()
      .query(`FOR user IN users FILTER user.email == @email RETURN user`, { email });
    const users = await cursor.all();
    return users[0] || null; 
  }
} 