$(function() {
        $.ajax({
            type: "POST", //提交方式
            url: "/Home/LoadMenuList", //路径
            success: function(result) { //返回数据根据结果进行相应的处理
                var str = loadMenu(result);
                $("#menuLeft").empty().append(str);
            }
        });
        var g = $(window).height(); // 屏幕高度
        //全屏/退出全屏

        $('#fullscreen').on('click', function() {
            $(this).attr("isScreen") == "0" ? enterfullscreen() || iefull() : exitfullscreen();
            if ($(this).attr("isScreen") == "0") {
                $(this).attr("isScreen", "1");
                $(this).text("退出全屏");
            } else {
                $(this).attr("isScreen", "0");
                $(this).text("全屏显示");
            }


        });
        //修改密码
        $("#btnChangePassWord").click(function() {
            submitPassword();
        });
        $(".outBtn").click(function() {
            $.ajax({
                type: "Get", //提交方式
                url: "/Home/Logout", //路径
                success: function(result) { //返回数据根据结果进行相应的处理
                    window.top.location = window.location;
                }
            });
        });
        $("#Use").click(function() {
            window.location = 'http://xitongguanwang.whchem.com:8090/';
        });
    })
    //加装菜单方法
var loadMenu = function(menuData) {
        /*左菜单栏的小箭头*/
        var imgJianTou1 = '../Content/Images/jiantou1.png';
        var str = $("<ul></ul>");
        for (var i = 0; i < menuData.length; i++) {
            var item = menuData[i];
            if (item.TreeDepth == 0) {
                str.addClass("show");
            } else {
                str.addClass("hide");
            }
            var li = $("<li class='varied'></li>");
            var hoverMenu = $("<div class='menuHover visibili'><div>");
            li.append(hoverMenu);
            var div = $("<div class='fatherBox'></div>");
            var imgUrl = item.IconImageUrl;
            div.append('<i class="' + imgUrl + '" ></i>');
            div.append('<samp class="p-l-10 ZiTiSize">' + item.MenuName + '</samp>');
            if (item.Childs.length > 0) {
                div.append('<img class=jiantou src="' + imgJianTou1 + '" />');
            } else {
                div.append('<img class=jiantou style="display:none" src="" />');
            }
            li.append(div);
            var childBox = $('<div class="childBox hide"></div>');
            if (item.Childs.length > 0) {
                for (var j = 0; j < item.Childs.length; j++) {
                    var childDivListitem = $("<div class='childDivList' style='letter-spacing:1px'>" + item.Childs[j].MenuName + "</div>");
                    /*点击二级子菜单显示字体颜色和背景*/
                    childDivListitem.click(function() {
                        if ($(this).css('color', '#252525')) {
                            $(this).css('color', '#252525').siblings().css('color', '#252525');
                            //$(this).parent().css('color', '#064b98');
                            $(this).parent().parent().children('.fatherBox').children('i').css('color', '#064b98');
                            $(this).parent().parent().children('.fatherBox').children('samp').css('color', '#064b98');
                            $(this).parent().parent().siblings().children('.childBox').children('.childDivList').css('color', '#252525')
                        }
                    });

                    (function(data, dom, parentDom, childBox, item) {
                        dom.hover(function() {
                            if (parentDom.attr("isSelect")) {
                                return;
                            }
                            parentDom.addClass("activeVaried");
                            dom.addClass("activeChildDivList");

                        }, function() {
                            if (parentDom.attr("isSelect")) {
                                return;
                            }
                            parentDom.removeClass("activeVaried");
                            dom.removeClass("activeChildDivList");
                        });
                        dom.click(function() {
                            $("#menuLeft").find("li").siblings().removeAttr("isSelect").removeClass("activeVaried");
                            $(".childBox").removeClass("show").addClass("hide");
                            $(".sanJiaoDiv").removeClass("show").addClass("hide");
                            childBox.addClass("show").removeClass("hide");
                            $(".activeChildDivList").removeClass("activeChildDivList");
                            parentDom.attr("isSelect", true);
                            parentDom.addClass("activeVaried");
                            dom.addClass("activeChildDivList");
                            if (item.OpenForm && $('iframe').attr('src') != item.OpenForm) {
                                $('iframe').attr('src', item.OpenForm);
                            }
                        });
                    })(item, childDivListitem, li, childBox, item.Childs[j]);
                    childBox.append(childDivListitem);
                }
            }
            li.append(childBox);
            str.append(li);
            (function(item, li, childBox, div, str, hoverMenu) {
                div.click(function() {
                    if (item.OpenForm && $('iframe').attr('src') != item.OpenForm) {
                        $('iframe').attr('src', item.OpenForm);
                    }
                    $(".childBox").removeClass("show").addClass("hide");
                    $(".menuHover").addClass("visibili");
                    hoverMenu.removeClass("visibili");
                    str.find("li").find(".activeVaried").removeAttr("style").removeClass("activeVaried");
                    div.css("color", "rgb(6, 75, 152)");
                    div.addClass("activeVaried");
                    //移除其他dom的样式
                    if (li.attr("isSelect")) {
                        childBox.removeClass("show").addClass("hide");
                        li.removeAttr("isSelect");
                    } else {
                        childBox.addClass("show").removeClass("hide");
                        str.find("li").removeAttr("isSelect");
                        li.attr("isSelect", true);
                    }
                    var liDomList = str.find("li");
                    /*点击父div换箭头*/
                    if ($('.activeVaried>.jiantou').attr('src') == '../Content/Images/jiantou1.png') {
                        $('.activeVaried>.jiantou').attr('src', '../Content/Images/jiantou2.png');
                        $(this).parent().siblings().children().children('.jiantou').attr('src', '../Content/Images/jiantou1.png');
                        $(this).parent().siblings().children().children('samp').css('color', '#252525');
                        $('.activeVaried>samp').css('color', '#064b98');
                        $(this).parent().siblings().children(".fatherBox").children("i").css('color', '#252525');
                    } else if ($('.activeVaried>.jiantou').attr('src') == '../Content/Images/jiantou2.png') {
                        $('.jiantou').attr('src', '../Content/Images/jiantou1.png');
                        //$(this).nextAll().children().css('color', '#064b98');
                        $('.fatherBox>samp').css('color', '#252525');
                    } else {
                        $(this).nextAll().children().css('color', '#252525');
                        $('.fatherBox>samp').css('color', '#252525');
                    }


                });
                li.click(function() {
                    div.addClass("activeVaried");
                }, function() {
                    if (li.attr("isSelect")) {
                        return;
                    }
                    div.removeClass("activeVaried");
                    div.removeAttr("style");
                });
            })(item, li, childBox, div, str, hoverMenu);
        }
        return str;
    }
    //全屏
function enterfullscreen() {
    var el = document.documentElement;
    var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    if (typeof rfs != "undefined" && rfs) {
        rfs.call(el);
    };
    return;
}
//退出全屏
function exitfullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
    if (typeof cfs != "undefined" && cfs) {
        cfs.call(el);
    }
}
//ie低版本的全屏，退出全屏都这个方法
function iefull() {
    var el = document.documentElement;
    var rfs = el.msRequestFullScreen;
    if (typeof window.ActiveXObject != "undefined") {
        //这的方法 模拟f11键，使浏览器全屏
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript != null) {
            wscript.SendKeys("{F11}");
        }
    }
}
//提交密码修改方法
var submitPassword = function() {
    var old = $("#old-pwd").val();
    var news = $("#new-pwd").val();
    var newsT = $("#q-pwd").val();
    //修改前验证
    if (old == "") {
        showErrMsg("请输入原密码！");
        return false;
    }
    if (news == "") {
        showErrMsg("请输入新密码！");
        return false;
    } else {
        if (!(/^[A-Za-z0-9]{6,14}$/.test(news))) {
            showErrMsg("请输入6-14位包含数字、字母的密码！");
            return false;
        }
    }
    if (newsT == "") {
        showErrMsg("请输入确认密码！");
        return false;
    } else {
        if (!(/^[A-Za-z0-9]{6,14}$/.test(newsT))) {
            showErrMsg("请输入6-14位包含数字、字母的确认密码！");
            return false;
        }
    }
    if ($("#new-pwd").val() != $("#q-pwd").val()) {
        $("#q-pwd").val("");
        showErrMsg("两次输入的密码不一致,请重新输入密码。");
        return false;
    }
    //执行密码修改
    $.ajax({
        type: 'POST',
        url: "/Home/SubmitUpdatePassword",
        data: { oldPwd: $("#old-pwd").val(), newPwd: $("#new-pwd").val() },
        async: true,
        dataType: "json",
        success: function(data) {
            if (data && data.Success) {
                showSuccessMsg("用户密码修改成功。");
                $("#pwd-modal").modal("hide");
            } else {
                showErrMsg("用户密码修改失败,请重试");
                return false;
            }
        }
    });
};
//错误信息提示框
function showErrMsg(msg) {
    $(".errorInfo").html(msg);
    $(".errorInfo").show();
    setTimeout('$(".errorInfo").fadeOut()', 1500);
};
//成功信息提示框
function showSuccessMsg(msg) {
    $(".succeedInfo").html(msg);
    $(".succeedInfo").show();
    setTimeout('$(".succeedInfo").fadeOut()', 1500);
};


///*主体 clac自适应高度*/
//var isIE = function(ver) {
//    var b = document.createElement('b')
//    b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->'
//    return b.getElementsByTagName('i').length === 1
//}
//var ie = isIE();
//if (ie) {
//    $('.downBox').css('height', '100%').css('height', '-=60px');
//$('#Right-box').css('width', '100%').css('width', '-=145px');


/*主体右边自适应宽度*/

//$('#Right-box').css('height', '100%').css('height', '-=0px');
//$('＃Right-box').css({'width':'calc(100%-100px)'});


var eventList = [];
//记得加载jquery
//作者：yanue
//使用参数：1.标题，2.链接地址，3.内容简介
$(function() {
    var param = getUrlParam("pzytz");
    console.log(param);
    if (param != null && param != '' && param.length > 0 && param != undefined) {
        $('iframe').attr('src', "/event/Index?pzytz=" + param);
    }
    $("#popMore").click(function() {
        $('iframe').attr('src', "/event/Index");
    });
});

function GetEventData() {
    $.ajax({
        type: "POST", //提交方式
        url: "/Event/GetMobileEventData", //路径
        success: function(result) { //返回数据根据结果进行相应的处理
            if (result && result.result && result.result[0]) {
                console.log(result.result[0].Id);
                if (result.result.length > 0) {
                    tip(result.result[0].Title, "/Event/EditEventPage?row=" + result.result[0].Id + "&type=confirm");
                }
            }
        }
    });
}

function tip(title, titlehref, content) {
    var pop = new Pop(title, titlehref, content, t1, $('iframe'));
}
var t1 = setInterval(GetEventData, 60000);


function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}