require("dotenv").config();
console.log("Knex configuration loaded");
console.log("Database client:", "mysql2");
console.log("Database name:", process.env.DB_NAME);

module.exports = {
    development: {
        client: "mysql2",

        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        },

        migrations: {
            directory: "./migrations",
            tableName: "knex_migrations"
        }
    }
};