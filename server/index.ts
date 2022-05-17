import express from "express"
import mongoose, {ConnectOptions} from "mongoose"
import "dotenv/config"
import cors from "cors"
import axios from "axios"

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

app.get("/ping", async (req, res) => {
  const response = await axios.get("http://172.18.0.2:3030/ping");
  res.send(response.data);
})

const users = require("./routes/users");
app.use("/users", users);
const imageai = require("./routes/ai/imageai");
app.use("/image", imageai);
const urlai = require("./routes/ai/urlai");
app.use("/url", urlai);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
