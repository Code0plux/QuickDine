import db from '../config/db.js'
export const allRestaurantController = async (req,res)=>{
    
    try{
        const [restaurantInfo] = await db.query(`select restaurant_id, restaurant_name, email, phone, address, cover_img from restaurant`)
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
        const[data] = await db.query('select restaurant_id,restaurant_name,email,phone,address,cover_img from restaurant where restaurant_id = ?',[id]);
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
        const {name,email,phone,address,cover_img} = req.body;
        const ownerid = req.userId;
        if(!name ||!email ||!phone||!address) return res.status(400).json({message:"Fill all the fields"})
        const[result] = await db.query(`insert into restaurant (owner_id,restaurant_name,email,phone,address,cover_img) values (?,?,?,?,?,?)`,
            [ownerid,name,email,phone,address,cover_img || null]
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
        const userId = req.userId;
        const [result] = await db.query(`select * from restaurant where owner_id = ?`,[userId]);
        res.status(201).json({data:result})
    }
    catch(err){
        return res.status(401).json({Error:err})
    }
}
export const getRestaurantBookings = async (req,res)=>{
    try{
        const userid = req.userId;
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

export const updateRestaurant = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.userId;
        const { name, email, phone, address, cover_img } = req.body;
        const [restaurant] = await db.query(`select owner_id from restaurant where restaurant_id = ?`, [id]);
        if (restaurant.length === 0) return res.status(404).json({ message: "Restaurant not found" });
        if (restaurant[0].owner_id !== userId) return res.status(401).json({ message: "Unauthorized" });
        await db.query(
            `update restaurant set restaurant_name=?, email=?, phone=?, address=?, cover_img=COALESCE(?,cover_img) where restaurant_id=?`,
            [name, email, phone, address, cover_img || null, id]
        );
        res.status(200).json({ message: "Restaurant updated" });
    } catch (err) {
        res.status(500).json({ message: "Error updating restaurant", err });
    }
}

export const deleteRestaurant = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.userId;
        const [restaurant] = await db.query(`select owner_id from restaurant where restaurant_id = ?`, [id]);
        if (restaurant.length === 0) return res.status(404).json({ message: "Restaurant not found" });
        if (restaurant[0].owner_id !== userId) return res.status(401).json({ message: "Unauthorized" });
        const [tables] = await db.query(`select table_id from restaurant_table where restaurant_id = ?`, [id]);
        const tableIds = tables.map(t => t.table_id);
        if (tableIds.length > 0) {
            await db.query(`delete from booking where table_id in (?)`, [tableIds]);
            await db.query(`delete from restaurant_table where restaurant_id = ?`, [id]);
        }
        await db.query(`delete from restaurant where restaurant_id = ?`, [id]);
        res.status(200).json({ message: "Restaurant deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting restaurant", err });
    }
}

export default {allRestaurantController,restaurantControllerById,addRestaurant,getRestaurant,getRestaurantBookings,deleteRestaurant}