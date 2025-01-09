import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { Request, Response } from 'express';
import { catchAsync } from 'src/utils/catchAsync';
import {
  createUserService,
  deleteUserByIdService,
  getUserByIdService,
  queryUsersService,
  updateUserByIdService,
} from 'src/services';
import pick from 'src/utils/pick';

export const createUserController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const user = await createUserService(req.body);
  res.status(httpStatus.CREATED).send(user);
});

export const getUsersController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await queryUsersService(filter, options);
  res.send(result);
});

export const getUserController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const user = await getUserByIdService(req.params['userId'] as string);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

export const updateUserController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const user = await updateUserByIdService(req.params['userId'] as string, req.body);
  res.send(user);
});

export const deleteUserController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  await deleteUserByIdService(req.params['userId'] as string);
  res.status(httpStatus.NO_CONTENT).send();
});
