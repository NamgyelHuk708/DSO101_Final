require('dotenv').config();

module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL || {
    host: 'db',  // Must match compose service name
    port: 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  },
  migrations: {
    directory: './database/migrations'
  }
};