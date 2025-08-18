import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { APP_CONFIGS } from '../../../config/app.config';
import { IJwtPayload } from '../../../interfaces/jwt.payload';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: APP_CONFIGS.JWT.SECRET,
    });
  }

  async validate(payload: IJwtPayload): Promise<User> {
    const user = new User();
    user.id = payload.id;
    user.email = payload.email;
    user.roles = payload.roles;
    return user;
  }
}
