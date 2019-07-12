const rp = require("request-promise");
const $ = require("cheerio");
const puppeteer = require("puppeteer");
var mongoose = require('mongoose');
var fs = require("fs");
mongoose.connect('mongodb://127.0.0.1:27017/nodetest1', { useNewUrlParser: true });

//const url = 'https://en.wikipedia.org/wiki/George_Washington';
//const url = 'https://www.skipthedishes.com/mexican-amigos'
const url = "https://www.skipthedishes.com/pizza-nova-upper-paradise-road";
//const url = "https://www.skipthedishes.com/pokito";
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
});
var itemSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: String
});
var Item = mongoose.model('Item', itemSchema)
var mcdouble = new Item({
    name: "MCDOUBLE",
    description: "VALUE MEAL",
    price: "$2.29"
})
mcdouble.save(function(err,mcdouble){
    if(err) return console.error(err)
})
function fetchData() {
    puppeteer
        .launch()
        .then(function (browser) {
            return browser.newPage();
        })
        .then(function (page) {
            return page.goto(url).then(function () {
                return page.content();
            });
        })
        .then(html => {
            var i = 0;
            $("h3", html).each(function () {
                console.log($(this).text());
                i++;
                console.log(i);
            });
            var itemLength = $(".jssuro8ow", html).length;
            console.log(itemLength);
            menu = []
            for (let i = 0; i < itemLength; i++) {
                curObject = {
                    price: $(".jssuro8ow", html)[i].children[2].children[0].children[0].next
                        .children[2].children[0].data,
                    description: $(".jssuro8ow", html)[i].children[1].attribs.content,
                    name: $(".jssuro8ow", html)[i].children[2].children[0].children[0].children[0]
                        .children[0].children[0].data
                }
                console.log(curObject.name)
                console.log(curObject.description)
                console.log(curObject.price)
                menu.push(curObject)
            }
            fs.writeFile("hackernews.json", JSON.stringify(menu), function (err) {
                if (err) throw err;
                console.log("Saved!");
            });
            console.log(success("Browser Closed"));
        })
        .catch(function (err) {
        });
}
fetchData()
