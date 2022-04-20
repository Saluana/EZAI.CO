import express from "express"
import mongoose, {ConnectOptions} from "mongoose"
import "dotenv/config"
import cors from "cors"

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(`${process.env.MONGO_DB_URI}`, options as ConnectOptions)
.then(()=>{
  console.log("Connected to MongoDB")
});

const app = express();
app.use(express.json());
app.use(cors());

import {isTokenValid} from "./middleware/authorization"

app.get("/", isTokenValid, (req, res) => {
res.send("Hello world");
})
const users = require("./routes/users");
app.use("/users", users);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
