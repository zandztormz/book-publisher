const axios = require("axios")

module.exports = {
    index: async (req, res) => {
        const books = await axios.get("https://scb-test-book-publisher.herokuapp.com/books").catch(error => {
            return res.send({ success: false, message: error.message });
        });

        const recommened = await axios.get("https://scb-test-book-publisher.herokuapp.com/books/recommendation").catch(error => {
            return res.send({ success: false, message: error.message });
        });

        for (var i = 0; i < books.data.length; i++) {
            recommened.data.forEach(value2 => {
                if (books.data[i].id === value2.id) {
                    books.data.splice(i, 1)
                }
            })
        }

        recommened.data.forEach(value2 => {
            books.data.unshift(value2)
        })

        res.send(books.data)
    }
}