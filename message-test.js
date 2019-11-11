let animeTitle = ['ULTRAMAN','盾の勇者の成り上がり','キャロル＆チューズデイ','とある科学の一方通行','炎炎ノ消防隊','​聖闘士星矢: Knights of the Zodiac','かぐや様は告らせたい～天才たちの恋愛頭脳戦～','ありふれた職業で世界最強','彼方のアストラ','リラックマとカオルさん','異世界チート魔術師','甲鉄城のカバネリ 海門決戦','賢者の孫','五等分の花嫁','Fairy gone フェアリーゴーン','通常攻撃が全体攻撃で二回攻撃のお母さんは好きですか？','さらざんまい','BEM','群青のマグメル','フルーツバスケット','続・終物語','なんでここに先生が!?','真夜中のオカルト公務員','荒野のコトブキ飛行隊','ブギーポップは笑わない'];
let message = [];
let messages = [];
let firstGet = 'true';

const date = new Date();
const today = (date.getMonth() + 1) + "月" + date.getDate() + '日';
    
let fixedMessage = '【' + today + 'のネットフリックスのアニメ新タイトル】' + '\n\n';
let fixedCount = 1;
const fixedTag = '\n#Netflix';
let nextTweet = [];

const getMessage = {
    MessageAsync: async () => {
        if(firstGet === 'true'){
            firstGet = 'false';
            await getMessage.MessageFunc(animeTitle);    
        }
    
        if(nextTweet.length > 0) {
            fixedMessage = '続き' + fixedCount + '\n\n';
            fixedCount++;
            await getMessage.MessageFunc(nextTweet);
            await getMessage.MessageAsync();
        }
    },

    MessageFunc: async (animeTitle) => {
        nextTweet = [];
        let messageCount = 0;
        for(i =0;animeTitle.length > i;i++) {
            if(animeTitle[i + 1]) { 
                // +１は改行する分
                messageCount = message.length + animeTitle[i + 1].length + 1 + fixedMessage.length + fixedTag.length;
            }
            if(messageCount < 140) {
                message += animeTitle[i] + '\n';
            } else {
                nextTweet.push(animeTitle[i]);
            }    
        }
        let tweetContent = fixedMessage + message + fixedTag
        messages.push(tweetContent);
        message = [];
        console.log(messages);
    },
}

getMessage.MessageAsync();
console.log(messages);


// async function MessageFunc (animeTitle) {
//     nextTweet = [];
//     let messageCount = 0;
//     for(i =0;animeTitle.length > i;i++) {
//         if(animeTitle[i + 1]) { 
//             // +１は改行する分
//             messageCount = message.length + animeTitle[i + 1].length + 1 + fixedMessage.length + fixedTag.length;
//         }
//         if(messageCount < 140) {
//             message += animeTitle[i] + '\n';
//         } else {
//             nextTweet.push(animeTitle[i]);
//         }    
//     }
//     // console.log(message);
//     // console.log(nextTweet);
//     messages.push(message);
//     console.log(messages);
//     message = [];
// }

// async function messageAsync() {
//     if(firstGet === 'true'){
//         firstGet = 'false';
//         await MessageFunc(animeTitle);    
//     }

//     if(nextTweet.length > 0) {
//         fixedMessage = '続き' + '\n\n';
//         await MessageFunc(nextTweet);
//         await messageAsync();
//     }
// }

// messageAsync();



