import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { hash, compare } from 'bcryptjs';
import { model, Model, Schema } from 'mongoose';

const SALT_ROUND = 10;

const authSchema: Schema = new Schema(
  {
    username: { type: String },
    uId: { type: String },
    email: { type: String },
    password: { type: String },
    avatarColor: { type: String },
    createdAt: { type: Date, default: Date.now },
    passwordResetToken: { type: String, default: '' },
    passwordResetExpires: { type: Number },
  },
  {
    // when we return the authSchema document, password field will be removed from it.
    // if we don't want to return any other property upon query, just delete it here.
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        return ret;
      }
    }
  }
);

// below method will hash the password before we save it to the database
// this refers to the particular document that has been created
authSchema.pre('save', async function (this: IAuthDocument, next: () => void) {
  const hashedPassword: string = await hash(this.password as string, SALT_ROUND);
  this.password = hashedPassword;
  next();
});

authSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  const hashedPassword: string = (this as unknown as IAuthDocument).password!;
  return compare(password, hashedPassword);
};

// this method will be used when user try to its password
authSchema.methods.hashPassword = async function (password: string): Promise<string> {
  return hash(password, SALT_ROUND);
};

const AuthModel: Model<IAuthDocument> = model<IAuthDocument>('Auth', authSchema, 'Auth');
export { AuthModel };
