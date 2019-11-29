const db = require('../config/database')
const moment = require('moment')

const customer = {
   listAllBookingActive: (callback) => {
       stringQuery = "SELECT * FROM hotel_booking.bookings where c_in_date > CURDATE() && is_active = 1"

       return db.pool.query(stringQuery,callback)
   },

   listAllRooms: (callback) => {
       stringQuery = "SELECT * FROM hotel_booking.rooms WHERE enable =1"

       return db.pool.query(stringQuery ,callback)
   },

   bookRoom: (params,callback) => {
       stringQuery = "INSERT INTO hotel_booking.bookings(customers_id,c_in_date,c_out_date,date_book,room_id,is_active)"
       stringQuery += `VALUES(?,?,?,'${moment().format("YYYY-MM-DD")}',?,1)`

       return db.pool.query(stringQuery,[params.customer_id,params.c_in_date,params.c_out_date,params.room_id],
            callback)
   },

   getPriceRoom: (params,callback) => {
       stringQuery = "SELECT price FROM hotel_booking.rooms WHERE id = ?"

       return db.pool.query(stringQuery,[params.id_room],callback)
   },

   createBill: (params,callback) => {
       stringQuery = "INSERT INTO hotel_booking.bills(booking_id,total)"
       stringQuery += `VALUES(?,?)`

       return db.pool.query(stringQuery,[params.booking_id,params.total],callback)
   },

   totalBill: (params,callback) => {
       stringQuery = "SELECT SUM(bills.total) as total_bill FROM bills "
       stringQuery += `INNER JOIN bookings `
       stringQuery += `ON bookings.id = bills.booking_id `
       stringQuery += `INNER JOIN customers `
       stringQuery += `ON customers.id = bookings.customers_id `
       stringQuery += `WHERE customers.id = ? & bookings.is_active = 1 `

       return db.pool.query(stringQuery,[params.customers_id],callback)
   },

   cancelBook: (params,callback) => {
       stringQuery = "UPDATE hotel_booking.bookings  SET is_active = 0 WHERE id = ?"

       return db.pool.query(stringQuery,[params.id_book],callback)
   },

   deleteBill: (params,callback) => {
       stringQuery = "DELETE FROM hotel_booking.bills WHERE booking_id= ? "

       return db.pool.query(stringQuery,[params.id_book],callback)
   }
}

module.exports = customer