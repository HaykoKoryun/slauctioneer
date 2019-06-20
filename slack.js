const { RTMClient } = require('@slack/rtm-api');
const { WebClient } = require('@slack/web-api');

const token = process.env.SLACK_BOT_TOKEN;
const channel =
{ general:
  { code: process.env.SLACK_GENERAL_CHANNEL
  , label: 'general'
  }
, auction:
  { code: process.env.SLACK_AUCTION_CHANNEL
  , label: 'auction'
  }
};

const rtm = new RTMClient(token);
const web = new WebClient(token);

let messageCallBack = null;

const init = async () =>
{ const { self, team } = await rtm.start();
};

const typing = async (channel) =>
{ await rtm.sendTyping(channel);
};

const postLotInGeneral = async (lot, photo) =>
{ try
  { 
    typing(channel.general.code);

    const result = await web.chat.postMessage(
    { blocks:
      [
        { type: 'section'
        , text:
          { type: 'mrkdwn',
            text: `Now bidding on LOT *#${lot}*.`
          }
        }
      , { type: 'image'
        , image_url: `http://drive.google.com/uc?export=view&id=${photo}`
        , alt_text: '...'
        }
      , { type: 'section'
        , text:
          { type: 'mrkdwn',
            text: 'Head on over to #haykos-auction to start bidding!'
          }
        }
      ]
    , channel: channel.general.code
    });
  }
  catch(e)
  { console.log(`Error posting LOT #${lot} in general`);
    console.log(e);
    console.log(e.data)
  }
};

const postLot = async (lot, photo) =>
{ try
  { 
    typing(channel.auction.code);

    const result = await web.chat.postMessage(
    { blocks:
      [
        { type: 'section'
        , text:
          { type: 'mrkdwn',
            text: `Now bidding on LOT *#${lot}*.`
          }
        }
      , { type: 'image'
        , image_url: `http://drive.google.com/uc?export=view&id=${photo}`
        , alt_text: '...'
        }
      ]
    , channel: channel.auction.code
    });
  }
  catch(e)
  { console.log(`Error posting LOT #${lot} in auction`);
    console.log(e);
    console.log(e.data)
  }
};

const postCommentInGeneral = async (comment) =>
{ await postComment(channel.general, comment);
};

const postCommentInAuction = async (comment) =>
{ await postComment(channel.auction, comment);
};

const postComment = async (channel, comment) =>
{ try
  { 
    typing(channel.code);
    await wait(comment);

    const result = await web.chat.postMessage(
    { blocks:
      [
        { type: 'section'
        , text:
          { type: 'mrkdwn',
            text: comment
          }
        }
      ]
    , channel: channel.code
    });
  }
  catch(e)
  { console.log(`Error posting comment in ${channel.label}`);
    console.log(e);
    console.log(e.data)
  }
};

const setMessageCallback = (callback) =>
{ messageCallBack = callback
};

rtm.on('connected', (event) => {
  console.log('connected');
});

rtm.on('message', (event) => {
  messageCallBack
  && event.channel == channel.auction.code
  && messageCallBack(event);
});

const wait = (message) =>
{ return new Promise((resolve, reject) =>
  { setTimeout(resolve, (message.length * 50) + 1000);
  });
};

module.exports = {
  init,
  postLotInGeneral,
  postLot,
  postCommentInGeneral,
  postCommentInAuction,
  setMessageCallback
}