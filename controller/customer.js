const customer = require('../models/customer')
const moment = require('moment')
const axios = require('axios')

exports.list_all_avail_room_by_date = (req,res) =>{
    let StartDate = new Date(req.body.c_in_date)
    let EndDate = new Date(req.body.c_out_date)
    //check in room must be greater than today
    let isStartDateGreater = is_check_in_is_greater_than_today(StartDate)
    if (isStartDateGreater) {
        // returns an array of dates between the two dates that will be book by customer
        let DatesToBook = get_date_to_book(new Date(StartDate.getFullYear(),StartDate.getMonth(),StartDate.getDate()), new Date(EndDate.getFullYear(),EndDate.getMonth(),EndDate.getDate()))
        
        //list all booking active
        customer.listAllBookingActive(async (err,list_booking_active)=>{
            if (err) {
                res.json({
                    "error":true,
                    "message": err,
                    "data":{}
                })
            } else {
                
                let all_booking_room_active = list_booking_active
                //is there any booking room from other person that match day with this customer
                let room_booked_other_customer = await is_there_any_booking_from_other_person(DatesToBook,all_booking_room_active)
                
                //count same room booked with other customer
                let room_booked_other_customer_compresed = compressArray(room_booked_other_customer)
                
                customer.listAllRooms((err,list_rooms)=>{
                    if (err) {
                        res.json({
                            "error":true,
                            "message": err,
                            "data":{}
                        })
                    } else {
                        
                        let all_rooms = list_rooms
                        //reduce the quantity of rooms that are already booked
                        all_rooms.forEach((item, i)=>{
                            room_booked_other_customer_compresed.forEach((itm,idx)=>{
                                if (itm.value.id_room == item.id) {
                                    item.quantity = item.quantity - itm.count
                                }
                            })
                        })
                        //filter: rooms available
                        let room_avail = all_rooms.filter(item=>item.quantity >0)
                        res.json({
                            "error":false,
                            "message": "success",
                            "data": room_avail
                        })
                    }
                })

            }
        })

    } else {
        res.json({
            "error":true,
            "message": "check in must be greater than today",
            "data":{}
        })
    }

}

exports.book_rooms = (req, res) => {
    //retrieve available room data between date wich will be book
    axios.post('http://127.0.0.1:3000/customer/list_all_avail_room', {
        c_in_date: req.body.c_in_date,
	    c_out_date: req.body.c_out_date
      })
      .then(async(response) => {
        //is room wich customer will book available
        let check_room_avail = await is_room_avail(response.data.data,req.body.room_to_book)
        if (check_room_avail.warning == 1) {
            res.json({
                "error":true,
                "message": check_room_avail.message,
                "data":{}
            })
        } else {
            let arr_id_book = []
            req.body.room_to_book.forEach((item, index)=>{

                let quantity_room_to_book = item.quantity
                while (quantity_room_to_book--) {
                    let data_to_book = {
                        customer_id : req.body.id_customer,
                        c_in_date : req.body.c_in_date,
                        c_out_date:req.body.c_out_date,
                        room_id:item.id_room
                    }
                    //book room
                    customer.bookRoom(data_to_book,(err,result_book)=>{
                        if (err) {
                            res.json({
                                "error":true,
                                "message": err,
                                "data":{}
                            })
                        }else{
                            //get price every booked room
                            customer.getPriceRoom({id_room : data_to_book.room_id},(err,result_harga)=>{
                                if (err) {
                                    res.json({
                                        "error":true,
                                        "message": err,
                                        "data":{}
                                    })
                                } else {
                                    
                                    arr_id_book.push(result_book.insertId)
                                    let data_bill = {
                                        booking_id:result_book.insertId,
                                        total: result_harga[0].price
                                    }
                                    //create bill
                                    customer.createBill(data_bill,(err,result_bill)=>{
                                        if (err) {
                                            res.json({
                                                "error":true,
                                                "message": err,
                                                "data":{}
                                            })
                                        } else {
                                        
                                            if ((index+1) == (req.body.room_to_book).length && quantity_room_to_book == -1) {
                                                customer.totalBill({customers_id : req.body.id_customer}, (err,result_total_bill)=>{
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
                                                            "data": {
                                                                bill: result_total_bill,
                                                                array_id_book: arr_id_book
                                                            }
                                                        })      
                                                    }
                                                })

                                            }                                            
                                        }
                                    })
                                }
                            })
                            
                        }
                    })
                }
            })
            
        }
        
      })
      .catch((error) => {
        res.json({
            "error":true,
            "message": error,
            "data":{}
        })
      });
}

exports.cancel_book = (req,res) => {
    req.body.id_book.forEach((item, index)=>{
        customer.deleteBill({id_book: item.id},(err, result_d_bill)=>{
            if (err) {
                res.json({
                    "error":true,
                    "message": err,
                    "data":{}
                })
            }else{
                // console.log('there')
                customer.cancelBook({id_book: item.id},(err,result)=>{
                    if (err) {
                        res.json({
                            "error":true,
                            "message": error,
                            "data":{}
                        })      
                    }
                    if ((index+1) == (req.body.id_book).length) {
                        res.json({
                            "error":false,
                            "message": "success",
                            "data":"booking canceled"
                        })   
                    }
                })
            }
        })

    })
}

function is_room_avail(roomAvail,roomToBook){
    return new Promise((resolve) => {
        for (let index = 0; index < roomToBook.length; index++) {
            
            var matchRoom = 0
            let i = roomAvail.length
            while (i--) {
                
                if (roomToBook[index].id_room == roomAvail[i].id) {
                    matchRoom++
                    //if the number of rooms available is less than the room to be booked, display a warning
                    if (roomToBook[index].quantity > roomAvail[i].quantity) {
                        resolve({
                            warning : 1,
                            message : `the number of rooms id ${roomToBook[index].id_room} available is less than the room to be booked`,
                            data : {}
                        })             
                    }
                }
            }

             //if the room you are about to book is not available then display a warning
            if (matchRoom == 0) {
                resolve({
                    warning : 1,
                    message : `the room id ${roomToBook[index].id_room} you are about to book is not available`,
                    data : {}
                })
            } 
            //everything ok
            else if (matchRoom > 0 && (index+1) == roomToBook.length) {
                resolve({
                    warning : 0,
                    message : `all room available`,
                    data : {}
                })
            }
            
        }
    }) 
}

function compressArray(original) {
 
	var compressed = []
	// make a copy of the input array
    var copy = original.slice(0);
 
	// first loop goes over every element
	for (var i = 0; i < original.length; i++) {
 
		var myCount = 0
        // loop over every element in the copy and see if it's the same
        let w = copy.length
        while(w--){
            if (original[i].id_room == copy[w].id_room) {
				// increase amount of times duplicate is found
				myCount++;
			}
        }
 
		if (myCount > 0) {
			var a = new Object();
			a.value = original[i];
			a.count = myCount;
			compressed.push(a);
		}
	}
 
	return compressed;
};

function is_there_any_booking_from_other_person(datesToBook,allBookingRoomActive) {
    return new Promise((resolve)=>{
        let arr_room_booked_with_other = []
        
        datesToBook.forEach((date_booked, i) => {
                
            if (allBookingRoomActive.length != 0) {
                //all date booked active
                for (let index = 0; index < allBookingRoomActive.length; index++) {
                    //check if date will be book included to date booked active 
                    let d1 = moment(allBookingRoomActive[index].c_in_date).format("YYYY-MM-DD").split("-")
                    let d2 = moment(allBookingRoomActive[index].c_out_date).format("YYYY-MM-DD").split("-")
                    let c = moment(date_booked).format("YYYY-MM-DD").split("-")
                    // console.log(date_booked)

                    let from = new Date(d1[0], parseInt(d1[1])-1, d1[2]);  // -1 because months are from 0 to 11
                    let to   = new Date(d2[0], parseInt(d2[1])-1, d2[2]);
                    let check = new Date(c[0], parseInt(c[1])-1, parseInt(c[2])-1);
                    
                    // console.log(`${check} >= ${from} && ${check} <= ${to}`)
                    // console.log((check >= from && check <= to))
                    if (check >= from && check <= to) {
                        arr_room_booked_with_other.push({
                            id_room: allBookingRoomActive[index].room_id
                        })
                        if (datesToBook.length == (i+1) && allBookingRoomActive.length == (index+1)) {
                            resolve(arr_room_booked_with_other)
                        }
                    } else {
                        if (datesToBook.length == (i+1) && allBookingRoomActive.length == (index+1)) {
                            resolve(arr_room_booked_with_other)
                        }
                    }
                }
            } else {
                //if no book
                resolve(arr_room_booked_with_other)                
            }
        })
    })
}

function is_check_in_is_greater_than_today(startDate) {
    if (startDate > new Date()) {
        return true
    } else {
        return false
    }
}

function get_date_to_book(startDate, endDate) {
    var dates = [],
    currentDate = startDate,
    addDays = function(days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };
    while (currentDate <= endDate) {
        currentDate = addDays.call(currentDate, 1);
        dates.push(currentDate);
    }
    return dates;
};