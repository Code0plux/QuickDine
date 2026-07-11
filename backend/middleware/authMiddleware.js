import jwt from 'jsonwebtoken'
import auth from '../controllers/auth.js';
export const authenticateUser=(req,res,next)=>{
    try {
        const header = req.headers.authorization;
        if(!header) return res.status(401).json({message:'unauthorized'})
        const token = header.split(' ')[1];
        const decode = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        console.log(decode)
        req.userId = decode.id;
        next();
        }
        catch(err){
            if(err){
                return res.status(401).json({
                    "message":"Unauthorized",
                    "err":err
                })
            }
        }
}
export default {authenticateUser};