import { Schema } from 'mongoose';

interface TransformOptions {
  [key: string]: any;
}

const deleteAtPath = (obj: any, path: string[], index: number): void => {
  if (index === path.length - 1) {
    const pathElement = path[index];
    if (pathElement !== undefined) {
      delete obj[pathElement.toString()];
    }
    return;
  }
  deleteAtPath(obj[path[index]?.toString() ?? ''], path, index + 1);
};

const toJSON = (schema: Schema): void => {
  let transform: (doc: any, ret: any, options: TransformOptions) => any;

  // Check if a custom transform function is provided
  if (schema?. && schema.options.toJSON && schema.options.toJSON.transform) {
    transform = schema.options.toJSON.transform;
  }

  schema.options = Object.assign(schema?.options || {}, {
    toJSON: {
      transform(doc: any, ret: any, options: TransformOptions): any {
        // Remove private fields
        Object.keys(schema.paths).forEach((path) => {
          const schemaPath = schema.paths[path];
          if (schemaPath?.options && schemaPath?.options['private']) {
            deleteAtPath(ret, path.split('.'), 0);
          }
        });

        // Standard transformations
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;

        if (transform) {
          return transform(doc, ret, options);
        }
      },
    },
  });
};

export default toJSON;
