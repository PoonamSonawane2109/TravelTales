/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {

    return knex.schema.createTable("users", function (table) {

        table.increments("user_id").primary();

        table.string("full_name", 100).notNullable();

        table.string("email", 150).notNullable().unique();

        table.string("password_hash", 255).notNullable();

        table.enu("role", ["user", "admin"])
            .notNullable()
            .defaultTo("user");

        table.enu("account_status", ["active", "inactive", "blocked"])
            .notNullable()
            .defaultTo("active");

        table.string("profile_image", 500);

        table.string("bio", 500);

        table.timestamp("created_at").defaultTo(knex.fn.now());

        table.timestamp("updated_at").defaultTo(knex.fn.now());

    });

};


exports.down = function (knex) {

    return knex.schema.dropTableIfExists("users");

};
