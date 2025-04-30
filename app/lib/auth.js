import jwt from 'jsonwebtoken';
const SECRET = 'secret-key';
export function generateToken(user) {
    return jwt.sign(user,SECRET,{expiresIn:'1h'});
}
export function verifyToken(token){
    return jwt.verify(token,SECRET);
}