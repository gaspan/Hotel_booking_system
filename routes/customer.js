module.exports = (app) => {
    const customer = require('../controller/customer')

    app.route('/customer/list_all_avail_room')
        .post(customer.list_all_avail_room_by_date)

    app.route('/customer/book_rooms')
        .post(customer.book_rooms)

    app.route('/customer/cancel_book')
        .post(customer.cancel_book)
}