
exports.up = function(knex) {
  return knex.schema
    .createTable('administrators', (table)=>{
        table.increments('id').primary()
        table.string('username')
        table.string('password')
        table.boolean('enable')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('administrators')
};
