import { Document, SessionOption } from 'mongoose';

export default interface IWriter<T extends Document, A> {
  create(data: A): any;
  updateOne(query: any, data: Partial<A>, session?: SessionOption | null): Promise<T | null>;
  delete(query: any, session?: SessionOption | null): Promise<T | null>;
}
