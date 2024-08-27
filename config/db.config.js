require('dotenv').config()

const config = {
    db: {
      /* don't expose password or any sensitive info, done only for demo */
      host: process.env.DATABASE_IP,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    },
    listPerPage: 10,
  };
  module.exports = config;