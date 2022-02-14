const express = require('express');
const User = require('../models/User');
const router = express.Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "Abhayisagoodb$oy";

//ROUTE 1: Create a user using: POST "/api/auth/createuser". Doesn't require Auth
router.post('/createuser', [
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 })
    ], async (req, res) => {

        // Validation Check
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Check for user with this email
            let user = await User.findOne({email: req.body.email});
            if(user) {
                return res.status(400).json({error: "User with this email already exists"})
            }

            const salt = await bcrypt.genSalt(10);
            const secPass =  await bcrypt.hash(req.body.password, salt);

            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass
            })

            const data = {
                user:{
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            res.json({authToken});
            // res.json(user)

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Some error occured");
        }
    })


//ROUTE 2: Authenticate a user using: POST "/api/auth/login". Doesn't require Auth
router.post('/login', [
    body('email').isEmail(),
    body('password').exists()
    ], async (req, res) => {

        // Validation Check [agar koi error hua to pta chal jayega]
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const {email, password} = req.body;

        try {
            // Check for user with this email
            let user = await User.findOne({email});
            if(!user) {
                return res.status(400).json({error: "Please try to login with correct credentials"});
            }
            
            const passwordComare = await bcrypt.compare(password, user.password);
            if(!passwordComare) {
                return res.status(400).json({error: "Please try to login with correct credentials"});
            }

            const data = {
                user:{
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            res.json({authToken});

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })

//ROUTE 3: Get loggedin user details using: POST "/api/auth/getuser". require Auth
router.post('/getuser', fetchuser, async (req, res) => {
    
        // Validation Check
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            userId = req.user.id;
            let user = await User.findById(userId).select("-password");
            res.send(user);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Some error occured");
        }
    })

module.exports = router