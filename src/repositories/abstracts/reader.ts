import { Document, FilterQuery } from 'mongoose';

export default interface IReader<T extends Document> {
  find(query: FilterQuery<T>): Promise<T[]>;
  findOne(query: FilterQuery<T>): Promise<T | null>;
}
