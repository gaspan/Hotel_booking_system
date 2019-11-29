const db = require('../config/database')

const administrator = {
    getAllRooms: (callback) => {
        stringQuery = "SELECT id, type_room, description, image, quantity, price, enable FROM hotel_booking.rooms WHERE enable =1";
        return db.pool.query(stringQuery, callback);
    },

    createRoom: (params, callback) =>{
        stringQuery = "INSERT INTO hotel_booking.rooms(type_room,description,image,quantity,price,enable)"
        stringQuery += "values(?,?,?,?,?,1);"
        
        return db.pool.query(stringQuery,[params.type_room,params.description,params.image,params.quantity,params.price],
            callback)
    },

    updateRoom: (params,callback) => {
        stringQuery = "UPDATE hotel_booking.rooms SET type_room = ?, description = ?, image = ?, quantity = ?,"
        stringQuery += "price = ? WHERE id = ?"

        return db.pool.query(stringQuery,[params.type_room,params.description,params.image,params.quantity,params.price,
            params.id],callback)
    },

    deleteRoom: (params,callback) =>{
        stringQuery = "UPDATE hotel_booking.rooms SET enable = 0 WHERE id = ?"

        return db.pool.query(stringQuery, [params.id],callback)
    },

    uploadImageRoom: (params,callback) => {
        stringQuery = "UPDATE hotel_booking.rooms SET image = ? WHERE id = ?"

        return db.pool.query(stringQuery, [params.image, params.id], callback)
    }
}

module.exports = administrator