require('dotenv').config();

const slack = require('./slack');

(async () =>
{ await slack.init();
})();