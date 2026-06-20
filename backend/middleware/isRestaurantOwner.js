import db from '../config/db.js'

export const isRestaurantOwner = async (req,res,next)=>{
   try{
    const {res_id,table_number,capacity}  = req.body;
    const [id] = await db.query(`select owner_id from restaurant where restaurant_id = ?`,res_id)
    console.log(id[0].owner_id,req.userId.id)
    if(id[0].owner_id!=req.userId.id) return res.status(401).json({message:"Unauthorized user"})
    next();
    }
    catch(err){ return res.status(401).json({message:"Error from is restaurant owner middleware",
        Error:err
    })
    }
}
export const isOwner = async (req,res,next)=>{
    try{
        const userId = req.userId.id;
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