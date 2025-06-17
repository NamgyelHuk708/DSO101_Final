exports.up = function(knex) {
    return knex.schema.createTable('bmi_records', table => {
      table.increments('id').primary();
      table.decimal('height').notNullable();
      table.decimal('weight').notNullable();
      table.integer('age').notNullable();
      table.decimal('bmi').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('bmi_records');
  };