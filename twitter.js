const puppeteer = require('puppeteer');
const config = require('./config.js');
const twitter_module = require('./twitter_module');

const twitter = {
    twitterInitialize: async (message) => {
        const USERNAME = config.twitterId;
        const PASSWORD = config.twitterPass;
        const MESSAGE = message;
        console.log(`Twitter.jsの値${MESSAGE}`);
        
        await twitter_module.initialize();
        await twitter_module.login(USERNAME, PASSWORD);
        await twitter_module.tweet(MESSAGE);
        await twitter_module.end();
    },
    
}

module.exports = twitter;
