import jwt from "jsonwebtoken";
import Users from "../models/UserModel.js"; 
import { Op } from "sequelize";

export const CheckTokenAdmin = async(req, res, next) => {
    const authorizeHeader = req.headers['authorization'];
    const token = authorizeHeader && authorizeHeader.split(' ')[1];
    // console.log(req);
    if(token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err) return res.sendStatus(403);

        CheckRole(decoded.userId).then(code => { 
            if (code !== 200) return res.sendStatus(code);
        } );
        req.user_id = decoded.userId;
        req.email = decoded.email;
        next();
    })
}

const CheckRole = async(userId) => {
    try {
        const user = await Users.findOne({
            where:{
                user_id: {[Op.eq] : userId},
            }
        });

        if (!user) return 404;
        if (user.user_type === "admin") {
            return 200;
        }
    } catch (error) {
        console.log(error);
        return 403;
    }
}
