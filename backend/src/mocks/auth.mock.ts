import { AuthPayload, IAuthDocument } from '@auth/interfaces/auth.interface';
import { Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authMockRequest = (sessionData: IJWT, body: IAuthMock, currentUser?: AuthPayload | null, params?: any) => ({
  session: sessionData,
  body,
  params,
  currentUser
});

export const authMockResponse = (): Response => {
  const res: Response = {} as Response;
  res.status = jest.fn().mockReturnValue(res);  // to return a mock value
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

export interface IJWT {
  jwt?: string;
}

export interface IAuthMock {
  _id?: string;
  username?: string;
  email?: string;
  uId?: string;
  password?: string;
  confirmPassword?: string;
  avatarImage?: string;
  avatarColor?: string;
  createdAt?: Date | string;
}

export const authUserPayload: AuthPayload = {
  userId: '60263f14648fed5246e322d9',
  uId: '1621613119252066',
  username: 'Manny',
  email: 'manny@me.com',
  avatarColor: '#9c27b0',
  iat: 12345
};

export const authMock = {
  _id: '60263f14648fed5246e322d3',
  uId: '1621613119252066',
  username: 'Manny',
  email: 'manny@me.com',
  avatarColor: '#9c27b0',
  createdAt: '2022-08-31T07:42:24.451Z',
  save: () => {},
  comparePassword: () => false
} as unknown as IAuthDocument;

export const signUpMockData = {
  _id: '60263f14648fed5246e',
  uId: '1621613119252066',
  username: 'Manny',
  email: 'manny@test.com',
  avatarColor: '#ff9800',
  password: 'password',
  birthDay: { month: '', day: '' },
  postCount: 0,
  blocked: [],
  blockedBy: [],
  work: '',
  location: '',
  school: '',
  quote: '',
  bgImageVersion: '',
  bgImageId: '',
  followersCount: 0,
  followingCount: 0,
  postsCount: 0,
  notifications: [Object],
  social: [Object]
};
