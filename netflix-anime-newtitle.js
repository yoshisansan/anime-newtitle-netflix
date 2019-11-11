//タスク：スプレッドシートとの連携→新作があった場合は更に１０件の取得
const puppeteer = require('puppeteer');
const fs = require('fs');
const config = require('./config.js');

const writeSpreadSheet = require('./write-spread-sheet').writeSpreadSheet;
const getTitle = require('./get-netflix-title').getTitle;
const twitter = require('./twitter');
const getMessage = require('./makeTweetContent');

async function getNewTitle (cells, filterTarget) {
    //concatは配列を繋げる
    let arr = filterTarget.concat(cells);
    const doubleTitle = arr.filter( (title, index, self) => {
        //lastIndexOfは配列の最後から検索してインデックスを返す。
        return self.indexOf(title) === index && index !== self.lastIndexOf(title);
    });
    const newTitleFilter = filterTarget.filter( title => {
        return doubleTitle.indexOf(title) == -1;
    });

    console.log(`新タイトル：${newTitleFilter}`);
    if( newTitleFilter.length > 0 ) {
        // await writeSpreadSheet(newTitleFilter);
        // getMessageオブジェクト→Twitterオブジェクトへ流れて呟きを実行します
        await getMessage.MessageAsync(newTitleFilter);
        // await twitter.twitterInitialize();
        // await twitter.tweet(newTitleFilter);
    } else {
        console.log('新作はありませんでした。処理を終了します');
    }
    return;
}

(async () => {
    const spreadItems = await getTitle();
    let cells = spreadItems.filter(item => item);

    const viewportWidth = 1000;
    const viewportHeight = 630;
    const browser = await puppeteer.launch({
        headless: true,
    });
    const page = await browser.newPage();

    // ネットフリックスのページへログイン
    page.setViewport({width: viewportWidth, height: viewportHeight});
    await page.goto('https://www.netflix.com/jp/login');
    await page.type('input[name="userLoginId"]', config.username);
    await page.type('input[name="password"]', config.password);
    await page.keyboard.press('Enter');
    console.log('ログイン完了しました。');
    await page.waitForNavigation();

    await page.click('div[class="profile-icon"]');

    //イメージを読み込まずにページへ遷移することによってスピードアップ
    await page.setRequestInterception(true);
    page.on('request', (request) => {
        if(['image', 'stylesheet', 'font'].includes(request.resourceType())) {
            request.abort();
        } else {
            request.continue();
        }
    });

    //クリックなどのアクションを行いURLが画面上で変更してしまうとスクレイピングできなかった
    await page.goto('https://www.netflix.com/browse/genre/7424?so=yr');

    // スクロールダウン２回して半分くらいのタイトルの遅延読み込みさせておく。読み込みすぎてもタイトルを微変したものを拾う可能性があるので不要
    await page.evaluate(() => {
        window.scrollTo(0,10000);
    }).catch(()=>'スクロールはエラー');
    await page.waitFor(2000);

    await page.evaluate(() => {
        window.scrollTo(0,20000);
    }).catch(()=>'スクロールはエラー');
    console.log('スクロール完了');    
    await page.waitFor(2000);

    console.log('トップタイトル取得します');
    let topTitle = await page.evaluate(() => {
        
        //配列はevaluateの中で宣言したものでないと使えなかった
        let titles = [];
        let titleNode = document.querySelectorAll('div.ptrack-content > a > div > div > p');
        for (i = 0;i < titleNode.length;i++) {
            titles.push(titleNode[i].innerHTML);
        }
        return titles;
        // count++;
    }).catch(() => 'titlesはエラー');

    await getNewTitle(cells, topTitle);
    await browser.close();

    return;
})();