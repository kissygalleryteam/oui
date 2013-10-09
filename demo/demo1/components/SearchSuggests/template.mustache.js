KISSY.add(function() {
	return '\
        <ul>\
            {{#items}}\
                <li class="pop-list"><a href="http://wenda.daily.etao.net/thread/detail/{{id}}.htm">{{{title}}} <span><i>{{reply_count}}</i>个回答</span></a></li>\
            {{/items}}\
        </ul>\
        {{#hasMore}}\
        <a class="view-more" href="http://wenda.daily.etao.net/search.htm?q={{key}}">查看全部{{total}}个相关问题</a>\
        {{/hasMore}}\
	'
});