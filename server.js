require('dotenv').config();
const mongoose = require('mongoose');
const user = require('./user/user');
const authroutes = require('./routes/auth-routes');
const protectedroutes = require('./routes/protected-routes');
const express = require('express');


const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected Successfully");
  } catch (error) {
    console.log("Connection failed", error);
    process.exit(1);
  }
};

connectdb();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use('/api/auth',authroutes);
app.use('/api/user',protectedroutes);

app.listen(PORT, () => {
  console.log(`Server is now listening on ${PORT}`);
});