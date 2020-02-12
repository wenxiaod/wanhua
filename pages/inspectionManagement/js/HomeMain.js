/// <reference path="jquery-1.7.1.min.js" />
/// <reference path="clientscripts/showBo.js" />
var host;
var compId = null;
$(function() {
    //LoadMenu();
    $("#TaskInfomation").fadeOut(30000);
    $("#imgUC,#div_UserId").click(function() {
        window.location.href = "http://i." + getPrimaryHost();
    });
});

function PageClick(obj) {
    var title = obj.innerText;
    var url = $(obj).attr("Mysrc").toString() + "/"; //最后加上斜杠是为了解决iframe src 自动添加数据的隐患
    var isExt = $('#tt').tabs('exists', title); //判断页签是否已经存在
    if (isExt) {
        $('#tt').tabs('select', title); //如果存在选中
        return;
    }
    $('#tt').tabs('add', { //添加页签
        title: title,
        content: createContent(url),
        closable: true
    });
}

function createContent(url) {
    var strHtml = "<iframe src='" + url.toString() + "' scrolling='no' frameborder='0' width='100%' height='100%'></iframe>";
    return strHtml;
}

//点击菜单效果
function PageMainStyle(obj) {
    var asd = event.target.nodeName;
    if (asd.indexOf("SPAN") < 0) {
        if ($(obj).children("ul").attr("style") != undefined) {
            if ($(obj).children("ul").attr("style").indexOf("display: none") >= 0) {
                $(obj).children("ul").show(100);
            } else {
                if ($(obj).children("ul").attr("style").indexOf("display: none") < 0) {
                    $(obj).children("ul").hide(100);
                }
            }
        } else {
            $(obj).children("ul").hide(100);
        }
    }
}

function MeunClick(obj) {
    //$(".PageHide li").css("background-color", "rgb(66, 79, 87)");
    $(obj).parents("li").css("background-color", "rgb(205,230,255)");
}



function LoadInfo() {
    $.ajax({
        type: "POST",
        data: "flag=GetLoginInfo",
        url: "Pages/HttpRequest/GetUserInfo.ashx",
        dataType: "text",
        error: function(xhr) {
            $("#ShowBolightBox").show();
            document.cookie = null;
            clearCookies();
            Showbo.Msg.confirm("通信异常,请重新登录!", function(e) {
                $("#ShowBolightBox").hide();
                window.sopTop.location.href = "http://pipe." + host + ".com:8090";
            });
            $("#ShowBolightBox").css("z-index", "999");
            $("#dvMsgBox").css("z-index", "1000");
        },
        success: function(data) {
            if (data == null || data == "") {
                $("#ShowBolightBox").show();
                document.cookie = null;
                clearCookies();
                Showbo.Msg.confirm("访问异常,请重新登录!", function(e) {
                    $("#ShowBolightBox").hide();
                    window.sopTop.location.href = "http://pipe." + host + ".com:8090";
                });
                $("#ShowBolightBox").css("z-index", "999");
                $("#dvMsgBox").css("z-index", "1000");
                return;
            }

            var datas = data.split(",");
            if (datas[0] == "" || datas[3] == "") {
                $("#ShowBolightBox").show();
                document.cookie = null;
                clearCookies();
                Showbo.Msg.confirm("访问异常,请重新登录!", function(e) {
                    $("#ShowBolightBox").hide();
                    window.sopTop.location.href = "http://pipe." + host + ".com:8090";
                });
                $("#ShowBolightBox").css("z-index", "999");
                $("#dvMsgBox").css("z-index", "1000");
                return;
            }
            var datas = data.split(",");
            $("#div_UserId").html(datas[0]);
            $("#th_LogTime").html(datas[1]);
            $("#th_LogIP").html(datas[2]);
            $("#lbUserName").html(datas[0]);
            $("#CompanyName").text(datas[4]);
            Logoinfo(datas[5]);
            compId = datas[3];
        }
    });
}

function Logoinfo(data) {
    var obj = $("#LogoClick");
    obj.attr({ "src": data, "style": "cursor: pointer; vertical-align: middle; margin-bottom: 6px;max-width:40px;max-height:40px;" });
    try {
        if (data.indexOf("img_sprites4.png") > 0)
            obj.css({ height: 73 });
    } catch (e) {}
}


function GetMuen() {
    $("#loading").show();
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
            if (nowWid != 175) {
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
        if (nowWid == 175) {
            $(change).animate({
                height: hei
            }, 0);
        }
    }, function() {
        var nowWid = $(this).width();
        var outWid = $(window).width();
        var wid = outWid - 45;
        var change = $(this).children()[1];
        if (nowWid == 175) {
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
    //导航全部收起
    $('.leftOuter').css('width', '175px');
    background('.hide2', '');
    $('.only-nav > ul li').animate({
        'width': '175px'
    }, 0);
    var outWid = $(window).width();
    var wid = outWid - 175;
    $('.bottom-outer').animate({
        'padding-left': '175px'

    }, 0)
    setTimeout(function() { $('.hide2').css('overflow-y', 'auto'); }, 0);

    function change() {
        $('.hide1 ul li').css({ 'background-color': '#fff' });
        $('.message-title').css({ 'background-color': '#CDE6FF' });
    }
    $(".PageHide").hide();
    $(".arrow2").attr("style", "transform: rotate(0deg);");
    $("#loading").hide();

}

function LoadMenu() {
    host = window.location.href;
    host = host.substr(host.indexOf(".") + 1, (host.length - host.indexOf(".") + 1));
    host = host.substr(0, host.indexOf(".com"));
    console.log(host);
    var redirectUrl = "http://work." + host + ".com"; //redirect url
    $.ajax({
        type: "POST",
        data: "flag=LoadMenu",
        url: "Pages/HttpRequest/PmsMng.ashx",
        dataType: "text",
        error: function(xhr) {
            $("#ShowBolightBox").show();
            Showbo.Msg.confirm("菜单加载失败，无权限访问!", function(e) {
                document.cookie = null;
                clearCookies();
                $("#ShowBolightBox").hide();
                window.sopTop.location.href = redirectUrl;
            });
            $("#ShowBolightBox").css("z-index", "999");
            $("#dvMsgBox").css("z-index", "1000");
        },
        success: function(data) {

            if (data.indexOf("404") >= 0 || data.indexOf("500") >= 0) {
                $("body").empty();
                $("body").html(data);
            } else {
                var usercookie = document.cookie;
                var ShowBolightBox = document.getElementById("only-frame").contentWindow.document.getElementById("ShowBolightBox");
                var dvMsgBox = document.getElementById("only-frame").contentWindow.document.getElementById("dvMsgBox");
                if (dvMsgBox != null && dvMsgBox != undefined && dvMsgBox != "") {
                    ShowBolightBox.remove();
                    dvMsgBox.remove();
                }
                if (data == "0") {
                    document.getElementById("only-frame").setAttribute("src", "");
                    $("#ShowBolightBox").show();
                    document.cookie = null;
                    clearCookies();
                    Showbo.Msg.confirm("菜单加载失败，无权限访问!", function(e) {
                        $("#ShowBolightBox").hide();
                        window.sopTop.location.href = redirectUrl;
                    });
                    $("#ShowBolightBox").css("z-index", "999");
                    $("#dvMsgBox").css("z-index", "1000");
                    return;
                } else if (data == "-1" || !data) {
                    document.getElementById("only-frame").setAttribute("src", "");
                    $("#ShowBolightBox").show();
                    document.cookie = null;
                    clearCookies();
                    Showbo.Msg.confirm("访问异常,请重新登录!", function(e) {
                        $("#ShowBolightBox").hide();
                        window.sopTop.location.href = redirectUrl;

                    });
                    $("#ShowBolightBox").css("z-index", "999");
                    $("#dvMsgBox").css("z-index", "1000");
                    return;
                } else if (data.indexOf("无权限访问") >= 0) {
                    document.getElementById("only-frame").setAttribute("src", "");
                    $("#ShowBolightBox").show();
                    document.cookie = null;
                    clearCookies();
                    Showbo.Msg.confirm("菜单加载失败，无权限访问!", function(e) {
                        $("#ShowBolightBox").hide();
                        window.sopTop.location.href = redirectUrl;
                    });
                    $("#ShowBolightBox").css("z-index", "999");
                    $("#dvMsgBox").css("z-index", "1000");
                    return;
                }
                $("#meNav").html(data);
                LoadInfo();
                GetMuen();
            }
        }
    });
}

//清除cookies
function clearCookies() {
    var hostname = window.location.hostname.substr(window.location.hostname.indexOf('.'), window.location.hostname.length - window.location.hostname.indexOf('.'))
    var doname = hostname; //.scadacc.com
    $.cookies.del("UserName", { domain: doname });
    $.cookies.del("TrueName", { domain: doname });
    $.cookies.del("ActiveKey", { domain: doname });
    $.cookies.del("LgDate", { domain: doname });
    $.cookies.del("LastIP", { domain: doname });
    $.cookies.del("CompanyId", { domain: doname });
    $.cookies.del("CompanyName", { domain: doname });
    $.cookies.del("Pop", { domain: doname });
    $.cookies.del("SSOToken", { domain: doname });
    $.cookies.del("SSOCurrentUser", { domain: doname });
    $.cookies.del("_cacheAuthors", { domain: doname });
    $.cookies.del("_cacheIntervals", { domain: doname });
    $.cookies.del("isEixt", { domain: doname });
}

function clearCookiesTwo() {
    $.cookies.del("UserName", { domain: "" });
    $.cookies.del("TrueName", { domain: "" });
    $.cookies.del("ActiveKey", { domain: "" });
    $.cookies.del("LgDate", { domain: "" });
    $.cookies.del("LastIP", { domain: "" });
    $.cookies.del("CompanyId", { domain: "" });
    $.cookies.del("CompanyName", { domain: "" });
    $.cookies.del("Pop", { domain: "" });
    $.cookies.del("SSOTimeOut", { domain: "" });
    $.cookies.del("SSOCurrentUser", { domain: "" });
    $.cookies.set("isEixt", "1", { domain: "" });
}

//function exitSystem(sel) {
//    layer.confirm('确认退出系统吗？', function () {
//        document.cookie = null;
//        host = window.location.href;
//        host = host.substr(host.indexOf(".") + 1, (host.length - host.indexOf(".") + 1));
//        host = host.substr(0, host.indexOf(".com"));
//        console.log(host);
//        clearCookies();
//        window.sopTop.location.href = "http://login.chengdurst.work:8090/Login.html?AppCode=Work&BackUrl=http%3a%2f%2fwork." + host + ".com%3a8090%2f&SSOTimeOut=600";
//    });



//$("#ShowBolightBox").show();
//layer.confirm("确认退出系统吗？", function (e) {
//    $("#ShowBolightBox").hide();
//    if (e == "yes") {
//        document.cookie = null;
//        clearCookies();
//        //window.sopTop.location.href = "http://work." + host + ".com:" + 8090;
//        window.sopTop.location.href = "http://login.wanhuarst.com:8090/Login.html?AppCode=Work&BackUrl=http%3a%2f%2fwork.wanhuarst.com%3a8090%2f&SSOTimeOut=600";
//    }
//});
//$("#ShowBolightBox").css("z-index", "999");
//$("#dvMsgBox").css("z-index", "1000");
//}

//F11全屏
function FnF11() {
    var docelem = document.getElementById('bodyScreen');
    if (docelem.requestFullscreen) {
        docelem.requestFullscreen();
    } else if (docelem.webkitRequestFullscreen) {
        docelem.webkitRequestFullscreen();
    } else if (docelem.mozRequestFullScreen) {
        docelem.mozRequestFullScreen();
    } else if (docelem.msRequestFullscreen) {
        docelem.msRequestFullscreen();
    }
}

//用户信息
function defaultUser(obj) {
    var meOffset = $(obj).offset();
    $("#meUserInfo").css("top", meOffset.top);
    $("#meUserInfo").css("left", meOffset.left - 50);
    $("#meUserInfo").mousemove(function() {
        $("#meUserInfo").css("top", meOffset.top);
    });
    $("#meUserInfo").mouseout(function() {
        $("#meUserInfo").css("top", "-378px");
    });
}

//用户信息
function defaultSys(obj) {
    objOffset = $(obj).offset();
    $("#div_sys").css({ "left": objOffset.left, "top": objOffset.top });
    $("#div_sys").show();
    $("#div_sys").mousemove(function() {
        $("#div_sys").show();
    });
    $("#div_sys").mouseout(function() {
        $("#div_sys").hide();
    });
    $("#div_sys a").each(function() {
        $(this).click(function() {
            $("#mePlace").html($(this).text());
        });
    });
}

//解决irame在IE下的缓存隐患
function refresh(e) {
    var tempUrl = e.href;
    if (tempUrl.indexOf('?') != -1) {
        tempUrl = tempUrl.subString(0, tempUrl.indexOf('?'));
    }
    e.href = e.href + "?random=" + Math.floor(Math.random() * 100000);
}

function setMenuImgs() {
    $("#meNav li").find("span:first").each(function(k, v) {
        //v.classList.remove("fn_gis_data");
        v.classList.add("fn_imgs");
        v.classList.add("fn_wh");
        v.classList.add("fn_menu_" + v.parentNode.getAttribute("tag"));
    });
}

function getPrimaryHost() {
    var url = window.location.host;
    var urlReg = /[^.]+\.(com.cn|com|net.cn|net|org.cn|org|gov.cn|gov|cn|mobi|me|info|name|biz|cc|tv|asia|hk|网络|公司|中国)(:?\d+)?/i;
    var domain = url.match(urlReg);
    return ((domain != null && domain.length > 0) ? domain[0] : url);
}