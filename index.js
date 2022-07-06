// const bodyParser = require("body-parser")
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")
const AuthRoute = require("./Routes/AuthRoute")
const UserRoute = require("./Routes/UserRoute")
const PostRoute = require("./Routes/PostRoute")
const UploadRoute = require("./Routes/UploadRoute")
const ChatRoute = require("./Routes/ChatRoute")
const MessageRoute = require("./Routes/MessageRoute")

dotenv.config()

app.use(cors())
app.use(express.json())
app.use("/auth",AuthRoute)
app.use("/user",UserRoute)
app.use("/post",PostRoute)
app.use('/upload', UploadRoute)
app.use('/chat', ChatRoute)
app.use('/message', MessageRoute)


const MONGO_URL = process.env.MONGO_URL
const port = process.env.PORT || 3001

mongoose.connect(MONGO_URL,{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>{
    console.log("Database connected")
}).catch((err)=>{
    console.log(err)
})


app.get("/",(req,res)=>{
    res.send("hello there")
})

app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})