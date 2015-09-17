'use strict';
angular.module('app')
.service('google_news', [ '$window',
    
    function ServiceConstructor($window){
        var socket = $window.io.connect();
        
        function GoogleNews() {
            var service = this;
            this.subscribers = [];
            
            socket.on('connect', function () {
                console.log('GoogleNews: client connected');
            });
            
            socket.on('news_list', function(news_list){
                for (var idx = service.subscribers.length; idx--; ) {
                    service.subscribers[idx](news_list);
                }
            });
        }
        
        GoogleNews.prototype.get_news = function (criteria) {
            socket.emit('get_news', criteria);
            console.log('GoogleNews: get_news()');
        };
        
        GoogleNews.prototype.subscribe = function (callback) {
            this.subscribers.push(callback);
        };
        
        return new GoogleNews();
    }
])