import express from "express"
import axios from "axios"
import {isTokenValid} from "../../middleware/authorization"

const router = express.Router()

router.get("/summary", isTokenValid, async (req, res) => {
    const uri:string = typeof req.query.uri === "string" ? req.query.uri : ""
    const decodedUri = decodeURIComponent(uri);
    let response:any;

    if (uri.length > 0) {
    response = await axios.post("http://scraper-api:3030/summary", { URI: decodedUri });
    } else {
        return res.send(null)
    }
    
    if (!response) {
        res.status(500).send("Error");
    } else {
        res.send(response.data);
    }
})

router.get("/notes", isTokenValid, async (req, res) => {
    const uri = req.query.uri;
    let response = await axios.post("http://scraper-api:3030/notes", {URI: uri});

    if (!response) {
        res.status(500).send("Error");
    } else {
        res.send(response.data);
    }
})

module.exports = router;