/*******
Promise 
https://www.promisejs.org/
It is a super set of ES6 Promises designed to have readable, 
performant code and to provide just the extensions that are 
absolutely necessary for using promises today.
********/

const http = require("http");
const Promise = require("promise"); //ES6 buit-in object
const cheerio = require("cheerio");
const baseUrl = "http://www.jianshu.com/p/";

const articleIds = ['d05e902af678','d05e902af678','89f1d4245b20','f2f5aca71fec','5b4c2f4c7a52','23454b4c899d','2f3bc2598dc5','3d4e8e2592a8','6958f99db769','a7d6077187d9','8e28be0e7ab1','95901615f322','3aa7de527e33','d36fb31f9cff']

const articlePromiseArray = [];

const nodemailer = require('nodemailer');


articleIds.forEach(function(item) {
    articlePromiseArray.push(getPageAsync(baseUrl + item));
});

function getPageAsync (url) {
    return new Promise(function(resolve, reject){
        http.get(url, function(res) {
            var html = "";

            res.on("data", function(data) {
                html += data;
            });

            res.on("end", function() {
                resolve(html);
            });
        }).on("error", function(e) {
            reject(e);
            console.log("获取信息出错!");
        });
    });
};

Promise.all(articlePromiseArray).then(function onFulfilled (pages) {
    let mailContent = '';
    pages.forEach(function(html) {
        let info = filterArticles(html);
        printInfo(info);        
    }); 

    var transporter = nodemailer.createTransport({
        host : '',
        secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
        auth : {
            user : '',
            pass : 
        },
    });

    // mailContent需要由读者自行配制，这里对mailContent的赋值已经删去。

    var mailOptions = {
        from: '', // sender address
        to: '', // list of receivers
        subject: 'Crawler-jianshu ✔', // Subject line
        text: mailContent, // plaintext body
        html: '<b>'+mailContent+'</b>' // html body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });

}, function onRejected (e) {
    console.log(e);
});


function filterArticles (html) {
    let $ = cheerio.load(html);
    let title = $(".article .title").text();
    let publishTime = $('.publish-time').text();
    let textNum = $('.wordage').text().split(' ')[1];
    // let views = $('.views-count').text().split('阅读')[1];
    // let commentsNum = $('.comments-count').text();
    // let likeNum = $('.likes-count').text();
    let articleData = {
        title: title,
        publishTime: publishTime,
        textNum: textNum
        // views: views,
        // commentsNum: commentsNum,
        // likeNum: likeNum
    }; 
    
    return articleData;
};

function printInfo (info) {
    console.log("=========printInfo BEGIN=========" + "\n");
    
    let title = info.title;
    let publishTime = info.publishTime;
    let textNum = info.textNum;

    console.log("-- 【文章题目】" + title.replace(/\s+/g,"") + "\n");
    console.log("   【"+ title.replace(/\s+/g,"") +"】 发布时间：" + publishTime + "\n");
    console.log("   【"+ title.replace(/\s+/g,"") +"】 字数总计：" + textNum.replace(/\s+/g,"") + "\n");
    console.log("=========printInfo DONE=========");
    console.log("\n");
}




