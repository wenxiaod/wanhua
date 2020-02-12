var MonitorComm = {
    TestData: function(data) {
        if (data == "0") {
            layer.msg("暂未找到数据！", {
                icon: 2,
                time: 1000
            });
            return false;
        }
        if (data == "1") {
            layer.msg("请稍后刷新再试！", {
                icon: 2,
                time: 1000
            });
            return false;
        }
        return true;
    },
    FixWidth: function(percent) {
        //文档可见区域宽度
        return document.body.clientWidth * percent;
    },
    Loading: function() {
        //设置全局请求超时时间
        $.ajaxSetup({ timeout: 10000 });
        $("#loading").css({ position: "absolute", height: "100%", width: "100%", filter: " alpha(opacity = 40)", "-moz-opacity": "0.4", opacity: "0.4", background: "gray url(../../Style/imgs/loading.gif) center center no-repeat", "z-index": "10000", top: "0px", left: "0px" });
        $("#loading").bind("ajaxSend", function() {
            $(this).show();
        }).bind("ajaxComplete", function() {
            $(this).fadeOut(700);
        });
    },
    Reload: function() {
        var time = $("#lbTime").text();
        if (time == 0) {
            $("#lbTime").text(300);
            window.location.reload(true);
        } else {
            time--;
            $("#lbTime").text(time);
        }
    },
    Refresh: function() {
        setInterval("MonitorComm.Reload()", 1000);
    },
    AddTimeLbl: function() {
        var lbl = "<span class='com_fr  com_ganeralFont com_CnowPlace com_fblod' style='position:absolute; top:0px;  right:0px;'>刷新倒计时:<label id='lbTime' class='com_red'>300</label>秒</span>";
        $("form").append(lbl);
    },
    Exit: function() {
        $(document).keydown(function(event) {
            if (event.keyCode == '27') {
                $("#ShowMessage").remove();
            }
        });
    },
    AddDetailInfo: function(obj) {
        var message = "<div id='ShowMessage' class='com_bgColor com_DivBorder' style='border-radius:5px; display:none; position :absolute;top: 150px; left: 350px; width:500px;height:50%; margin:0 auto; z-index:99999;'>";
        message += "<div  id='DivError'  style='position: relative; top: 0px; right: 2px; cursor: pointer;float: right; background: url(/Style/imgs/sprites/SmsCom.gif) no-repeat 0px 0px; width: 17px; height: 17px; cursor: pointer'></div>";
        message += "<div id='ShowMessageInner' class=com_DivBorder style='border-radius:5px; overflow-y:auto;overflow-x:hidden; position:relative; margin-left:25px; margin-top:15px;  width:90%;height:90%; '> </div> </div>";
        $("form").append(message);
        $("#ShowMessageInner").text($(obj).parent().prev().prev().text());
        $("#ShowMessage").show();
        $("#DivError").bind("click", function() {
            $("#ShowMessage").remove();
        });
    },
    GetServerName: function() {
        $.ajax({
            type: "post",
            async: false,
            dataType: "html",
            url: "../HttpRequest/ManageAssets.ashx",
            data: { flag: "GetServerName" },
            error: function(ex) {
                layer.msg("网络异常，请重新刷新！", {
                    icon: 2,
                    time: 1000
                });
            },
            success: function(back) {

                if (back.length > 0) {
                    var opt = "";
                    var tb = back.split(',');
                    $.each(tb, function(k, v) {
                        var txt = v.split('=');
                        opt += "<option value='" + txt[0] + "'>" + txt[1] + "</option>";
                    });
                    $("#ServerList").html(opt);
                    MonitorComm.GetParasEnum($("#ServerList").val());
                    $("#ServerList").bind("change", function() {
                        MonitorComm.GetParasEnum($("#ServerList").val());
                    });
                }
            }
        });
    },
    GetDBServer: function() {
        $.ajax({
            type: 'post',
            url: '../HttpRequest/SafeMng.ashx',
            dataType: 'text',
            data: "flag=DBMonitor&MonitorFlag=IPMng&",
            error: function(xhr) {
                layer.msg("请稍后刷新再试！", {
                    icon: 2,
                    time: 1000
                });
            },
            success: function(data) {
                if (MonitorComm.TestData(data)) {
                    var Json = eval(data);
                    var Option = "";
                    $(Json).each(function(item) {
                        Option += "<option value=" + Json[item].ServerCode + ">" + Json[item].ServerName + "</option>"
                    });
                    $("#ServerList option :gt(0)").remove();
                    $("#ServerList").append(Option);
                }
            }
        });
    },
    /***获取服务器参数枚举类型***/
    GetParasEnum: function(ServerCode) {
        $.ajax({
            type: "post",
            dataType: "html",
            url: "../HttpRequest/ManageAssets.ashx",
            data: { flag: "GetParasEnum", Data: ServerCode },
            error: function(ex) {
                layer.msg("网络异常，请重新刷新！", {
                    icon: 2,
                    time: 1000
                });
            },
            success: function(back) {
                if (back == 0) {
                    layer.msg("无数据提供，请尝试刷新页面！", {
                        icon: 7,
                        time: 1000
                    });
                } else if (back.length > 0) {
                    var opo = "";
                    var ta = back.split(',');
                    $.each(ta, function(k, v) {
                        var tt = v.split('-');
                        opo += "<option value='" + tt[0] + "'>" + tt[1] + "</option>";
                    });
                    $("#Type").html(opo);
                }
            }
        });
    },
    CheckBeginAndEndTime: function(begin, end) {
        if (begin > end) { return false; } else { return true; }
    },
    CreateNoteDiv: function(text) {
        var message = "<div id='ShowMessage' class='com_bgColor com_DivBorder' style='border-radius:5px; display:none; position :absolute;top: 150px; left: 350px; width:500px;height:50%; margin:0 auto; z-index:99999;'>";
        message += "<div  id='Div1'  style='position: relative; top: 0px; right: 2px; cursor: pointer;float: right; background: url(/Style/imgs/sprites/SmsCom.gif) no-repeat 0px 0px; width: 17px; height: 17px; cursor: pointer'></div>";
        message += "<div id='ShowMessageInner' class=com_DivBorder style='border-radius:5px; overflow-y:auto;overflow-x:hidden; position:relative; margin-left:25px; margin-top:15px;  width:90%;height:90%; '> </div> </div>";
        $("form").append(message);
        $("#ShowMessageInner").html(text);
        $("#ShowMessage").show();
        $("#Div1").bind("click", function() {
            $("#ShowMessage").remove();
        });
    },
    //文本框得到焦点
    GetFocus: function(obj, txt) {
        if ($(obj).val() == txt) {
            $(obj).val("");
            $(obj).removeClass("com_silver");
        }
    },
    LoseFocus: function(obj, txt) {
        if ($(obj).val() == txt || $(obj).val() == "") {
            $(obj).val(txt);
            $(obj).addClass("com_silver");
        }
    },
    getQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
}