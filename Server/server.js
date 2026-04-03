const express = require("express");
const cookieParser=require("cookie-parser");
require("dotenv").config();
const authRouter=require("./src/routes/auth.route");
const messageRouter=require("./src/routes/message.route")
const {connectDB}=require("./src/config/db")
const cors= require("cors")
const {app,server,io}=require("./src/lib/socket");
connectDB();


app.use(cors({
    origin: "http://localhost:5173",
    credentials:true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]

}));

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/auth",authRouter);
app.use("/msg",messageRouter);


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is up and running on http://localhost:${PORT}`);
});