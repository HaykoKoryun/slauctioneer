require('dotenv').config();

const { createReadStream } = require('fs');
const { RTMClient } = require('@slack/rtm-api');
const { WebClient } = require('@slack/web-api');

const token = process.env.SLACK_BOT_TOKEN;
const rtm = new RTMClient(token);
const web = new WebClient(token);

(async () => {
  try {
    await rtm.sendTyping('GKBHJ1FJQ');
    //await (new Promise((resolve) => setTimeout(resolve, 3000)));

    const result = await web.chat.postMessage({
      blocks: [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "A message *with some bold text* and _some italicized text_."
          }
        },
        {
          "type": "section",
          "block_id": "section567",
          "text": {
            "type": "mrkdwn",
            "text": "You can add an image next to text in this block."
          },
          "accessory": {
            "type": "image",
            "image_url": "https://is5-ssl.mzstatic.com/image/thumb/Purple3/v4/d3/72/5c/d3725c8f-c642-5d69-1904-aa36e4297885/source/256x256bb.jpg",
            "alt_text": "plants"
          }
        },
        {
          "type": "image",
          "title": {
            "type": "plain_text",
            "text": "Please enjoy this photo of a kitten"
          },
          "block_id": "image4",
          "image_url": "https://slack-files.com/T0QMFHDB7-FKC2RSL69-13ef0e522c",
          "alt_text": "An incredibly cute kitten."
        }
      ],
      channel: 'GKBHJ1FJQ',
    });
    console.log('Message sent successfully', result.ts);
  } catch (error) {
    console.log('An error occurred', error);
  }

  /* const result = await web.files.upload({
    filename: 'expanse.jpg',
    // You can use a ReadableStream or a Buffer for the file option
    // This file is located in the current directory (`process.pwd()`), so the relative path resolves
    file: createReadStream(`./images/expanse.jpg`),
  });

  console.log(result); */
})();

rtm.on('message', (event) => {
  console.log(event);
});

rtm.on('connected', (event) => {
  console.log('connected');
});

(async () => {
  // Connect to Slack
  const { self, team } = await rtm.start();
})();