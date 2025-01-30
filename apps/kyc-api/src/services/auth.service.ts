import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { AppError } from '../middleware/error.middleware';
import { SignupDTO, LoginDTO, AuthResponse } from '../types/auth';
import { env } from '../config/env.config';

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async signup(data: SignupDTO): Promise<AuthResponse> {
    // Check if user exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError(400, 'Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await this.userRepository.create({
      email: data.email,
      name: data.name,
      password: hashedPassword,
    });

    // Generate token
    const token = this.generateToken(user);

    return this.createAuthResponse(user, token);
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    // Find user
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user);

    return this.createAuthResponse(user, token);
  }

  private generateToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      env.JWT_SECRET,
      { expiresIn: '1d' },
    );
  }

  private createAuthResponse(user: User, token: string): AuthResponse {
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }
}
