// testリファレンス https://developers.google.com/apps-script/reference/spreadsheet/range
//タスク フィルター→新規タイトルだけ書き込み→日付書き込み
module.exports = (animeTitle) => {
console.log(`読み込んだドン ${animeTitle}`);

const GoogleSpreadsheetAsPromised = require('google-spreadsheet-as-promised');
const CREDS = require('./netflix-anime-newtitle-spreadsheet/netflix-anime-newtitle-key.json');
const SHEET_ID = config.sheetId;

async function getTailRowIndex (worksheet) {
        const cells = ( await worksheet.getCells('B1:B999') ).getAllValues();
        for ( let i = 0; i < cells.length; i++ ) {
            if (cells[i] == '') return i
        }
}

(async() => {
        const sheet = new GoogleSpreadsheetAsPromised();
        await sheet.load(SHEET_ID, CREDS);
        const worksheet = await sheet.getWorksheetByName('sheet1');
        const tailRowIndex = await getTailRowIndex(worksheet);
        for ( i = 0;i < animeTitle.length;i++ ) {
            const cell = await worksheet.getCell(`B${tailRowIndex + i + 1}`);
            await cell.setValue(animeTitle[i]);
        }
        console.log('done');
})().catch(err => console.error(err.stack || err));

}