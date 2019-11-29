
exports.up = function(knex) {
  return knex.schema
    .createTable('customers', (table)=>{
        table.increments('id').primary()
        table.string('fullname')
        table.string('username')
        table.string('password')
        table.bigInteger('ktp')
        table.string('alamat')
        table.date('tgl_lahir')
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('customers')
};
