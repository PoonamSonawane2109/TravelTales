/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("contact_messages", (table) => {
        table.increments("message_id").primary();
        table.integer("user_id").unsigned().notNullable()
            .references("user_id").inTable("users");
        table.string("subject", 200).notNullable();
        table.text("message").notNullable();
        table.enu("status", ["NEW", "READ", "RESOLVED"]).notNullable().defaultTo("NEW");
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists("contact_messages");
};
