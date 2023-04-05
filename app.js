import express from 'express';
import {Server} from 'socket.io';
import io from './socket.js';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import multer from 'multer';
import feedRoute from './router/feed.js';
import authRoute from './router/auth.js'; 
import cors from 'cors';
const app = express();

app.use(cors());
dotenv.config();

const fileStorage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'images');
    },
    filename : (req,file,cb)=>{
        const currentDate = new Date().toISOString().slice(0,10);
        cb(null, currentDate +'-'+file.originalname);
    }

})

const fileFilter = (req,file,cb)=>{
    if(file.mimetype === 'image/png' ||
       file.mimetype === 'image/jpg' ||
       file.mimetype === 'image/jpeg'
    ) {
        cb(null,true);
      }else{
        cb(null,false);
      }
}

app.use(bodyParser.json());
app.use(multer({storage: fileStorage, fileFilter : fileFilter}).single('image'));
app.use('/images',express.static(path.join(path.dirname(process.cwd()),'express-restwebApp','images')))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', ['Content-type', 'Authorization']); // set multiple headers as an array
    next();
  });
  

app.use('/feed',feedRoute);
app.use('/auth',authRoute);

app.use((err,req,res,next)=>{
    const status = err.statusCode || 500;
    const message = err.message;
    const data = err.data;
    res.status(status).json({
        message : message,
        data : data
    })
})

mongoose.connect(process.env.MONGODB_URI)
.then(result =>{
    const server = app.listen(8080,()=>{
        console.log("server started");
    });
    const socketServer = io.init(server);
      
   socketServer.on('connection',socket =>{
    console.log('Client connected');
   });
})
.catch(err => console.log(err));
 
