
import dotenv from "dotenv"
import cors from "cors"
import helmet from "helmet";
dotenv.config()
// const port = process.env.MODE === 'PROD' ? process.env.PORT :  parseInt(process.env.PORT) + 1000 || 5555
const port = process.env.MODE === 'PROD' ? 5500 : process.env.DEV_PORT || 5000

import express from "express"
import { bootstrap } from "./src/index.router.js"
// import { Server } from "socket.io"
import { initIo, socketAuth } from "./src/utils/socket_server.js"
import { Server } from "socket.io"
const app = express()

// app.use(helmet())
app.use('/uploads', express.static('uploads'))
app.use(express.json())

var whitelist = ['arab-made.com']
// var corsOptions = {
//     origin: function (origin, callback) {
//         if (process.env.MODE == 'DEV') {
//             callback(null, true)
//         }
//         else if (!origin) {
//             if (this.req && this.req.headers.password == process.env.PASSWORD_API) {
//                 callback(null, true)
//             } else {
//                 callback(new Error('Not allowed by CORS, Wrong password'))
//             }
//         } else if (whitelist.includes(new URL(origin).hostname)) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'))
//         }
//     }
// }


app.use(cors())

// app.use((req,res,nxt)=>{
//     if(process.env.MODE=='DEV') nxt();
//     else if(whitelist.includes(req.hostname)) nxt();
//     else if(req.headers["api-key"]==process.env.PASSWORD_API) nxt();
//     else return res.status(403).json({message:"error"})
// })


bootstrap(app)

const server = app.listen(port, () => {
    console.log("Server is ON  ", port);
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
// test
//test 2