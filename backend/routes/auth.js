const express = require('express');
const User = require('../models/User');
const router = express.Router()
const { body, validationResult } = require('express-validator');

// Create a user using: POST "/api/auth/createuser". Doesn't require Auth
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
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            res.json(user)
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Some error occured");
        }
    })

module.exports = router