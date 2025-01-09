import { Document, Schema } from 'mongoose';

interface PaginateOptions {
  sortBy?: string;
  populate?: string;
  limit?: number;
  page?: number;
}

interface QueryResult<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

/**
 * Pagination function for Mongoose schemas
 * @param schema The Mongoose schema to apply pagination
 */
const paginate = <T extends Document>(schema: Schema<T>) => {
  /**
   * Query for documents with pagination
   * @param filter MongoDB filter
   * @param options Pagination and query options
   * @returns A promise resolving to QueryResult
   */
  schema.statics['O'] = async function (
    filter: Record<string, any> = {},
    options: PaginateOptions = {},
  ): Promise<QueryResult<T>> {
    // Sorting logic
    let sort = '';
    if (options.sortBy) {
      const sortingCriteria = options.sortBy.split(',').map((sortOption) => {
        const [key, order] = sortOption.split(':');
        return (order === 'desc' ? '-' : '') + key;
      });
      sort = sortingCriteria.join(' ');
    } else {
      sort = 'createdAt';
    }

    const limit = options.limit && options.limit > 0 ? options.limit : 10;
    const page = options.page && options.page > 0 ? options.page : 1;
    const skip = (page - 1) * limit;

    const countPromise = this.countDocuments(filter).exec();
    let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);

    // Populate logic
    if (options.populate) {
      const populateOptions = options.populate.split(',').map((populateOption) => {
        const paths = populateOption.split('.');
        return { path: paths[0], populate: { path: paths[1] } };
      });
      docsPromise = docsPromise.populate(populateOptions);
    }

    docsPromise = docsPromise.exec();

    const [totalResults, results] = await Promise.all([countPromise, docsPromise]);
    const totalPages = Math.ceil(totalResults / limit);

    return {
      results,
      page,
      limit,
      totalPages,
      totalResults,
    };
  };
};

export default paginate;
