const express = require('express');
const connectDb = require('./config/database');
const app = express();
const User = require('./models/user');
const {validateSignupData} = require('./utils/validation');
const bcrypt = require('bcrypt');

app.use(express.json());

app.post('/signup', async (req, res) => {
   try{
  
   validateSignupData(req);
 
  const { firstName, lastName, emailId, password} = new User(req.body);
  // Validation of data

   // Encrypt the password
  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    firstName, lastName, emailId, password:passwordHash
  })

   await user.save();
   res.send("User saved successfully");
  }
  catch(err){
    console.log(err);
   res.status(400).send("Error: " +err.message);
   }
});

app.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res.send("Login successful!!!");
    } else {
      throw new Error("Invalid credentials");
    }

  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get User by email
app.get('/user', async (req, res) => {
  const userEmail = req.body.emailId;

  try{
   const users = await User.find({emailId: userEmail});
   if(users.length === 0){
    res.status(400).send("User not found");
   }
   else{
    res.send(users);
   }
   
  }
  catch(err){
    res.status(400).send("Something went wrong");
  }
})

// Feed API - Get /feed - get all the users from the database
app.get('/feed', async (req, res) => {
   try{
  const users = await User.find({});
     res.send(users);
   }
   catch(err){
     res.status(400).send("Something went wrong");
   }
})

// Delete user from database
app.delete('/user', async (req, res) => {
  const userId = req.body.userId;
  console.log(userId);
   try{
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully")
   }
   catch(err){
    res.status(400).send("Something went wrong");
   }
})

// Update the user data from database
app.patch('/user/:userId', async (req, res) => {
  const userId = req.params?.userId;
   const data = req.body;
  
  try{
     const ALLOWED_UPDATES = [
     "photoUrl", "about", "gender", "age", "skills"
   ];
   const isUpdateAllowed = Object.keys(data).every((k) => {
    ALLOWED_UPDATES.includes(k)
   
  });
 if(!isUpdateAllowed){
   throw new Error("Update not allowed");
 }
 if(data?.skills.length > 10){
  throw new Error("Skills can not more than 10");
 }
   await User.findOneAndUpdate({_id: userId}, data);
   runValidators: true,
   res.send("User updated successfully");
  }
  catch(err){
     res.status(400).send("Something went wrong");
  }
})

connectDb()
.then(() => {
   console.log('Database connection established!');
    app.listen(3000, () =>{
    console.log("Server is successfully listen on the port 3000");
   })
})
.catch((err) => {
    console.log('Database can not be connected!');
});


