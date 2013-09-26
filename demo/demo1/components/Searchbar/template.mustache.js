KISSY.add(function() {
	return '\
    <content select="input[type=search]"></content>\
    <content select="input[type=submit]"></content>\
    <script id="pop-layer-template" type="text/template">\
        <div class="pop-layer">\
            <ul>\
                {{#items}}\
                    <li class="pop-list"><a href="http://wenda.daily.etao.net/thread/detail/{{id}}.htm">{{{title}}} <span><i>{{reply_count}}</i>个回答</span></a></li>\
                {{/items}}\
            </ul>\
            {{#hasMore}}\
            <a href="http://wenda.daily.etao.net/search.htm?q={{key}}" class="view-more">查看全部{{total}}个相关问题</a>\
            {{/hasMore}}\
        </div>\
    </script>\
    <div class="question-pop">\
        <script id="question-pop-template" type="text/template">\
            <div class="user-qa">\
                <h3 class="userqa-title"><i class="icon quiz-ico"></i>{{title}}</h3>\
                <p class="userqa-info"><span>提问者：</span>{{asker}}<span>7个回答</span><span>732浏览</span><span>16分钟前</span></p>\
            </div>\
        </script>\
    </div>\
    '
});