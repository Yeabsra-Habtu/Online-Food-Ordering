import express from 'express'
import Database from './services/Database'
import App from './services/ExpressApp'
import { PORT } from './config';

const StartServer=async()=>{
    const app=express();
    await Database();
    await App(app);

    app.listen(PORT,()=>{
        console.log(`Server listening on port: ${PORT}`)
    })
}

StartServer();