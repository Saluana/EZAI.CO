import express from "express"
import { User } from "../models/Users"
import validator from "validator"

const router = express.Router();

router.post("/create", async (req, res) => {
    // Check if data matches schema
    const username: string = typeof req.body.username === "string" ? req.body.username : "";
    const email: string = typeof req.body.email === "string" ? req.body.email : "";

    //Validate the data is correct
    if (username.length < 1) {
        res.status(400).send("Username is required").end();
    } else if (!validator.isEmail(email)) {
        res.status(400).send("Email is invalid").end();
    }

    // Save the user to the database
    if (username && email) {

    const user = new User({
        username: username,
        email: email,
      });

      await user.save()
      .then(()=>{
          res.status(200).json({status: "success", message: "User Created"});
      })
      .catch(error => console.log(error.code))
    } else {
        console.log("Invalid data")
    }
})

router.get("/check/:email", async (req, res) => {

    const email = typeof req.params.email === "string" ? req.params.email : "";

    if (email) {
        await User.findOne({email: email})
        .then(user => {
            if (user) {
                res.status(200).json({status: "success", message: "User exists"});
            } else {
                res.status(200).json({status: "failure", message: "User does not exist"});
            }
        })
        .catch(error => {
            console.log(error.code)
            res.status(401).json({status: "failure", message: "Something went wrong."});
        })
    }
})

module.exports = router;
