const User = require('../models/User');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const e = require('express');
const { SECRET } = process.env

exports.registerNewUser = (req, res) => {

  User.findOne({ username: req.body.username }, (err, existingUser) => {
    if (existingUser) {
      return res.status(400).json({
        message: 'A user with this username already exists'
      })
    }
    if (err) {
      return res.status(500).json({ err })
    }
  })

  const { firstname, lastname, username, email, password } = req.body

  User.create({
    firstname: firstname,
    lastname: lastname,
    username: username,
    email: email
  }, (err, newuser) => {
    if (err) {
      return res.status(500).json({ err })
    }
    else (
      bcrypt.genSalt(10, (err, salt) => {
        if (err){throw err}
        console.log("salt = " + salt);
        bcrypt.hash(password, salt, (err, hashedPassword) => {
          // Store hash in database here

          if (err) {
            throw err
          }
          else {
            newuser.password = hashedPassword; 
        
            newuser.save((err) => {
              if (err) {
               return res.status(500).json({ err })
              }
              else (


                jwt.sign(
                  {
                    id: newuser._id,
                    firstname: newuser.firstname,
                    lastname: newuser.lastname,
                    email: newuser.email,
                    password: newuser.password

                  }, SECRET, { expiresIn: 36000 }, (err, token) => {
                    if (err) {
                      return res.status(500), json({ err })
                    }
                    res.status(200).json({
                      message: "User Registration Successful",
                      token
                    })
                  }
                )

              )
            })

          }
        })
      })
    )
  })

}


exports.loginUser = async (req, res) => {
  console.log("okkrrr")
  const errors = validationResult(req);

  if (!errors.isEmpty) {
    return res.status(400).json({
      errors: errors.array()
    })
  }

  const { email, password } = req.body;

  try {

    let user = await User.findOne({ email: email })

    if (!user) {
      return res.status(400).json({
        statusCode: 401,
        message: "Invalid Credentials"
      })
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid Credentials"
      })
    }

    const payload = {
      user: {
        id: user.id

      }
    }

    jwt.sign(
      payload,
      SECRET,
      {
        expiresIn: 360000
      },
      (err, token) => {
        if (err) {
          throw err
        }
        else {
          res.json({
            statusCode: 200,
            message: "Logged In Successfully",
            user: {
              firstname: User.firstname,
              lastname: User.lastname,
              userRole: User.userRole,
              isTutor: User.isTutor,
              isAdmin: User.isAdmin
            },
            token
          })
        }
      }
    )


  } catch (error) {
    console.error(error.message)
    res.status(500).send("Server Error")
  }
}

