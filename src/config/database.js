const mongoose = require('mongoose');

const connectDb = async () => {
    await mongoose.connect('mongodb+srv://namatedev:oliju3R6yeKtetbQ@cluster0.myagju0.mongodb.net/devTinder')
}

module.exports = connectDb;


