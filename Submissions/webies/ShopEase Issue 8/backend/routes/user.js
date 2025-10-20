const express= require('express')
const {handleUserSignUp, handleUserLogin}=require('../controllers/handleUser')
const {signUpValidation, loginValidation}= require('../middlewares/authValidation')

const router = express.Router()

router.post('/signup',signUpValidation,handleUserSignUp)
router.post('/login',loginValidation,handleUserLogin)
 
module.exports=router   