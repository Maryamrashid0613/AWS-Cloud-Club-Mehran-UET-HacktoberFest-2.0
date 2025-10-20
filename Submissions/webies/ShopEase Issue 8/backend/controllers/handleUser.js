const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

async function handleUserSignUp(req, res) {
    try {
        const { name, email, password } = req.body
        const user = await User.findOne({ email })
        if (user) {
            return res.status(409)
            .json({ msg: 'user alreaday logged in', success: false })
        }
        const newPassword= await bcrypt.hash(password, 10)
        const userModel = new User({ name, email, password:newPassword })
        
        await userModel.save()
        res.status(201).json({ msg: 'signup successfull', success: true })
    } catch (err) {
        res.status(500).json({ msg: 'internal server error', success: true })
    }
}
async function handleUserLogin(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(403).json({ msg: 'Invalid email or password', success: false });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(403).json({ msg: 'Invalid email or password', success: false });
        }
        const jwtToken = jwt.sign(
            {email:user.email,_id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:'24h'}
        )

        return res.status(201)
        .json({
            msg: 'Login successful',
            success: true,
            jwtToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error', success: false });
    }
}




module.exports = {
    handleUserSignUp,
    handleUserLogin
}

