import express, { Request, Response } from 'express';

import { speechToText, textToSpeech, chat } from './controllers/transcription';

const app = express();
const port = 3000;

app.get('/', async (req: Request, res: Response) => {
  //await speechToText();
  //await textToSpeech();
  await chat('how are you?');
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});