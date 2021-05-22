import mongoose from 'mongoose';
import logger from './winston';
import secrets from './secrets';

const connect = (): void => {
  if (secrets.MONGODB_URI_LOCAL) {
    mongoose.connect(secrets.MONGODB_URI_LOCAL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    }).then(() => {
      logger.info('MongoDB connection established');
    }).catch((err) => {
      logger.error(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
      process.exit(1);
    });
  }
};

const exit = (): void => {
  mongoose.connection.close(() => {
    logger.info('MongoDB connection closed');
    process.exit(0);
  });
};

export default {
  connect,
  exit,
};
