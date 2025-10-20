import jwt from 'jsonwebtoken';

export const signToken = (payload ,expiresIn) => {

    if (expiresIn)
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn })

    return jwt.sign(payload, process.env.JWT_SECRET)
}

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}