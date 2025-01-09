import mongoose, { Document, Model } from 'mongoose';
import { toJSON } from './plugins';
import { tokenTypes } from '../config/tokens';

// Define the Token interface
export interface IToken extends Document {
  token: string;
  user: mongoose.Types.ObjectId;
  type: string;
  expires: Date;
  blacklisted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Create the Token schema
const tokenSchema = new mongoose.Schema<IToken>(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Add the plugin that converts Mongoose to JSON
tokenSchema.plugin(toJSON);

// Define the Token model
const Token: Model<IToken> = mongoose.model<IToken>('Token', tokenSchema);

export default Token;
