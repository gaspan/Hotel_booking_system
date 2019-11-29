const administrator = require('../models/administrator')


exports.list_rooms = (req, res) =>{
    administrator.getAllRooms((err, rows)=>{
        if (err) {
            res.json({
                "error":true,
                "message": err,
                "data":{}
            })
        } else {
            rows.map(item=>{
                item.image = req.headers.host + item.image
            })
            res.json({
                "error":false,
                "message": "success",
                "data":rows
            })
        }
    })
}

exports.create_rooms = (req, res) => {
    administrator.createRoom(req.body, (err, result)=>{
        if (err) {
            res.json({
                "error":true,
                "message": err,
                "data":{}
            })
        } else {
            res.json({
                "error":false,
                "message": "success",
                "data":result
            })
        }
    })
}

exports.update_room = (req,res) => {
    administrator.updateRoom(req.body, (err, result)=>{
        if (err) {
            res.json({
                "error":true,
                "message": err,
                "data":{}
            })
        } else {
            res.json({
                "error":false,
                "message": "success",
                "data":result
            })
        }
    })
}

exports.delete_rooms = (req,res) =>{
    administrator.deleteRoom(req.params, (err, result)=> {
        if (err) {
            res.json({
                "error":true,
                "message": err,
                "data":{}
            })
        } else {
            res.json({
                "error":false,
                "message": "success",
                "data":'deleted'
            })
        }
    })
}

exports.image_room_upload = (req,res) => {
    if (req.file == "" || req.file == null){
        file_img= 0
    }else{
        file_img= req.file
        length = file_img.length
    }

    if (file_img != 0) {
        let mimetype = (file_img.mimetype).split("/").pop()
        let payload = {
            id : req.params.id,
            // image : `/${file_img.path}.${mimetype}`
            image : `/${file_img.path}`
        }
        // console.log(payload)
        administrator.uploadImageRoom(payload, (err,result)=>{
            if (err) {
                res.json({
                    "error":true,
                    "message": err,
                    "data":{}
                })
            } else {
                res.json({
                    "error":false,
                    "message": "success",
                    "data":'uploaded'
                })
            }
        })
    }else{
        res.json({
            "error":true,
                "message": "file not found",
                "data":{}
        })
    }
}