import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";
 
export const RefreshToken = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);
        const user = await Users.findAll({
            where:{
                refresh_token: refreshToken
            }
        });
        if(!user[0]) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.sendStatus(403);
            const userId = user[0].user_id;
            const email = user[0].email;
            const accessToken = jwt.sign({userId, email}, process.env.ACCESS_TOKEN_SECRET,{
                expiresIn: '24h'
            });
            res.json({ accessToken });
        });
    } catch (error) {
        res.status(400).json({msg:"ไม่สามารถ refresh token"});
        console.log(error);
    }
}