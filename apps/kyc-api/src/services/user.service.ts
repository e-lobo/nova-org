import { User, Prisma } from '@prisma/client';
import { UserRepository } from '../repositories/user.repository';
import { AppError } from '../middleware/error.middleware';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError(400, 'Email already exists');
    }
    return this.userRepository.create(data);
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    return user;
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    await this.getUserById(id); // Checks if user exists

    if (data.email) {
      const existingUser = await this.userRepository.findByEmail(
        data.email as string,
      );
      if (existingUser && existingUser.id !== id) {
        throw new AppError(400, 'Email already exists');
      }
    }

    return this.userRepository.update(id, data);
  }

  async deleteUser(id: string): Promise<User> {
    await this.getUserById(id); // Checks if user exists
    return this.userRepository.delete(id);
  }

  async getUsers(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    return this.userRepository.findAll(params);
  }
}
