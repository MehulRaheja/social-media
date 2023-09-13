import { Request, Response } from 'express';
import * as cloudinaryUploads from '@global/helpers/cloudinary-upload';
import { authMock, authMockRequest, authMockResponse } from '@root/mocks/auth.mock';
import { SignUp } from '@auth/controllers/signup';
import { CustomError } from '@global/helpers/error-handler';
import { authService } from '@service/db/auth.service';
import { UserCache } from '@service/redis/user.cache';

jest.useFakeTimers(); // to fake setTimeout and setInterval methods
// here we mock all the methods that are required for signup because we don't want to use the actual implementation
jest.mock('@service/queues/base.queue');
jest.mock('@service/redis/user.cache');
jest.mock('@service/queues/user.queue');
jest.mock('@service/queues/auth.queue');
jest.mock('@global/helpers/cloudinary-upload');

describe('SignUp', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // before starting any test it will reset all the mocked functions
  });

  afterEach(() => {
    jest.clearAllMocks(); // all mock functions of the test will be clear here
    jest.clearAllTimers(); // all the fake timeout and interval methods will be cleared here
  });

  it('should throw an error if username is not available', () => {
    const req: Request = authMockRequest({}, {
      username: '',
      email: 'manny@test.com',
      password: 'password',
      avatarColor: 'red',
      avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
    }) as Request;
    const res: Response = authMockResponse();

    // we will use the catch method to get the error
    // joiValidator is using our custom error handler so the type of the error will be of CustomError
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Username is a required field');
    });
  });

  it('should throw an error if username is less than the minimum', () => {
    const req: Request = authMockRequest({}, {
      username: 'me',
      email: 'manny@test.com',
      password: 'password',
      avatarColor: 'red',
      avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
    }) as Request;
    const res: Response = authMockResponse();

    // we will use the catch method to get the error
    // joiValidator is using our custom error handler so the type of the error will be of CustomError
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid username');
    });
  });

  it('should throw an error if username is more than the maximum', () => {
    const req: Request = authMockRequest({}, {
      username: 'mexgdf gsdgsd',
      email: 'manny@test.com',
      password: 'password',
      avatarColor: 'red',
      avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
    }) as Request;
    const res: Response = authMockResponse();

    // we will use the catch method to get the error
    // joiValidator is using our custom error handler so the type of the error will be of CustomError
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid username');
    });
  });

  it('should throw an error if email is invalid', () => {
    const req: Request = authMockRequest({}, {
      username: 'mehul',
      email: 'not valid',
      password: 'password',
      avatarColor: 'red',
      avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
    }) as Request;
    const res: Response = authMockResponse();

    // we will use the catch method to get the error
    // joiValidator is using our custom error handler so the type of the error will be of CustomError
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Email must be valid');
    });
  });

  it('should throw an error if email is invalid', () => {
    const req: Request = authMockRequest({}, {
      username: 'mehul',
      password: 'password',
      avatarColor: 'red',
      avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
    }) as Request;
    const res: Response = authMockResponse();

    // we will use the catch method to get the error
    // joiValidator is using our custom error handler so the type of the error will be of CustomError
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('"email" is required');
    });
  });

  it('should throw an error if password is not available', () => {
    const req: Request = authMockRequest({}, {
      username: 'mehul',
      email: 'manny@test.com',
      password: '',
      avatarColor: 'red',
      avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
    }) as Request;
    const res: Response = authMockResponse();

    // we will use the catch method to get the error
    // joiValidator is using our custom error handler so the type of the error will be of CustomError
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Password is a required field');
    });
  });

  it('should throw an error if password length is less than the minimum', () => {
    const req: Request = authMockRequest({}, {
      username: 'mehul',
      email: 'manny@test.com',
      password: '45',
      avatarColor: 'red',
      avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
    }) as Request;
    const res: Response = authMockResponse();

    // we will use the catch method to get the error
    // joiValidator is using our custom error handler so the type of the error will be of CustomError
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid Password');
    });
  });

  it('should throw an error if password length is larger than the maximum', () => {
    const req: Request = authMockRequest({}, {
      username: 'mehul',
      email: 'manny@test.com',
      password: 'kjhuytuyuyililhihihjghfjdj',
      avatarColor: 'red',
      avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
    }) as Request;
    const res: Response = authMockResponse();

    // we will use the catch method to get the error
    // joiValidator is using our custom error handler so the type of the error will be of CustomError
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid Password');
    });
  });

  it('should throw unauthorize error is user already exist', () => {
    const req: Request = authMockRequest({}, {
      username: 'Manny',
      email: 'mannfy@test.com',
      password: 'password',
      avatarColor: 'red',
      avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
    }) as Request;
    const res: Response = authMockResponse();

    jest.spyOn(authService, 'getUserByUsernameOrEmail').mockResolvedValue(authMock); // we mocked 'getUserByUsernameOrEmail' this function here
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid credentials');
    });
  });

  it('should set session data for valid credentials and send correct json response', async () => {
    const req: Request = authMockRequest({}, {
      username: 'Mehul',
      email: 'mehul@test.com',
      password: 'password',
      avatarColor: 'red',
      avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
    }) as Request;
    const res: Response = authMockResponse();

    const userSpy = jest.spyOn(UserCache.prototype, 'saveUserToCache'); // spying on this method will not work if we call it on authService, so we have directly call it on userCache class
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(authService, 'getUserByUsernameOrEmail').mockResolvedValue(null as any); // we mocked 'getUserByUsernameOrEmail' this function here
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(cloudinaryUploads, 'uploads').mockImplementation((): any => Promise.resolve({ version: '345674567', public_id: '1234567'}));

    await SignUp.prototype.create(req, res);
    console.log(userSpy.mock);
    expect(req.session?.jwt).toBeDefined();
    expect(res.json).toHaveBeenCalledWith({
      message: 'User created successfully.',
      user: userSpy.mock.calls[0][2],
      token: req.session?.jwt
    });
  });
});
