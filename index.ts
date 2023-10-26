import express from 'express'
import{AdminRoute,VanorRoute}from './routes'
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { MONGO_URI } from './config';

const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect(MONGO_URI).then(result=>{
    console.log('DB connected')
}).catch(err=>{
    console.log(err.message)
})

app.use('/vandor',VanorRoute)
app.use('/admin',AdminRoute)






app.listen(8000,()=>{
    console.log('Port on 8000')
})