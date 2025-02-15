const Bot = require('./Bot.js');
const client = new Bot();

client.setup();
client.loadEvents();
client.start();