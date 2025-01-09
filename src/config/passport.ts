import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions, VerifiedCallback } from 'passport-jwt';
import config from './config';
import { tokenTypes } from './tokens';
import { User } from '../models';
import { JwtPayload } from 'jsonwebtoken';

// Define the payload type
interface CustomJwtPayload extends JwtPayload {
  sub: string; // Subject (user ID)
  type: string; // Token type
}

const jwtOptions: StrategyOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload: CustomJwtPayload, done: VerifiedCallback): Promise<void> => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }

    done(null, user);
  } catch (error) {
    done(error as Error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export { jwtStrategy };
