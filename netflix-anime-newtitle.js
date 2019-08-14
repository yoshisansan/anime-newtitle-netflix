//タスク：スプレッドシートとの連携→新作があった場合は更に１０件の取得
const puppeteer = require('puppeteer');
const fs = require('fs');
const config = require('./config.js');

const writeSpreadSheet = require('./google-spread-sheet');

// console.log(config.username, config.password);

(async () => {
    let results = [];
    // const SHOW_LOADING = config.showLoading;
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();

    // Open login page and login
    await page.goto('https://www.netflix.com/jp/login');
    await page.type('input[name="userLoginId"]', config.username);
    await page.type('input[name="password"]', config.password);
    await page.keyboard.press('Enter');
    await page.waitForNavigation();

    await page.click('div[class="profile-icon"]');
    
    //クリックなどのアクションを行いURLが画面上で変更してしまうとスクレイピングできなかった
    await page.goto('https://www.netflix.com/browse/genre/7424?so=yr');
    
    //クリックで公開年のページへ遷移してうまくいかなかったやつ
    // await page.click('button[class="aro-grid-toggle"]');
    // await page.click('div[class="sortGallery"]');
    // await page.click('#appMountPoint > div > div > div:nth-child(1) > div > div.pinning-header > div > div.sub-header > div > div > div > div.aro-genre-details > div > div > div > div > div.sub-menu.theme-aro > ul > li:nth-child(2) > a');
    // await page.waitForNavigation();

    var titletest = await page.evaluate(() => {
        //配列はevaluateの中で宣言したものでないと使えなかった
        var titles = [];
        var titleNode = document.querySelectorAll('div.ptrack-content > a > div > div > div');
        for (i = 0;i < 10;i++) {
            titles.push(titleNode[i].innerHTML);
        }
        return titles;
    }).catch(() => 'titlesはエラー');

    // TOP10動画が新しく追加された動画かフィルターをかける。10個目も新しい動画なら、さらにプラス10動画を調べる
    writeSpreadSheet(titletest);
})();