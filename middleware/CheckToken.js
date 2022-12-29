import jwt from "jsonwebtoken";
 
export const CheckToken = (req, res, next) => {
    const authorizeHeader = req.headers['authorization'];
    const token = authorizeHeader && authorizeHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err) return res.sendStatus(403);
        req.user_id = decoded.userId;
        req.email = decoded.email;
        next();
    })
}