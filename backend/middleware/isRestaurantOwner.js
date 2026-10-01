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
export const isOwner = async (req, res, next) => {
    try {
        const [rows] = await db.query(`select role from user where id = ?`, [req.userId]);
        if (!rows.length || rows[0].role !== 'owner')
            return res.status(403).json({ message: "Only restaurant owners can do this" });
        next();
    } catch (err) {
        return res.status(500).json({ message: "Error from isOwner middleware", Error: err });
    }
}

export default {isRestaurantOwner,isOwner};