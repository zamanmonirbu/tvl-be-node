import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
  PORT: Joi.number().default(3000),
  MONGODB_URL: Joi.string().required().description('Mongo DB url'),
  JWT_SECRET: Joi.string().required().description('JWT secret key'),
  JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('Minutes after which access tokens expire'),
  JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('Days after which refresh tokens expire'),
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
    .default(10)
    .description('Minutes after which reset password token expires'),
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
    .default(10)
    .description('Minutes after which verify email token expires'),
  SMTP_HOST: Joi.string().description('Server that will send the emails'),
  SMTP_PORT: Joi.number().description('Port to connect to the email server'),
  SMTP_USERNAME: Joi.string().description('Username for email server'),
  SMTP_PASSWORD: Joi.string().description('Password for email server'),
  EMAIL_FROM: Joi.string().description('The "from" field in the emails sent by the app'),
}).unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV as 'production' | 'development' | 'test',
  port: envVars.PORT as number,
  mongoose: {
    url: `${envVars.MONGODB_URL}${envVars.NODE_ENV === 'test' ? '-test' : ''}`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET as string,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES as number,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS as number,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES as number,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES as number,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST as string,
      port: envVars.SMTP_PORT as number,
      auth: {
        user: envVars.SMTP_USERNAME as string,
        pass: envVars.SMTP_PASSWORD as string,
      },
    },
    from: envVars.EMAIL_FROM as string,
  },
};

export default config;
