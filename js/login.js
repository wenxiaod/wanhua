$(function() {
    $("#txtUserName").focus();
    document.onkeydown = function(event) {
        e = event ? event : (window.event ? window.event : null);
        if (e.keyCode == 13 && !$("#btnOK").attr("disabled")) {
            $("#btnOK").click();
        }
    };
});

var ULogin = {
    funShow: function() {
        alert("请联系管理员修改密码！");
    },
    funValidateLogin: function() {
        var username = $.trim($("#txtUserName").val());
        var passowrd = $.trim($("#txtPassword").val());
        var inputUserName = $.request.queryString["UserName"];
        var inputPwd = $.request.queryString["Password"];

        if (inputUserName != undefined && inputUserName != null && inputUserName != '' && inputPwd != undefined && inputPwd != null && inputPwd != '') {
            return true;
        }

        if (checkBrowserVer() != "") {
            alert("您的IE浏览器版本过低！");
            return false;
        }

        if ($.trim($("#txtUserName").val()).length == 0) {
            alert("请输入用户名");
            $("#txtUserName").focus();
            return false;
        }
        if ($.trim($("#txtPassword").val()).length == 0) {
            alert("请输入密码");
            $("#txtPassword").focus();
            return false;
        }
        var checkCode = $("#txtValidateCode").val();
        if (checkCode.length == 0) {
            alert("请输入验证码");
            $("#txtValidateCode").focus();
            return false;
        }
        // if (!$.cookies.get("CheckCode")) {
        //     alert("验证码过期请重新刷新验证码");
        //     $("#imgValidateCode").click();
        //     $("#txtValidateCode").val("");
        //     $("#txtValidateCode").focus();
        //     return false;
        // }
        // if (!VerifyCheckCode(checkCode)) {
        //     alert("验证码输入错误，请重试.");
        //     $("#imgValidateCode").click();
        //     $("#txtValidateCode").val("");
        //     $("#txtValidateCode").focus();
        //     return false;
        // }
        return true;
    },
    funLogin: function() {
        if (!this.funValidateLogin()) {
            return;
        }
        var appCode = $.request.queryString["AppCode"] == undefined ? "" : $.request.queryString["AppCode"];
        var backUrl = $.request.queryString["BackUrl"] == undefined ? window.location.protocol + "//" + window.location.host : $.request.queryString["BackUrl"];
        var username = $.trim($("#txtUserName").val());
        var passowrd = $.trim($("#txtPassword").val());
        var inputUserName = $.request.queryString["UserName"];
        var inputPwd = $.request.queryString["Password"];
        $("#btnOK").attr({ "disabled": "disabled" });
        loading(true);
        var cc = getQueryString("c");
        var strParam = "";
        if (cc != null) {
            strParam = cc;
        }
        $.post(
            "Login.ashx", { "opt": "Login", "id": username, "pwd": passowrd, 'inputusername': inputUserName, 'inputpassword': inputPwd, "autologin": $("#chkAuto").hasClass(".input-active") ? '1' : '0', "AppCode": appCode, "BackUrl": backUrl, "c": strParam },
            function(data) {
                //let item = JSON.parse(data);
                //if (item.status == 'true') {
                //    window.location.href = item.backUrl;
                if (data == "true") {
                    // *********************************************
                    // window.location.href = backUrl;
                    window.location.href = "../pages/home.html";
                } else {
                    if (data == "false" || data == "登录密码错误") {
                        alert('用户名或密码错误');
                    } else {
                        alert(data);
                    }
                    if (!$("#divCheckCode").is(":hidden")) {
                        $("#imgValidateCode").click();
                        $("#txtValidateCode").val("");
                    } else if ($.cookies.get("validate") == "1") {
                        $("#divCheckCode").show();
                        $("#divmaincontent").height("480px");
                    }
                }
                $("#btnOK").removeAttr("disabled");
                loading(false);
            });
    }
};

// 验证码.
function VerifyCheckCode(val) {
    var strCookie = $.cookies.get("CheckCode");
    //var arrCookie = strCookie.split(";");
    //for (var i = 0; i < arrCookie.length; i++) {
    //    var cook = arrCookie[i].split("=");
    //    if (jQuery.trim(cook[0]) == "CheckCode") {
    if (strCookie && strCookie.toUpperCase() == val.toUpperCase()) {
        return true;
    } else {
        return false;
    }
}

function loading(loading_status) {
    var len = $('body').find('.loading').length;
    if (len == 0) {
        $('body').append('<div class="loading"> <img src="../images/loader.gif" style="margin-top:20px;margin-left:40px" alt=""> <span style="position:absolute;left:36.5%;top:20px;font-famliy: Microsoft Yahei;">登录中,请稍候...</span></div>');
        $(".loading").css("position", "absolute");
        $(".loading").css("top", "36%");
        $(".loading").css("left", "43%");
        $(".loading").css("background", "black");
        $(".loading").css("width", "270px");
        $(".loading").css("height", "70px");
        $(".loading").css("opacity", "0.4");
        $(".loading").css("font-size", "18px");
        $(".loading").css("color", "#fff");
        $(".loading").css("border-radius", "3px");
    }
    if (loading_status) {
        $('.loading-overlay').show();
        $('.loading').show();
    } else {
        $('.loading-overlay').hide();
        $('.loading').hide();
    }
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}