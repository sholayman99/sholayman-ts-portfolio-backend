/*
* Author: Md. Sholayman
* Description: This file contains  model for services.
* Date: 02 December 2024
*/

import mongoose, { Schema, Document } from 'mongoose';

interface IService extends Document {
    icon:string,
    title:string,
    description:string,
}

const ServiceSchema : Schema<IService> = new Schema({
    icon :{type:String,required:true},
    title :{type:String,required:true},
    description :{type:String,required:true},
},
    {timestamps:true,versionKey:false});

const Service = mongoose.model <IService>('services', ServiceSchema);
export default Service;