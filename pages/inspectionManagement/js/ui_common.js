var common = {
    treeNum: 1, //中间折叠的记数
    topNum: 1, //向上折叠的记数
    animate_ShowTree: function() { //有动画的折叠
        $("#meNav").animate({ "width": "160px", "left": "3px" }, 'normal');
        $("#meFold").animate({ "left": "166px" }, 'normal');
        $("#meContent").animate({
            "width": $(window).width() - 175 + "px",
            "left": "172px"
        }, 'normal');
        $("#ifmContent").animate({
            "width": $(window).width() - 175 + "px",
            "left": "172px"
        }, 'normal');
    },
    animate_hideTree: function() { //有动画的展开
        $("#meNav").animate({ "width": "0px", "left": "-10px" }, 'normal');
        $("#meFold").animate({ "left": "3px" }, 'normal');
        $("#meContent").animate({ "width": "99%", "left": "10px" }, 'normal');
        $("#ifmContent").animate({ "width": "99%", "left": "10px" }, 'normal');
    },
    me_showTree: function() { //无动画的折叠
        $("#meNav").css({ "width": "160px", "left": "3px" });
        $("#meFold").css({ "left": "166px" });
        $("#meContent").css({
            "width": $(window).width() - 175 + "px",
            "left": "172px"
        });
        $("#ifmContent").css({
            "width": $(window).width() - 175 + "px",
            "left": "172px"
        });
    },
    me_hideTree: function() {
        $("#meNav").css({ "width": "0px", "left": "-10px" });
        $("#meFold").css({ "left": "3px" }, 'normal');
        $("#meContent").css({ "width": "99%", "left": "10px" });
        $("#ifmContent").css({ "width": "99%", "left": "10px" });
    },
    me_input: function() {
        $(":button").mouseover(function() {
            $(this).addClass("fn_button_onMouserover");
        });
        $(":button").mouseout(function() {
            $(this).removeClass("fn_button_onMouserover");
        });
        $(":input").not(":button").mouseover(function() {
            $(this).addClass("fn_text");
        });
        $(":input").not(":button").mouseout(function() {
            $(this).removeClass("fn_text");
        });
    },
    //折叠
    //meNav:    left:8px    width:224px   
    //meFold    left:238px  width:9px
    //meContent left:252px  width:auto;
    defaultTree: function() {
        var browser = typeof($.browser.msie);
        if (this.treeNum % 2 == 0) {
            if ($.browser.msie) {
                if ($.browser.version != 8.0) {
                    this.me_showTree();
                } else {
                    this.animate_ShowTree();
                }
            }
            if (browser == "undefined") {
                this.animate_ShowTree();
            }
        } else { //折叠 
            if ($.browser.msie) {
                if ($.browser.version != 8.0) {

                    this.me_hideTree();
                } else {
                    this.animate_hideTree();
                }
            }

            if (browser == "undefined") {
                this.animate_hideTree();
            }

        }
        this.treeNum++;
    },
    //折叠  向上
    dufaultZheDieTop: function() {
        var meHeight = $(window).height(),
            otherHeight = 65 + 8 + 12,
            otherWidth = 175;
        if (this.topNum % 2 == 0) {
            //头部
            $("#me_top").show();
            //show
            $("#me_banner").animate({ "height": "75px" }, 'normal');
            $("#meFold_top").animate({ "top": "69px" }, 'normal');
            $("#meBody").animate({ "height": meHeight - otherHeight + "px" }, 'normal');
            $("#meNav").animate({ "height": meHeight - otherHeight + "px" }, 'normal');
            $("#meContent").animate({ "height": meHeight - otherHeight + "px" }, 'normal');
            $("#ifmContent").animate({ "height": meHeight - otherHeight + "px" }, 'normal');

            $(".main_banner_logo").show(); //隐藏LOGO   因为是绝对的
            $(".lay_main_over").show();
            $(".lay_main_overR").show();
            $("#div_Name").show();
        } else {
            //折叠
            $("#me_top").hide();
            $(".main_banner_logo").hide(); //隐藏LOGO   因为是绝对的
            $(".lay_main_over").hide();
            $(".lay_main_overR").hide();
            $("#div_Name").hide();

            $("#me_banner").animate({ "height": "5px" }, 'normal');
            $("#meFold_top").animate({ "top": "0px" }, 'normal');
            $("#meBody").animate({ "height": meHeight + "px" }, 'normal');
            $("#meNav").animate({ "height": meHeight - 15 + "px" }, 'normal');
            $("#meContent").animate({ "height": meHeight - 15 + "px" }, 'normal');
            $("#ifmContent").animate({ "height": meHeight - 25 + "px" }, 'normal');
        }
        this.topNum++;
    },
    //提示信息
    //参数：m_id  m_top  m_right  m_height  m_width   m_content
    setInfo: function(jason) {
        var id = "";
        if (typeof(jason.m_id) == "undefined") {
            throw "jason is wrong";
            return;
        } else {
            id = jason.m_id;
        }
        var myWidth = typeof(jason.m_width) == "undefined" ? $("#" + id).css("width") : jason.m_width;
        var myHeight = typeof(jason.m_height) == "undefined" ? $("#" + id).css("height") : jason.m_height;

        var myRight = typeof(jason.m_right) == "undefined" ? "45%" : jason.m_right;
        var myTop = typeof(jason.m_top) == "undefined" ? $("#" + id).css("top") : jason.m_top;

        var myContent = typeof(jason.m_content) == "undefined" ? $("#" + id + " .content").html() : jason.m_content;
        $("#" + id).css({ "width": myWidth, "height": myHeight, "right": myRight, "top": myTop });
        $("#" + id).fadeIn("slow");
        $("#" + id + " .content").html(myContent)
    },
    //关闭提示   若没有ID  关闭所有Info
    //m_id
    closeInfo: function(myId) {
        if (arguments.length == "0") {
            $(".InfoTitle").fadeOut("slow");
        } else {
            $("#" + myId).fadeOut("slow");
        }
    },
    //父页的提示层(不关闭)
    FatherInfo: function(msg) {
        window.sopTop.common.setInfo({
            "m_id": "infoMe",
            "m_content": msg
        });
    },
    //父页的提示层(要关闭)
    closeFatherInfo: function(msg) {
        window.sopTop.common.setInfo({
            "m_id": "infoMe",
            "m_content": msg
        });
        setTimeout("parent.common.closeInfo('infoMe');", "12000");
    },
    //关闭注解
    memoCloseMe: function(obj) {
        $(obj).parent().hide('1000');
    },
    //首页里的高度控制  ID定死
    defaultPage: function() {
        var myHeight = $(window).height();
        var myWidth = $(window).width();
        var otherHeight = 85;
        var otherWidth = 180;
        //总body高度
        $("#meBody").css("height", myHeight - otherHeight + "px");
        //NAV 和 content的高度 和 折叠 , iframe
        var NavHeight = $("#meNav").parent().height();
        $("#meNav").css("height", NavHeight + "px");
        $("#meFold").css("height", NavHeight + "px");
        $("#meContent").css("height", NavHeight + "px");
        if (this.treeNum % 2 != 0) {
            $("#meContent").css("width", myWidth - otherWidth + "px");
            $("#ifmContent").css("width", myWidth - otherWidth + "px");
        }
        $("#ifmContent").css("height", NavHeight - 12 + "px");
    },
    //2级导航绑定
    defaultNav2Set: function() {
        $(".main_nav_Two a").each(function() {
            $(this).click(function() {
                var mePlace = "";
                $(".main_nav_Two a").removeClass("Twoselected");
                $(this).addClass("Twoselected");
                mePlace = $(this).text();
                $("#mePlace").html(mePlace);
            });
        });
    },
    //首页的导航
    defaultNav1: function(obj) {
        //展开
        var ulID = "ul_" + $(obj).attr("date-name");
        //去掉样式
        $(".main_nav_One a").removeClass("Oneselected").removeClass("Oneselected_1px");
        if ($(obj).attr("href").indexOf("javascript") > -1) {
            $("#" + ulID).slideToggle('normal');
            //展开之前是1   关闭之前是>1  
            if ($("#" + ulID).css("height").replace("px", "") == "1") {
                $(obj).addClass("Oneselected");
            } else {
                $(obj).addClass("Oneselected_1px");
            }
            //首页是没有  2级导航的  为null

            if ($("#" + ulID) == "null") {
                $(obj).addClass("Oneselected_1px");
            }
        } else {
            $(obj).addClass("Oneselected_1px");
        }


        //替换位置地方的文字
        var mePlace = "";
        mePlace = $(obj).text();
        $("#mePlace").html(mePlace);
    },
    //鼠标移入移除，网吧异常
    doScanningFN: function() {
        $("#meGaojing").mouseover(function() {
            $("#meGaojingLay").show();
        });
        $("#meGaojing").mouseout(function() {
            $("#meGaojingLay").hide();
        });
        $("#meGaojingLay").mouseover(function() {
            $("#meGaojingLay").show();
        })
        $("#meGaojingLay").mouseout(function() {
            $("#meGaojingLay").hide();
        })
    },
    //用户信息
    defaultUser: function(obj) {
        var meOffset = $(obj).offset();
        $("#meUserInfo").css("top", meOffset.top);
        $("#meUserInfo").css("left", meOffset.left);
        $("#meUserInfo").mousemove(function() {
            $("#meUserInfo").css("top", meOffset.top);
        });
        $("#meUserInfo").mouseout(function() {
            $("#meUserInfo").css("top", "-378px");
        });
    },
    //用户信息
    defaultSys: function(obj) {
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
    },
    //我经常用的
    defaultQuick: function(obj) {
        objOffset = $(obj).offset();
        $("#meQuick").css({ "left": objOffset.left, "top": objOffset.top });
        $("#meQuick").show();
        $("#meQuick").mousemove(function() {
            $("#meQuick").show();
        });
        $("#meQuick").mouseout(function() {
            $("#meQuick").hide();
        });
        $("#meQuick a").each(function() {
            $(this).click(function() {
                $("#mePlace").html($(this).text());
            });
        });
    },
    //退出系统
    exitSystem: function() {
        debugger;
        if (confirm('确认退出系统吗？')) {
            window.location = "login.htm";
        } else {
            return false;
        }
    },
    //联系我们(打开)
    defaultUs: function(obj) {
        $(obj).hide();
        $(".fn_us_Over").show();
    },
    //联系我们(关闭)
    defaultCloseUs: function() {
        $('.fn_us_Over').hide();
        $(".fn_us_out").show();
    },
    //关闭弹出层
    layoutClose: function() {
        $('.msbgs .myBG').fadeTo("slow", 0);
        $("#ifrHTML").attr("src", "");
        setTimeout(function() { $('.msbgs').hide(); }, "500");
    },
    //展开弹出层  可以自己传入宽度和高度   支持百分比   根据页面大小合理设置
    //meWidth meHeight meSrc
    layoutShow: function(jason) {
        var isHave = false; //不是百分比
        if (arguments.length != 0) {
            var thisWidth = typeof(jason.meWidth) == "undefined" ? "80%" : jason.meWidth;
            var thisHeight = typeof(jason.meHeight) == "undefined" ? "90%" : jason.meHeight;
            var thisLeft = 0;
            if (thisWidth.indexOf("%") > -1) {
                var newWidth = thisWidth.replace("%", "");
                thisLeft = newWidth / 2;
                isHave = true;
            } else {
                thisLeft = thisWidth / 2;
            }
            $("#meLayout").css({ "width": thisWidth, "height": thisHeight });
            if (isHave) { //有%
                $("#meLayout").css({ "margin-left": "-" + thisLeft + "%" });
            } else {
                $("#meLayout").css({ "margin-left": "-" + thisLeft + "px" });
            }

        } else {
            $("#meLayout").css({ "width": "80%", "height": "90%", "margin-left": "-40%" });
        }
        $('.msbgs').show();
        $('.msbgs .myBG').fadeTo("slow", 0.6)
        $("#ifrHTML").attr("src", jason.meSrc);
    }
}

var TableFn = {
    trClass: "com_tdBG", //换行的td 背景
    //meType:table,ul    
    //meObj:id or object   
    //支持  object 参数
    trColor: function(jason) {
        var meType = typeof(jason.meType) == "string" ? jason.meType : "table";
        if (typeof(jason.meObj) == "undefined") {
            throw "error for jason by function：TableFn.trColor(jason)"
            return;
        }
        switch (meType) {
            case "table":
                if (typeof(jason.meObj) == "string") {
                    $("#" + jason.meObj + " tbody tr:odd td").addClass(this.trClass);
                } else {
                    jason.meObj.addClass(this.trClass);
                }
                break;
            case "ul":
                if (typeof(jason.meObj) == "string") {
                    $("#" + jason.meObj + " li:odd").addClass(this.trClass);
                } else {
                    jason.meObj.addClass(this.trClass);
                }
        }
    }
}

//结合后台需要的代码
var code = {
    //Main页 刷新iframe的src
    reloadIfr: function(meSrc) {
        $("#ifmContent").attr("src", meSrc);
    },
    //值班日历里的标签
    bookUi: function() {
        $(".bookUL li a").click(function() {
            var meAttr = $(this).attr("date-name");
            $(".bookUL li a").each(function() {
                $(this).removeClass("bookSelected");
            });
            $(this).addClass("bookSelected");
            $(".bookDIV").hide();
            $("#div_" + meAttr).show();
        });
    },
    //值班日历里的工作日onClick
    WorkDay: function() {
        $(".workDay").click(function() {
            $(this).toggleClass("workDaySelect");
        });
    }
}


$(document).ready(function() {
    common.me_input();
});