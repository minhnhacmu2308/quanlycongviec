const express = require('express');
const bcrypt = require('bcrypt');
const cors =  require("cors");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Router = require('./routers');


const app = express();
const PORT = 8000;
const URI = "mongodb+srv://nguyenminhnhacmu:aQjyl9LTCushwKts@cluster0.lyilbyv.mongodb.net/";
app.use(cors());
app.use(express.json());


mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connect Successfully!!!");
    app.listen(PORT, () => {
      console.log("Server running !!!!! ");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/user", Router);
