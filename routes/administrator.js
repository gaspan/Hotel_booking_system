module.exports = (app) => {
    const administrator = require('../controller/administrator')
    const multer = require('multer')
    const path = require('path')
    var upload_image = multer({
        dest: 'public/rooms/',
        fileFilter: (req, file, inst) => {
            var extFile = path.extname(file.originalname);
            var filetypeallowed = /png|jpg|jpeg/;
            var mimetype = filetypeallowed.test(file.mimetype);
            if (!(extFile !== ".png" || extFile !== ".jpg" || extFile !== ".jpeg") || !mimetype) {
                console.log('failed');
                inst(null, false)
            } else {
                inst(null, true)
            }
        }
    });
    
    app.route('/administrator/get_list_rooms')
        .get(administrator.list_rooms)
    
    app.route('/administrator/rooms')
        .post(administrator.create_rooms)
        .put(administrator.update_room)

    app.route('/administrator/rooms/:id')
        .delete(administrator.delete_rooms)

    app.route('/administrator/image/:id')
        .post(upload_image.single('photo'), administrator.image_room_upload)

}