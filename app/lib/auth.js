import jwt from 'jsonwebtoken';
const SECRET = process.env.SECRET_KEY;
export function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };
    return jwt.sign(payload,SECRET,{expiresIn:'1h'});
}
export function verifyToken(token){
    try{
        return jwt.verify(token,SECRET);
    }
    catch (err){
        console.log("invaild or expired token");
        return null;
    }
}