/**
 * @fileoverview 
 * @author goto100<yiyu.ljw@taobao.com>
 * @module oui
 **/
KISSY.add(function (S, Node,Base) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     * 
     * @class Oui
     * @constructor
     * @extends Base
     */
    function Oui(comConfig) {
        var self = this;
        //调用父类构造函数
        Oui.superclass.constructor.call(self, comConfig);
    }
    S.extend(Oui, Base, /** @lends Oui.prototype*/{

    }, {ATTRS : /** @lends Oui*/{

    }});
    return Oui;
}, {requires:['node', 'base']});



