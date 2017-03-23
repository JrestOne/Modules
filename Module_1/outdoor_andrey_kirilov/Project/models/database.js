const pg = require('pg');
const connectStr = process.env.DATABASE_URL || 'postgres://postgres:123@localhost:5432/postgres';

const client = new pg.Client(connectStr);
client.connect();
const query = client.query(
  'CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY , username VARCHAR(40) not null , email VARCHAR(40) not null, password VARCHAR(100) not null,roles VARCHAR(40) not null);');
query.on('end', () => { client.end(); });
