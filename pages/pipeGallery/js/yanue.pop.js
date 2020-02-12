//兼容ie6的fixed代码 
//jQuery(function($j){
//	$j('#pop').positionFixed()
//})
(function ($j) {
    $j.positionFixed = function (el) {
        $j(el).each(function () {
            new fixed(this)
        })
        return el;
    }
    $j.fn.positionFixed = function () {
        return $j.positionFixed(this)
    }
    var fixed = $j.positionFixed.impl = function (el) {
        var o = this;
        o.sts = {
            target: $j(el).css('position', 'fixed'),
            container: $j(window)
        }
        o.sts.currentCss = {
            top: o.sts.target.css('top'),
            right: o.sts.target.css('right'),
            bottom: o.sts.target.css('bottom'),
            left: o.sts.target.css('left')
        }
        if (!o.ie6) return;
        o.bindEvent();
    }
    $j.extend(fixed.prototype, {
        ie6: $.browser && $.browser.msie && $.browser.version < 7.0,
        bindEvent: function () {
            var o = this;
            o.sts.target.css('position', 'absolute')
            o.overRelative().initBasePos();
            o.sts.target.css(o.sts.basePos)
            o.sts.container.scroll(o.scrollEvent()).resize(o.resizeEvent());
            o.setPos();
        },
        overRelative: function () {
            var o = this;
            var relative = o.sts.target.parents().filter(function () {
                if ($j(this).css('position') == 'relative') return this;
            })
            if (relative.size() > 0) relative.after(o.sts.target)
            return o;
        },
        initBasePos: function () {
            var o = this;
            o.sts.basePos = {
                top: o.sts.target.offset().top - (o.sts.currentCss.top == 'auto' ? o.sts.container.scrollTop() : 0),
                left: o.sts.target.offset().left - (o.sts.currentCss.left == 'auto' ? o.sts.container.scrollLeft() : 0)
            }
            return o;
        },
        setPos: function () {
            var o = this;
            o.sts.target.css({
                top: o.sts.container.scrollTop() + o.sts.basePos.top,
                left: o.sts.container.scrollLeft() + o.sts.basePos.left
            })
        },
        scrollEvent: function () {
            var o = this;
            return function () {
                o.setPos();
            }
        },
        resizeEvent: function () {
            var o = this;
            return function () {
                setTimeout(function () {
                    o.sts.target.css(o.sts.currentCss)
                    o.initBasePos();
                    o.setPos()
                }, 1)
            }
        }
    })
})(jQuery)

jQuery(function ($j) {
    $j('#footer').positionFixed()
})
function Setcookie(name, value) {
    //设置名称为name,值为value的Cookie
    var expdate = new Date();   //初始化时间
    expdate.setTime(expdate.getTime() + 30 * 60 * 1000);   //时间
    document.cookie = name + "=" + value + ";expires=" + expdate.toGMTString() + ";path=/";
    //即document.cookie= name+"="+value+";path=/";   时间可以不要，但路径(path)必须要填写，因为JS的默认路径是当前页，如果不填，此cookie只在当前页面生效！~
}
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}
//pop右下角弹窗函数
//作者：yanue
function Pop(title, url, intro, t1, iframe) {
    this.title = title;
    this.url = url;
    this.intro = intro;
    this.apearTime = 1000;
    this.hideTime = 500;
    this.delay = 1000 * 60 * 60 * 24;
    this.addInfo = function () {
        $("#popTitle a").html(this.title);
        $("#popIntro").html(this.intro);
        $("#popTitle a").click(function () {
            iframe.attr('src', url);
        });
        //$("#popMore a").attr('href', this.url);
    },
        this.showDiv = function () {
            $("#check").attr("checked", false);
            if (getCookie("pageload") != "41a4g5e64wea4g") {
                if (!($.browser && $.browser.msie && ($.browser.version == "6.0") && !$.support.style)) {
                    $('#pop').slideDown(this.apearTime).delay(this.delay).fadeOut(400);
                } else {//调用jquery.fixed.js,解决ie6不能用fixed
                    $('#pop').show();
                    jQuery(function ($j) {
                        $j('#pop').positionFixed()
                    });
                }
            }
        },
        this.closeDiv = function () {
            $("#popClose").click(function () {
                $('#pop').hide()
                Setcookie("pageload", "41a4g5e64wea4g");
                window.clearInterval(t1);
                //if ($("#check").is(':checked')) {
                //window.clearInterval(t);
                //}
            }
            );
        }
    //添加信息
    this.addInfo();
    //显示
    this.showDiv();
    //关闭
    this.closeDiv();
}