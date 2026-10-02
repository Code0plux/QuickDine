import {rateLimit} from 'express-rate-limit'
const rate = async(req,res,next)=>{
    try{
        const limiter = rateLimit({
            windowMs: 5*60*1000,
            limit: 10,
            standardHeaders: 'draft-8',
            legacyHeaders: false,
            message:{
                status:402,
                error:'Max attemp reached try again after 5 Mins'
            }
        })
    }catch(e){
        res.status(500).json({error:e.message})
    }
}