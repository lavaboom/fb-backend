exports.up = function (knex) {
    return knex.schema
        .createTable('trips', (table) => {
        table.increments('id').primary();
        table
            .integer('sender_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        table.integer('driver_id');
            // .unsigned()
            // .references('id')
            // .inTable('users')
            // .onUpdate('CASCADE')
            // .onDelete('CASCADE');
        table.string('origin').notNullable();
        table.string('destination').notNullable();
        table.string('note').defaultTo('Leave at door');
        table.timestamp('date_posted').defaultTo(knex.fn.now());
        table.timestamp('job_date').notNullable();
        table.string('status').notNullable();
        table.string('payment_type').notNullable();
        table.integer('payment_amount').notNullable();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('trips');
};
