// <reference path="../HomeMain.js" />
// <reference path="../jquery.cookies.2.2.0.min.js" />
function getElementsByClassName(className, root, tagName) { //root锛氱埗鑺傜偣锛宼agName锛氳鑺傜偣鐨勬爣绛惧悕銆� 杩欎袱涓弬鏁板潎鍙湁鍙棤
    if (root) {
        root = typeof root == "string" ? document.getElementById(root) : root;
    } else {
        root = document.body;
    }
    tagName = tagName || "*";
    if (document.getElementsByClassName) { //濡傛灉娴忚鍣ㄦ敮鎸乬etElementsByClassName锛屽氨鐩存帴鐨勭敤
        return root.getElementsByClassName(className);
    } else {
        var tag = root.getElementsByTagName(tagName); //鑾峰彇鎸囧畾鍏冪礌
        var tagAll = []; //鐢ㄤ簬瀛樺偍绗﹀悎鏉′欢鐨勫厓绱�
        for (var i = 0; i < tag.length; i++) { //閬嶅巻鑾峰緱鐨勫厓绱�
            for (var j = 0, n = tag[i].className.split(' '); j < n.length; j++) { //閬嶅巻姝ゅ厓绱犱腑鎵€鏈塩lass鐨勫€硷紝濡傛灉鍖呭惈鎸囧畾鐨勭被鍚嶏紝灏辫祴鍊肩粰tagnameAll
                if (n[j] == className) {
                    tagAll.push(tag[i]);
                    break;
                }
            }
        }
        return tagAll;
    }
}

function GetMuen() {
    setTimeout(function() {
        var user = getElementsByClassName('user');
        for (var i = 0; i < user.length; i++) {
            user[i].ind = i;
            $(user[i]).on('click', function() {
                var IndexId = this.id.substr(4, this.id.toString().length - 4);
                var nowHide = '.hide' + IndexId;
                var f = $(nowHide).is(':hidden');
                var nowArrow = $(this).children().find('img');
                if (f) {
                    $(nowHide).show(200);
                    $(nowArrow).css({
                        'transform': 'rotate(90deg)'
                    })
                };
                if (!f) {
                    $(nowHide).hide(200);
                    $(nowArrow).css({
                        'transform': 'rotate(0deg)'
                    })
                }
            });
        }
        $('.hide1 ul li ').click(function() {
            background('.hide1', this);
            sessionStorage.setItem('name', null)
        });

        $('.left_nav ').hover(function() {}),
            function() {
                var nowWid = $(this).width();
                if (nowWid != 140) {
                    $('.start-change').remove();
                    $('#only-frame').animate({
                        'width': wid,
                        'margin-left': '45px'
                    }, 0);
                }
            };
        $('.hide2 ul li ').hover(function() {
            var nowWid = $(this).width();
            var change = $(this).children()[1];
            var single = $(change).children()[0];
            var inner = $(change).children();
            var singleHeight = $(single).outerHeight();
            var num = inner.length;
            var hei = singleHeight * num;
            if (nowWid == 140) {
                $(change).animate({
                    height: hei
                }, 0);
            }
        }, function() {
            var nowWid = $(this).width();
            var outWid = $(window).width();
            var wid = outWid - 45;
            var change = $(this).children()[1];
            if (nowWid == 140) {
                $(change).animate({
                    height: 0
                }, 0)
            }
        });

        function background(x, y) {
            var hide1 = x + ' ul li';

            $(hide1).css({ 'background-color': '#fff' });

            $(y).css({ 'background-color': '#CDE6FF' });
            if ($(x).is(':hidden') == true) {
                $(hide1).css({ 'background-color': '#fff' });
            }
        }
        //瀵艰埅鍏ㄩ儴鏀惰捣
        $('.leftOuter').css('width', '140px');
        background('.hide2', '');
        $('.only-nav > ul li').animate({
            'width': '140px'
        }, 0);
        var outWid = $(window).width();
        var wid = outWid - 140;
        $('.bottom-outer').animate({
            'padding-left': '140px'

        }, 0)
        setTimeout(function() { $('.hide2').css('overflow-y', 'auto'); }, 0);

        function change() {
            $('.hide1 ul li').css({ 'background-color': '#fff' });
            $('.message-title').css({ 'background-color': '#CDE6FF' });
        }
        $(".PageHide").hide();
        $(".arrow2").attr("style", "transform: rotate(0deg);");
    }, 500);
}


function OnDivClick(obj) {
    var Mybtn = this.event.target.defaultValue;
    if (Mybtn == "纭") {
        clearCookies();
    }

}