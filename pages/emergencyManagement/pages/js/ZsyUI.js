ZsyUI = function() {};
ZsyUI.Core = {
    //格式化成指定位数的小数，不足位数补零
    changeDecimalBuZero: function(number, bitNum) {
        var f_x = parseFloat(number);
        if (isNaN(f_x)) {
            return 0;
        }
        var s_x = number.toString();
        var pos_decimal = s_x.indexOf('.');
        if (pos_decimal < 0) {
            pos_decimal = s_x.length;
            s_x += '.';
            var cnt = 1
            while (cnt <= bitNum) {
                s_x += '0';
                cnt = cnt + 1;
            }
        } else {
            if (s_x.length - pos_decimal - 1 >= bitNum) //小数位数大于指定的位数时，截断
            {
                s_x = s_x.substring(0, pos_decimal + bitNum + 1);
            } else { //小位数小于指定的位数时，补零
                var len = s_x.length - pos_decimal;
                for (i = len; i <= bitNum; i++) {
                    s_x += '0';
                    len = len + 1;
                }
            }
        }
        return s_x;
    },
    //减法函数，用来得到精确的加法结果
    //说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
    //调用：accSub(arg1,arg2)
    //返回值：arg1加上arg2的精确结果
    accSub: function(arg1, arg2) {
        var r1, r2, m, n;
        try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
        try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
        m = Math.pow(10, Math.max(r1, r2));
        return ((arg1 * m - arg2 * m) / m).toFixed(4);
    },
    //加法函数，用来得到精确的加法结果
    //说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
    //调用：accAdd(arg1,arg2)
    //返回值：arg1加上arg2的精确结果
    accAdd: function(arg1, arg2) {
        var r1, r2, m;
        try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
        try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
        m = Math.pow(10, Math.max(r1, r2))
        return ((arg1 * m + arg2 * m) / m).toFixed(4);
    },
    //乘法函数，用来得到精确的乘法结果
    //说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
    //调用：accMul(arg1,arg2)
    //返回值：arg1乘以arg2的精确结果
    accMul: function(arg1, arg2) {
        var m = 0,
            s1 = arg1.toString(),
            s2 = arg2.toString();
        try { m += s1.split(".")[1].length } catch (e) {}
        try { m += s2.split(".")[1].length } catch (e) {}
        return (Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)).toFixed(4);
    },
    //除法函数，用来得到精确的除法结果
    //说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
    //调用：accDiv(arg1,arg2)
    //返回值：arg1除以arg2的精确结果
    accDiv: function(arg1, arg2) {
        var t1 = 0,
            t2 = 0,
            r1, r2;
        try { t1 = arg1.toString().split(".")[1].length } catch (e) {}
        try { t2 = arg2.toString().split(".")[1].length } catch (e) {}
        with(Math) {
            r1 = Number(arg1.toString().replace(".", ""))
            r2 = Number(arg2.toString().replace(".", ""))
            return ((r1 / r2) * pow(10, t2 - t1)).toFixed(4);
        }
    },
    //获取当前的日期时间 格式“yyyy/MM/dd HH:MM”true为获取时间长的的格式，false为短时间yyyy/MM/dd
    GetDateNow: function(Flag) {
        var dtime = "";
        $.ajax({
            type: 'POST',
            url: SpliceUrl('/CustomerRescue/GetDefaultInfo'),
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data.Code == 1) {
                    dtime = ZsyUI.Core.FormatDate(data.Msg)
                } else {
                    top.showErrMsg(data.Msg);
                }
            }
        });
        //获取当前日期
        var date_time = new Date(dtime.replace(/-/g, "/"));
        //年
        var year = date_time.getFullYear();
        //判断小于10，前面补0
        if (year < 10) {
            year = "0" + year;
        }
        //月
        var month = date_time.getMonth() + 1;
        //判断小于10，前面补0
        if (month < 10) {
            month = "0" + month;
        }
        //日
        var day = date_time.getDate();
        //判断小于10，前面补0
        if (day < 10) {
            day = "0" + day;
        }
        //时
        var hours = date_time.getHours();
        //判断小于10，前面补0
        if (hours < 10) {
            hours = "0" + hours;
        }
        //分
        var minutes = date_time.getMinutes();
        //判断小于10，前面补0
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        //秒
        var seconds = date_time.getSeconds();
        //判断小于10，前面补0
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        var date_str = "";
        if (Flag == true) {
            //拼接年月日时分秒
            date_str = year + "/" + month + "/" + day + " " + hours + ":" + minutes;
        } else {
            //拼接年月日
            date_str = year + "/" + month + "/" + day;
        }
        return date_str;
    },
    //格式化指定日期
    FormatDate: function(dtime) {
        if (dtime == null || dtime == "" || typeof(dtime) == "undefined") { return ""; }
        var date_time = new Date(dtime.replace(/-/g, "/"));
        //年
        var year = date_time.getFullYear();
        //判断小于10，前面补0
        if (year < 10) {
            year = "0" + year;
        }
        //月
        var month = date_time.getMonth() + 1;
        //判断小于10，前面补0
        if (month < 10) {
            month = "0" + month;
        }
        //日
        var day = date_time.getDate();
        //判断小于10，前面补0
        if (day < 10) {
            day = "0" + day;
        }
        //时
        var hours = date_time.getHours();
        //判断小于10，前面补0
        if (hours < 10) {
            hours = "0" + hours;
        }
        //分
        var minutes = date_time.getMinutes();
        //判断小于10，前面补0
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        //秒
        var seconds = date_time.getSeconds();
        //判断小于10，前面补0
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        //拼接年月日时分秒
        var date_str = year + "/" + month + "/" + day + " " + hours + ":" + minutes;
        return date_str;
    },
    //格式化日期0000-00-00
    FormatShortDate: function(dtime) {
        if (dtime == null || dtime == "" || typeof(dtime) == "undefined") { return ""; }
        var date_time = new Date(dtime.replace(/-/g, "/"));
        //年
        var year = date_time.getFullYear();
        //判断小于10，前面补0
        if (year < 10) {
            year = "0" + year;
        }
        //月
        var month = date_time.getMonth() + 1;
        //判断小于10，前面补0
        if (month < 10) {
            month = "0" + month;
        }
        //日
        var day = date_time.getDate();
        //判断小于10，前面补0
        if (day < 10) {
            day = "0" + day;
        }
        //时
        var hours = date_time.getHours();
        //判断小于10，前面补0
        if (hours < 10) {
            hours = "0" + hours;
        }
        //分
        var minutes = date_time.getMinutes();
        //判断小于10，前面补0
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        //秒
        var seconds = date_time.getSeconds();
        //判断小于10，前面补0
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        //拼接年月日时分秒
        var date_str = year + "/" + month + "/" + day;
        return date_str;
    },
    //获取前几天的日期
    getBeforeDate: function(n) {
        var n = n - 1;
        var d = new Date(ZsyUI.Core.GetDateNow(true));
        var year = d.getFullYear();
        var mon = d.getMonth() + 1;
        var day = d.getDate();
        if (day <= n) {
            if (mon > 1) {
                mon = mon - 1;
            } else {
                year = year - 1;
                mon = 12;
            }
        }
        d.setDate(d.getDate() - n);
        year = d.getFullYear();
        mon = d.getMonth() + 1;
        day = d.getDate();
        s = year + "/" + (mon < 10 ? ('0' + mon) : mon) + "/" + (day < 10 ? ('0' + day) : day);
        return s;
    },
    //获取后几天的日期
    getafterDate: function(n, code) {
        var n = n;
        var d = new Date(ZsyUI.Core.GetDateNow(true));
        var year = d.getFullYear();
        var mon = d.getMonth() + 1;
        var day = d.getDate();
        var hour = d.getHours();
        var minute = d.getMinutes();
        if (day <= n) {
            if (mon > 1) {
                mon = mon - 1;
            } else {
                year = year - 1;
                mon = 12;
            }
        }
        d.setDate(d.getDate() + n);
        year = d.getFullYear();
        mon = d.getMonth() + 1;
        day = d.getDate();
        if (code == "true") {
            s = year + "/" + (mon < 10 ? ('0' + mon) : mon) + "/" + (day < 10 ? ('0' + day) : day) + " " + hour + ":" + minute;
            return s;
        } else {
            s = year + "/" + (mon < 10 ? ('0' + mon) : mon) + "/" + (day < 10 ? ('0' + day) : day);
            return s;
        }
    },
    /**
    判断输入框中输入的日期格式为yyyy-mm-dd和正确的日期
    */
    IsDate: function(mystring) {
        var a = /^(\d{4})-(\d{2})-(\d{2})$/
        if (!a.test(mystring)) {
            return false
        } else {
            return true
        }
    },
    //生成GUID字符创
    newGuid: function() {
        var guid = "";
        for (var i = 1; i <= 32; i++) {
            var n = Math.floor(Math.random() * 16.0).toString(16);
            guid += n;
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                guid += "-";
        }
        return guid;
    },
    //将金额转换成汉子的大写的金额
    GetChinese: function convertCurrency(money) {
        //汉字的数字
        var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
        //基本单位
        var cnIntRadice = new Array('', '拾', '佰', '仟');
        //对应整数部分扩展单位
        var cnIntUnits = new Array('', '万', '亿', '兆');
        //对应小数部分单位
        var cnDecUnits = new Array('角', '分', '毫', '厘');
        //整数金额时后面跟的字符
        var cnInteger = '整';
        //整型完以后的单位
        var cnIntLast = '元';
        //最大处理的数字
        var maxNum = 999999999999999.9999;
        //金额整数部分
        var integerNum;
        //金额小数部分
        var decimalNum;
        //输出的中文金额字符串
        var chineseStr = '';
        //分离金额后用的数组，预定义
        var parts;
        if (money == '') { return ''; }
        money = parseFloat(money);
        if (money >= maxNum) {
            //超出最大处理数字
            return '';
        }
        if (money == 0) {
            chineseStr = cnNums[0] + cnIntLast + cnInteger;
            return chineseStr;
        }
        //转换为字符串
        money = money.toString();
        if (money.indexOf('.') == -1) {
            integerNum = money;
            decimalNum = '';
        } else {
            parts = money.split('.');
            integerNum = parts[0];
            decimalNum = parts[1].substr(0, 4);
        }
        //获取整型部分转换
        if (parseInt(integerNum, 10) > 0) {
            var zeroCount = 0;
            var IntLen = integerNum.length;
            for (var i = 0; i < IntLen; i++) {
                var n = integerNum.substr(i, 1);
                var p = IntLen - i - 1;
                var q = p / 4;
                var m = p % 4;
                if (n == '0') {
                    zeroCount++;
                } else {
                    if (zeroCount > 0) {
                        chineseStr += cnNums[0];
                    }
                    //归零
                    zeroCount = 0;
                    chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
                }
                if (m == 0 && zeroCount < 4) {
                    chineseStr += cnIntUnits[q];
                }
            }
            chineseStr += cnIntLast;
        }
        //小数部分
        if (decimalNum != '') {
            var decLen = decimalNum.length;
            for (var i = 0; i < decLen; i++) {
                var n = decimalNum.substr(i, 1);
                if (n != '0') {
                    chineseStr += cnNums[Number(n)] + cnDecUnits[i];
                }
            }
        }
        if (chineseStr == '') {
            chineseStr += cnNums[0] + cnIntLast + cnInteger;
        } else if (decimalNum == '') {
            chineseStr += cnInteger;
        }
        return chineseStr;
    },
    //读取表格列头配置信息
    //自定义的列信息,读取配置页面code，是否读取商品扩展属性
    GetSysConfigColumns: function(cols, pageCode, GoodsAttrFlag) {
        //设置返回对象
        var retObj = {
            retFlag: true,
            cols: []
        }
        var Setcols = [];
        $.ajax({
            type: 'POST',
            url: SpliceUrl('/BasicService/GetShowColumns'),
            data: { PageCode: pageCode },
            dataType: "json",
            async: false,
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    retObj.retFlag = false;
                }
                if (data && data.Code == "1") {
                    if (data.Columns != "") {
                        Setcols = JSON.parse(data.Columns);
                    }
                    retObj.retFlag = true;
                } else {
                    top.showErrMsg(data.Msg);
                    retObj.retFlag = false;
                }
            }
        });
        //判断是否用户是否设置了显示字段，如果设置过显示字段将根据用户设置的内容加载
        if (Setcols.length > 0) {
            $.each(cols, function(index, value) {
                value.visible = false;
                //在数组中匹配值
                if (value.title == "undefined") {
                    value.visible = true;
                    return true;
                }
                if ($.inArray(value.field, Setcols) > -1) {
                    value.visible = true;
                }
            });
        }
        //没有设置将直接加载默认设置内容
        retObj.cols = cols;
        return retObj;
    },
    //绑定列显示隐藏事件并保存
    SaveSysConfigColumns: function(obj, pageCode) {
        if (pageCode == "") {
            return false;
        }
        $(".bootstrap-table .fixed-table-toolbar .columns .keep-open .dropdown-menu li input").on("click", function() {
            var col = obj.bootstrapTable('getVisibleColumns');
            var colarry = [];
            $.each(col, function(index, value) {
                colarry.push(value.field);
            });
            $.ajax({
                type: 'POST',
                url: SpliceUrl('/BasicService/SetShowColumns'),
                data: { Columns: JSON.stringify(colarry), PageCode: pageCode },
                dataType: "json",
                success: function(data) {
                    if (data && data.loginstatus && data.loginstatus == -1) {
                        top.AglinLogin();
                        return false;
                    }
                    if (data && data.Code == "1") {
                        top.showSuccessMsg(data.Msg);
                        return true;
                    } else {
                        top.showErrMsg(data.Msg);
                        return false;
                    }
                }
            })
        });
    },
    //表格选项多选项设置
    TableCheck: function(obj, selectionIds, IsEmpty) {
        //选中事件操作数组
        var union = function(array, ids) {
            $.each(ids, function(i, ID) {
                if ($.inArray(ID, array) == -1) {
                    array[array.length] = ID;
                }
            });
            return array;
        };
        //取消选中事件操作数组
        var difference = function(array, ids) {
            $.each(ids, function(i, ID) {
                var index = $.inArray(ID, array);
                if (index != -1) {
                    array.splice(index, 1);
                }
            });
            return array;
        };
        var _ = { "union": union, "difference": difference };
        //绑定选中事件、取消事件、全部选中、全部取消
        obj.on('check.bs.table check-all.bs.table uncheck.bs.table uncheck-all.bs.table', function(e, rows) {
            var ids = $.map(!$.isArray(rows) ? [rows] : rows, function(row) {
                if (IsEmpty == true) {
                    return row.ID;
                } else {
                    return row;
                }
            });
            func = $.inArray(e.type, ['check', 'check-all']) > -1 ? 'union' : 'difference';
            selectionIds = _[func](selectionIds, ids);
        });
        return selectionIds;
    },
    //接受参数方法
    getQueryString: function(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return "";
    },
    ///解码(encodeURI()转码后相应的解码)
    getUrlParam: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = decodeURI(window.location.search.substr(1)).match(reg); //匹配目标参数解码
        if (r != null) return unescape(r[2]);
        return ""; //返回参数值
    },
    //定时轮询检查session是否丢失
    CheckReLogin: function() {
        var getting = {
            url: SpliceUrl('/Home/CheckReLogin'),
            async: true,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 0) {
                    top.AglinLogin();
                    return false;
                } else if (data && data.Code == 2) {
                    showErrMsg(data.Msg);
                    return false;
                }
            }
        };
        //两分钟轮询一次
        window.setInterval(function() { $.ajax(getting) }, 1000 * 60 * 2);
    },
    //读取菜单的功能授权信息
    Authority: function(AppId, Callback) {
        $.ajax({
            type: 'POST',
            async: false,
            url: SpliceUrl('/BasicService/GetAuthority'),
            data: { AppId: AppId },
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == "1") {
                    Callback(data.Msg);
                } else {
                    top.showErrMsg(data.Msg);
                }
            }
        })
    }
};
//验证
ZsyUI.validate = {
    //qq验证
    QQ: function(value) {
        var qq = true;
        if (!(/^\d[1-9]{5,11}$/.test(value))) {
            qq = false;
        }
        return qq;
    },
    //账号验证
    Account: function(value) {
        var count = true;
        if (!(/^[0-9a-zA-Z_]{0,}$/.test(value))) {
            count = false;
        }
        return count;
    },
    //身份证号验证
    IdCardNo: function(val) {
        if (val.length == 18 || val.length == 15) {
            var pattern = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
            return pattern.test(val);
        }
    },
    //银行卡号验证
    BankCardNo: function(val) {
        var pattern = /^\d{16,19}$/;
        return pattern.test(val);
    },
    //密码验证
    Password: function(value) {
        var password = true;
        var reg = /^[A-Za-z0-9]{6,14}$/;
        var r = value.match(reg);
        if (r == null) {
            password = false;
        }
        return password;
    },
    //邮箱验证
    Email: function(value) {
        var email = true;
        if (!(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(value))) {
            email = false;
        }
        return email;
    },
    //联系电话验证
    Phone: function(value) {
        var number = true;
        if (!(/^1[2|3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(value))) {
            number = false;
        }
        return number;
    },
    //验证正整数
    Integer: function(value) {
        var number = true;
        if (!(/^[1-9]\d*$/.test(value))) {
            number = false;
        }
        return number;
    },
    //验证整数
    validateNum: function(val) {
        var patten = /^-?\d+$/;
        return patten.test(val);
    },
    //验证数字
    validateRealNum: function(val) {
        var patten = /^[0-9]+\.?[0-9]*$/;
        return patten.test(val);
    },
    //验证小数  
    validateFloat: function(val) {
        var patten = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/;
        return patten.test(val);
    },
    //只能输入数字和字母 
    validateNumOrLetter: function(val) {
        var patten = /^[A-Za-z0-9]+$/;
        return patten.test(val);
    },
    //验证空  
    validateNull: function(val) {
        return val.replace(/\s+/g, "").length == 0;
    },
    //验证时间2010-10-10 
    validateDate: function(val) {
        var patten = /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/;
        return patten.test(val);
    },
    //验证长时间yyyy/MM/dd HH:ss:mm
    validateTime: function(val) {
        var pattenA = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
        var pattenB = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2})$/;
        return pattenA.test(val) || pattenB.test(val);
    },
    //只能输入数字、字母、下划线
    validateNumLetterLine: function(val) {
        var patten = /^[a-zA-Z0-9_]{1,}$/;
        return patten.test(val);
    }
};
ZsyUI.CommonSearch = {
    //查询门店选择列表框（公共）（受权限控制）
    Organize: function(obj, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetOrganiza"),
            data: { Type: "1" },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg;
                    var org = data.UserOrg;
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Name).appendTo(obj);
                    }
                    if (IsEmpty == true) {
                        obj.selectpicker('val', " ");
                    } else {
                        obj.selectpicker('val', org);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //全部门店列表信息（不受权限控制,不排除操作员自己所属门店数据）
    Organize2: function(obj, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetOrganiza"),
            data: { Type: "1", Flag: "1" }, //读取全部，不需要权限检查
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg;
                    var org = data.UserOrg;
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Name).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //全部门店列表信息（不受权限控制,排除操作员自己所属门店数据）
    Organize3: function(obj, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetOrganiza"),
            data: { Type: "1", Flag: "1" },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg;
                    var org = data.UserOrg;
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        if (json[i].Id != org) {
                            $("<option></option>").val(json[i].Id).text(json[i].Name).appendTo(obj);
                        }
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //查询部门选择列表框（公共）
    Depart: function(obj, Organize, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetOrganiza"),
            data: { Type: "2", Organize: Organize },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Name).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //查询岗位选择列表框（公共）
    Post: function(obj, Organize, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetOrganiza"),
            data: { Type: "3", Organize: Organize },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Name).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //查询用户选择列表框（组织机构用）
    User: function(obj, OrganizeId, IsEmpty, NoSelected) {
        var NoSelected = arguments[3] == "NoSelected" ? true : false; //设置参数 
        $.ajax({
            type: 'POST',
            url: SpliceUrl('/BasicService/GetUser'),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data.Code == 1) {
                    var json = data.Msg;
                    var str = data.Msg1;
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option ></option>").val(json[i].Id).text(json[i].Name).appendTo(obj);
                    }
                    if (NoSelected == false) {
                        obj.selectpicker('val', str);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                } else {
                    top.showErrMsg(data.Msg);
                }
            }
        })
    },
    //查询用户选择列表框（不添加默认值）
    NewUser: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl('/BasicService/GetUser'),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg;
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option ></option>").val(json[i].Id).text(json[i].Name).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                } else {
                    top.showErrMsg(data.Msg);
                }
            }
        })
    },
    //查询仓库类别选择列表框
    Store: function(obj, Organize, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetStore"),
            data: { OrganizeId: Organize },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg;
                    if (json !== null) {
                        if (IsEmpty == true) {
                            $("<option></option>").val("").text("").appendTo(obj);
                        }
                        for (var i = 0; i < json.length; i++) {
                            $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                        }
                        obj.selectpicker('refresh');
                        obj.selectpicker('render');
                    }

                }
            }
        });
    },
    //查询仓库选择列表框
    StoreName: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetStoreName"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg;
                    obj.empty();
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].ID).text(json[i].Name).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //查询仓库库位列表
    StorageName: function(obj, StoreId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetStorageName"),
            data: { StoreId: StoreId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].ID).text(json[i].Name).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //查询账号类型列表
    AccountName: function(obj, OrganizeId, typeid, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetAccountInfo"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg;
                    var str = data.Msg2;
                    var strOption = "";
                    if (IsEmpty == true) {
                        strOption += "<option value=''></option>";
                    }
                    $.each(str, function(index, value) {
                        if (value.Key < typeid) {
                            strOption += "<optgroup label='" + value.Value + "'>";
                            $.each(json, function(idx, val) {
                                if (val.BTypeName == value.Value) {
                                    strOption += "<option value='" + val.ID + "'>" + val.Name + "</option>";
                                }
                            });
                            strOption += "</optgroup>";
                        }
                    });
                    obj.html(strOption);
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    AccountCome: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/DailyInPay/GetInfo"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.obj
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //查询问卷类别选择列表框
    QuestionnaireType: function(obj, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetQuestionnairetype"),
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Key).text(json[i].Value).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //查询车辆销售/预订的付款方式选择列表框
    PaymentWay: function(obj, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetPaymentWay"),
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Key).text(json[i].Value).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //查询销售渠道
    BuyingChannel: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetChannel"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //查询购车性质
    BuyingNature: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetNature"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //查询按揭银行
    BankName: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetBankName"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //查询取牌方式
    TakeCardWay: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetTakeCard"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //查询问题类别选择列表框
    ProblemType: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetProblemtype"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option data-our=" + json[i].Title + "></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //查询车类型
    VehicleType: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetVehicleType"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //查询车身颜色
    CarColor: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetCarColor"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //查询销售预订单
    YSaleOrder: function(obj, IsEmpty, OrganizeId) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetSalesYOrder"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].ID).text(json[i].SaleOderCode).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //查询内饰颜色
    TrimColor: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetTrimColor"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //查询车辆品牌
    Carbrand: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetBrandCar"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg;
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].ID).text(json[i].Name).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //查询车系
    CarModel: function(obj, OrganizeId, CarBrandId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetCarSeries"),
            data: { OrganizeId: OrganizeId, CarBrandId: CarBrandId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {

                        $("<option></option>").val(json[i].ID).text(json[i].Name).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //查询车型
    Models: function(obj, OrganizeId, CarSeriesId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetModel"),
            data: { OrganizeId: OrganizeId, CarSeriesId: CarSeriesId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg

                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].ID).text(json[i].Name).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //查询角色选择列表框
    Role: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetRoleList"),
            data: { Organize: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Name).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //查询作业分类
    JobType: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl('/BasicService/GetJobType'),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data.Code == 1) {
                    var json = data.Msg;
                    obj.empty();
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                } else {
                    top.showErrMsg(data.Msg);
                }
            }
        });
    },
    //查询作业分类
    NJobType: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl('/BasicService/GetNJobType'),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data.Code == 1) {
                    var json = data.Msg;
                    if (IsEmpty == true) {
                        json = "<option value=''></option>" + json;
                    }
                    obj.html(json);
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                } else {
                    top.showErrMsg(data.Msg);
                }
            }
        });
    },
    //查询维修部位
    Part: function(obj, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl('/BasicService/GetPart'),
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                } else {
                    top.showErrMsg(data.Msg);
                }
            }
        });
    },
    //查询跟进方式
    FollowWay: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl('/BasicService/GetFollowWay'),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                } else {
                    top.showErrMsg(data.Msg);
                }
            }
        });
    },
    //客户分类
    CustType: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl('/BasicService/GetCustType'),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                } else {
                    top.showErrMsg(data.Msg);
                }
            }
        });
    },
    //客户级别
    CustLevel: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl('/BasicService/GetCustLevel'),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                } else {
                    top.showErrMsg(data.Msg);
                }
            }
        });
    },
    //查询物资分类（公共）
    MaterialsType: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasisInfo/GetMaterialType"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg;
                    obj.empty();
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Name).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //查询物资品牌（公共）
    MaterialsBrand: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasisInfo/GetAllWZPP"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg;
                    obj.empty();
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Name).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //获取计量单位
    GetMeasureUnit: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetMeasureUnit"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg;
                    obj.empty();
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //获取施工部位
    GetSitePart: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetSitePartId"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg;
                    obj.empty();
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //获取耗材领料类型
    GetWzHcType: function(obj, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetLlType"),
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //账类
    Account: function(obj, OrganizeId, IsEmpty, setItem) {
        var setID = "";
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetAccount"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                        if (setID == "") {
                            if (setItem != "" && json[i].Title.indexOf(setItem) > -1) {
                                setID = json[i].Id;
                            }
                        }
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                    if (setID != "") {
                        obj.selectpicker('val', setID);
                    }
                }
            }
        });
    },
    //维修类型
    RepairType: function(obj, OrganizeId, IsEmpty, setItem) {
        var setID = "";
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetRepairType"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                        if (setID == "") {
                            if (setItem != "" && json[i].Title.indexOf(setItem) > -1) {
                                setID = json[i].Id;
                            }
                        }
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                    if (setID != "") {
                        obj.selectpicker('val', setID);
                    }
                }
            }
        });
    },
    //维修车型GetVehicleType
    VehicleType: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetVehicleType"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });

    },
    //品牌+车系+车型
    CarClassify: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetClassify"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Name).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //车辆品牌
    VehicleBrand: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetKB"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg; //品牌
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].ID).text(json[i].Name).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //读取品牌车系列表
    CarClass: function(obj, OrganizeId) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetKB"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg; //品牌
                    var json1 = data.Msg1; //车系
                    var strOption = "";
                    $.each(json, function(index, value) {
                        strOption += "<optgroup label='" + value.Name + "'>";
                        $.each(json1, function(idx, val) {
                            if (val.BrandId == value.ID) {
                                strOption += "<option value='" + val.ID + "'>" + val.Name + "</option>";
                            }
                        });
                        strOption += "</optgroup>";
                    });
                    obj.html(strOption);
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //查询客户评价
    CustomerEvaluation: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetCustomerEvaluation"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //查询失败原因
    FailureReason: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetFailureReason"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //查询跟踪客户来源
    CustomerSource: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetCustomerSource"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    CustomerType: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetCustomerType"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }

                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //查询跟踪客户状态
    CustomerState: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetCustomerState"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //查询意向级别状态
    CustomerStatus: function(obj, ParentId, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetCustomerStatus"),
            data: { Name: ParentId, OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //查询跟踪客户跟进状态
    CustomerDefeat: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetCustomerDefeat"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //查询门店下面的保险公司
    Insurance: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl('/BasicService/GetInceByOrgId'),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data.Code == 1) {
                    obj.empty();
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option data-our=''></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option data-our=" + json[i].InsuranceName + "></option>").val(json[i].ID).text(json[i].InsuranceName).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                } else {
                    top.showErrMsg(data.Msg);
                }
            }
        })
    },
    //查询供应商type=(整车供应商,物资供应商)
    Supplier: function(obj, IsEmpty, Types, OrganizeId) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetSupplier"),
            data: { Type: Types, OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].ID).text(json[i].SupplierName).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //根据门店获取整车仓库
    GetStoreByOrganize: function(obj, IsEmpty, OrganizeId) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetStoreByOrganize"),
            data: { Organize: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].ID).text(json[i].Name).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //投保情况
    InsureSitation: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetInsureSitation"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    FUSitation: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetFUSitation"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    ///客户信息
    SelecCustomer: function(obj, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetllCustomer"),
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].ID).text(json[i].Name).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    ///客户信息
    GetSMSType: function(obj, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/SMSModule/GetNoteThpes"),
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //历史回访时间
    GetRevisitDate: function(obj, CarSellID, Organize, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/CarSaleVisit/GetRevisitDate"),
            data: { Organize: Organize, CarSellID: CarSellID },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (json != "") {
                        if (IsEmpty == true) {
                            $("<option></option>").val("").text("").appendTo(obj);
                        }
                        for (var i = 0; i < json.length; i++) {
                            $("<option></option>").val(json[i].ID).text(ZsyUI.Core.FormatDate(json[i].BillDate)).appendTo(obj);
                        }
                        obj.selectpicker('refresh');
                        obj.selectpicker('render')
                    }

                }
            }
        });
    },
    //历史回访时间
    GetRevisitDateG: function(obj, RepairOderID, Organize, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/MaintenanceVisit/GetRevisitDate"),
            data: { Organize: Organize, RepairOderID: RepairOderID },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (json != "") {
                        if (IsEmpty == true) {
                            $("<option></option>").val("").text("").appendTo(obj);
                        }
                        for (var i = 0; i < json.length; i++) {
                            $("<option></option>").val(json[i].ID).text(ZsyUI.Core.FormatDate(json[i].BillDate)).appendTo(obj);
                        }
                        obj.selectpicker('refresh');
                        obj.selectpicker('render')
                    }

                }
            }
        });
    },
    //将当前门店的Id
    GetOrgId: function(obj, IsEmpty) {
        var Id = "";
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetNowOrgName"),
            data: { Type: "1" },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    Id = data.Id;
                }
            }
        });
        return Id;
    },
    //将当前门店的Name
    GetOrgName: function(obj, IsEmpty) {
        var Name = "";
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetNowOrgName"),
            data: { Type: "1" },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    Name = data.Name;
                }
            }
        });
        return Name;
    },
    //根据门店Id获取分红方案(type:1、股东分红2、员工分红3、客户分红、4销售提成、5施工提成、6绩效提成)
    GetPPP: function(obj, IsEmpty, OrganizeId, types) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetPPP"),
            data: { OrganizeId: OrganizeId, types: types },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.list
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].ID).text(json[i].PreceptName).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },

    GetParentId: function(obj, OrganizeId, IsEmpty, IsAll) {
        var IsAll = arguments[3] == true ? "1" : "0"; //设置参数 
        $.ajax({
            type: 'POST',
            url: SpliceUrl('/BasicService/GetParentId'),
            data: { OrganizeId: OrganizeId, IsAll: IsAll },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data.Code == 1) {
                    var json = data.Msg;
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Name).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                } else {
                    top.showErrMsg(data.Msg);
                }
            }
        });
    },
    GetPaId: function(obj, OrganizeId, UserId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl('/BasicService/GetPaId'),
            data: { OrganizeId: OrganizeId, UserId: UserId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data.Code == 1) {
                    var json = data.Msg;
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Name).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                } else {
                    top.showErrMsg(data.Msg);
                }
            }
        });
    },
    //车辆销售服务方式
    SCSeriveWay: function(obj, OrganizeId, IsEmpty) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetSCSeriveWay"),
            data: { OrganizeId: OrganizeId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //车辆销售付款方式
    SCPaymentWay: function(obj, OrganizeId, IsEmpty, ParentId) {
        $.ajax({
            type: 'POST',
            url: SpliceUrl("/BasicService/GetSCPaymentWay"),
            data: { OrganizeId: OrganizeId, ParentId: ParentId },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg
                    if (IsEmpty == true) {
                        $("<option></option>").val("").text("").appendTo(obj);
                    }
                    for (var i = 0; i < json.length; i++) {
                        $("<option></option>").val(json[i].Id).text(json[i].Title).appendTo(obj);
                    }
                    obj.selectpicker('refresh');
                    obj.selectpicker('render');
                }
            }
        });
    },
    //短信替换内容
    //系统ID：SystemID
    //短信内容：ReplaceContent
    //所属门店：OrganizeID
    //替换内容：ReplaceData
    ReplaceMethod: function(SystemID, ReplaceContent, ReplaceData, OrganizeID) {
        //返回内容
        var ReturnData = [];
        $.ajax({
            type: 'POST',
            url: SpliceUrl('/SMSSetUp/ReplaceData'),
            data: { SystemID: SystemID, OrganizeID: OrganizeID },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data && data.loginstatus && data.loginstatus == -1) {
                    top.AglinLogin();
                    return false;
                }
                if (data && data.Code == 1) {
                    var json = data.Msg; //系统参数
                    var json2 = data.Msg2; //系统模板内容
                    var content = ReplaceContent; //自定义模板内容
                    if (ReplaceContent == "") {
                        content = json2[0].SMSContent
                    }
                    for (var k = 0; k < ReplaceData.length; k++) {
                        for (var i = 0; i < json.length; i++) {
                            content = content.replace(new RegExp("{" + json[i].ParameterName + "}", "gi"), "{" + json[i].FieldName + "}")
                            content = content.replace(new RegExp("{" + json[i].FieldName + "}", "gi"), ReplaceData[k][json[i].FieldName])
                        }
                        var ContentNum = parseInt(parseFloat(content.length) / 67);
                        if (parseFloat(content.length) % 67 > 0) {
                            ContentNum = parseFloat(ContentNum) + 1;
                        }
                        var cd = {
                            SmsContentS: content,
                            ContentNum: ContentNum,
                            CusID: ReplaceData[k].ID,
                            CusName: ReplaceData[k].Contacts,
                            CusPhone: ReplaceData[k].ContactPhone,
                            OrganizeID: OrganizeID,
                        }
                        ReturnData.push(cd);
                        if (ReplaceContent == "") {
                            content = json2[0].SMSContent
                        } else {
                            content = ReplaceContent; //模板内容
                        }
                    }
                }
            }
        })

        return ReturnData;
    }

}