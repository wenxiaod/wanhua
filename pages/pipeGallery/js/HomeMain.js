// <reference path="jquery-1.7.1.min.js" />
// <reference path="jquery.cookies.2.2.0.min.js" />
// <reference path="clientscripts/showBo.js" />
var host;
$(function() {
    $("#content").css("height", $(window).height() - $("#header").height() + "px")
    LoadMenu();
    $("#pullOut").click(function() {
        exitSystem(1);
    })
    $("#meNav").delegate("li", "click", function() {
        //ClickMenu(this)
    })
    $('#companys').perfectScrollbar({
        wheelSpeed: 20,
        wheelPropagation: true
    });
    company.GetCompanyLogo();
    company.LoadCompanyId();
});

function PageClick(obj) {
    var title = obj.innerText;
    var url = $(obj).attr("Mysrc").toString() + "/"; //鏈€鍚庡姞涓婃枩鏉犳槸涓轰簡瑙ｅ喅iframe src 鑷姩娣诲姞鏁版嵁鐨勯棶棰�
    var isExt = $('#tt').tabs('exists', title); //鍒ゆ柇椤电鏄惁宸茬粡瀛樺湪
    if (isExt) {
        $('#tt').tabs('select', title); //濡傛灉瀛樺湪閫変腑
        return;
    }
    $('#tt').tabs('add', { //娣诲姞椤电
        title: title,
        content: createContent(url),
        closable: true
    });
}

function createContent(url) {
    var strHtml = "<iframe src='" + url.toString() + "' scrolling='no' frameborder='0' width='100%' height='100%'></iframe>";
    return strHtml;
}



function LoadInfo() {
    $.ajax({
        type: "POST",
        data: "flag=logInfo",
        url: "Pages/HttpRequest/UserInfoMgr.ashx",
        dataType: "text",
        error: function(xhr) {
            $("#ShowBolightBox").show();
            document.cookie = null;
            clearCookies();
            Showbo.Msg.confirm("閫氫俊寮傚父,璇烽噸鏂扮櫥褰�!", function(e) {
                $("#ShowBolightBox").hide();
                window.top.location.href = "http://" + document.location.host;
            });
            $("#ShowBolightBox").css("z-index", "999");
            $("#dvMsgBox").css("z-index", "1000");
        },
        success: function(data) {
            if (data == null || data == "") {
                $("#ShowBolightBox").show();
                document.cookie = null;
                clearCookies();
                Showbo.Msg.confirm("璁块棶寮傚父,璇烽噸鏂扮櫥褰�!", function(e) {
                    $("#ShowBolightBox").hide();
                    window.top.location.href = "http://" + document.location.host;
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
                Showbo.Msg.confirm("璁块棶寮傚父,璇烽噸鏂扮櫥褰�!", function(e) {
                    $("#ShowBolightBox").hide();
                    window.top.location.href = "http://" + document.location.host;
                });
                $("#ShowBolightBox").css("z-index", "999");
                $("#dvMsgBox").css("z-index", "1000");
                return;
            }
            var datas = data.split(",");
            $("#div_UserId").html(datas[0]);
            $("#div_UserId").attr("title", datas[0]);
            $("#selCompanyListDiv").css("right", $("#user").width() + $("#loginOut").width() + 15 * 3 + "px");
            $("#th_LogTime").html(datas[1]);
            $("#th_LogIP").html(datas[2]);
            $("#lbUserName").html(datas[0]);
            $("#CompanyName").text(datas[4]).attr("name", datas[3]).attr("title", datas[4]);

            compId = datas[3];
        }
    });
}

function LoadMenu() {
    $.ajax({
        type: "POST",
        data: "flag=GetMenu",
        url: "Pages/HttpRequest/PmsMgr.ashx",
        dataType: "text",
        error: function(xhr) {
            $("#ShowBolightBox").show();
            Showbo.Msg.confirm("登录信息过期，请重新登录！!", function(e) {
                document.cookie = null;
                clearCookies();
                $("#ShowBolightBox").hide();
                window.top.location.href = "http://" + document.location.host;
            });
            $("#ShowBolightBox").css("z-index", "999");
            $("#dvMsgBox").css("z-index", "1000");
        },
        success: function(data) {
            var usercookie = document.cookie;
            var ShowBolightBox = document.getElementById("only-frame").contentWindow.document.getElementById("ShowBolightBox");
            var dvMsgBox = document.getElementById("only-frame").contentWindow.document.getElementById("dvMsgBox");
            if (dvMsgBox != null && dvMsgBox != undefined && dvMsgBox != "") {
                ShowBolightBox.remove();
                dvMsgBox.remove();
            }
            // *********** data==1*******************
            if (data == "0") {
                document.getElementById("only-frame").setAttribute("src", "");
                $("#ShowBolightBox").show();
                document.cookie = null;
                clearCookies();
                Showbo.Msg.confirm("登录信息过期，请重新登录！", function(e) {
                    $("#ShowBolightBox").hide();
                    window.top.location.href = "http://" + document.location.host;
                });
                $("#ShowBolightBox").css("z-index", "999");
                $("#dvMsgBox").css("z-index", "1000");
                return;
            } else if (data.indexOf("鏃犳潈闄愯闂�") >= 0) {
                document.getElementById("only-frame").setAttribute("src", "");
                $("#ShowBolightBox").show();
                document.cookie = null;
                clearCookies();
                Showbo.Msg.confirm("鑿滃崟鍔犺浇澶辫触锛屾棤鏉冮檺璁块棶!", function(e) {
                    $("#ShowBolightBox").hide();
                    window.top.location.href = "http://" + document.location.host;
                });
                $("#ShowBolightBox").css("z-index", "999");
                $("#dvMsgBox").css("z-index", "1000");
                return;
            }
            data = JSON.parse(data);

            //2019-06-26 鏂板锛屾牴鎹笉鍚岀殑鎿嶄綔鍚敤涓嶅悓鑿滃崟
            {
                //鎼滅储opt = default 鎴栬€� opt = safe
                //濡傛灉涓嶅甫浠讳綍鍙傛暟鍒欏睆钄藉畨鍏ㄧ鐞�
                //濡傛灉 opt = safe锛屽垯浠呮樉绀哄畨鍏ㄧ鐞�
                let pattern = /^.*opt\s*=\s*(\w+).*$/g;
                let opt = location.search.match(pattern);
                if (opt && RegExp.$1 === 'safe') {
                    data = data.filter(p => p.MenuName && p.MenuName === '信息查询');
                    //璁剧疆榛樿椤甸潰
                    if (data.length > 0 && data[0].Childs.length > 0)
                        var param = getUrlParam("pgfxzy");
                    console.log(param);
                    if (param != null && param != '' && param.length > 0 && param != undefined) {
                        $("#only-frame").attr("src", data[0].Childs[0].OpenForm + "?pgfxzy=" + param);
                    } else {
                        $("#only-frame").attr("src", data[0].Childs[0].OpenForm);
                    }
                } else {
                    data = data.filter(p => p.MenuName !== '管网编辑');
                }
            }
            //$("#meNav").html(GetMuenHtml(data));
            $("#meNav").empty().append(GetNewMuenHtml(data));
            LoadInfo();

        }
    });
}



function GetNewMuenHtml(menuData) {
    /*宸﹁彍鍗曟爮鐨勫皬绠ご*/
    var imgJianTou1 = 'images/IndexImg/jiantou1.png';
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
        div.append('<i class="icon iconfont ' + imgUrl + '" ></i>');
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
                /*鐐瑰嚮浜岀骇瀛愯彍鍗曟樉绀哄瓧浣撻鑹插拰鑳屾櫙*/
                childDivListitem.click(function() {
                    if ($(this).css('color', '#252525')) {
                        $(this).css('color', '#252525').siblings().css('color', '#252525');
                        $(this).parent().parent().children('.fatherBox').children('i').css('color', '#064b98');
                        $(this).parent().parent().siblings().children().children('.childDivList').css('color', '#252525')
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
                        //if ($('iframe').attr('src') != item.OpenForm) {
                        $('#Right-box iframe').attr('src', item.OpenForm);
                        //  }
                    });
                })(item, childDivListitem, li, childBox, item.Childs[j]);
                childBox.append(childDivListitem);
            }
        }
        li.append(childBox);
        str.append(li);
        (function(item, li, childBox, div, str, hoverMenu) {
            div.click(function() {
                // if ($('iframe').attr('src') != item.OpenForm) {
                //$('iframe').attr('src', item.OpenForm);
                //  }
                $(".childBox").removeClass("show").addClass("hide");
                $(".menuHover").addClass("visibili");
                hoverMenu.removeClass("visibili");
                str.find("li").find(".activeVaried").removeAttr("style").removeClass("activeVaried");
                //div.css("background", "rgba(205,230,255,1)");
                div.addClass("activeVaried");
                //绉婚櫎鍏朵粬dom鐨勬牱寮�
                if (li.attr("isSelect")) {
                    childBox.removeClass("show").addClass("hide");
                    li.removeAttr("isSelect");
                } else {
                    childBox.addClass("show").removeClass("hide");
                    str.find("li").removeAttr("isSelect");
                    li.attr("isSelect", true);
                }
                var liDomList = str.find("li");
                /*鐐瑰嚮鐖禿iv鎹㈢澶�*/
                if ($('.activeVaried>.jiantou').attr('src') == 'images/IndexImg/jiantou1.png') {
                    $('.activeVaried>.jiantou').attr('src', 'images/IndexImg/jiantou2.png');
                    $(this).parent().siblings().children().children('.jiantou').attr('src', 'images/IndexImg/jiantou1.png');
                    $(this).parent().siblings().children().children('samp').css('color', '#252525');
                    $('.activeVaried>samp').css('color', '#064b98');
                    $(this).parent().siblings().children(".fatherBox").children("i").css('color', '#252525');
                } else if ($('.activeVaried>.jiantou').attr('src') == 'images/IndexImg/jiantou2.png') {
                    $('.jiantou').attr('src', 'images/IndexImg/jiantou1.png');
                    $(this).nextAll().children().css('color', '#252525');
                    $('.fatherBox>samp').css('color', '#010101');
                } else {
                    $(this).nextAll().children().css('color', '#064b98');
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




function GetMuenHtml(data) {
    var html = "";
    //PipeRelationShip22
    var setHtml_Child = function(child) {
        html += '<ul class="iai-headnav-subitems ant-menu ant-menu-root">'
        for (var i in child) {
            html += '<li class="ant-menu-item">' +
                '<a href="javascript:void(0)" name="' + (child[i]["OpenForm"].substring(1) == "/" ? child[i]["OpenForm"].substring(1) : child[i]["OpenForm"]) + '"><i class=""></i>' + child[i]["MenuName"] + '</a>' +
                '</li>'
        }
        html += '</ul>'
    }

    var setHtml = function() {
        for (var i in data) {
            html += '<li class="iai-headnav-item iai-headnav-hassub">' +
                ' <a href="javascript:void(0)" name="">' +
                '<i class="icon iconfont ' + data[i]["IconImageUrl"] + '"></i>' +
                ' <span>' + data[i]["MenuName"] + '<i class="iconfont icon-zhankai icon-sm"></i></span>' +
                '</a>'
            if (data[i]["Childs"] && data[i]["Childs"].length > 0)
                setHtml_Child(data[i]["Childs"])
            html += '</li>'
        }
    }
    setHtml();
    return html;
}

function ClickMenu(obj) {
    var url = $(obj).find("a").attr("name");
    if (url.length > 0) {
        $("#only-frame").attr("src", url);
        $("#meNav").find("li").removeClass("iai-headnav-item-selected");
        $(obj).parents("li:first").addClass("iai-headnav-item-selected");
    }
}

//娓呴櫎cookies
function clearCookies() {
    host = window.location.href;
    host = host.substr(host.indexOf(".") + 1, (host.length - host.indexOf(".") + 1));
    host = host.substr(0, host.indexOf(".com"));
    //var doname = "." + host + ".com"; //.scadacc.com
    //$.cookies.del("UserName", { domain: doname });
    //$.cookies.del("TrueName", { domain: doname });
    //$.cookies.del("ActiveKey", { domain: doname });
    //$.cookies.del("LgDate", { domain: doname });
    //$.cookies.del("LastIP", { domain: doname });
    //$.cookies.del("CompanyId", { domain: doname });
    //$.cookies.del("CompanyName", { domain: doname });
    //$.cookies.del("Pop", { domain: doname });
    //$.cookies.del("SSOToken", { domain: doname });
    //$.cookies.del("SSOCurrentUser", { domain: doname });
    //$.cookies.del("_cacheAuthors", { domain: doname });
    //$.cookies.del("_cacheIntervals", { domain: doname });
    //$.cookies.del("isEixt", { domain: doname });
    //$.cookies.del("CurrentCompanyId", { domain: doname });
    //$.cookies.del("CurrentCompanyName", { domain: doname });
    //$.cookies.del("MainComanyId", { domain: doname });
    var doname = location.hostname.substr(location.hostname.indexOf("."), (location.hostname.length - location.hostname.indexOf(".")));
    var $ = jaaulde.utils;
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
    window.top.location.href = location.origin;

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

function exitSystem(sel) {
    $("#ShowBolightBox").show();
    Showbo.Msg.confirm("纭閫€鍑虹郴缁熷悧锛�", function(e) {
        $("#ShowBolightBox").hide();
        if (e == "yes") {
            document.cookie = null;
            clearCookies();
            clearCookiesTwo();
            window.location.reload();
            localStorage.clear();
        }
    });
    $("#ShowBolightBox").css("z-index", "999");
    $("#dvMsgBox").css("z-index", "1000");
}

//F11鍏ㄥ睆
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

//鐢ㄦ埛淇℃伅
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

//鐢ㄦ埛淇℃伅
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

//瑙ｅ喅irame鍦↖E涓嬬殑缂撳瓨闂
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
    var urlReg = /[^.]+\.(com.cn|com|net.cn|net|org.cn|org|gov.cn|gov|cn|mobi|me|info|name|biz|cc|tv|asia|hk|缃戠粶|鍏徃|涓浗)(:?\d+)?/i;
    var domain = url.match(urlReg);
    return ((domain != null && domain.length > 0) ? domain[0] : url);
}

/*-------------鍏徃鏁版嵁鍔犺浇浠ュ強鍔熻兘瀹炵幇----------------*/
var company = function() {
    return {
        ///鍔犺浇鍏徃鏁版嵁
        LoadCompanyId: function(cmpId) {
            this.fnGetCompanyList(null, function(data) {
                var companys = [];
                if (data.length > 0) {
                    var html = ''
                    if (!$("#conpany_select") || $("#conpany_select").length <= 0) {
                        html += '<li class="item-company" id="conpany_select">' +
                            '<input id="conpany_select_input" type="text" class="company-search" placeholder="璇疯緭鍏ュ叕鍙稿悕绉�"/>' +
                            '</li>'
                    }
                    for (var i in data) {
                        companys.push(data[i].CompanyName);
                        html += '<li class="ant-menu-item"><a href="#" name="' + data[i].CompanyId + '" title="' + data[i].CompanyName + '">' + data[i].CompanyName + '</a></li>'
                    }
                    $("#companys").find("li:gt(0)").remove();
                    $("#companys").append(html);

                }
                $("#companys").find("li").unbind("click").click(function() {
                    if ($(this).attr("id") != "conpany_select")
                        company.fnSetCompanyId(this);
                });

                //鍏徃绛涢€夊姛鑳�
                var string = "";
                var companys = ["鎴戞槸鍏紡鐖卞悍鍚堥€傜殑鍗″彿鏄崱涓婄湅", "鎴戞槸鍏徃浜�", "鎴戞槸鍏徃涓�", "鎴戞槸鍏徃鍥�", "鎴戞槸鍏徃浜�", "鎴戞槸鍏徃鍏�", "鎴戞槸鍏徃涓�", "鎴戞槸鍏徃鍏�", "鎴戞槸鍏徃涔�", "鎴戞槸鍏徃鍗�"];

                //瀵规悳绱㈡娣诲姞鐩戝惉浜嬩欢
                $("#conpany_select_input").bind("input propertychange change", function(event) {
                    string = $(this).val();
                    if (string == "") {
                        $(".company li.ant-menu-item").stop().show()
                    } else {
                        //灏嗛櫎鎼滅储妗嗕互澶栫殑li閮介殣钘�
                        $(".company li.ant-menu-item").stop().hide().filter(":contains('" + (string) + "')").show(); //鎵惧埌鍖呭惈瀛楃涓瞫tring鐨刲i鏄剧ず鍑烘潵
                    }

                    if ($(".company li.ant-menu-item").stop().hide().filter(":contains('" + (string) + "')").show().length == 0 && string != 0) {
                        var html = '<li class="ant-menu-item no-company"><a href="#" target="">鏈绱㈠埌璇ュ叕鍙�</a></li>';
                        $(".company").append(html);
                    } else if ($(".company li.ant-menu-item").stop().hide().filter(":contains('" + (string) + "')").show().length == 0 && string == 0) {
                        $(".no-company").remove();
                        $(".company li.ant-menu-item").stop().show();
                    } else {
                        $(".no-company").remove();
                    }
                });
            })

        },
        fnGetCompanyList: function(cmpId, callback) {
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/Pages/HttpRequest/DeviceMgr.ashx',
                data: {
                    opt: "GetCompanyList",
                    CompanyId: cmpId
                },
                success: function(back) {
                    if (typeof callback == 'function')
                        callback(back);


                },
                error: function(e) {
                    console.log(e);
                }
            });
        },
        fnSetCompanyId: function(obj) {
            var id = $(obj).find("a").attr("name");
            var name = $(obj).find("a").text();
            if (id != $("#CompanyName").attr("name")) {
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/Pages/HttpRequest/DeviceMgr.ashx',
                    data: {
                        opt: "ReplaceCompany",
                        newcmpId: id,
                        newcmpName: name
                    },
                    success: function(back) {
                        window.location.reload();
                    }
                })
            }
        },
        GetCompanyLogo: function() {
            $.ajax({
                type: 'Post',
                dataType: 'text',
                url: '/Pages/HttpRequest/DeviceMgr.ashx',
                data: {
                    opt: "GetCompanyLogo"
                },
                success: function(back) {
                    if (back != "")
                        $("#LogoClick").attr("src", back);
                    else
                        $("#LogoClick").attr("src", "../../Images/main/logo.png");
                }
            })
        },
    }
}();


function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //鏋勯€犱竴涓惈鏈夌洰鏍囧弬鏁扮殑姝ｅ垯琛ㄨ揪寮忓璞�
    var r = window.location.search.substr(1).match(reg); //鍖归厤鐩爣鍙傛暟
    if (r != null) return unescape(r[2]);
    return null; //杩斿洖鍙傛暟鍊�
}