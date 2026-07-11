import db from '../config/db.js'

export const addTable = async (req,res)=>{
    try{
    const {res_id,table_number,capacity}  = req.body;
    if(!res_id || !table_number ||!capacity) return res.status(401).json({
        "Message":"Must fill all the details"
    });
    const [check] = await db.query(`select * from restaurant_table where restaurant_id=? and table_number = ?`,[res_id,table_number]);
    if(check.length > 0) return res.status(409).json({message:"Table Number Already Exists"})
    const [result] = await db.query(`insert into restaurant_table (restaurant_id,table_number,capacity,is_active) values (?,?,?,?)`,[res_id,table_number,capacity,1]);
    res.status(201).json({
        message: "Table added successfully"
    });}
    catch(err){
        console.log(err)
        res.status(500).json({message:"Error from add table"})
    }
}
export const getAllTables = async (req, res) => {
    try {
        const res_id = req.params.id;
        const [tables] = await db.query(`select * from restaurant_table where restaurant_id = ?`, [res_id]);
        res.status(200).json(tables);
    } catch (err) {
        res.status(500).json({ message: "Error fetching tables", err });
    }
}

export const updateTable = async (req, res) => {
    try {
        const { tableId } = req.params;
        const { capacity, table_number } = req.body;
        await db.query(`update restaurant_table set capacity=?, table_number=? where table_id=?`, [capacity, table_number, tableId]);
        res.status(200).json({ message: "Table updated" });
    } catch (err) {
        res.status(500).json({ message: "Error updating table", err });
    }
}

export const deleteTable = async (req,res)=>{
    try{
        const { tableId } = req.params;
        await db.query(`delete from booking where table_id = ?`, [tableId]);
        await db.query(`delete from restaurant_table where table_id = ?`,[tableId]);
        res.status(200).json({ message:"Deleted successfully" })
    }catch(err){
        console.log("deleteTable error:", err.message, err.errno);
        res.status(500).json({ message: err.message, errno: err.errno })
    }
}

export const getTable = async (req,res)=>{
    try{
        const res_id = req.params.id;
        const {date,time,guest} = req.query;
        const [upquery] = await db.query(`UPDATE booking SET booking_status = 'completed' WHERE booking_status = 'confirm' AND TIMESTAMP(booking_date, booking_time) <= NOW();`)
        console.log(upquery)
        const [available] = await db.query(
            `select * from restaurant_table rt where rt.restaurant_id = ? AND rt.capacity>=? AND rt.table_id NOT IN (select table_id from booking bk where  bk.booking_date = ? And bk.booking_time =  ? AND bk.booking_status = 'confirm') `,
            [res_id,guest,date,time]
        )
        console.log(date,time,guest)
        res.send(available);

    }catch(err){
        return res.status(401).json({message:"Error from get table","err":err.message
        })
    }
}
export default {addTable,getTable,deleteTable}