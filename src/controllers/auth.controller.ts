import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../utils/catchAsync';
import {
  createUserService,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
  loginUserWithEmailAndPasswordService,
  logoutService,
  refreshAuthService,
  resetPasswordService,
  sendResetPasswordEmailService,
  sendVerificationEmailService,
  verifyEmailService,
} from 'src/services';

export const registerController = catchAsync(async (req: Request, res: Response) => {
  const user = await createUserService(req.body);
  const tokens = await generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

export const loginController = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await loginUserWithEmailAndPasswordService(email, password);
  const tokens = await generateAuthTokens(user);
  res.send({ user, tokens });
});

export const logoutController = catchAsync(async (req: Request, res: Response) => {
  await logoutService(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

export const refreshTokensController = catchAsync(async (req: Request, res: Response) => {
  const tokens = await refreshAuthService(req.body.refreshToken);
  res.send({ ...tokens });
});

export const forgotPasswordController = catchAsync(async (req: Request, res: Response) => {
  const resetPasswordToken = await generateResetPasswordToken(req.body.email);
  await sendResetPasswordEmailService(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

export const resetPasswordController = catchAsync(async (req: Request, res: Response) => {
  await resetPasswordService(req.query['token'] as string, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

export const sendVerificationEmailController = catchAsync(async (req: Request, res: Response) => {
  const verifyEmailToken = await generateVerifyEmailToken(req.user);
  await sendVerificationEmailService((req.user as any).email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

export const verifyEmailController = catchAsync(async (req: Request, res: Response) => {
  await verifyEmailService(req.query['token'] as string);
  res.status(httpStatus.NO_CONTENT).send();
});
