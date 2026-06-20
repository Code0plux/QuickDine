import db from '../config/db.js'

export const addTable = async (req,res)=>{
    try{
    const {res_id,table_number,capacity}  = req.body;
    if(!res_id || !table_number ||!capacity) return res.status(401).json({
        "Message":"Must fill all the details"
    });
    const [result] = await db.query(`insert into restaurant_table (restaurant_id,table_number,capacity,is_active) values (?,?,?,?)`,[res_id,table_number,capacity,1]);
    res.status(201).json({
        message: "Table added successfully"
    });}
    catch(err){
        res.status(500).json({message:"Error from add table"})
    }
}

export const getTable = async (req,res)=>{
    try{
        const res_id = req.params.id;
        const {date,time,guest} = req.query;
        const [available] = await db.query(
            `select * from restaurant_table rt where rt.restaurant_id = ? AND rt.capacity>=? AND rt.table_id NOT IN (select table_id from booking bk where  bk.booking_date = ? And bk.booking_time =  ? AND bk.booking_status = 'confirm') `,
            [res_id,guest,date,time]
        )
        console.log(date,time,guest)
        res.send(available);

    }catch(err){
        return res.status(401).json({message:"Error from get table","err":err})
    }
}
export default {addTable,getTable}