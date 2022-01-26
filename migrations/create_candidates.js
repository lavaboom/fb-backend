exports.up = function (knex) {
    return knex.schema
        .createTable('candidates', (table) => {
        table.increments('id').primary();
        table
            .integer('trip_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('trips')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        table
            .integer('candidate_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        table.integer('offer').notNullable();
        table.string('candidate_status');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('candidates');
};
