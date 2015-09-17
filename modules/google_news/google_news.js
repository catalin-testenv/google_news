
var request = require("request");
var REST_URI = "https://ajax.googleapis.com/ajax/services/search/news";

exports.get_news  = function get_news (criteria, on_news_retrieved) {
    request({
        uri: REST_URI,
        method: "GET",
        timeout: 10000,
        qs: {v: "1.0", q: criteria.q, start: criteria.start}
    }, function(error, response, body) {
        on_news_retrieved(error, response, body);
    });
}

