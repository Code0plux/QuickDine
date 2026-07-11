import db from "../config/db.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
export const login = async (req,res)=>{
    try{
        const {email,password} = req.body;
        const [isavailable] = await db.query(
            `select * from user where email=?`,
            [email]
        )
        if(isavailable.length===0){
            return res.status(400).json({
                "message":"Email does not exist"
            })
        }
        //console.log(isavailable[0].password_hash)
        const ismatch = await bcrypt.compare(password,isavailable[0].password_hash)
        if(!ismatch){
            return res.status(400).json({
                "message":"Password does not match"
            })
        }
        const token = jwt.sign({id:isavailable[0].id,role: isavailable[0].role},process.env.JWT_SECRET,{expiresIn:process.env.EXPIRES_IN})
        res.status(200).json({
            "message":"login success",
            "token":token
        })
    } catch(err){
        return  res.status(500).json({
            "message":err
        })
    }
}
export const register = async (req,res)=>{
   try {
    const {name,email,phone,role,password} = req.body;
    try {
        const [id] = await db.query(`select id from user where email = ?`,[email])
        console.log(id)
        if(id.length>0){
            return res.status(400).json({
                "message":"Email already exist"
            })
        }
    } catch(err){
        return res.status(500).json({
            "message":err
        })
    }
    const pass_hash = await bcrypt.hash(password,10);
    const[result] = await db.query(
     `Insert into user (name,email,phone,role,password_hash) value (?,?,?,?,?)`,
     [name,email,phone,role,pass_hash]
    );
    const[getId] = await db.query(
        'select id from user where email = ?',[email]
    );
    const token = jwt.sign({id:getId[0].id , role:role},process.env.JWT_SECRET,{expiresIn:process.env.EXPIRES_IN})
    res.status(201).json({
     message:'user Created',
     userId: result.insertId,
     token:token
    });
    //console.log(result)
    // res.send("hello")
   } catch (error) {
        console.log(error)
        res.status(500).json({
            message:error
        })
   }
}


export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const [users] = await db.query(`select id from user where email = ?`, [email]);
        if (users.length === 0) return res.status(400).json({ message: "Email does not exist" });

        const token = crypto.randomBytes(32).toString('hex');
        const expiry = Date.now() + 15 * 60 * 1000; // 15 minutes

        await db.query(`update user set reset_token = ?, reset_token_expiry = ? where email = ?`, [token, expiry, email]);

        // In production, send this token via email instead
        res.status(200).json({ message: "Reset token generated", reset_token: token });
    } catch (err) {
        return res.status(500).json({ message: "Error from forgot password", err });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        const [users] = await db.query(`select * from user where reset_token = ?`, [token]);

        if (users.length === 0) return res.status(400).json({ message: "Invalid token" });
        if (users[0].reset_token_expiry < Date.now()) return res.status(400).json({ message: "Token expired" });

        const hash = await bcrypt.hash(password, 10);
        await db.query(`update user set password_hash = ?, reset_token = NULL, reset_token_expiry = NULL where id = ?`, [hash, users[0].id]);

        res.status(200).json({ message: "Password reset successful" });
    } catch (err) {
        return res.status(500).json({ message: "Error from reset password", err });
    }
}

export default {login, register, forgotPassword, resetPassword};