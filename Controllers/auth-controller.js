const user = require('../user/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registeruser = async(req,res)=>{
    try{
        const {username, email, password, role} = req.body;
        const checkexistuser = await user.findOne({$or : [{username},{email}]})
        if(checkexistuser){
            return res.status(400).json({
                success: false,
                message: "user with same username or email already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password,salt);

        const newlyuser = new user({
            username,
            email,
            password:hashpassword,
            role: role || 'user'
        })
        await newlyuser.save();
        if(newlyuser){
            res.status(201).json({
                success:true,
                message:'User registered successfully'
            })
        }else{
             res.status(400).json({
                success:false,
                message:'Unable to Register'
            })
        }

    }catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:"some error occured!"
        });
    }
};

const loginuser = async(req,res)=>{
    try{
        const {email, password} = req.body;
        const checkuser = await user.findOne({email});
        if(!checkuser) {
            return res.status(400).json({
                success:false,
                message: "user doen't exist"
            })
        }
        const ispassmatch = await bcrypt.compare(password,checkuser.password);
        if(!ispassmatch){
            return res.status(400).json({
                success:false,
                message: 'Invalid Credentials'
            })
        }
           const accessToken = jwt.sign({
            userid: checkuser._id,
            username: checkuser.username,
            role: checkuser.role
           }, process.env.JWT_SECRET_KEY, {
              expiresIn : '15m'
           });

           res.status(200).json({
            success: true,
            message: "Login Successful",
            accessToken
           })




    }catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:"some error occured!"
        });
}
};


// auth-controller.js

const changePassword = async (req, res) => {
    // The user's info (like their ID) is available from the `protect` middleware
    const { userId } = req.user;
    const { oldPassword, newPassword } = req.body;

    try {
        // Find the user in the database
        const userToUpdate = await user.findById(userId);
        if (!userToUpdate) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Check if the OLD password they provided is correct
        const isPasswordMatch = await bcrypt.compare(oldPassword, userToUpdate.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ success: false, message: "Incorrect old password." });
        }

        // Hash the NEW password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // Save the new password
        userToUpdate.password = hashedNewPassword;
        await userToUpdate.save();

        res.status(200).json({ success: true, message: "Password changed successfully." });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occurred!"
        });
    }
};



module.exports = {registeruser,loginuser ,changePassword};



