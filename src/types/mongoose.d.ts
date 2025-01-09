import { Schema } from 'mongoose';

declare module 'mongoose' {
  interface SchemaOptions {
    toJSON?: {
      transform?: (doc: any, ret: any, options: any) => any;
    };
  }
}
