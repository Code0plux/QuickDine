import db from '../config/db.js'
export const allRestaurantController = async (req,res)=>{
    
    try{
        const [restaurantInfo] = await db.query(`select restaurant_id, restaurant_name,email,phone,address from restaurant`)
        console.log("esdf")
    res.status(201).json({
        "Data":restaurantInfo
    })}catch(err){
        res.status(500).send(err)
    }
}
export const restaurantControllerById = async (req,res)=>{
    try{
        const id = req.params.id;
        const[data] = await db.query('select restaurant_id,restaurant_name,email,phone,address from restaurant where restaurant_id = ?',[id]);
        console.log(id)
        res.status(201).json({
            "Data":data
        })
    }
    catch(err){
        res.status(500).json({"message":"err"})
    }
}
export const addRestaurant = async (req,res)=>{
    try{
        const {name,email,phone,address} = req.body;
        const ownerid = req.userId.id;
        if(!name ||!email ||!phone||!address) return res.status(400).json({message:"Fill all the fields",name:{name,email,phone,address}})
        console.log(ownerid.id)
        const[result] = await db.query(`insert into restaurant (owner_id,restaurant_name,email,phone,address) values (?,?,?,?,?)`,
            [ownerid,name,email,phone,address]
        )
        res.status(201).json({
            "message":"Restaurant added",
        })
    }
    catch(err){
        res.status(500).json({"message":"err from add restaurant controller" + err})
    }
}
export const getRestaurant= async (req,res)=>{
    try{
        const userId = req.userId.id;
        //console.log("hi from get res"+userId)
        const [result] = await db.query(`select * from restaurant where  = ?`,[userId]);
       // console.log(result + "hell")
        res.status(201).json({data:result})
    }
    catch(err){
        return res.status(401).json({Error:err})
    }
}
export const getRestaurantBookings = async (req,res)=>{
    try{
        const userid = req.userId.id;
        const resId = req.params.id;
        const date = req.query.date;
        console.log(userid,resId,date)
        const [result] = await db.query(`select * from restaurant_table t  left join  booking b on t.table_id = b.table_id and b.booking_date = ? left join user c on c.id = b.customer_id  where t.restaurant_id = ?;
`,[date,resId])
            res.status(201).json({result})
    }catch(err){
        return res.status(401).json({message:"error form getresbooking controller",
            error:err
        })
    }
}

export default {allRestaurantController,restaurantControllerById,addRestaurant,getRestaurant,getRestaurantBookings}