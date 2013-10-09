KISSY.add(function() {
	return '\
    <fieldset>\
        <legend>form</legend>\
        <div class="content">\
            <content select="input[type=search]"><input type="search" name="{{search-key}}" /></content>\
        </div>\
        <div class="suggests">\
            <content select="x-searchsuggests"></content>\
        </div>\
        <div class="actions">\
            <content select="input[type=submit]"><input type="submit" /></content>\
        </div>\
    </fieldset>\
    '
});