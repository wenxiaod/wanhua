$(function() {
    var userAgent = navigator.userAgent;
    if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/9./i) == '9.') {
        console.log("IE9");
        var menuRow = $('.menu-row').width();
        $('.item-auto').css("min-width", (menuRow - 35) * 100 / (3 * menuRow) + '%');
        var smallW = $('.small').width();
        //$('.small-long').css("min-width", (menuRow - smallW-30)*100/(3*(menuRow - smallW)) + "%");
    }
    ChangeFullScreen(); //绑定全屏事件
    lodaMenu();
});

function custom_close() {
    $.ajax({
        type: "Post", //提交方式
        url: "/Home/Logout", //路径
        success: function(result) { //返回数据根据结果进行相应的处理
            window.location = window.location;
        }
    });
}

$("#MessageList").click(function() {
    window.open("http://msg.xitongguanwang.whchem.com:8090/", "_self");
});


//菜单显示控制
function lodaMenu() {
    $.ajax({
        type: "post",
        async: false,
        url: "/Home/HomePermission",
        success: function(result) {
            var obj = $.parseJSON(result);
            $("#userName").html(obj.UserName);
            $.each(obj.DomainInfoDTOList, function(i, v) {
                var model = v.Model;
                //$("#" + model.Id).text(model.Name);//绑定系统名称
                //有权限的场合需要更改图片背景样式
                if (v.IsAvailable == true) {
                    $("#" + model.Id).attr("class", "menu-row-title");
                    $("#" + model.Id).parents("div").addClass("menu-hover");
                    var strName = model.Id.toUpperCase();
                    if (strName == "PIPE".toUpperCase()) {
                        $("#" + model.Id).siblings("img").attr("src", "../../images/WanHuaImg/guanlang.png");
                        $("#" + model.Id).attr("data-Url", model.BackUrl);
                    } else if (strName == "DXPIPE".toUpperCase()) {
                        $("#" + model.Id).siblings("img").attr("src", "../../images/WanHuaImg/guanwang.png");
                        $("#" + model.Id).attr("data-Url", model.BackUrl);
                    } else if (strName == "Work".toUpperCase()) {
                        $("#" + model.Id).siblings("img").attr("src", "../../images/WanHuaImg/xunjian.png");
                        $("#" + model.Id).attr("data-Url", model.BackUrl);
                    } else if (strName == "OSS".toUpperCase()) {
                        $("#" + model.Id).siblings("img").attr("src", "../../images/WanHuaImg/wenjian.png");
                        $("#" + model.Id).attr("data-Url", model.BackUrl);
                    } else if (strName == "MSC".toUpperCase()) {
                        $("#" + model.Id).siblings("img").attr("src", "../../images/WanHuaImg/xiaoxi.png");
                        $("#" + model.Id).attr("data-Url", model.BackUrl);
                    } else if (strName == "GAS".toUpperCase()) {
                        $("#" + model.Id).siblings("img").attr("src", "../../images/WanHuaImg/shuju.png");
                        $("#" + model.Id).attr("data-Url", model.BackUrl);
                    } else if (strName == "PMS".toUpperCase()) {
                        $("#" + model.Id).siblings("img").attr("src", "../../images/WanHuaImg/yonghu.png");
                        $("#" + model.Id).attr("data-Url", model.BackUrl);
                    } else if (strName == "EMG".toUpperCase()) {
                        $("#" + model.Id).siblings("img").attr("src", "../../images/WanHuaImg/yingji.png");
                        $("#" + model.Id).attr("data-Url", model.BackUrl);
                    } else if (strName == "J_Log".toUpperCase()) {
                        $("#" + model.Id).siblings("img").attr("src", "../../images/WanHuaImg/rizhi.png");
                        $("#" + model.Id).attr("data-Url", model.BackUrl);
                    } else if (strName == "PortalTwo".toUpperCase()) {
                        $("#" + model.Id).siblings("img").attr("src", "../../images/WanHuaImg/daping.png");
                        $("#" + model.Id).attr("data-Url", model.BackUrl);
                    } else if (strName == "Main".toUpperCase()) {
                        $("#" + model.Id).siblings("img").attr("src", "../../images/WanHuaImg/daping.png");
                    }
                } else {
                    $("#" + model.Id).attr("class", "menu-lg-font2");
                    $("#" + model.Id).parent().css({ "background-color": "#e8e8e8" });
                    $("#" + model.Id).parents("div").removeClass("menu-hover");
                    var strName = model.Id.toUpperCase();
                    if (strName == "PIPE".toUpperCase()) {
                        $("#" + model.Id).siblings("img").attr("src", "../../images/WanHuaImg/guanlang2.png");
                    } else if (strName == "DXPIPE".toUpperCase()) {
                        $("#" + model.Id).siblings("img").attr("src", "../../images/WanHuaImg/guanwang2.png");
                    } else if (strName == "Work".toUpperCase()) {
                        $("#" + model.Id).siblings("img").attr("src", "../../images/WanHuaImg/xunjian2.png");
                    } else if (strName == "OSS".toUpperCase()) {
                        $("#" + model.Id).attr("src", "../../images/WanHuaImg/wenjian2.png");
                    } else if (strName == "MSC".toUpperCase()) {
                        $("#" + model.Id).attr("src", "../../images/WanHuaImg/xiaoxi2.png");
                    } else if (strName == "GAS".toUpperCase()) {
                        $("#" + model.Id).siblings("img").attr("src", "../../images/WanHuaImg/shuju2.png");
                    } else if (strName == "PMS".toUpperCase()) {
                        $("#" + model.Id).attr("src", "../../images/WanHuaImg/yonghu2.png");
                    } else if (strName == "EMG".toUpperCase()) {
                        $("#" + model.Id).siblings("img").attr("src", "../../images/WanHuaImg/yingji2.png");
                    } else if (strName == "J_Log".toUpperCase()) {
                        $("#" + model.Id).attr("src", "../../images/WanHuaImg/rizhi2.png");
                    } else if (strName == "PortalTwo".toUpperCase()) {
                        $("#" + model.Id).siblings("img").attr("src", "../../images/WanHuaImg/daping2.png");
                    } else if (strName == "Main".toUpperCase()) {
                        $("#" + model.Id).siblings("img").attr("src", "../../images/WanHuaImg/daping2.png");
                    }
                }
            })
        }
    });
}

function OpenWindow(obj) {
    var Url = $(obj).children("div").attr('data-url');
    if (typeof(Url) != "undefined" && Url != "http://xitongguanwang.whchem.com:8090/Wanhua/WanHuaBigScreen") {
        window.open(Url, "_self");
    } else if (Url == "http://xitongguanwang.whchem.com:8090/Wanhua/WanHuaBigScreen") {
        window.open(Url);
    }
}

function OpenWindow2(obj) {
    var Url = $(obj).children("img").attr('data-url');
    if (typeof(Url) != "undefined") {
        window.open(Url, "_self");
    }
}

function OpenWindow3() {
    window.open("http://xitongguanwang.whchem.com:8090/Wanhua/MainNew");
    //window.open("Main");
}
//控制全屏
function ChangeFullScreen() {
    var a = 0;
    $('#fullscreen').on('click', function() {
        a++;
        a % 2 == 1 ? enterfullscreen() || iefull() : exitfullscreen();
    });

}

//全屏
function enterfullscreen() {
    $("#fullscreen").text("退出全屏");
    var el = document.documentElement;
    var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    if (typeof rfs != "undefined" && rfs) {
        rfs.call(el);
    };
    return;
}
//退出全屏
function exitfullscreen() {
    $("#fullscreen").text("全屏显示");
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
    $("#fullscreen").text("退出全屏");
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