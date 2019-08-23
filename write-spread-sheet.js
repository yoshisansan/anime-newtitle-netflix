// testリファレンス https://developers.google.com/apps-script/reference/spreadsheet/range
//タスク フィルター→新規タイトルだけ書き込み→日付書き込み
//新タイトルフィルタリングするための処理をnetflix-anime-newtitleへ移動する⇨
exports.writeSpreadSheet = (animeTitle) => {

    const GoogleSpreadsheetAsPromised = require('google-spreadsheet-as-promised');
    const CREDS = require('./netflix-anime-newtitle-spreadsheet/netflix-anime-newtitle-key.json');
    const SHEET_ID = '1klOTaz5sj-iFvXPJlsTHgsGuGuSH498jQsb51raV8b4';
    console.log(`書き込むタイトルはこちらです:${animeTitle}`);
    const date = new Date();
    const today = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();

    async function getTailRowIndex (worksheet) {
        const cells = ( await worksheet.getCells('B1:B999') ).getAllValues();
        for ( let i = 0; i < cells.length; i++ ) {
            if (cells[i] == '') return i + 1
        }
    }
    async function getNewTitleRowIndex (worksheet) {
        const cells = ( await worksheet.getCells('C1:C300') ).getAllValues();
        for ( let i = 0; i < cells.length; i++ ) {
            if (cells[i] == '') return i + 1
        }
    }
    async function getDateRowTailIndex (worksheet) {
        const cells = ( await worksheet.getCells('E1:E365') ).getAllValues();
        for ( let i = 0; i < cells.length; i++ ) {
            if (cells[i] == '') return i + 1
        }
    }
    (async function spreadSheet() {
        const sheet = new GoogleSpreadsheetAsPromised();
        await sheet.load(SHEET_ID, CREDS);
        const worksheet = await sheet.getWorksheetByName('sheet1');
        
        if(animeTitle.length > 0){
            console.log(`スプレッドシートへ書き込み開始します`);
            const tailRowIndex = await getTailRowIndex(worksheet);
            const newTitleRowIndex = await getNewTitleRowIndex(worksheet);
            for ( i = 0;i < animeTitle.length;i++) {
                let titleCell = await worksheet.getCell(`B${tailRowIndex + i}`);
                let newTitleCell = await worksheet.getCell(`C${newTitleRowIndex + i}`);
                let dateCell = await worksheet.getCell(`D${newTitleRowIndex + i}`);
                await titleCell.setValue(animeTitle[i]);
                await newTitleCell.setValue(animeTitle[i]);
                await dateCell.setValue(today);
                foundNewTitle = true;
            }
        } else { 
            console.log('newTitleはありませんでした。');
            foundNewTitle = false;
        }
    
        const getDateRowIndex = await getDateRowTailIndex (worksheet);
        const executeDateCell = await worksheet.getCell(`E${getDateRowIndex}`);
        await executeDateCell.setValue(today);
        console.log('書き込みが完了しました');
        
        return;

    })().catch(err => console.error(err.stack || err));
}