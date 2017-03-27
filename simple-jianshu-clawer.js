const http = require("http");
const Promise = require("promise"); //ES6 buit-in object
const cheerio = require("cheerio");

var articleUrls = [];

// 先获取作者主页下文章的articleUrls数组
http.get("http://www.jianshu.com/u/452568260db5", function(res) {
    let html = "";
    
    // Event API : emitter.on(event, listener)
    res.on("data" ,function(data) {
        console.log("开始获取作者主页信息...");
        html += data;
    });

    res.on("end",function() {
        console.log("获取作者主页信息成功~");
        console.log("==========");
        getArticleUrls(html);
        console.log(articleUrls);
    });
}).on("error",function(){
    console.log("获取作者主页信息出错!");
});


function getArticleUrls (html) {
    let $ = cheerio.load(html);
    let titles = $(".note-list .title");
    titles.each(function(index){
        articleUrls.push($(this).attr("href"));
    })
}