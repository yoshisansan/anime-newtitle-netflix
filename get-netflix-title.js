exports.getTitle = () => {

    async function getNewTitle (worksheet) {
        //アニメタイトル数がB1200を超える前に更新しておく
        const cells = ( await worksheet.getCells('B2:B1200') ).getAllValues();
        //concatは配列を繋げる
        let arr = filterTarget.concat(cells);
        const doubleTitle = arr.filter( (title, index, self) => {
            //lastIndexOfは配列の最後から検索してインデックスを返す。
            return self.indexOf(title) === index && index !== self.lastIndexOf(title);
        });
        const newTitleFilter = filterTarget.filter( title => {
            return doubleTitle.indexOf(title) == -1;
        });
        return newTitleFilter;
    }

    async function spreadSheet() {
        const GoogleSpreadsheetAsPromised = require('google-spreadsheet-as-promised');
        const CREDS = require('./netflix-anime-newtitle-spreadsheet/netflix-anime-newtitle-key.json');
        const SHEET_ID = '1klOTaz5sj-iFvXPJlsTHgsGuGuSH498jQsb51raV8b4';

        console.log('GoogleSpreadSheetへアクセス開始します');
        const sheet = new GoogleSpreadsheetAsPromised();;
        await sheet.load(SHEET_ID, CREDS);
        console.log('auth完了');
        const worksheet = await sheet.getWorksheetByName('sheet1');
        const cells = ( await worksheet.getCells('B2:B1200') ).getAllValues();
        return cells;
    }

    const cells = spreadSheet();
    return cells;

}