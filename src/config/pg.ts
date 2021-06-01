import pgPromise from 'pg-promise';
import config from '.';

const pgp = pgPromise({});
const db = pgp(config.secrets.PGSQL_URI);

export default db;
