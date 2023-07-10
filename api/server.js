import express from "express";
import cors from "cors"; 
import *as dotnev from "dotenv";
import { Configuration, OpenAIApi } from "openai";


dotnev.config()

const app=express();
app.use(cors());
app.use(express.json());

app.get("/",async (req,res)=>{
    res.status(200).send({
        
        message:"this is chatgpt Ai App"
    
    });
});

const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);

app.post("/",async (req,res)=>
{
    try
    {

const response = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: req.body.input,
  temperature: 0,
  max_tokens: 3000,
  top_p: 1,
  frequency_penalty: 0.5,
  presence_penalty: 0,
});

    console.log("PASSED:",req.body.input)

    res.status(200).send({
        bot: response.data.choices[0].text,
    });

    }
    catch(err)
    {
        console.log("FAILED:",req.body.input)
        console.error(err);
        res.status(500).send(err);
    }
});

app.listen(5000,()=>console.log("serever is running on port 5000"));