import mongoose, { Document, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { toJSON, paginate } from './plugins';
import { roles } from '../config/roles';

// Interface defining the structure of the User document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  isEmailVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  isPasswordMatch(password: string): Promise<boolean>;
}

// Interface for the model-level methods
export interface IUserModel extends Model<IUser> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
}

// Define the User schema
const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: 'Invalid email',
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate: {
        validator: (value: string) => /\d/.test(value) && /[a-zA-Z]/.test(value),
        message: 'Password must contain at least one letter and one number',
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Add plugins
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

// Static method to check if an email is taken
userSchema.statics['isEmailTaken'] = async function (
  email: string,
  excludeUserId?: mongoose.Types.ObjectId,
): Promise<boolean> {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

// Instance method to check if passwords match
userSchema.methods['isPasswordMatch'] = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this[password]);
};

// Pre-save middleware to hash the password if modified
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Define the User model
const User = mongoose.model<IUser, IUserModel>('User', userSchema);

export default User;
