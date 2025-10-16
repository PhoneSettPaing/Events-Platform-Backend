const pg = require("pg");
const { Pool } = pg;
// Prevent DATE (OID 1082) from being converted to JS Date objects
// Returns date and time fields as plain strings exactly as stored in Postgres.
pg.types.setTypeParser(1082, (str) => str); // DATE
pg.types.setTypeParser(1083, (str) => str); // TIME

const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({ path: `${__dirname}/../.env.${ENV}` });

const config = {};

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
} else {
  console.log(
    `Connected to ${process.env.PGDATABASE || process.env.DATABASE_URL}`
  );
}

const db = new Pool(config);

module.exports = db;
