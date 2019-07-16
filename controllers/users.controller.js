const users = require("../models/users.model");
const orders = require("../models/orders.model");
const { validationResult } = require('express-validator');
const axios = require("axios")
module.exports = {

    index: async (req, res) => {
        const data = await users.findById(req.user._id).populate('orders')
        res.send(data)
    },

    create: async (req, res) => {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ success: false, message: errors.array().map(val => val.msg) });
        }
        const checkUserIsExist = await users.find({username: req.body.username})
        if(checkUserIsExist.length > 0) {
            return res.send({success: false, message: "Username already in use"})
        }

        await users.create(req.body).catch(error => {
            return res.send({ success: false, message: error.message });
        });

        res.status(201).send({ success: true, message: "User created" })
    },

    delete: async (req, res) => {

        await users.findByIdAndRemove(req.user._id).catch(error => {
            return res.send({ success: false, message: error.message });
        });

        res.status(202).send({ success: true, message: "User deleted" })
    },

    order: async (req, res) => {

        const books = await axios.get("https://scb-test-book-publisher.herokuapp.com/books").catch(error => {
            return res.send({ success: false, message: error.message });
        });
        
        const orderItems = req.body.orders.map(value => {
            let orderBookId = parseInt(value)
            return books.data.find(book => book.id === orderBookId)
        })
        
        const total = orderItems.reduce((price, value) => value.price + price, 0)
        
        await orders.create({
            bookId: req.body.orders,
            userId: req.user._id,
            price: total
        }).catch(error => {
            return res.send({ success: false, message: error.message });
        });

       await users.findOneAndUpdate(
            { _id: req.user._id }, 
            { "$addToSet": { books: { "$each": req.body.orders }}}
        );
      
        
        res.status(200).send({ success: true, price: total })
    }
}