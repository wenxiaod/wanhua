function Jump(obj) {
    var url = $(obj).attr("data-href");
    window.location.href = url;
}

function UpdateState(obj, Index, Id, fun) {
    var url = $(obj).attr("data-href");
    var state = $(obj).attr("data-state");
    var title = $(obj).text();
    layer.confirm("确定是否" + title + "?", {
        btn: ['确定', '取消'],
        shadeClose: true,
        shade: 0.5,
        icon: 3
    }, function(num) {
        $.ajax({
            type: 'POST',
            url: url,
            data: { Id: Id, State: state },
            async: true,
            dataType: "json",
            success: function(data) {
                if (!data) {
                    layer.msg(data["Msg"], {
                        icon: 2,
                        time: 1000
                    });
                    return;
                }
                if (data["Result"] == 1) {
                    layer.msg(data.Msg, {
                        icon: 1,
                        time: 1000
                    }, function() {
                        if (fun) {
                            fun(Index, data.Data);
                        }
                    })
                } else {
                    layer.msg(data["Msg"], {
                        icon: 2,
                        time: 1000
                    });
                }
                layer.close(num);
            },
            error: function() {
                layer.msg("数据保存失败，请重试!", {
                    icon: 2,
                    time: 1000
                });
                return;
            }
        });
    });
}

function Del(obj, Id) {
    var url = $(obj).attr("data-href");
    var title = $(obj).text();
    layer.confirm("确定是否" + title + "?", {
        btn: ['确定', '取消'],
        shadeClose: true,
        shade: 0.5,
        icon: 3
    }, function(num, layero) {
        layer.msg('努力中...', {
                icon: 16,
                shade: [0.5, '#f5f5f5'],
                scrollbar: false,
                offset: '0px',
                time: 100000
            },
            function(num, layero) {
                $(layero).css("z-index", "9999999")
            })
        $.ajax({
            type: 'POST',
            url: url,
            data: { Id: Id },
            async: true,
            dataType: "json",
            success: function(data) {
                var bl = data && data.Result && data.Msg;
                if (bl && data.Result == 2) {
                    layer.msg(data.Msg, {
                        icon: 2,
                        time: 1000
                    });
                } else if (data.Result == 1) {
                    if (bl)
                        layer.msg(data["Msg"], {
                            icon: 1,
                            time: 1000
                        }, function() {
                            $(obj).parents("table").bootstrapTable('refresh');
                        });
                    //var ary = new Array();
                    //ary.push(Id);
                    //var params = { field: 'Id', values: ary };
                    //$(obj).parents("table").bootstrapTable('remove', params);
                } else if (!bl)
                    layer.msg(data["Msg"], {
                        icon: 2,
                        time: 1000
                    });
                layer.close(num);

            },
            error: function() {
                layer.msg("数据删除失败，请重试!", {
                    icon: 2,
                    time: 1000
                });
                layer.close(num);
                return;
            }
        })
        layer.closeAll();
    });
}

function SaveData(obj) {
    SolvingDom(obj, true);
    var form = $(obj).parents(form);
    var url = $(obj).attr("data-href");
    var backUrl = $(obj).attr("data-backurl");
    var aa = function() {
        SolvingDom(obj, false);
    }
    $.ajax({
        type: 'POST',
        url: url,
        data: form.serialize(),
        async: true,
        dataType: "json",
        success: function(data) {
            var icon = 2;
            var msg = "操作失败";
            if (!data) {
                icon = 2;
            } else
            if (data["Result"] == 1) {
                icon = 1;
                msg = data.Msg;
                aa = function() {
                    window.parent.layer.closeAll();
                    window.parent.location.reload();
                }
            } else if (data["Result"] == 0) {
                msg = data.Msg;
                icon = 2;
            } else {
                icon = 2;
                msg = data.Msg;
            }
            layer.msg(msg, {
                icon: icon,
                time: 1000
            }, aa);
        },
        error: function() {
            layer.msg("数据保存失败，请重试!", {
                icon: 2,
                time: 1000
            }, aa);
            return;
        }
    })
}

function GetCompany(obj, callo, dom) {
    $.ajax({
        type: 'POST',
        url: '/Tool/GetCompanyInfo',
        async: true,
        dataType: "json",
        success: function(data) {
            if (!data) {
                layer.msg("数据获取失败，请重试!", {
                    icon: 2,
                    time: 1000
                });
                return;
            }
            var companylist = data.List;
            $(this).find("option:gt(0)").remove();
            var id = 0;
            if (companylist.length == 1 && dom) {
                dom.parent().hide();
            } else if (companylist.length == 1 && !dom) {
                obj.parent().parent().hide();
            } else {
                //加载总部所有公司参数列表
                var bl = true;
                for (var i = 0; i < companylist.length; i++) {
                    if (companylist[i].ParentId === 0 && bl) {
                        id = companylist[i].CompanyID;
                        bl = false;
                    }
                    $("<option class='wid-198'></option>").val(companylist[i].CompanyID).text(companylist[i].CompanyName).appendTo(obj);
                }
                $(obj).selectpicker('refresh');
                $(obj).selectpicker('render');
                $(obj).selectpicker('val', id);

            }
            if (callo && callo.funload && callo.funload.constructor) {
                callo.funload(data.UserCompany, data.isParent);
            }
        },
        error: function() {
            layer.msg("数据获取失败，请重试!", {
                icon: 2,
                time: 1000
            });
            return;
        }
    })
}

function GetType(obj, Type) {
    $.ajax({
        type: 'POST',
        url: '/Tool/GetDictionary',
        data: { Type: Type },
        async: false,
        dataType: "json",
        success: function(data) {
            if (!data) {
                layer.msg("数据获取失败，请重试!", {
                    icon: 2,
                    time: 1000
                });
                return;
            }
            if (data.Code == "1") {
                var List = data.List;
                for (var i = 0; i < List.length; i++) {
                    $("<option></option>").val(List[i].Id).text(List[i].Title).appendTo(obj);
                }
                $(obj).selectpicker('refresh');
                $(obj).selectpicker('render');
            }
        },
        error: function() {
            layer.msg("数据获取失败，请重试!", {
                icon: 2,
                time: 1000
            });
            return;
        }
    })
}
Date.prototype.Format = function(fmt) { //author: meizz 
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    //时间格式化
function GetDateFormat(str) {
    if (str == null || str == "") {
        return "";
    }
    return format(new Date(parseInt(str.substr(6, 13))));
}

function format(Date) {
    var Y = Date.getFullYear();
    var M = Date.getMonth() + 1;
    M = M < 10 ? '0' + M : M; // 不够两位补充0
    var D = Date.getDate();
    D = D < 10 ? '0' + D : D;
    var H = Date.getHours();
    H = H < 10 ? '0' + H : H;
    var Mi = Date.getMinutes();
    Mi = Mi < 10 ? '0' + Mi : Mi;
    var S = Date.getSeconds();
    S = S < 10 ? '0' + S : S;
    return Y + '-' + M + '-' + D + ' ' + H + ':' + Mi + ':' + S;
}
Date.prototype.toLocaleString = function() {
    return this.getFullYear() + "/" + (this.getMonth() + 1) + "/" + this.getDate() + " " + this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds();
};
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
Array.prototype.add = function() {
    for (var i = 0; i < arguments.length; i++) {
        var ele = arguments[i];
        if (this.indexOf(ele) == -1) {
            //alert("aa");
            this.push(ele);
        } else {
            // alert(ele);
        }
    }
};
//弹窗页面
function Open(obj, height, width, title) {
    var url = $(obj).attr("data-href");
    var title = title || $(obj).text();
    var width = width || 680;
    var height = height || 400;
    var optionwin = {
        type: 2,
        fix: true, //不固定
        area: [width + 'px', height + 'px'],
        content: url,
        title: title,
        shadeClose: false, //加上边框
        scrollbar: false,
        shade: 0.4,
        shift: 0
    }
    layer.open(optionwin);
}
//关闭弹窗
function Close() {
    window.parent.layer.closeAll();
}
//处理中(按钮控制)dom:按钮,YorN:是否禁用(true:禁用,false:启用),ShowText展示文字
function SolvingDom(dom, YorN, ShowText, fun) {
    if (dom) {
        if (dom[0]) {
            dom[0].disabled = YorN ? true : false;
            if (dom[0].tagName.toLowerCase() == "button") {
                dom[0].innerHTML = ShowText ? ShowText : YorN ? "保存中..." : ShowText ? ShowText : "保存";
            }
            if (dom[0].tagName.toLowerCase() == "input") {
                var domvalue = dom[0].value;
                dom[0].value = ShowText ? ShowText : YorN ? "保存中..." : ShowText ? ShowText : "保存";
            }
        } else {
            dom.disabled = YorN ? true : false;
            if (dom.tagName.toLowerCase() == "button") {
                dom.innerHTML = ShowText ? ShowText : YorN ? "保存中..." : ShowText ? ShowText : "保存";
            }
            if (dom.tagName.toLowerCase() == "input") {
                var domvalue = dom.value;
                dom.value = ShowText ? ShowText : YorN ? "保存中..." : ShowText ? ShowText : "保存";
            }
        }
    }
    if (fun && fun.constructor) {
        fun();
    }
}
//日期正则表达式，范围1900-2099，可为空

//验证数据
function ValidateData(dom, callBack) {
    var InputList = [];
    if (dom instanceof Array) {
        InputList = dom;
    } else if (dom.find("input[type=text]").length > 0 || dom.find("select").length > 0 || dom.find("textarea").length > 0) {
        dom.find("input[type=text],select,textarea").each(function() {
            InputList.push($(this))
        });
    } else {
        InputList.push(dom)
    }
    for (var i = 0; i < InputList.length; i++) {
        var result = AttrValidata($(InputList[i]));
        if (!result.Success) {
            if (callBack && callBack.constructor) {
                callBack($(InputList[i]), result);
            } else {
                layer.msg(result.msg, {
                    icon: 7,
                    time: 2000
                })
            }
            return false;
        }
    }
    return true;
}

function AttrValidata(dom) {
    var result = { Success: false, msg: "" };
    var data_title = dom.attr("data-title");
    data_title = data_title ? data_title : "";
    if (!dom.attr("valiisnull") && !dom.val()) {
        result.Success = true;
        return result;
    }
    if (dom[0].localName == "select") {
        if (dom.attr("valiisnull")) {
            if (!dom.val() || ValidateNull(dom.val())) {
                result.msg = "请选择" + data_title + "!";
                return result;
            }
        }
        if (dom.attr("valiselectval")) {
            if (ValidateSelectVal(dom.val(), dom.attr("valiselectval"))) {
                result.msg = "请选择" + data_title + "!";
                return result;
            }
        }

    } else {
        if (dom.attr("valiisnull")) {
            if (!dom.val() || ValidateNull(dom.val())) {
                result.msg = data_title + "不允许为空！";
                return result;
            }
        }
        if (!ValidateSpecialSymbol(dom.val())) {
            result.msg = data_title + "包含特殊字符！";
            return result;
        }
        if (dom.attr("valitimeformat")) {
            if (!ValidateTimeFormat(dom.val())) {
                result.msg = data_title + "格式错误！";
                return result;
            }
        }
        if (dom.attr("valiphone")) {
            if (!ValidatePhone(dom.val())) {
                result.msg = data_title + "格式错误！";
                return result;
            }
        }
        if (dom.attr("valiemail")) {
            if (!ValidateEmail(dom.val())) {
                result.msg = data_title + "格式错误！";
                return result;
            }
        }
        if (dom.attr("valilength")) {
            try {
                var length = Number(dom.attr("valilength"));
                if (length > 0) {
                    if (!ValidateLength(dom.val(), length)) {
                        result.msg = data_title + "最多可输入" + dom.attr("valilength") + "字符！";
                        return result;
                    }
                }
            } catch (e) {

            }
        }
    }





    result.Success = true;
    return result
}


//验证空
function ValidateNull(value) {
    return value.replace(/\s+/g, "").length == 0;
}
//验证下拉框值
function ValidateSelectVal(value, selval) {
    if (value) {
        return value == selval
    }
    return !value;
}
//验证时间格式
function ValidateTimeFormat(value) {
    var TimeRegex = /^(19|20)\d{2}(-|\/|.| )((0[1-9])|1[0-2]|[1-9])(-|\/|.| )(0[1-9]|[1-2][0-9]|3[0-1]|[1-9])( (20|21|22|23|[0-1]\d|\d):([0-5]\d|\d):([0-5]\d|\d))?$/;
    return TimeRegex.test(value)
}
//验证手机格式
function ValidatePhone(value) {
    var PhoneRegex = /^(13|14|15|18|17)[0-9]{9}$/;
    return PhoneRegex.test(value)
}
//验证Email格式
function ValidateEmail(value) {
    var EmailRegex = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    return EmailRegex.test(value)
}
//验证长度
function ValidateLength(value, length) {
    return value.length <= length;
}
//特殊符号验证
function ValidateSpecialSymbol(value) {
    var SpecialSymbol = ["</"];
    for (var i = 0; i < SpecialSymbol.length; i++) {
        if (value.indexOf(SpecialSymbol[i]) >= 0)
            return false;
    }
    return true;
}