const mongoose = require("mongoose");

// const connectDb = async () => {
//     await mongoose.connect('mongodb+srv://namatedev:oliju3R6yeKtetbQ@cluster0.myagju0.mongodb.net/devTinder')
// }

const connectDb = async () => {
  await mongoose.connect(
    "mongodb://namatedev:oliju3R6yeKtetbQ@ac-t7ub3tq-shard-00-00.myagju0.mongodb.net:27017,ac-t7ub3tq-shard-00-01.myagju0.mongodb.net:27017,ac-t7ub3tq-shard-00-02.myagju0.mongodb.net:27017/?ssl=true&replicaSet=atlas-azsztl-shard-0&authSource=admin&appName=Cluster0",
  );
};

module.exports = connectDb;
