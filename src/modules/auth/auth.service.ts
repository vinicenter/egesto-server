import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string, tenant: string) {
    const user = await this.usersService.findUserAndComparePassword(
      username,
      pass,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user._id, username: user.username, tenant };

    return {
      token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }
}
