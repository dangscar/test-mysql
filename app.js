require('dotenv').config();
const express = require("express");
const app = express();
//const userRouter = require("./api/users/user.route")
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/api/users", userRouter);

const pdfRouter = require("./routes/pdfRoutes");
app.use("/pdf", pdfRouter); 



app.listen(process.env.APP_PORT, ()=> {
    console.log(`Example app listening at http://localhost:${process.env.APP_PORT}`)
})