const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const authRouter=require("./src/routes/auth.route")
const {connectDB}=require("./src/config/db")
const app = express();
connectDB();

app.use("/",authRouter);
const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server is up and running on http://localhost:${PORT}`);
});