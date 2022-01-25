exports.up = function (knex) {
    return knex.schema
        .createTable('reviews', (table) => {
        table.increments('id').primary();
        table
            .integer('by_user_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        table
            .integer('for_user_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
            table
            .integer('trip_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('trips')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        table.integer('score').notNullable();
        table.string('text');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('reviews');
};
