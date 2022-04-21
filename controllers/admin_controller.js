const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

// Load Admin model
const Admin = require("../models/Admin");

// @desc    Register administrator
// @route   POST /api/v1/admins/register
// @access  Public
exports.register = async (req, res, next) => {
    try {

        // Form validation
        const { errors, isValid } = validateRegisterInput(req.body);

        // Check validation
        if (!isValid) {
            return res.status(400).json({
                success: false,
                error: errors[Object.keys(errors)[0]]
            });
        }

        Admin.findOne({ email: req.body.email }).then(admin => {
            if (admin) {
                return res.status(400).json({
                    success: false,
                    error: "Email already exists"
                });
            } else {
                const newAdmin = new Admin({
                    email: req.body.email,
                    password: req.body.password
                });

                // Hash password before saving in database
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newAdmin.password, salt, (err, hash) => {
                        if (err) throw err;
                        newAdmin.password = hash;
                        newAdmin
                            .save()
                            .then(admin => res.status(201).json({
                                success: true,
                                data: admin
                            }))
                            .catch(err => console.log(err));
                    });
                });
            }
        });

    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);

            return res.status(400).json({
                success: false,
                error: messages
            })
        } else {
            return res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
       
    }
}

// @desc    Login administrator
// @route   POST /api/v1/admins/login
// @access  Public
exports.login = async (req, res, next) => {
    try {

        // Form validation
        const { errors, isValid } = validateLoginInput(req.body);

        // Check validation
        if (!isValid) {
            return res.status(400).json({
                success: false,
                error: errors[Object.keys(errors)[0]]
            });
        }
    
        const email = req.body.email;
        const password = req.body.password;

        // Find user by email
        Admin.findOne({ email }).then(admin => {

            // Check if administrator exists
            if (!admin) {
                return res.status(404).json({
                    success: false,
                    error: "Email not found"
                });
            }

            // Check password
            bcrypt.compare(password, admin.password).then(isMatch => {
                if (isMatch) {
                    // User matched

                    // Create JWT Payload
                    const payload = {
                        id: admin.id,
                        name: admin.name
                    };

                    // Sign token
                    jwt.sign(
                        payload,
                        keys.secretOrKey,
                        {
                            expiresIn: 31556926 // 1 year in seconds
                        },
                        (err, token) => {
                            res.json({
                                success: true,
                                data: {
                                    token: "Bearer " + token
                                }
                            });
                         }
                    );
                } else {
                    return res
                        .status(400)
                        .json({
                            success: false,
                            error: "Password incorrect"
                        });
                }
            });
        });

    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);

            return res.status(400).json({
                success: false,
                error: messages
            })
        } else {
            return res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
       
    }
}