import { useLogger } from '@/composables/logger';
import mongoose from 'mongoose';

const register = async (mongo_db_address: string) => {
  const { log } = useLogger('db/mongo');
  try {
    await mongoose.connect(mongo_db_address, { appName: 'dexterous' });
    return log({ message: 'Mongo DB Connected Successfully', type: 'success' }).object;
  } catch (error) {
    throw log({ data: error, message: 'Error On Connect To Mongo DB ', type: 'error' }).object;
  }
};
export default { register };
