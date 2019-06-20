require('dotenv').config();
const fs = require('fs');

const lots = process.env.LOTS;

const slack = require('./slack');

(async () =>
{ await slack.init();

  for(let i = 1; i <= lots; ++i)
  { await auctionLot(i);
  }
})();

const auctionLot = async (lot) =>
{ const padded = `${lot}`.padStart(3, '0');
  const info = fs.readFileSync(`lots/${padded}/info.txt`, 'utf8');
  const tokens = info.split('\n');

  const [photo, minimum] = tokens[0].split(':');

  await slack.postLotInGeneral(padded, photo);
  await slack.postLot(padded, photo);

  for(let i = 1; i < tokens.length; ++i)
  { await slack.postCommentInAuction(tokens[i]);
  }

  await slack.postCommentInAuction(`To bid, type \`bid xxx\` where \`xxx\` is the amount, e.g. \`bid 500\`. We'll start at *${minimum}*.`);

  await monitorAuction(padded, parseInt(minimum));
};

const monitorAuction = (lot, minimum) =>
{ return new Promise(async (resolve, reject) =>
  { const highest =
    { user: null
    , bid: minimum
    };

    let open = true;

    const endAuction = async () =>
    { open = false;
      timeoutID = null;
      slack.setMessageCallback(null);

      await slack.postCommentInAuction(`*SOLD* LOT *#${lot}* to <@${highest.user}> for *${highest.bid}*`);
      resolve();
    };

    setTimeout(
      async () =>
      { if(highest.user == null)
        { open = false;
          slack.setMessageCallback(null);

          await slack.postCommentInAuction('No one wanted this? More for me then!');
          resolve();
        }
      }
    , 120000
    );

    let timeoutID = null;

    slack.setMessageCallback(async (event) =>
    { const bids = event.text.match(/bid\s+?([0-9]+)\s?/ig);
      if(bids)
      { const bid = parseInt(bids[0].substring(4));
        if(bid > highest.bid)
        { if(!open)
          { return;
          }

          highest.bid = bid;
          highest.user = event.user;

          timeoutID != null && clearTimeout(timeoutID);

          await slack.postCommentInAuction(`Confirmed bid *${bid}* from <@${event.user}>`);

          timeoutID = setTimeout(endAuction, 60000);
        }
      }
    });
  });
}