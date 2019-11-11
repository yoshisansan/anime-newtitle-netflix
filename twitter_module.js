const puppeteer = require('puppeteer');

const BASE_URL = 'https://twitter.com/';
const LOGIN_URL = 'https://twitter.com/login?lang=ja'; 

let borwser = null;
let page = null;

const twitter_module = {

    initialize: async () => {
        const viewportWidth = 1000;
        const viewportHeight = 630;
    
        browser = await puppeteer.launch({
            headless: false,
        });
        page = await browser.newPage();    
        page.setViewport({width: viewportWidth, height: viewportHeight});
        // page.goto(BASE_URL);
    },

    login: async (username, password) => {
        await page.goto(LOGIN_URL);
        await page.waitFor('input[name="session[username_or_email]"]', {delay: 25});
        await page.type('input[name="session[username_or_email]"]', username);
        await page.type('input[class="js-password-field"]', password);
        await page.keyboard.press('Enter');
        await page.waitForNavigation();
        console.log('ログイン完了しました。');
        // await twitter_module.tweet(message);
    },
    
    tweet: async (message) => {
        console.log(`meesageLengthは${message.length}です`);
        console.log(message);
        await page.waitFor('div[class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"]', {delay: 25});
        await page.click('div[class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"]',{delay: 25});
        await page.type('div[class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"]', message[0]);
        await page.waitFor(2000);

        for(i=1;message.length > i;i++) {
            if(i !== 1) {
                await page.click('div[aria-label="ツイートを追加"]');
            } else { 
                await page.click('a[aria-label="ツイートを追加"]');
            }
            // await page.click('a[aria-label="ツイートを追加"]');
            await page.type('div[class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"]', message[i]);
            await page.evaluate(() => {
                var test = document.querySelectorAll("#react-root > div > div > div > div > div > div > div > div > div > div > div > div")[2];
                    test.scrollTo(0,2000);
            }).catch(()=>'スクロールはエラー');
            await page.waitFor(2000);
        }

        if(message.length == 1) {
            await page.click('div[data-testid="tweetButtonInline"]');
        } else {
            await page.click('div[data-testid="tweetButton"]');
        }
        console.log('呟き完了しました');
    },

    end: async () => {
        await page.waitFor(1000);
        // await browser.close();
    }

};

module.exports = twitter_module;