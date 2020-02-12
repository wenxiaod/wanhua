(() => {
    var result = location.search.match(new RegExp("[\?\&]CDtuId=([^\&]+)", "i"))
    if (result && result.length > 1) {
        $.cookies.set("CDtuId", result[1])
        $.cookies.set("MenuId", result[1])
    }
})();
//用户中心
function SetUse() {
    window.location = 'http://xitongguanwang.whchem.com:8090';
}
//window.onbeforeunload = function () {
//    //return "确认关闭系统?";
//    var    n    =    window.event.screenX    -    window.screenLeft;
//    var    b    =    n    >    document.documentElement.scrollWidth-20;
//    if(b    &&    window.event.clientY    <   0    ||    window.event.altKey)
//    {
//        alert("是关闭而非刷新");
//        return  "是否关闭？";
//    }else{
//        alert("是刷新而非关闭");
//    }
//}

var host = host = window.location.href;
host = host.substr(host.indexOf(".") + 1, (host.length - host.indexOf(".") + 1));
host = host.substr(0, host.indexOf(".com"));
var doname = "." + host + ".com"; //.scadacc.com
function LoginOut() {

    ClearCookies();
    //var url= location.search;
    //var arr=url.split('?');
    //if(arr.length<=1)
    //    window.location.href="/home/logout";
    //else
    //    window.location.href="/home/logout?"+arr[1];
    window.top.location.href = location.origin;
}


function ClearCookies() {
    var doname = "." + host + ".com"; //.scadacc.com
    $.cookies.del("UserName", {
        domain: doname
    });
    $.cookies.del("TrueName", {
        domain: doname
    });
    $.cookies.del("ActiveKey", {
        domain: doname
    });
    $.cookies.del("LgDate", {
        domain: doname
    });
    $.cookies.del("LastIP", {
        domain: doname
    });
    $.cookies.del("CompanyId", {
        domain: doname
    });
    $.cookies.del("CompanyName", {
        domain: doname
    });
    $.cookies.del("Pop", {
        domain: doname
    });
    $.cookies.del("SSOToken", {
        domain: doname
    });
    $.cookies.del("SSOCurrentUser", {
        domain: doname
    });
    $.cookies.del("_cacheAuthors", {
        domain: doname
    });
    $.cookies.del("_cacheIntervals", {
        domain: doname
    });
    $.cookies.del("isEixt", {
        domain: doname
    });
    $.cookies.del("CurrentCompanyId");
    $.cookies.del("CurrentCompanyName");
    $.cookies.del("ChoseType");
    $.cookies.del("ChoseTypeName");
}

var app = new Vue({
    el: '#vueapp',
    data: {
        isCheck: false,
        Datas: [],
        badgeCount: 0, //状态为未查看的报警数量
    },
    methods: {
        onlyalarm: function(res) {


            if (app.badgeCount > 0) {
                //$("#alarmOne").hide();
                //$("#alarmOne").show();
                //$("#alarmTwo").hide();
                //$("#alarmTwo").show();

                //var music = document.getElementById("alarmTwo");

                //if(music.paused){music.play();
                //    $("#alarmTwo").removeClass("pause").addClass("play");
                //}else{music.pause();
                //    $("#alarmTwo").removeClass("play").addClass("pause");
                //}

            }


        },
        binddata: function(res) {

            app.Datas = res.data;
            app.badgeCount = res.badgecount;

        },
        refresh: function() {
            var $vuerefer = $("#vueapp");
            var selector = ".alarm-popup-time-header li.current";
            var param = {
                dtFrom: $(selector).attr("name") + ' 00:00:00',
                dtTo: $(selector).attr("name") + ' 23:59:59'
            };
            if (!$vuerefer.hasClass("alarm-popup-opened")) {
                var selector = ".alarm-popup-time-header li[name=" + new Date().Format("yyyy-MM-dd") + "]";
                $(selector).addClass("current").siblings().removeClass("current");
            }
            $.ajax.post('../Home/GetCurrentDayAlarm', param, function(res) {
                    app.binddata(res);
                    app.onlyalarm(res);
                }, function() {
                    $.message.showError("网络异常或请求数据超时!");
                })
                //var $vuerefer = $("#vueapp");
                //var param = {dtFrom:new Date().addSeconds(-130).Format("yyyy-MM-dd hh:mm:ss"),dtTo:new Date().addSeconds(60).Format("yyyy-MM-dd hh:mm:ss")};
                //$.ajax.post('../Home/GetCurrentDayAlarm', param, function (res) {
                //    //判断当前右侧是否打开
                //    if($vuerefer.hasClass("alarm-popup-opened")){
                //        var selector = ".alarm-popup-time-header li.current";
                //        if($(selector).attr("name")==new Date().Format("yyyy-MM-dd"))
                //        {
                //            app.binddata(res);
                //        }
                //    }
                //    else{

            //        app.binddata(res);
            //        var selector = ".alarm-popup-time-header li[name=" + new Date().Format("yyyy-MM-dd") + "]";
            //        $(selector).addClass("current").siblings().removeClass("current");
            //    }

            //    app.onlyalarm(res);
            //}, function () {
            //    $.message.showError("网络异常或请求数据超时!");
            //});
        },
        get: function(e) {
            if ($(e.target).hasClass("anticon-ellipsis")) {
                app.Datas = [];
                $('.iai-headnav .iai-headnav-item,.ant-menu-item').find('a[href="/alert/search"]').parent().click();
                $('.alarm-popup-title').click();
            } else {
                $(e.target).addClass("current").siblings().removeClass("current");
                var param = {
                    dtFrom: $(e.target).attr("name"),
                    dtTo: new Date($(e.target).attr("name")).addDays(1).Format("yyyy-MM-dd")
                };
                $.ajax.post('../Home/GetCurrentDayAlarm', param, function(res) {

                    app.binddata(res);
                    app.onlyalarm(res);

                }, function() {
                    $.message.showError("网络异常或请求数据超时!");
                });
            }
        },
        changealertstatus: function(data, index, Dtuid, DtuName) {
            var $ul = null;
            try {
                $ul = sopTop.$(".iai-headnav");
            } catch (e) {
                $ul = $(".iai-headnav");
            }
            var liobj = $($ul).find(".iai-headnav-item-selected");
            var aObj = $(liobj[0]).find('a');
            layer.confirm('确认将该报警信息上传到应急系统？', {
                btn: ['确定', '取消'] //按钮
            }, function() {
                var elm = $(event.target);
                $.post('../Alert/AddEvent', {
                    AlertId: data.Id
                }, function(dataa) {

                    dataa = JSON.parse(dataa);
                    if (dataa.ResponseData) {

                        $.ajax.post('../Home/ModifyDataReadById', {
                            AlertId: data.Id
                        }, function(res) {
                            data.AlertStatusDesc = 2;
                            data.AlertState = "已查看";
                            app.badgeCount = app.badgeCount - 1;
                            app.Datas[index] = data;
                            if (eval(res) == true) {
                                layer.msg("报警已确认! 应急数据上传成功", {
                                    icon: 1
                                });
                            } else {
                                layer.msg("报警确认失败! 应急数据上传成功", {
                                    icon: 2
                                });
                            }

                        }, function() {
                            $.message.showError("网络异常或请求数据超时!");
                        });
                    } else {
                        layer.msg("应急数据上传失败！", {
                            icon: 2
                        });
                    }
                });
                if (aObj.length == 1) {
                    href = $(aObj[0]).attr('href');
                    if ('/alert/search' == href) {
                        $.cookies.set("ChoseType", EnumChoseType.Site, {
                            hoursToLive: 10000,
                            secure: false
                        });
                        $.cookies.set("CDtuId", Dtuid, {
                            hoursToLive: 10000,
                            secure: false
                        });
                        $.cookies.set("MenuId", Dtuid, {
                            hoursToLive: 10000,
                            secure: false
                        });
                        $.cookies.set("ChoseTypeName", DtuName, {
                            hoursToLive: 10000,
                            secure: false
                        });
                        $("#sildeMenu").html("");
                        createMenu();
                        window.frames[0].document.location.href = "/alert/Search?AlertId=" + data.Id;
                    }
                }
            }, function() {
                var elm = $(event.target);
                $.ajax.post('../Home/ModifyDataReadById', {
                    AlertId: data.Id
                }, function(res) {
                    if (eval(res) == true) {
                        data.AlertStatusDesc = 2;
                        data.AlertState = "已查看";
                        app.badgeCount = app.badgeCount - 1;
                        app.Datas[index] = data;
                        layer.msg("报警已确认!", {
                            icon: 1
                        });
                    } else {
                        layer.msg("报警确认失败！", {
                            icon: 2
                        });
                    }
                }, function() {
                    $.message.showError("网络异常或请求数据超时!");
                });
                if (aObj.length == 1) {
                    href = $(aObj[0]).attr('href');
                    if ('/alert/search' == href) {
                        $.cookies.set("ChoseType", EnumChoseType.Site, {
                            hoursToLive: 10000,
                            secure: false
                        });
                        $.cookies.set("CDtuId", Dtuid, {
                            hoursToLive: 10000,
                            secure: false
                        });
                        $.cookies.set("MenuId", Dtuid, {
                            hoursToLive: 10000,
                            secure: false
                        });
                        $.cookies.set("ChoseTypeName", DtuName, {
                            hoursToLive: 10000,
                            secure: false
                        });
                        $("#sildeMenu").html("");
                        createMenu();
                        window.frames[0].document.location.href = "/alert/Search?AlertId=" + data.Id;
                    }
                }
            });

        },
        dateFormat: function(date) {
            return (new Date(date).Format('hh:mm:ss'));
        },
        // 转到实时数据
        GoToRealTime: function(Dtuid, DtuName) {
            $.cookies.set("ChoseType", EnumChoseType.Site, {
                hoursToLive: 10000,
                secure: false
            });
            $.cookies.set("CDtuId", Dtuid, {
                hoursToLive: 10000,
                secure: false
            });
            $.cookies.set("MenuId", Dtuid, {
                hoursToLive: 10000,
                secure: false
            });
            $.cookies.set("ChoseTypeName", DtuName, {
                hoursToLive: 10000,
                secure: false
            });

            window.frames[0].document.location.href = "/DataSearch/RealTime";
        },
        GoToAlerm: function(AlertId, Dtuid, DtuName) {
            var id = Dtuid;
            $.cookies.set("ChoseType", EnumChoseType.Site, {
                hoursToLive: 10000,
                secure: false
            });
            $.cookies.set("CDtuId", id, {
                hoursToLive: 10000,
                secure: false
            });
            $.cookies.set("MenuId", id, {
                hoursToLive: 10000,
                secure: false
            });
            $.cookies.set("ChoseTypeName", DtuName, {
                hoursToLive: 10000,
                secure: false
            });
            $("#sildeMenu").html("");
            createMenu();
            var url = "/alert/search";
            var $ul = null;
            try {
                $ul = sopTop.$(".iai-headnav");
            } catch (e) {
                $ul = $(".iai-headnav");
            }

            var liobj = $($ul).find(".iai-headnav-item");
            $.each(liobj, function(index, item) {

                var href = '';
                var aObj = $(this).find('a');
                if (aObj.length > 1) {
                    $.each(aObj, function(childIndex, childItem) {
                        href = $(childItem).attr('href');
                        if (url == href) return
                    });
                } else href = $(this).find('a:eq(0)').attr('href');

                if (url == href) {
                    $($ul).find('.iai-headnav-item-selected').removeClass('iai-headnav-item-selected');
                    $(this).addClass('iai-headnav-item-selected');
                    return
                }
            });
            window.frames[0].document.location.href = "/alert/Search?AlertId=" + AlertId;
        }
    }

});
var menu;

function createMenu() {
    $('.iai-headnav').on('click', 'a', function(evt) {
        (evt || window.event).preventDefault();
    })
    $('.iai-headnav').on('click', '.iai-headnav-item,.ant-menu-item', function() {
        $('.iai-headnav .iai-headnav-item-selected').removeClass('iai-headnav-item-selected');
        $(this).addClass('iai-headnav-item-selected');
        var href = $(this).find('a:eq(0)').attr('href');
        var target = $(this).find('a:eq(0)').attr('target');
        if (target == "_blank") {
            window.open(href);
            return;
        }
        if (href) {
            document.getElementById('pageframe').src = href;
        }
    });
    menu = new iaicn.SideMenu({
        el: '#sildeMenu',
        levelPadding: 16,
        onClick: function(id) {
            if (id == "all") {
                $.cookies.set("ChoseType", EnumChoseType.All, {
                    hoursToLive: 10000,
                    secure: false
                });
                $.cookies.set("ChoseTypeName", "全部站点", {
                    hoursToLive: 10000,
                    secure: false
                });
            } else { //判断类型，是分组还是站点还是commid
                for (var a in sideMenuData) {
                    if (sideMenuData[a].NodeId == id) {
                        $.cookies.set("MenuId", id, {
                            hoursToLive: 10000,
                            secure: false
                        });
                        switch (parseInt(sideMenuData[a].NodeType)) {
                            case EnumChoseType.Common:
                                $.cookies.set("ChoseType", EnumChoseType.Common, {
                                    hoursToLive: 10000,
                                    secure: false
                                });
                                $.cookies.set("ChoseTypeName", sideMenuData[a].NodeName, {
                                    hoursToLive: 10000,
                                    secure: false
                                });
                                break;
                            case EnumChoseType.Group:
                                $.cookies.set("ChoseType", EnumChoseType.Group, {
                                    hoursToLive: 10000,
                                    secure: false
                                });
                                $.cookies.set("GroupCode", id, {
                                    hoursToLive: 10000,
                                    secure: false
                                });
                                $.cookies.set("ChoseTypeName", sideMenuData[a].NodeName, {
                                    hoursToLive: 10000,
                                    secure: false
                                });
                                break;
                            case EnumChoseType.Site:
                                $.cookies.set("ChoseType", EnumChoseType.Site, {
                                    hoursToLive: 10000,
                                    secure: false
                                });
                                $.cookies.set("CDtuId", id, {
                                    hoursToLive: 10000,
                                    secure: false
                                });
                                $.cookies.set("ChoseTypeName", sideMenuData[a].NodeName, {
                                    hoursToLive: 10000,
                                    secure: false
                                });
                                break;
                        }
                        break;
                    }
                }
            }
            //刷新当前所在界面方便更新数据
            if (window.frames['pageframe'].refresh) {
                window.frames['pageframe'].refresh();
            } else {
                //window.frames['pageframe'].location.reload();
                var url = window.frames['pageframe'].location.href;
                if (url != null) {
                    if (url.indexOf("alert/Search?AlertId=") >= 0) {
                        var startindex = url.indexOf("alert/Search?AlertId=");
                        var newurl = url.substr(0, startindex + 12);
                        window.frames['pageframe'].location.href = newurl;
                    } else {
                        window.frames['pageframe'].location.href = url;
                        //window.frames['pageframe'].location.reload();
                    }
                } else {
                    window.frames['pageframe'].location.href = url;
                    // window.frames['pageframe'].location.reload();
                }
            }
        },
        getIcon: function(node) {
            var icons = ['', 'iai-icon-zh', 'anticon anticon-database', 'anticon anticon-bulb'];
            return node.NodeId === 'all' ? 'anticon anticon-home home-icon-fontsize' : 　icons[node.NodeType];
        }
    });

    menu.render(window.iaicn.SideMenu.listToTree(sideMenuData, {
        parentKey: 'ParentNodeID',
        idKey: 'NodeId',
        rootId: null
    }));
    //setAlertStatus(sideMenuData);
    $('#sildeMenu').perfectScrollbar();
    var menuId = $.cookies.get("MenuId") || "all";
    menu.select(menuId, false);
}

function setAlertStatus(data) {

    var alarm = 0,
        offline = 0;
    var parentNodeId = null; //父类id
    var offlineStatusClass = 'iai-menu-item-offline';
    var alarmStatusClass = 'iai-menu-item-alarm';
    var allStatusClass = offlineStatusClass + ' ' + alarmStatusClass;

    var setOfflineStatus = function(id) {
        menu.removeItemClass(id, allStatusClass).addItemClass(id, offlineStatusClass);
    }
    var setAlarmStatus = function(id) {
        menu.removeItemClass(id, allStatusClass).addItemClass(id, alarmStatusClass);
    }

    $.each(data, function(index, item) {

        if (!parentNodeId) { //若父类为空，则赋予当前节点的父类id
            parentNodeId = item.ParentNodeID;

        }
        if (item.ParentNodeID != parentNodeId) {
            if (offline) {
                //todo 变更分组为离线状态
                setOfflineStatus(parentNodeId);
            }
            if (alarm > 0) {
                menu.setBadge(parentNodeId, alarm);
                setAlarmStatus(parentNodeId);

            } else {

                menu.clearBadge(parentNodeId);
                menu.removeItemClass(parentNodeId, allStatusClass);
            }
            alarm = 0, offline = 0;
            parentNodeId = null;
        }


        switch (parseInt(item.Status)) {
            case 0:
                //todo 变更站点为正常状态
                menu.removeItemClass(item.NodeId, allStatusClass);
                break;
            case 1:
                offline++;

                //todo 变更站点为离线状态
                setOfflineStatus(item.NodeId);
                break;
            case 2:
                alarm++;

                //todo 变更站点为报警状态
                setAlarmStatus(item.NodeId);
                break;
        }

        if (item.ParentNodeID != parentNodeId || index == data.length - 1) {
            if (offline) {
                //todo 变更分组为离线状态
                setOfflineStatus(parentNodeId);
            }
            if (alarm > 0) {
                menu.setBadge(parentNodeId, alarm);
                setAlarmStatus(parentNodeId);

            } else {
                menu.clearBadge(parentNodeId);
                menu.removeItemClass(parentNodeId, allStatusClass);
            }

            alarm = 0, offline = 0;
            parentNodeId = null;
        }

    })
}

function toggleMenu(show) {
    if (show) {
        $(".iai-asider").show();
        $('.content').css('left', 240);
    } else {
        $('.content').css('left', 0);
        $(".iai-asider").hide();
    }
}
$(function() {
    (() => {
        var url = location.search.match(new RegExp("[\?\&]nav=([^\&]+)", "i"))
        if (url) {
            debugger
            window.frames['pageframe'].location.href = url[1];
        }
    })();


    $(".change-company").perfectScrollbar();
    //公司筛选
    $(".company-search").bind("input propertychange change", function(event) {
        string = $(this).val();
        if (string == "") {
            $(".company li.ant-menu-subitem").stop().show()
        } else {
            $(".company li.ant-menu-subitem").stop().hide() //将除搜索框以外的li都隐藏
                .filter(":contains('" + (string) + "')").show(); //找到包含字符串string的li显示出来
        }

        if ($(".company li.ant-menu-subitem").stop().hide()
            .filter(":contains('" + (string) + "')").show().length == 0 && string != 0) {
            var html = '<li class="ant-menu-subitem no-company"><a href="#" target="">未检索到该公司</a></li>';
            $(".company").append(html);
        } else if ($(".company li.ant-menu-subitem").stop().hide()
            .filter(":contains('" + (string) + "')").show().length == 0 && string == 0) {
            $(".no-company").remove();
            $(".company li.ant-menu-subitem").stop().show();
        } else {
            $(".no-company").remove();
        }

    });

    $('.vision-style').on('click', 'a', function() {
        var oldTheme = $.cookies.get("theme") || 'light';
        var theme = $(this).attr('theme');
        $.cookies.set("theme", theme, {
            hoursToLive: 10000,
            secure: false
        });
        chgStyle(theme, oldTheme);
    });

    function chgStyle(newTheme, oldTheme) {
        var funcChange = function(link) {
            var href = link.href.replace('theme/' + oldTheme, 'theme/' + newTheme).replace(oldTheme + '.css', newTheme + '.css');
            $(link).attr('href', href);
        }

        $('link').each(function() {
            funcChange(this);
        });

        window.frames["pageframe"].document.location.reload();
        //$(window.frames["pageframe"].document).find("head").find('link').each(function() {
        //    funcChange(this);
        //});
    }


    $('.alarm-popup-content').perfectScrollbar();
    $(".alarm-popup-time-header li").click(app.get);
    //如果cookie里没有值，则默认赋值为选择的全部
    var ChoseType = $.cookies.get("ChoseType");
    if (!ChoseType) {
        $.cookies.set("ChoseType", EnumChoseType.All, {
            hoursToLive: 10000,
            secure: false
        });
        $.cookies.set("ChoseTypeName", "全部站点", {
            hoursToLive: 10000,
            secure: false
        });
    }
    createMenu();
    $.ajax.post("/gis/GetDtuStatus", null, function(data) {
        setAlertStatus(data);
    }, function() {
        $.message.showError("网络异常，请尝试刷新");
    });
    setInterval(function() {
        $.ajax.post("/gis/GetDtuStatus", null, function(data) {
            setAlertStatus(data);
        }, function() {
            $.message.showError("网络异常，请尝试刷新");
        });
    }, 1000 * 60 * 2); //两分钟轮询一次状态

    app.refresh();
    setInterval(function() {
        app.refresh();
    }, 1000 * 60 * 2);
    $('.alarm-popup-title').on('click', function() {
        $(this).parent().toggleClass('alarm-popup-opened');
    });
    $(".iai-aside-bar").click(function() {
        if ($("body").hasClass("aside_unfold")) {
            $("body").removeClass("aside_unfold").addClass("aside_fold");
        } else {
            $("body").removeClass("aside_fold").addClass("aside_unfold");
        }
    });

    // autocomplete
    new iaicn.AutoComplete({
        target: $('.ant-input-search'),
        container: '.search-suguest',
        dataSource: sideMenuData,
        textField: 'NodeName',
        onSelected: function(data) {
            menu.select(data.NodeId);
        }
    }).render();

});

function SwitchCompany(obj) {
    $.ajax.http('/Home/SwitchCompany', function() {
        window.top.location.href = "";
        // window.frames["pageframe"].document.location.reload();
    }, {
        CPid: $(obj).attr("id"),
        CurrentCompanyName: $(obj).text()
    });
}
var angle = 0;

function route() {
    if (angle == 360) {
        angle == 0;
    }
    angle += 90;
    $('#devicePic').rotate({
        angle: angle
    });
}



function ScreenProjection() {
    var url = window.location + $("#pageframe").attr("src");
    $.common.openWindow(url, "大屏投影");
}

//全屏/退出全屏
var a = 0;

function SetFullscreen() {
    a++;
    a % 2 == 1 ? enterfullscreen() : exitfullscreen();
}

//控制全屏方法
function enterfullscreen() { //进入全屏
    $("#fullscreen").text("退出全屏");
    var docElm = document.documentElement;
    //W3C
    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    }
    //FireFox
    else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
    }
    //Chrome等
    else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
    }
    //IE11
    else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
}

//退出全屏方法
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
}

$('.content').append($("<div/>").load("/views/home/offlinedtus.html"))