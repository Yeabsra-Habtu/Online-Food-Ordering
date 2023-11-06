import mongoose from "mongoose"
import {MONGO_URI}from '../config'

export default async()=>{
    try {
        await mongoose.connect(MONGO_URI).then(result=>{
            console.log('DB connected')
        }).catch(err=>{
            console.log("DB connection failed due to: ",err.message)
        })
    } catch (error) {
        console.log(error)
    }
}

