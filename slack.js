const { RTMClient } = require('@slack/rtm-api');
const { WebClient } = require('@slack/web-api');

const token = process.env.SLACK_BOT_TOKEN;
const channel = process.env.SLACK_CHANNEL;

const rtm = new RTMClient(token);
const web = new WebClient(token);

const init = async () =>
{ const { self, team } = await rtm.start();
}

const postLot = async (lot, photo, description) =>
{ try
  { await rtm.sendTyping(channel);

    const result = await web.chat.postMessage(
    { blocks:
      [
        { type: 'section'
        , text:
          { type: 'mrkdwn',
            text: `Now bidding for *Lot #${lot}*.`
          }
        }
      , { type: 'image'
        , image_url: `http://drive.google.com/uc?export=view&id=${photo}`
        , alt_text: '...'
        }
      , { type: 'section'
        , text:
          { type: 'mrkdwn',
            text: description
          }
        }
      , { type: 'divider'
        }
      ]
    , channel: channel
    });
  }
  catch(e)
  { console.log(`Error posting Lot #${lot}`);
    console.log(e);
    console.log(e.data)
  }
}

rtm.on('connected', (event) => {
  console.log('connected');
});

rtm.on('message', (event) => {
  console.log(event);
});

module.exports = {
  init,
  postLot
}