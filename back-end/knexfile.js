/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

//require('dotenv').config();
const path = require("path");

const {
  DATABASE_URL = "postgres://dbzfjvjy:79OPnT96b1k3bZJ6a6jsiRH3h1xsWYRJ@queenie.db.elephantsql.com:5432/dbzfjvjy",
  DATABASE_URL_DEVELOPMENT = "postgres://dbzfjvjy:79OPnT96b1k3bZJ6a6jsiRH3h1xsWYRJ@queenie.db.elephantsql.com:5432/dbzfjvjy",
  DATABASE_URL_TEST = "postgres://knulqjgu:mwNiAB3cZJHw1lA3uzYuCYJv3TV9Mt7k@queenie.db.elephantsql.com:5432/knulqjgu",
  DATABASE_URL_PREVIEW = "postgres://aqleriza:fkzdl_KUWpVm1JeNpj7kgrsXd22XtysQ@queenie.db.elephantsql.com:5432/aqleriza",
  DEBUG,
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_DEVELOPMENT,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_TEST,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_PREVIEW,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
