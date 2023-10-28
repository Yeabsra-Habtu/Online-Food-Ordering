import express, { Application } from 'express'
import{AdminRoute,CustomerRoute,ShoppingRoute,VanorRoute}from '../routes'
import bodyParser from 'body-parser';
import path from 'path'


export default async(app:Application)=>{
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}))
    app.use('/images',express.static(path.join(__dirname,'images')))
    
    app.use('/vandor',VanorRoute)
    app.use('/admin',AdminRoute)
    app.use('/shopping',ShoppingRoute)
    app.use('/customer',CustomerRoute)

    return app;
}





