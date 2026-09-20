import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPasswordResetToken(data: {
    token: string;
    userId: number;
    expiresAt: Date;
  }) {
    return this.prisma.passwordResetToken.create({ data });
  }

  async findPasswordResetToken(token: string) {
    return this.prisma.passwordResetToken.findUnique({
      where: {
        token,
      },
    });
  }

  async deletePasswordResetToken(id: number) {
    return this.prisma.passwordResetToken.delete({
      where: {
        id,
      },
    });
  }

  async deleteUserPasswordResetTokens(userId: number) {
    return this.prisma.passwordResetToken.deleteMany({
      where: {
        userId,
      },
    });
  }

  async updateUserPassword(userId: number, password: string) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password,
      },
    });
  }
}
