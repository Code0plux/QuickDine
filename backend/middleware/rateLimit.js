import {rateLimit} from 'express-rate-limit'
import { loginRateLitmit } from '../server'

const rate = async(req,res,next)=>{
    try{
        await loginRateLitmit(req,res,next)
    }catch(e){
        res.status(500).json({error:e.message})
    }
}