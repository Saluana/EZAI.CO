import express from "express"
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");
import { isTokenValid } from "../../middleware/authorization";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);
  
  router.post("/notes", isTokenValid, async (req, res) => {
    const response = await openai.createCompletion("text-curie-001", {
      prompt: `Create a bullet point list of notes with all the key points from this article:  \n ${req.body.text}`,
      temperature: 0.7,
      max_tokens: 700,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    
    if (response.data) {
      res.status(200).json({status: "success", message: "Grammar corrected.", response: response.data.choices[0].text});
      } else {
      res.status(200).json({status: "failure", message: "Grammar not corrected.", response: null});
      }
  });

  router.post("/summarize", isTokenValid, async (req, res) => {
    const response = await openai.createCompletion("text-davinci-002", {
      prompt: `summarize this in 200 words or less:  \n ${req.body.text}`,
      temperature: 0.7,
      max_tokens: 700,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    
    if (response.data) {
      res.status(200).json({status: "success", message: "Grammar corrected.", response: response.data.choices[0].text});
      } else {
      res.status(200).json({status: "failure", message: "Grammar not corrected.", response: null});
      }
  });

  router.post("/correct", isTokenValid, async (req, res) => {
    console.log(req.body.text);
    const response = await openai.createCompletion("text-curie-001", {
      prompt: `${req.body.text} \n Correct the grammar, remove unexpected characters and add paragraphs where needed.`,
      temperature: 0.7,
      max_tokens: 700,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    if (response.data) {
    res.status(200).json({status: "success", message: "Grammar corrected.", response: response.data.choices[0].text});
    } else {
    res.status(200).json({status: "failure", message: "Grammar not corrected.", response: null});
    }
  });

module.exports = router;
