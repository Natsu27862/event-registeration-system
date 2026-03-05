import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.status(401).json({message: "No Token Provided"});
        }

        const token = authHeader.split(" ")[1];

        if(!token){
            return res.status(401).json({message: "Invalid Token Format"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        
        next();
    } catch(error) {
        return res.status(401).json({message: "Invalid or expired token"})
    }
};

export const adminMiddleware = (req, res, next) => {
    try{
        if(!req.user){
            return res.status(401).json({message: "Unauthorized"});
        }

        if(req.user.role !== "ADMIN"){
            return res.status(403).json({message: "Access denied"});
        }

        next();

    } catch(error){
        return res.status(500).json({message: "Something went wrong"})
    }
};