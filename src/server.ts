import mongoose from 'mongoose';
import app from './app';
import config from './config';

config.mongo.connect();

mongoose.connection.on('connected', () => {
  app.listen(app.get('port'), () => {
    config.logger.info(`App is running at http://localhost:${app.get('port')} in ${app.get('env')}`);
  });
});

process.on('SIGINT', () => config.mongo.exit()).on('SIGTERM', () => config.mongo.exit());
