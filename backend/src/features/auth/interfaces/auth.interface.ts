import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { IUserDocument } from '@user/interfaces/user.interface';


// here we added a new property to the interface Request which is part of already existing namespace i.e. Express
// currentUser is added to Request interface of the Express, preexisting properties are req.body, req.params, req.query etc.
declare global {
  namespace Express {
    interface Request {
      currentUser?: AuthPayload;
    }
  }
}

// auth api payload from client
export interface AuthPayload {
  userId: string;
  uId: string;
  email: string;
  username: string;
  avatarColor: string;
  iat?: number;
}

// auth schema interface
export interface IAuthDocument extends Document {
  _id: string | ObjectId;
  uId: string;
  username: string;
  email: string;
  password?: string;
  avatarColor: string;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
}

// signup data used to create user, this data is used for create/save method
export interface ISignUpData {
  _id: ObjectId;
  uId: string;
  email: string;
  username: string;
  password: string;
  avatarColor: string;
}

export interface IAuthJob {
  value?: string | IAuthDocument | IUserDocument;
}
