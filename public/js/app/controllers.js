'use strict';
angular.module('app')
.controller('main_controller', ['$scope', '$location', 'google_news', '$timeout', function main_controller ($scope, $location, google_news, $timeout) {
    var controller = this;
    var old_controller_q ;
    var old_controller_start ;
    controller.news = [];
    
    controller.navigate_to = function (start) { controller.start = start; };
    controller.set_focus = function (idx) { $location.search('focus', idx); };
    
    google_news.subscribe(function (news_list) {
        if (!news_list.responseData) { return; } ;
        var news = news_list.responseData.results;
        var cursor = news_list.responseData.cursor;
        $timeout(function(){
            news.forEach(function(topic, idx){
                topic.status = {isFirstOpen: idx == controller.focus};
                topic.image = topic.image && topic.image.tbUrl ? topic.image : {tbUrl: 'http://lh3.ggpht.com/_9nphYWWWTBQ/TLmC-EdNZxI/AAAAAAAAEFY/HpLyVN91AVY/no_image.jpeg'};
                topic.content = '<p>' + '<img width="80" height="50" src="'+topic.image.tbUrl+'" style="margin: 10px ; " />' + topic.content + '</p>';
            });
            controller.news = news;
            controller.cursor = cursor;
            console.log('main_controller: news_retrieved: ' + controller.news.length);
            //console.log(news_list);
        }, 0);
    });
    
    $scope.$on('$locationChangeSuccess', function () {
        console.log('main_controller: $locationChangeSuccess');
        var search = $location.search();
        var make_new_query = true;
        
        if (search.start == old_controller_start && search.q == old_controller_q) {
            make_new_query = false;
        }
        
        controller.q = search.q || '';
        controller.start = search.start || 0;
        controller.focus = search.focus || 0;
        
        
        controller.news.forEach(function(topic, idx){
            topic.status.isFirstOpen = (idx == controller.focus);
        });
        
        //console.log(controller.q + ' ' + old_controller_q + ' ' + (controller.q != old_controller_q))
        //console.log(controller.start + ' ' + old_controller_start + ' ' + (controller.start != old_controller_start))
        //console.log('focus: ' + controller.focus);
        //console.log('make_new_query: ' + make_new_query);
        
        make_new_query && google_news.get_news({q: controller.q, start: controller.start});
        !controller.q && (controller.news = []);
        old_controller_q = controller.q;
        old_controller_start = controller.start;
    });
    
    $scope.$watch(function () { return controller.q; }, function (newValue, oldValue) {
        if ( newValue !== oldValue ) {
            //console.log('q changed');
            $location.search('q', newValue||'');
        }
    });
    
    $scope.$watch(function () { return controller.start; }, function (newValue, oldValue) {
        if ( newValue !== oldValue ) {
            //console.log('start changed');
            $location.search('start', newValue||0);
        }
    });
}])