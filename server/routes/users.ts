import express from "express"
import { User } from "../models/Users"
import validator from "validator"
import { isTokenValid } from "../middleware/authorization";

const router = express.Router();

router.post("/create", isTokenValid, async (req, res) => {
    console.log("account creation started...")
    // Check if data matches schema
    const username: string = typeof req.body.username === "string" ? req.body.username : "";
    const email: string = typeof req.body.email === "string" ? req.body.email : "";
    const uid: string = typeof req.body.uid === "string" ? req.body.uid : "";

    //Validate the data is correct
    if (!username) {
        console.log("No username")
        return res.status(400).send("Username is required").end();
    } else if (!validator.isEmail(email)) {
        console.log("No email")
        return res.status(400).send("Email is invalid").end();
    } else if (!uid) {
        console.log("No uid")
        return res.status(400).send("UID is required").end();
    }

    // Save the user to the database
    if (username && email && uid) {

    const user = new User({
        username: username,
        email: email,
        uid: uid
      });

      await user.save()
      .then((user)=>{
          console.log(user)
          console.log("User created");
          return res.status(200).json({status: "success", message: "User Created", user: user});
      })
      .catch(error => console.log(error.code))
    } else {
        console.log("Invalid data")
    }
})

router.get("/check/:uid", isTokenValid, async (req, res) => {

    const uid = typeof req.params.uid === "string" ? req.params.uid : "";
    if (uid.length !== 28) {
        return res.status(400).send("invalid UID").end();
    }
    if (uid) {
        await User.findOne({uid: uid})
        .then(user => {
            if (user) {
                console.log(user)
                return res.status(200).json({status: "success", message: "User exists", user: user});
            } else {
                return res.status(200).json({status: "failure", message: "User does not exist"});
            }
        })
        .catch(error => {
            console.log(error.code)
            return res.status(401).json({status: "failure", message: "Something went wrong."});
        })
    }
})

module.exports = router;
