import fs from 'fs';
import path from 'path';
import * as googleTTS from 'google-tts-api';
import axios from 'axios';
import * as dotenv from 'dotenv'

dotenv.config();

const key = process.env.OPEN_API_KEY;

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    //apiKey: process.env.OPENAI_API_KEY,
    apiKey: key
  });

export const speechToText = async() => {
    try {
        const pathRel = path.join(__dirname, '..', '..', 'audio', 'Rev.mp3');
        const readStream = fs.createReadStream(pathRel);

        const openai = new OpenAIApi(configuration);

        let time = Date.now();

        openai.createTranscription(readStream, 'whisper-1')
            .then((res: any) => console.log('audio res', res.data.text, (time-Date.now())/1000))
            .catch((error: any) => {console.log(error)})
        
    } catch(error) {
        console.log(error);
    }
}

export const textToSpeech = async() => {
    try {
        const url = googleTTS.getAudioUrl('Hello World', { lang: 'en', slow: false });
        console.log({ url }); 


        googleTTS
        .getAudioBase64('Привет', { lang: 'ru', slow: false })
        .then((base64) => {
            console.log({ base64 });
            const buffer = Buffer.from(base64, 'base64');
            fs.writeFileSync('audio/hello-world-english.mp3', buffer, { encoding: 'base64' });
        })
        .catch(console.error);


    } catch(error) {
        console.log(error);
    }
}

export const chat = async(request: string) => {
    const data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": request}],
        "temperature": 0.7
    };

    const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        }
    };

    axios.post('https://api.openai.com/v1/chat/completions', data, config)
    .then(response => {
        console.log(response.data.choices[0].message);
    })
    .catch(error => {
        console.log(error);
    });

}