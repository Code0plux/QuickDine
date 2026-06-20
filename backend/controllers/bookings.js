import db from "../config/db.js"

export const getUserBooking  = async (req,res)=>{
    try{const userId = req.userId.id;
    const [result] = await db.query(`select * from booking where customer_id = ? and booking_status != ?`,[userId,'cancelled'])
    res.status(201).json({
        "data": result
    })}
    catch(err){
        return res.status(500).json({message:"Error for get booking controller","Err":err})
    }
}
export const bookRestaurant = async (req,res)=>{
    try{
    const {table_id,res_id,date,time,guest} = req.body
    const userId = req.userId;
    //console.log(userId)
    const [result] =await  db.query('insert into booking(customer_id,restaurant_id,table_id,booking_date,booking_time,guest_count,booking_status) VALUES (?,?,?,?,?,?,?)',[userId.id,res_id,table_id,date,time,guest,"confirm"])
    res.status(201).json({message:"Confirmed"})
    }catch(err){
        if(err.errno == 1062) return res.status(409).json({message:"Already Booked"})
        return res.status(500).json({message:"error from booking controller","err":err})
    }
}
export const cancelBooking = async (req,res)=>{
    try{
        const bookingid = req.params.id;
        const [result] = await db.query(`update  booking set booking_status = 'cancelled' where booking_id = ?`,[bookingid])  
        return res.status(201).json({message:"Successfully deleted"})
    }
    catch(err){
        return res.status(500).json({message:"error from cancel booking controller","err":err})
    }
}

export default { getUserBooking ,bookRestaurant,cancelBooking};