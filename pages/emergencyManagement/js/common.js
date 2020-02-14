//寮瑰嚭妗嗗眳涓樉绀�
function centerModals() {
    $('.modal').each(function(i) {
        var $clone = $(this).clone().css('display', 'block').appendTo('body');
        var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
        top = top > 0 ? top : 0;
        $clone.remove();
        $(this).find('.modal-content').css("margin-top", top);
    });
}

//鍏充簬鐭俊杈撳叆鏁堟灉
function smsLength() {
    var smsMaxLength = $("#smsText").attr("maxlength");
    var oSmsText = $("#smsText");
    var smsContent = oSmsText.val();
    var smsLen = smsContent.length;
    var unsubscribe = "閫€璁㈠洖T";
    var finalLen = smsLen;
    if (finalLen <= smsMaxLength) {
        $("#smsWordNum").html(smsMaxLength - finalLen);
    }
    if (smsContent != "") {
        var SmsText = smsContent + unsubscribe;
        $("#preViewSms").html(SmsText).show();
    } else {
        $("#preViewSms").html("").hide();
    }
}


//绛惧悕鏄剧ず鑱氱劍
function EditSmsSign() {
    var oEdit = $("#Edit-smsSign");
    $("#smsSign").hide();
    oEdit.show().focus();
}
//绛惧悕澶卞幓鐒︾偣闅愯棌
function ActiveSmsSign() {
    var oEdit = $("#Edit-smsSign");
    $("#smsSign").css("display", "inline-block").text($(oEdit).val());
    oEdit.hide();
}


var height = 0;

function tabHeight(item) {
    var height1 = 0;
    var height2 = 0;
    var height3 = 0;
    var height4 = 0;
    var height5 = 0;
    var height6 = 0;
    if ($("div").hasClass("top_op")) {
        height1 = $(".top_op").outerHeight();
    }
    if ($("div").hasClass("bottom-search")) {
        height2 = $(".bottom-search").outerHeight();
    }
    if ($("div").hasClass("fix-footer")) {
        height3 = $(".bottom-operation").outerHeight();
    }
    if ($("ul").hasClass("tab-panel")) {
        height5 = $(".tab-panel").outerHeight(true);
    }
    height4 = $(".fixed-table-pagination ").height();
    if (item == 0) {
        height6 = height;
    } else {
        height = height6;
    }
    a = height1 + height2 + height3 + height4 + height5 + height6;
    $(".table-content .fixed-table-container").css({ height: $(window).height() - a - 32 });
}

//鍊掕鏃舵晥鏋�
var countdown = 60;

function settime(obj) {
    if (countdown == 0) {
        obj.removeAttribute("disabled");
        obj.value = "閲嶆柊鑾峰彇楠岃瘉鐮�";
        countdown = 60;
        return;
    } else {
        obj.setAttribute("disabled", true);
        obj.value = "閲嶆柊鍙戦€�(" + countdown + ")";
        countdown--;
    }
    setTimeout(function() {
        settime(obj)
    }, 1000)
}


//鐐瑰嚮涓嬩竴姝ヨ繘搴︽潯鏁堟灉
function stepNext(obj) {
    var i = parseInt($(obj).attr("step"));
    $(".zystep").find(".progress-highlight").animate({ width: 33 * (i + 1) + "%" }, 200, 'swing');
    $(obj).parent().addClass("hide").next().removeClass("hide");
    $(".steps li:eq(" + i + ")").find("span").addClass("bg-base color-white");
}

//URL鍦板潃璇锋眰杩囩▼涓檮甯﹂獙璇佷俊鎭�
function SpliceUrl() {
    var url = arguments[0] ? arguments[0] : "";
    var Flag = arguments[1] ? arguments[1] : false;
    var strUrl = "";
    var appid = "";

    //濡傛灉Url闇€瑕佽鍙朅ppId鐨勫満鍚堬紝闇€瑕佸皢璁剧疆绗簩涓弬鏁拌缃负True
    if (Flag == true) {
        var adress = url.indexOf("?") > -1 ? url.substr(0, url.indexOf("?")) : url.substr(0, url.length);
        if (url.indexOf("&AppId") < 0) {
            $.ajax({
                type: 'POST',
                async: false,
                url: SpliceUrl('/BasicService/GetAppIdByAdress'),
                data: { Adress: adress },
                dataType: "json",
                success: function(data) {
                    if (data && data.loginstatus && data.loginstatus == -1) {
                        top.AglinLogin();
                        return false;
                    }
                    if (data && data.Code == "1") {
                        appid = data.Msg == "" ? "" : "&AppId=" + data.Msg;
                    } else {
                        top.showErrMsg(data.Msg);
                        return false;
                    }
                }
            })
        }
    }
    var UnID = ZsyUI.Core.getQueryString("v");
    //濡傛灉宸茬粡瀛樺湪灏辩洿鎺ヨ烦杩�
    if (url.indexOf("?v=") > -1 || url.indexOf("&v=") > -1) {
        strUrl = url + appid;
    } else {
        if (url.indexOf("?") > -1) {
            strUrl = url + "&v=" + UnID + appid;
        } else {
            strUrl = url + "?v=" + UnID + appid;
        }
    }
    return strUrl;
}

$(function() {
    //澶氭潯浠舵樉绀�
    $('.btn-more').click(function() {
        if ($('.more-search').is(':hidden')) {
            $('.more-search').show();
            tabHeight();
        } else {
            $('.more-search').hide();
            tabHeight();
        }
    })

    $(window).resize(function() {
        if ($("div").hasClass("more-search")) {
            $(".more-search").hide();
            tabHeight();
        }
    })
    var time = setTimeout(function() {
        //鏃ユ湡鎻掍欢鐨勮皟鐢�
        if ($('input').hasClass('form_datetime')) {
            var $obj = $(".form_datetime");
            for (var i = 0; i < $obj.length; i++) {
                var dateHeight = $(".datetimepicker ").outerHeight(); //鑾峰彇鎺т欢楂樺害
                var topHeight = $obj.eq(i).offset().top + $obj.eq(i).outerHeight();
                var botHeight = $(window).height() - topHeight;
                if (botHeight > 226 || topHeight > topHeight) {

                    $(".form_datetime").datetimepicker({ language: 'zh-CN', minView: "month", format: 'yyyy/mm/dd', autoclose: true, pickerPosition: "bootom-left" });
                } else {
                    $(".form_datetime").datetimepicker({ language: 'zh-CN', minView: "month", format: 'yyyy/mm/dd', autoclose: true, pickerPosition: "top-left" });
                }
            }
        }
        if ($('input').hasClass('date_hi')) {
            var $obj = $(".date_hi");
            for (var i = 0; i < $obj.length; i++) {
                var topHeight = $obj.eq(i).offset().top + $obj.eq(i).outerHeight();
                var botHeight = $(window).height() - topHeight;
                if (botHeight > 226 || topHeight > topHeight) {
                    $(".date_hi").datetimepicker({ language: 'zh-CN', format: 'yyyy/mm/dd hh:ii', autoclose: true, pickerPosition: "bottom-right" });
                } else {
                    $(".date_hi").datetimepicker({ language: 'zh-CN', format: 'yyyy/mm/dd hh:ii', autoclose: true, pickerPosition: "top-right" });
                }
            }
        }
    }, 1000);

    //鎻愮ず淇℃伅
    $('.tooltips').tooltip({
        selector: "[data-toggle=tooltip]",
        container: "body"
    });
    //涓嬫媺鑿滃崟鐨勮缃�
    $('.selectpicker').selectpicker({
        size: "8",
        noneSelectedText: "",
    });
    $('[data-toggle="popover"]').popover();
    //灞呬腑鍙婃嫋鎷借皟鐢�
    if ($('div').hasClass('modal')) {
        //$(".modal").draggable();
        $(".modal").css("overflow", "hidden");
        $('.modal').on('show.bs.modal', centerModals);
        $(window).on('resize', centerModals);
    }


    $('.ui-widget input').focus(function() {
        $(this).parent().addClass("border-base");
    }).blur(function() {
        $(this).parent().removeClass("border-base");
    })


})