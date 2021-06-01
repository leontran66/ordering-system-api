import logger from './winston';

require('dotenv').config();

const {
  AUTH0_ADMIN_ID,
  AUTH0_DOMAIN,
  AUTH0_MGMT_CLIENT_ID,
  AUTH0_MGMT_CLIENT_SECRET,
  AUTH0_USER_ID,
  PGSQL_URI,
  PGSQL_URI_LOCAL,
} = process.env;

if (!AUTH0_ADMIN_ID || !AUTH0_DOMAIN || !AUTH0_MGMT_CLIENT_ID || !AUTH0_MGMT_CLIENT_SECRET
  || !AUTH0_USER_ID || !PGSQL_URI || !PGSQL_URI_LOCAL) {
  logger.error('One or more environment variables are missing. Please ensure that the following variables are set:\nAUTH0_ADMIN_ID\nAUTH0_DOMAIN\nAUTH0_MGMT_CLIENT_ID\nAUTH0_MGMT_CLIENT_SECRET\nAUTH0_USER_ID\nPGSQL_URI\nPGSQL_URI_LOCAL');
  process.exit(0);
}

export default {
  AUTH0_ADMIN_ID,
  AUTH0_DOMAIN,
  AUTH0_MGMT_CLIENT_ID,
  AUTH0_MGMT_CLIENT_SECRET,
  AUTH0_USER_ID,
  PGSQL_URI,
  PGSQL_URI_LOCAL,
};
