import db from '../config/db.js'

export const isRestaurantOwner = async (req,res,next)=>{
   try{
    const res_id = req.params.id || req.body?.res_id;
    const [rows] = await db.query(`select owner_id from restaurant where restaurant_id = ?`,[res_id])
    if(!rows.length) return res.status(404).json({message:"Restaurant not found"})
    if(rows[0].owner_id != req.userId) return res.status(401).json({message:"Unauthorized user"})
    next();
    }
    catch(err){ 
                console.log(err);

        return res.status(500).json({message:"Error from is restaurant owner middleware", Error:err})
    }
}
export const isOwner = async (req,res,next)=>{
    try{
        const userId = req.userId;
        const [result] = await db.query(`select * from restaurant where owner_id = ?`,[userId])
        if(result.length==0) return res.status(401).json({message:"Unauthorized user"})
        next();
    }catch(err){
        return res.status(401).json({Message:"error from isowner middleware",
        Error:err
        })
    }
}

export default {isRestaurantOwner,isOwner};