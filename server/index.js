import dotenv from "dotenv"
import cors from "cors"
import http from "http"
import path from "path"
dotenv.config()
const port = process.env.NODE_ENV === 'production' ? process.env.PROD_PORT : process.env.DEV_PORT || 5000
import express from "express"
import { bootstrap } from "./src/index.router.js"
// import { Server } from "socket.io"
import { initIo, socketAuth } from "./src/utils/socket_server.js"
import { Server } from "socket.io"
const app = express()



// export const io=new Server(server)

// io.on('connection',(socket)=>{
//     socket.on('joinChat',(chatId)=>{
//         socket.join(`chat:${chatId}`)
//     })
// })

app.use('/uploads', express.static('uploads'))
app.use(express.json())

// var whitelist = ['http://localhost:5001', 'http://3.28.122.72','http://3.28.122.72:7000']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

// app.use(cors(corsOptions))

app.use(cors())

// app.use(async(req,res,nxt)=>{
//     if(!whitelist.includes(req.header('origin'))){
//         return nxt(new Error("Refused by CORS Policy"))
//     }
//     await req.header('Access_Control_Allow_Private_Network','true')
// })
bootstrap(app)

const server = app.listen(port, () => {
    console.log("Server is ON ", port);
})

const io = initIo(server)

io.on("connection", (socket) => {
    socket.on("socketAuth", async (authorization) => {
        const auth = await socketAuth(authorization, socket.id)
        if (auth == true) {
            socket.emit("socketAuth", "done")
        }
    })
})
