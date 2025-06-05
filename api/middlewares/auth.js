import jwt from 'jsonwebtoken'

export const auth = (req,res,next) => {
    const token = req.headers.authorization;
    try {
        jwt.verify(token,process.env.JWT_SECRET)    
        next();
    } catch (error) {
        res.json({success:false,message:"inavlid  token"});
    }
}




export const authUser = (req,res,next) =>{
    try {
        const authHeader =  req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.json({success:false,message:"not auth, login again"});
        }
        const token = authHeader.split(" ")[1];
        

        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
        
        req.userId = token_decode.id;
 
        next();
    } catch (error) {
        // console.log(error);
        res.json({success:false,message:"invalid token"});

    }
}
