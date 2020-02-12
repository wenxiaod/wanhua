//SVG Engine
//0.0.7
//ZhangTao
/// <reference path="../js/jquery.js" />
/// <reference path="../js/snap.svg.js" />
/// <reference path="websocket.js" />
/// <reference path="jquery.cookie.js" />

var SvgEngine = {
    ContainerId: "td",
    BgColor: "b7bf76",
    BgImg: "",
    LocalPwd: 9527,
    UserId: '',
    UserName: '',
    CompanyId: '',
    CompanyName: '',
    DtuIds: [],
    //WebServer地址
    ServerUrl: 'http://hmi.scadacc.com', //'http://localhost:12311',
    //量程数组所需参数：{PremitiveId,MaxHeight,MinHeight,MaxValue,MinValue}
    Ranges: [],
    //条件颜色数组所需参数：{PremitiveId,ConditionColors:[{[{Operator,Value}],Color}]}
    ColorConditions: [],
    //条件文本数组所需参数：{PremitiveId,ConditionTexts:[{[{Operator,Value}],Text}]}
    TextConditions: [],
    //条件脚本数组所需参数：{PremitiveId,ConditionScripts:[{[{Operator,Value}],Script}]}
    ScriptConditions: [],
    //条件旋转数组所需参数：{PremitiveId,RotateConditons:[{[{Operator,Value}],Color}]}
    RotateConditons: [],
    //条件滑动数组所需参数：{PremitiveId,SlipConditons:[{[{Operator,Value}],Color}]}
    SlipConditons: [],
    //条件轨迹数组所需参数：{PremitiveId,TrailConditions:[{[{Operator,Value}],Color}]}
    TrailConditions: [],
    //循环执行数组：{Id,Timer}
    Timers: [],
    //单次或开关事件{Value}或{X,Y}
    Steps: [],
    //保存初始值{Id,Value}
    Origines: [],
    //条件闪烁{Id,Timer}
    ConditionTwinkles: [],
    //数据数组{Id,Value}
    DataValues: [],
    BaseTime: 1000,
    InterTime: 1500,
    //最顶层画面的z-index
    DivIndex: 1,
    //当前输入框（指输入框控件中的Text）
    CurrentInputBox: null,
    //数据驱动
    DataDrives: null,
    //HTTP请求
    HttpDrives: null,
    //图表显示设置
    ChartTables: null,
    //控制命令
    ControlOrders: null,
    //浮动参数：{'PID':{{0}},'Parameters':[{{1}}]}  -->  {'Name':{'T':'{{0}}','V':'{{1}}'},'Value':{'T':'{{2}}','V':'{{3}}'},'Unit':{'T':'{{4}}','V':'{{5}}'}}
    FloatParameters: null,
    //设置图元属性
    SetValue: function(obj, valType, val, speed, objType) {
        if (obj && objType && objType == "data") {
            var exist = false;
            $.each(SvgEngine.DataValues, function(i, o) {
                if (o.Id == obj.toUpperCase()) {
                    o.Value = val;
                    exist = true;
                    return false;
                }
            });
            if (!exist) {
                SvgEngine.DataValues.push({ Id: obj.toUpperCase(), Value: val });
            }
            var objs = obj.split('.');
            $.each($("[dataid]"), function(i, o) {
                if ($(this).attr("dataid").toUpperCase() == obj.toUpperCase() && $(this).is("text")) {
                    SvgEngine.SetValue("#" + $(this).attr("id"), "text", SvgEngine.FixNumber(val, $(this).attr("formatId")), speed);
                } else if (SvgEngine.DtuIds.length < 2 && objs.length > 1 && $(this).attr("dataid").toUpperCase() == objs[objs.length - 1].toUpperCase() && $(this).is("text")) {
                    SvgEngine.SetValue("#" + $(this).attr("id"), "text", val, speed);
                }
                if (obj.length < $(this).attr("dataid").length && $(this).attr("dataid").toUpperCase().indexOf(obj.toUpperCase()) >= 0) {
                    SvgEngine.SetValue("#" + $(this).attr("id"), "text", SvgEngine.FixNumber(SvgEngine.GetDataValue("#" + $(this).attr("dataid")), $(this).attr("formatId")), speed);
                }
            });
            //if (WebSC.DtuStatus) {
            $.each($("[labelid]"), function(i, o) {
                if ($(this).attr("labelid").toUpperCase() == obj.toUpperCase()) {
                    SvgEngine.RangeController(obj, val);
                    SvgEngine.ConditionController(obj, val);
                } else if (SvgEngine.DtuIds.length < 2 && objs.length > 1 && $(this).attr("labelid").toUpperCase() == objs[objs.length - 1].toUpperCase()) {
                    SvgEngine.RangeController(objs[objs.length - 1], val);
                    SvgEngine.ConditionController(objs[objs.length - 1], val);
                }
            });
            //}
        } else if (obj && $(obj)) {
            var curTime = (!speed) ? SvgEngine.InterTime : (SvgEngine.InterTime + (1 - speed) * 1000);
            switch (valType) {
                case "text":
                    $(obj).text(val);
                    SvgEngine.RangeController($(obj).attr("id"), val);
                    SvgEngine.ConditionController($(obj).attr("id"), val);
                    break;
                case "focusin":
                case "focusout":
                case "activate":
                case "click":
                case "mousedown":
                case "mouseover":
                case "mouseup":
                case "mousemove":
                case "mouseout":
                case "keypress":
                case "keyup":
                case "keydown":
                case "dblclick":
                    if ($(obj).attr("id"))
                        document.getElementById($(obj).attr("id")).setAttribute('class', 'svgHover');
                    $(obj).bind(valType, val);
                    break;
                case "transform":
                    Snap(obj).animate({ transform: val }, curTime);
                    break;
                case "fill":
                    if (val.indexOf("url(#") === 0 || $(obj).attr("fill").indexOf("url(#") === 0) {
                        $(obj).attr(valType, val);
                    } else {
                        Snap(obj).animate({ fill: val }, curTime);
                    }
                    break;
                case "height":
                    Snap(obj).animate({ height: val }, curTime);
                    break;
                case "width":
                    Snap(obj).animate({ width: val }, curTime);
                    break;
                case "opacity":
                    Snap(obj).animate({ opacity: val }, curTime);
                    break;
                case "rx":
                    Snap(obj).animate({ rx: val }, curTime);
                    break;
                case "ry":
                    Snap(obj).animate({ ry: val }, curTime);
                    break;
                case "cx":
                    Snap(obj).animate({ cx: val }, curTime);
                    break;
                case "cy":
                    Snap(obj).animate({ cy: val }, curTime);
                    break;
                default:
                    $(obj).attr(valType, val);
                    break;
            }
        }
    },
    //根据图元标签值和用户定义的量程控制图元高度
    RangeController: function(obj, objValue) {
        var curTime = SvgEngine.BaseTime;
        var pat = eval("/" + obj.toUpperCase() + "/");
        $.each(SvgEngine.Ranges, function(i, range) {
            if ($("#" + range.PremitiveId).attr("labelid") && pat.test($("#" + range.PremitiveId).attr("labelid").toUpperCase()) && range.MaxValue != range.MinValue) {
                objValue = SvgEngine.GetDataValue($("#" + range.PremitiveId).attr("labelid"));
                var h = Math.floor(range.MinHeight + (range.MaxHeight - range.MinHeight) / (range.MaxValue - range.MinValue) * objValue);
                Snap("#" + range.PremitiveId).animate({ height: h }, curTime);
                setTimeout(function() { waves.Init(range.PremitiveId); }, curTime);
                //return false;
            }
        });
    },
    //根据图元标签值和用户定义条件控制图元颜色
    ConditionController: function(obj, objValue) {
        var curTime = SvgEngine.BaseTime;
        var pat = eval("/" + obj.toUpperCase() + "/");
        $.each(SvgEngine.ColorConditions, function(i, colorCondition) {
            if ($("#" + colorCondition.PremitiveId).attr("labelid") && pat.test($("#" + colorCondition.PremitiveId).attr("labelid").toUpperCase())) {
                var labelValue = SvgEngine.GetDataValue($("#" + colorCondition.PremitiveId).attr("labelid"));
                $.each(colorCondition.ConditionColors, function(j, cc) {
                    var iTrue = 0;
                    $.each(cc.Conditions, function(k, c) {
                        var valTemp = isNaN(labelValue) ? c.Value : parseFloat(c.Value);
                        switch (c.Operator) {
                            case "=":
                                iTrue += (labelValue == valTemp) ? 1 : 0;
                                break;
                            case "!=":
                                iTrue += (labelValue != valTemp) ? 1 : 0;
                                break;
                            case ">":
                                iTrue += (labelValue > valTemp) ? 1 : 0;
                                break;
                            case ">=":
                                iTrue += (labelValue >= valTemp) ? 1 : 0;
                                break;
                            case "<":
                                iTrue += (labelValue < valTemp) ? 1 : 0;
                                break;
                            case "<=":
                                iTrue += (labelValue <= valTemp) ? 1 : 0;
                                break;
                        }
                    });
                    if (cc.Conditions.length != 0 && iTrue == cc.Conditions.length) {
                        if ($("#" + colorCondition.PremitiveId).attr("fill")) {
                            if (cc.Color.indexOf("url(#") === 0 || $("#" + colorCondition.PremitiveId).attr("fill").indexOf("url(#") === 0) {
                                $("#" + colorCondition.PremitiveId).attr("fill", cc.Color);
                                $("#" + colorCondition.PremitiveId).attr("stroke", cc.Color);
                            } else {
                                Snap("#" + colorCondition.PremitiveId).animate({ "fill": cc.Color }, curTime);
                                Snap("#" + colorCondition.PremitiveId).animate({ "stroke": cc.Color }, curTime);
                            }
                        }
                        SvgEngine.SetConditionTwinkle(colorCondition.PremitiveId, cc.IsTwinkle == "1" ? 1 : 0);
                    }
                });
            }
        });
        $.each(SvgEngine.TextConditions, function(i, textCondition) {
            if ($("#" + textCondition.PremitiveId).attr("labelid") && pat.test($("#" + textCondition.PremitiveId).attr("labelid").toUpperCase())) {
                var labelValue = SvgEngine.GetDataValue($("#" + textCondition.PremitiveId).attr("labelid"));
                $.each(textCondition.ConditionTexts, function(j, cc) {
                    var iTrue = 0;
                    $.each(cc.Conditions, function(k, c) {
                        var valTemp = isNaN(labelValue) ? c.Value : parseFloat(c.Value);
                        switch (c.Operator) {
                            case "=":
                                iTrue += (labelValue == valTemp) ? 1 : 0;
                                break;
                            case "!=":
                                iTrue += (labelValue != valTemp) ? 1 : 0;
                                break;
                            case ">":
                                iTrue += (labelValue > valTemp) ? 1 : 0;
                                break;
                            case ">=":
                                iTrue += (labelValue >= valTemp) ? 1 : 0;
                                break;
                            case "<":
                                iTrue += (labelValue < valTemp) ? 1 : 0;
                                break;
                            case "<=":
                                iTrue += (labelValue <= valTemp) ? 1 : 0;
                                break;
                        }
                    });
                    if (cc.Conditions.length != 0 && iTrue == cc.Conditions.length) {
                        if (cc.Text) {
                            //$("#" + textCondition.PremitiveId).text(cc.Text);
                            SvgEngine.SetValue("#" + textCondition.PremitiveId, "text", cc.Text);
                        }
                        $("#" + textCondition.PremitiveId).css('display', (cc.Visible == '1') ? '' : 'none');
                    }
                });
            }
        });
        $.each(SvgEngine.ScriptConditions, function(i, scriptCondition) {
            if ($("#" + scriptCondition.PremitiveId).attr("labelid") && pat.test($("#" + scriptCondition.PremitiveId).attr("labelid").toUpperCase())) {
                var labelValue = SvgEngine.GetDataValue($("#" + scriptCondition.PremitiveId).attr("labelid"));
                $.each(scriptCondition.ConditionScripts, function(j, cc) {
                    var iTrue = 0;
                    $.each(cc.Conditions, function(k, c) {
                        var valTemp = isNaN(labelValue) ? c.Value : parseFloat(c.Value);
                        switch (c.Operator) {
                            case "=":
                                iTrue += (labelValue == valTemp) ? 1 : 0;
                                break;
                            case "!=":
                                iTrue += (labelValue != valTemp) ? 1 : 0;
                                break;
                            case ">":
                                iTrue += (labelValue > valTemp) ? 1 : 0;
                                break;
                            case ">=":
                                iTrue += (labelValue >= valTemp) ? 1 : 0;
                                break;
                            case "<":
                                iTrue += (labelValue < valTemp) ? 1 : 0;
                                break;
                            case "<=":
                                iTrue += (labelValue <= valTemp) ? 1 : 0;
                                break;
                        }
                    });
                    if (cc.Conditions.length != 0 && iTrue == cc.Conditions.length) {
                        var s = eval(unescape(cc.Script));
                    }
                });
            }
        });
        $.each(SvgEngine.RotateConditons, function(i, scriptCondition) {
            if ($("#" + scriptCondition.PremitiveId).attr("labelid") && pat.test($("#" + scriptCondition.PremitiveId).attr("labelid").toUpperCase())) {
                var labelValue = SvgEngine.GetDataValue($("#" + scriptCondition.PremitiveId).attr("labelid"));
                $.each(scriptCondition.ConditonRotates, function(j, cc) {
                    var iTrue = 0;
                    $.each(cc.Conditions, function(k, c) {
                        var valTemp = isNaN(labelValue) ? c.Value : parseFloat(c.Value);
                        switch (c.Operator) {
                            case "=":
                                iTrue += (labelValue == valTemp) ? 1 : 0;
                                break;
                            case "!=":
                                iTrue += (labelValue != valTemp) ? 1 : 0;
                                break;
                            case ">":
                                iTrue += (labelValue > valTemp) ? 1 : 0;
                                break;
                            case ">=":
                                iTrue += (labelValue >= valTemp) ? 1 : 0;
                                break;
                            case "<":
                                iTrue += (labelValue < valTemp) ? 1 : 0;
                                break;
                            case "<=":
                                iTrue += (labelValue <= valTemp) ? 1 : 0;
                                break;
                        }
                    });
                    if (cc.Conditions.length != 0 && iTrue == cc.Conditions.length) {
                        if (cc.EnableAnimate == 1) {
                            SvgEngine.SetRotaeByType("#" + scriptCondition.PremitiveId, cc.RotateAngle, cc.RotateX, cc.RotateY, cc.RotateSpeed, cc.RotateType);
                        } else {
                            SvgEngine.StopRotateLoop("#" + scriptCondition.PremitiveId);
                        }
                    }
                });
            }
        });
    },
    //取得当前标签的值
    GetDataValue: function(id) {
        var arr = id.match(/[\+\-\*\/\|\&]|(\w|\.)+|(\w|\.)+/g);
        var result = null;
        var sign = '+';
        $.each(arr, function(i, o) {
            if (o == '+' || o == '-' || o == '*' || o == '/') {
                sign = o;
                return true;
            }
            var val = null;
            if (o.match(/(\w|\.)+/) && o.match(/(\w|\.)+/).length > 0) {
                var labelId = o.match(/(\w|\.)+/)[0];
                if (!isNaN(labelId)) {
                    val = labelId;
                } else if ($('#' + labelId).length > 0) {
                    val = $('#' + labelId).text();
                } else {
                    labelId = labelId.toUpperCase();
                    $.each(SvgEngine.DataValues, function(j, p) {
                        var pIds = p.Id.split('.');
                        if (labelId == p.Id || labelId == pIds[pIds.length - 1]) {
                            val = p.Value;
                            return false;
                        }
                    });
                }
            } else {
                return true;
            }
            var tempVal = parseFloat(val);
            if (isNaN(tempVal)) {
                result = val;
            } else {
                if (result == null) {
                    result = 0;
                }
                switch (sign) {
                    case "+":
                        result += tempVal;
                        break;
                    case "-":
                        result -= tempVal;
                        break;
                    case "*":
                        result *= tempVal;
                        break;
                    case "/":
                        if (tempVal != 0) {
                            result /= tempVal;
                        }
                        break;
                    case "|":
                        result = result || tempVal;
                        break;
                    case "&":
                        result = result && tempVal;
                        break;
                    default:
                        result += tempVal;
                        break;
                }
            }
        });
        //if (!isNaN(result)) {
        //    result = Math.floor(result * 1000) / 1000;
        //}
        return result;
    },
    //设置高度与宽度
    SetHeight: function(obj, valType, val) {
        var curTime = SvgEngine.InterTime;
        var startValue;
        $.each(SvgEngine.Origines, function(i, o) {
            if (o.Id == obj + valType) {
                startValue = o.Value;
                return false;
            }
        });
        if (!startValue) {
            startValue = parseFloat($(obj).attr(valType));
            Origines.push({ Id: obj + valType, Value: parseFloat($(obj).attr(valType)) })
        }
        $(obj).attr(valType, startValue);
        var endValue = parseFloat(val);
        var interValue = (endValue - startValue) / 100;
        var timer = setInterval(function() {
            if (parseInt(startValue) == parseInt(endValue)) {
                clearInterval(timer);
            } else {
                startValue += interValue;
                $(obj).attr(valType, parseInt(startValue));
            }
        }, curTime / 100);
    },
    //按类型设置旋转动画
    SetRotaeByType: function(obj, val, x, y, speed, rotateType) {
        if (rotateType == 0) {
            SvgEngine.SetValue(obj, 'transform', 'r' + val + ',' + x + ',' + y, speed);
        } else if (rotateType == 1) {
            SvgEngine.StartRotateLoop(obj, val, x, y, speed);
        } else if (rotateType == 2) {
            SvgEngine.SetValue(obj, 'transform', 'r' + val + ',' + x + ',' + y, speed);
        }
    },
    //启动循环旋转动画
    StartRotateLoop: function(obj, val, x, y, speed) {
        var timeId = 'rotate' + obj;
        var timerExits = false;
        $.each(SvgEngine.Timers, function(i, t) {
            if (t && t.Id == timeId) {
                timerExits = true;
                return false;
            }
        });
        if (!timerExits) {
            SvgEngine.SetRotate(obj, val, x, y, speed);
            var curTime = (speed == undefined) ? SvgEngine.InterTime : (SvgEngine.InterTime + (1 - speed) * 1000);
            var timer = setInterval(function() {
                SvgEngine.SetRotate(obj, val, x, y, speed);
            }, curTime);
            SvgEngine.Timers.push({
                Id: timeId,
                Timer: timer
            });
        }
    },
    //停止循环旋转
    StopRotateLoop: function(obj) {
        var timeId = 'rotate' + obj;
        $.each(SvgEngine.Timers, function(i, t) {
            {
                if (t && t.Id == timeId) {
                    clearInterval(t.Timer);
                    SvgEngine.Timers.splice(i, 1);
                    return false;
                }
            }
        });
    },
    //旋转
    SetRotate: function(obj, val, x, y, speed) {
        var curTime = (speed == undefined) ? SvgEngine.InterTime : (SvgEngine.InterTime + (1 - speed) * 1000);
        var startValue = 0;
        var interValue = parseFloat(val) / 100;
        var timer = setInterval(function() {
            if (parseInt(startValue) == parseInt(val)) {
                clearInterval(timer);
            } else {
                startValue += interValue;
                $(obj).attr("transform", ("rotate(" + parseInt(startValue) + ", " + x + ", " + y + ")"));
            }
        }, curTime / 100);
    },
    //移动
    SetPosition: function(obj, x, y, speed) {
        var curTime = (speed == undefined) ? SvgEngine.InterTime : (SvgEngine.InterTime + (1 - speed) * 1000);
        var startX = 0;
        var startY = 0;
        var interX = parseFloat(x) / 100;
        var interY = parseFloat(y) / 100;
        var timer = setInterval(function() {
            if (parseInt(startX) == parseInt(x) && parseInt(startY) == parseInt(y)) {
                clearInterval(timer);
            } else {
                startX += interX;
                startY += interY;
                $(obj).attr("transform", 'translate(' + startX + ' ' + startY + ')');
            }
        }, curTime / 100);
    },
    //闪烁
    SetColor: function(obj, cs, speed) {
        var curTime = (speed == undefined) ? SvgEngine.InterTime : (SvgEngine.InterTime + (1 - speed) * 1000);
        var colors = eval('(' + cs + ')');
        if (colors.length == 0) {
            return false;
        }
        var avgTime = parseInt(curTime / colors.length);
        for (i = 0; i < colors.length; i++) {
            setTimeout("$('" + obj + "').attr('fill', '" + colors[i] + "');", avgTime * i);
        }
    },
    //旋转（单次）
    SetRotateStep: function(id, obj, val, x, y, speed) {
        if (!SvgEngine.Steps[id]) {
            SvgEngine.Steps[id] = { Value: val };
        }
        SvgEngine.SetValue(obj, 'transform', 'r' + SvgEngine.Steps[id].Value + ',' + x + ',' + y, speed);
        SvgEngine.Steps[id].Value += val;
    },
    //旋转（开关）
    SetRotateSwitch: function(id, obj, val, x, y, speed) {
        if (!SvgEngine.Steps[id]) {
            SvgEngine.Steps[id] = { Value: 0.000001 };
        }
        SvgEngine.Steps[id].Value = (SvgEngine.Steps[id].Value == val ? 0.000001 : val);
        SvgEngine.SetValue(obj, 'transform', 'r' + SvgEngine.Steps[id].Value + ',' + x + ',' + y, speed);
    },
    //滑动（单次）
    SetSlipStep: function(id, obj, x, y, speed) {
        if (!SvgEngine.Steps[id]) {
            SvgEngine.Steps[id] = { X: x, Y: y };
        }
        SvgEngine.SetValue(obj, 'transform', 't' + SvgEngine.Steps[id].X + ',' + SvgEngine.Steps[id].Y + ')', speed);
        SvgEngine.Steps[id].X += x;
        SvgEngine.Steps[id].Y += y;
    },
    //滑动（开关）
    SetSlipSwitch: function(id, obj, startX, startY, x, y, speed) {
        var sx = startX - $(obj).attr("x");
        var sy = startY - $(obj).attr("y");
        if (!SvgEngine.Steps[id]) {
            SvgEngine.Steps[id] = { X: sx, Y: sy };
        }
        if (SvgEngine.Steps[id].X == x && SvgEngine.Steps[id].Y == y) {
            SvgEngine.Steps[id] = { X: sx, Y: sy };
        } else {
            SvgEngine.Steps[id] = { X: x, Y: y };
        }
        SvgEngine.SetValue(obj, 'transform', 't' + SvgEngine.Steps[id].X + ',' + SvgEngine.Steps[id].Y + ')', speed);
    },
    //闪烁（单次）
    SetTwinkleStep: function(obj, cs, speed) {
        SvgEngine.SetColor(obj, cs, speed);
    },
    //闪烁（开关）
    SetTwinkleSwitch: function(id, obj, cs, speed) {
        if (!SvgEngine.Steps[id]) {
            SvgEngine.Steps[id] = { Value: 1, Fill: $(obj).attr("fill") };
        }
        if (SvgEngine.Steps[id].Value == 1) {
            SvgEngine.SetColor(obj, cs, speed);
        } else {
            $(obj).attr("fill", SvgEngine.Steps[id].Fill);
        }
        SvgEngine.Steps[id].Value = (SvgEngine.Steps[id].Value == 1) ? 0 : 1;
    },
    //设置条件闪烁
    SetConditionTwinkle: function(id, isvisable) {
        $.each(SvgEngine.ConditionTwinkles, function(i, o) {
            if (o.Id == id) {
                startValue = o.Value;
                clearInterval(o.Timer);
                SvgEngine.ConditionTwinkles.splice(i, 1);
                $("#" + id).attr("fill-opacity", 1);
                return false;
            }
        });
        if (isvisable == "1") {
            var timer = setInterval(function() {
                $("#" + id).attr("fill-opacity", $("#" + id).attr("fill-opacity") == 1 ? 0 : 1);
            }, 500);
            SvgEngine.ConditionTwinkles.push({ Id: id, Timer: timer });
        }
    },
    //调用WCF服务：param为json格式的参数列表
    CallWcfService: function(wcfUrl, param) {
        $.ajax({
            url: wcfUrl,
            type: "post",
            data: param,
            dataType: "json",
            error: function(xhr) {
                console.log("error:" + xhr.responseText);
            },
            success: function(data) {
                console.log('success:' + data);
            }
        });
    },
    //设置当前选中的输入框的值
    SetCurrentInputBoxValue: function(e) {
        $('#divPopText').hide();
        $(SvgEngine.CurrentInputBox).text($(e).parent().children('input[type=text]').val());
    },
    //页面加载时生成并绑定输入框事件
    GeneratePopTextDiv: function() {
        if ($('g[class=text]').length > 0 && $('#divPopText').length == 0) {
            $(document.body).append("<div style='width:100%;height:100%;display:none;' id='divPopText'><div id='divMaskText' class='maskDiv'></div><div id='divTopText' class='topDiv' style='width: 300px; height: 50px; margin-left:100px;margin-top:110px;'><span class='popText' style='margin-left:10px;'>请输入：</span><input type='text' class='popText' style='width: 150px;'><input type='button' onclick='SvgEngine.SetCurrentInputBoxValue(this);' class='popText button' style='width:60px;margin-left:10px;' value='确定'/></div></div>");
        }
        $('g[class=text]').click(function(e) {
            SvgEngine.CurrentInputBox = $(this).children('text');
            $('#divTopText').children('input[type=text]').val($(this).children('text').text());
            $('#divPopText').show();
            $('#divTopText').css('margin-top', e.pageY);
            $('#divTopText').css('margin-left', e.pageX);
            if (SvgEngine.CurrentInputBox.attr('maxlength')) {
                $('#divTopText').children('input[type=text]').attr('maxlength', SvgEngine.CurrentInputBox.attr('maxlength'));
            }
            $('#divTopText').children('input[type=text]').focus();
        });
    },
    //全屏报警临时Timer
    ItvlEmergency: 0,
    //停止全屏报警
    StopEmergency: function() {
        clearInterval(SvgEngine.ItvlEmergency);
        SvgEngine.ItvlEmergency = 0;
        $('.emergencyDiv').remove();
    },
    //启动全屏报警
    StartEmergency: function() {
        if (SvgEngine.ItvlEmergency == 0) {
            $(document.body).append("<div class='emergencyDiv' onclick='SvgEngine.StopEmergency();'/>");
            var opacityDir = 1;
            SvgEngine.ItvlEmergency = setInterval(function() {
                var opty = parseFloat($('.emergencyDiv').css('opacity')) + ((opacityDir == 1) ? 0.05 : -0.05);
                if (opty > 0.5) {
                    opacityDir = -1;
                } else if (opty < 0.1) {
                    opacityDir = 1;
                }
                $('.emergencyDiv').css('opacity', opty);
            }, 100);
        }
    },
    //是否通过短信验证:未验证0，验证通过1，验证未通过2
    IsAuthorticated: 0,
    //临时的方法回调函数
    TempAuthorticateFuctionCallBack: null,
    //生成手机验证码DIV
    GenerateMessageAuthorticationDiv: function() {
        if ($('#divMessageAuthortication').length == 0) {
            $(document.body).append("<div id='divMessageAuthortication' style='border:5px solid #82C5FA;position:fixed;display:none;'><svg width='355' height='120' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient id='csvg_7' spreadMethod='pad' x2='0' y2='1'><stop stop-color='#ffffff' stop-opacity='1' offset='0'/><stop stop-color='#d5bfff' stop-opacity='1' offset='0.5'/><stop stop-color='#ffffff' stop-opacity='1' offset='1'/></linearGradient><linearGradient y2='1' x2='0' spreadMethod='pad' id='csvg_3' x1='0' y1='0'><stop offset='0' stop-opacity='1' stop-color='#ffffff'/><stop offset='0.5' stop-opacity='1' stop-color='#b7b7b7'/><stop offset='1' stop-opacity='1' stop-color='#ffffff'/></linearGradient></defs><g><rect stroke='#000000' fill='#e5e7ff' x='1' y='1' width='355' height='120' id='csvg_2'/><text xml:space='preserve' text-anchor='start' font-family='宋体' font-size='15' id='csvg_1' y='38' x='13' stroke-width='0' stroke='#000000' fill='#000000'>系统已将验证码发送至您的手机，请填入验证码：</text><text id='csvg_5' xml:space='preserve' text-anchor='start' font-family='宋体' font-size='12' y='65' x='132' stroke-width='0' stroke='#000000' fill='#000000'>没有收到验证码？</text><g id='buttonConfirm' class='button'><rect stroke='#000000' id='csvg_9' height='27' width='99' y='82.5' x='66.5' fill='url(#csvg_7)'/><text font-weight='bold' id='csvg_10' xml:space='preserve' text-anchor='start' font-family='宋体' font-size='15' y='101.5' x='97' stroke-width='0' stroke='#000000' fill='#000000'>确 定</text></g><g id='buttonCancel' class='button'><rect id='csvg_13' stroke='#000000' height='27' width='99' y='82.5' x='201.5' fill='url(#csvg_7)'/><text id='csvg_14' font-weight='bold' xml:space='preserve' text-anchor='start' font-family='宋体' font-size='15' y='101.5' x='230' stroke-width='0' fill='#000000' stroke='#000000'>取 消</text></g><g id='buttonReSend' class='button'><rect id='csvg_6' height='23' width='100' y='49' x='231' stroke='#000000' fill='url(#csvg_3)'/><text id='csvg_8' xml:space='preserve' text-anchor='middle' font-family='宋体' font-size='12' y='64.5' x='287' stroke-width='0' stroke='#000000' fill='#000000'>秒后重新发送</text><text id='csvg_12' xml:space='preserve' text-anchor='end' font-family='宋体' font-size='13' y='65.5' x='250' stroke-width='0' stroke='#000000' fill='#000000'>60</text></g><g id='csvg_18' class='text'><rect stroke='#000000' id='csvg_4' height='22' width='108' y='49' x='16' fill='#ffffff'/><text xml:space='preserve' text-anchor='middle' font-family='宋体' font-size='12' y='63.5' x='68' stroke-width='0' stroke='#000000' fill='#000000' id='ctxtCheckCode' maxlength='6'></text></g></g></svg></div>");
            SvgEngine.GeneratePopTextDiv();
            SvgEngine.BindConfirmMessageAuthortication(function() { SvgEngine.TempAuthorticateFuctionCallBack.call(this); });
            SvgEngine.BindCancelMessageAuthortication();
        }
    },
    //显示手机验证码
    ShowMessageAuthortication: function(e) {
        if (WebSC.IsSocketAlive()) {
            if (SvgEngine.IsAuthorticated == 1) {
                //已经通过短信验证，直接返回true，并进行后续接口调用
                if (typeof SvgEngine.TempAuthorticateFuctionCallBack == 'function') {
                    SvgEngine.TempAuthorticateFuctionCallBack.call(this);
                }
                return true;
            } else {
                //未通过短信验证，需进行验证，返回false
                SvgEngine.GenerateMessageAuthorticationDiv();
                SvgEngine.SendMessageAuthortication();
                if (e) {
                    $("#divMessageAuthortication").css('left', e.pageX);
                    $("#divMessageAuthortication").css('top', e.pageY);
                } else {
                    $("#divMessageAuthortication").css('left', 200);
                    $("#divMessageAuthortication").css('top', 100);
                }
                $('#divMessageAuthortication').show();

                return false;
            }
        }
    },
    //隐藏手机验证码DIV
    HideMessageAuthortication: function() {
        $('#divMessageAuthortication').hide();
        //clearInterval(SvgEngine.ItvlCheckCode);
        clearInterval(SvgEngine.ItvlConfirmMessage);
    },
    //手机验证码interval
    ItvlCheckCode: 0,
    //发送手机验证码
    SendMessageAuthortication: function() {
        if (WebSC.IsSocketAlive()) {
            $('#divMessageAuthortication').show();
            if (SvgEngine.ItvlCheckCode == 0) {
                clearInterval(SvgEngine.ItvlCheckCode);
                SvgEngine.ItvlCheckCode = setInterval(function() {
                    var leftTime = parseInt($('#csvg_12').text()) - 1;
                    if (leftTime > 0) {
                        $('#csvg_12').text(leftTime);
                    } else {
                        clearInterval(SvgEngine.ItvlCheckCode);
                        SvgEngine.ItvlCheckCode = 0;
                        SvgEngine.EnableMessageAuthortication();
                    }
                }, 1000);
                WebSC.RequestValidCode();
            }
        }
    },
    //重置验证验证码发送
    ResetMessageAuthortication: function() {
        $('#ctxtCheckCode').text('');
        $('#csvg_12').text(60);
        $('#csvg_8').text('秒后重新发送');
        $('#csvg_6').attr('fill', 'url(#csvg_3)');
    },
    //将验证码发送设置为可以发送
    EnableMessageAuthortication: function() {
        $('#csvg_12').text('');
        $('#csvg_8').text('重新发送');
        $('#csvg_6').attr('fill', 'url(#csvg_7)');
        $('#buttonReSend').one('click', SvgEngine.SendMessageAuthortication);
    },
    //验证码验证interval
    ItvlConfirmMessage: 0,
    //绑定验证码确定按钮
    BindConfirmMessageAuthortication: function(callback) {
        $('#buttonConfirm').bind('click', function() {
            if (SvgEngine.IsAuthorticated == 1) {
                if (typeof callback == 'function') {
                    callback.call(this);
                }
                SvgEngine.HideMessageAuthortication();
            } else {
                if (WebSC.IsSocketAlive()) {
                    $('#buttonConfirm').unbind('click');
                    SvgEngine.IsAuthorticated = 0;
                    WebSC.CheckValidCode($('#ctxtCheckCode').text());

                    SvgEngine.ItvlConfirmMessage = setInterval(function() {
                        if (SvgEngine.IsAuthorticated == 1) {
                            if (typeof callback == 'function') {
                                callback.call(this);
                            }
                            SvgEngine.HideMessageAuthortication();
                            clearInterval(SvgEngine.ItvlConfirmMessage);
                        } else if (SvgEngine.IsAuthorticated == 2) {
                            clearInterval(SvgEngine.ItvlConfirmMessage);
                            SvgEngine.BindConfirmMessageAuthortication(callback);
                        } else {
                            SvgEngine.BindConfirmMessageAuthortication(callback);
                        }
                    }, 100);
                }
            }
        });
    },
    //绑定验证码取消按钮
    BindCancelMessageAuthortication: function(callback) {
        $('#buttonCancel').unbind('click');
        $('#buttonCancel').bind('click', function() {
            if (typeof callback == 'function') {
                callback.call(this);
            }
            SvgEngine.HideMessageAuthortication();
        });
    },
    //显示系统信息(左下角)
    ShowSysMessage: function(msg, autoHide) {
        $('#DivSysMessage').children('div').text(msg);
        $('#DivSysMessage').css('z-index', 1000000);
        $('#DivSysMessage').show(200);
        if (autoHide) {
            setTimeout(function() { $('#DivSysMessage').hide(200); }, 5000);
        }
    },
    //隐藏系统信息(左下角)
    HideSysMessage: function() {
        $('#DivSysMessage').children('div').text('');
        $('#DivSysMessage').hide(200);
    },
    //取得当前用户名
    GetUserInfo: function() {
        if (SvgEngine.GetCookie("TrueName")) {
            $.ajax({
                type: "get",
                url: SvgEngine.ServerUrl + "/Pages/HttpRequest/WebSocketController.ashx?jsoncallback=?",
                data: { opt: "GetUserInfo", UserId: SvgEngine.GetCookie("UserName"), UserName: SvgEngine.GetCookie("TrueName"), CompanyId: SvgEngine.GetCookie("CompanyId"), CompanyName: SvgEngine.GetCookie("CompanyName") },
                dataType: "json",
                error: function(xhr) { console.log(xhr.responseText); },
                success: function(json) {
                    SvgEngine.UserId = json.UserId;
                    SvgEngine.UserName = json.UserName;
                    SvgEngine.CompanyId = json.CompanyId;
                    SvgEngine.CompanyName = json.CompanyName;
                }
            });
        }
    },
    GetCookie: function(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    },
    //取得Url中的参数值
    GetUrlParam: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    //初始化系统标签
    InitSystemLabel: function() {
        var itvl = setInterval(function() {
            $("text[dataid]").each(function(i, o) {
                if ($(o).attr('dataid').substr(0, 4) == 'sys.') {
                    var val = '';
                    switch ($(o).attr('dataid')) {
                        case 'sys.datetime':
                            val = (new Date()).toLocaleString();
                            break;
                        case 'sys.date':
                            val = (new Date()).toLocaleDateString();
                            break;
                        case 'sys.time':
                            val = (new Date()).toLocaleTimeString();
                            break;
                        case 'sys.year':
                            val = (new Date()).getFullYear();
                            break;
                        case 'sys.month':
                            val = (new Date()).getMonth();
                            break;
                        case 'sys.day':
                            val = (new Date()).getDate();
                            break;
                        case 'sys.hour':
                            val = (new Date()).getHours();
                            break;
                        case 'sys.minute':
                            val = (new Date()).getMinutes();
                            break;
                        case 'sys.second':
                            val = (new Date()).getSeconds();
                            break;
                        case 'sys.username':
                            val = SvgEngine.UserName;
                            break;
                        case 'sys.userid':
                            val = SvgEngine.UserId;
                            break;
                        case 'sys.companyid':
                            val = SvgEngine.CompanyId;
                            break;
                        case 'sys.companyname':
                            val = SvgEngine.CompanyName;
                            break;
                        default:
                            break;
                    }
                    SvgEngine.SetValue(o, "text", val);
                }
            });
        }, 1000);
    },
    //解析浮动参数
    ResolveFloatParameter: function() {
        $("[floatid]").each(function(i, o) {
            $(o).mouseover(function() {
                $("#" + $(o).attr("floatid")).attr("display", "display");
            })
            $(o).mouseout(function() {
                $("#" + $(o).attr("floatid")).attr("display", "none");
            })
            $("#" + $(o).attr("floatid")).attr("display", "none");
        });
    },
    //当前鼠标的坐标
    MousePosition: { x: 0, y: 0 },
    //获取当前鼠标的坐标
    MouseMove: function(ev) {
        var Ev = ev || window.event;
        if (ev.pageX || ev.pageY) {
            SvgEngine.MousePosition = { x: ev.pageX, y: ev.pageY };
        } else {
            SvgEngine.MousePosition = {
                x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
                y: ev.clientY + document.body.scrollTop - document.body.clientTop
            };
        }
    },
    //生成参数DIV
    GenerateFloatPrameterDiv: function() {
        if ($('#float_parameters').length == 0) {
            $(document.body).append("<div id='float_parameters' style='position:fixed;z-index:999999;width:180px;background-color:#000;padding:2px;display:none;'/>");
        }
    },
    //生成参数表
    GenerateFloatParamterTable: function(paramters) {
        var html = "<table style='font-size:small;color:#00ff00;width:100%;'>";
        $(paramters).each(function(i, p) {
            html += "<tr><td>" + (p.Name.T == "text" ? p.Name.V : SvgEngine.GetDataValue(p.Name.V)) + "</td><td align='right'>" + (p.Value.T == "text" ? p.Value.V : SvgEngine.GetDataValue(p.Value.V)) + "</td><td align='right'>" + (p.Unit.T == "text" ? p.Unit.V : SvgEngine.GetDataValue(p.Unit.V)) + "</td></tr>";
        });
        html += "</table>";
        $('#float_parameters').html(html);
    },
    //绑定浮动参数表显示事件
    BindFloatParamterEvent: function() {
        $(SvgEngine.FloatParameters).each(function(i, o) {
            $(o.PID).mouseover(function() {
                SvgEngine.GenerateFloatParamterTable(o.Parameters);
                $('#float_parameters').css('left', SvgEngine.MousePosition.x - $(document).scrollLeft() + 10);
                $('#float_parameters').css('top', SvgEngine.MousePosition.y - $(document).scrollTop() + 10);
                $('#float_parameters').show();
            });
            $(o.PID).mouseleave(function() {
                $('#float_parameters').hide();
            });
        });
    },
    //刷新引擎
    RefreshEngine: function() {
        SvgEngine.DtuIds = [];
        SvgEngine.Ranges = [];
        SvgEngine.ColorConditions = [];
        SvgEngine.TextConditions = [];
        SvgEngine.ScriptConditions = [];
        SvgEngine.Timers = [];
        SvgEngine.Steps = [];
        SvgEngine.Origines = [];
        SvgEngine.DataValues = [];
        $.each(SvgEngine.ConditionTwinkles, function(i, o) {
            clearInterval(o.Timer);
            $("#" + o.Id).attr("fill-opacity", 1);
        });
        SvgEngine.ConditionTwinkles = [];

        SvgEngine.CurrentInputBox = null;
        SvgEngine.DataDrives = null;
        SvgEngine.ControlOrders = null;
        SvgEngine.FloatParameters = null;
    },
    FixNumber: function(num, length) {
        //保留小数位数
        if (!isNaN(num)) {
            if (/^\d+$/.test(num)) {
                //如果是整数
                if (isNaN(length) || length < 0) {
                    //如果没设置小数位数或小于0，直接返回
                    return num;
                }
            }
            if (length != 0) {
                length = parseInt(length) || 2;
            }
            return parseFloat(num).toFixed(length);
        } else {
            return num;
        }
    },
    IsPwdCheckCancel: false,
    PwdCheckIntervalTime: 10, //密码验证等待时间（秒）
    PwdCheckInterval: null,
    PwdCheckCallBack: null,
    GeneratePwdCheckDiv: function() {
        //生成密码验证DIV
        if ($('#_com_svg_div_pwdcheck_mask').length == 0) {
            $(document.body).append('<div id="_com_svg_div_pwdcheck_mask" style="position:absolute;top:0;left:0;z-index:999998;height:100%;width:100%;background-color:#535362;opacity:.5;display:none"></div><div id="_com_svg_div_pwdcheck" style="z-index:999999;width:300px;background-color:#fff;position:absolute;top:40%;left:40%;display:none"><div style="margin:15px"><label style="font-size:14px">验证密码：<label><input id="_com_svg_txt_pwd" style="width:80px" type="password" maxlength="10"><label id="_com_svg_lbl_interval" style="font-size:12px;padding-left:5px">20秒后重新输入</label></label></label></div><label id="_com_svg_lbl_warn" style="color:red;font-size:small">密码已提交验证，请耐心等待。如20秒内未验证成功，请再次尝试。</label><div style="text-align:center;border-top:1px solid;border-color:#ddd;margin-top:10px"><button id="_com_svg_btn_ok" style="margin:5px">确定</button><button id="_com_svg_btn_cancel">取消</button></div></div>');

            $('#_com_svg_btn_ok').click(function() {
                $('#_com_svg_lbl_interval,#_com_svg_lbl_warn').show();
                $('#_com_svg_btn_ok').attr('disabled', 'disabled');
                SvgEngine.PwdCheckInterval = setInterval(function() {
                    $('#_com_svg_lbl_interval').text(SvgEngine.PwdCheckIntervalTime-- + '秒后重新输入');
                    if (SvgEngine.PwdCheckIntervalTime == 0) {
                        SvgEngine.ResetPwdCheckDiv();
                    }
                }, 1000);
                WebSC.CheckValidCode($('#_com_svg_txt_pwd').val());
                //if ($('#_com_svg_txt_pwd').val() == SvgEngine.LocalPwd) {
                //    if (typeof SvgEngine.PwdCheckCallBack == "function") {
                //        SvgEngine.PwdCheckCallBack.call();
                //        SvgEngine.ShowSysMessage('密码验证成功！');
                //        SvgEngine.ClosePwdCheck();
                //    }
                //} else {
                //    $("#_com_svg_lbl_warn").text('密码验证失败，请重新输入！');
                //    $("#_com_svg_lbl_warn").show();
                //    $("#_com_svg_txt_pwd").focus();
                //}
            });
            $('#_com_svg_btn_cancel').click(function() {
                SvgEngine.ClosePwdCheck();
            });
        }
    },
    ShowPwdCheckDiv: function(callback) {
        //显示密码验证DIV
        SvgEngine.ResetPwdCheckDiv();
        $('#_com_svg_div_pwdcheck_mask,#_com_svg_div_pwdcheck').show();
        SvgEngine.PwdCheckCallBack = callback;
    },
    HidePwdCheckDiv: function() {
        //隐藏密码验证DIV
        SvgEngine.ResetPwdCheckDiv();
        $('#_com_svg_div_pwdcheck_mask,#_com_svg_div_pwdcheck').hide();
    },
    ResetPwdCheckDiv: function() {
        //重置密码验证DIV
        clearInterval(SvgEngine.PwdCheckInterval);
        $('#_com_svg_txt_pwd').val('');
        $('#_com_svg_btn_ok').removeAttr('disabled');
        $('#_com_svg_lbl_interval,#_com_svg_lbl_warn').hide();
        SvgEngine.PwdCheckIntervalTime = 10;
        $('#_com_svg_lbl_interval').val(SvgEngine.PwdCheckIntervalTime + '秒后重新输入');
        SvgEngine.IsPwdCheckCancel = false;
    },
    CancelPwdCheck: function() {
        //取消密码验证
        SvgEngine.ResetPwdCheckDiv();
    },
    ClosePwdCheck: function() {
        //关闭密码验证
        SvgEngine.ResetPwdCheckDiv();
        SvgEngine.HidePwdCheckDiv();
    },
    GetQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    DisplaySwitch: function(id) {
        if ($('#' + id).css('display') == 'none') {
            $('#' + id).show();
        } else {
            $('#' + id).hide();
        }
    },
    InitWaterContainer: function() {
        setTimeout(function() {
            $('[watercontainer="true"]').each(function(i, o) {
                waves.Init($(o).attr('id'));
            });
        }, 100);
    },
    Init: function() {
        //页面加载时初始化
        $('[startdisplay="none"]').hide(); //隐藏所有启动隐藏的图元
        document.onmousemove = SvgEngine.MouseMove;
        SvgEngine.GeneratePopTextDiv();
        SvgEngine.GenerateFloatPrameterDiv();
        $('#DivSysMessage').children('b').click(function() {
            SvgEngine.HideSysMessage();
        });
        SvgEngine.InitSystemLabel();
        SvgEngine.ResolveFloatParameter();
        //WebSC.AppendMessage = function () { };
        WebSC.Init();
        SvgEngine.GeneratePwdCheckDiv();
        SvgEngine.InitWaterContainer();
        //ApiData.AnalyseData();
    }
};

var waves = function() {
    return {
        w_h: 20,
        time: 2000,
        Init: function(id) {
            $("body").find("svg[for=" + id + "]").remove();
            var snap_rect = Snap("#" + id).getBBox();
            var width = $.svg ? snap_rect.width / $.svg.proportion.w : snap_rect.width;
            var height = $.svg ? snap_rect.height / $.svg.proportion.h : snap_rect.height;
            var x = snap_rect.x;
            var y = snap_rect.y;
            var svg = Snap(width, height);
            var g = svg.paper.g();
            this.SetPath(svg, g, width, height);
            svg.node.setAttribute("for", id);
            var g_id = g.node.setAttribute("id", id + "_g");
            this.SetHtml(svg, x, y);
            this.Animate(Snap("#" + id + "_g"), 0, 0);
            $('#' + id).hide();
        },
        SetPath: function(svg, g, w, h) {
            var d = "M 0 " + this.w_h + " Q 40 0, 80 " + this.w_h + " ";
            w = w >= 160 ? w * 2 : (w * 2 + 80);
            for (var i = 160; i < w + 80; i = i + 80) {
                d += "T " + i + " 20 ";
            }
            d += "V " + h + " H 0 V 0";
            var p = svg.paper.path(d).attr({
                fill: "#00A1DF",
                opacity: 0.7
            });
            g.add(p);
        },
        Animate: function(g, x, y) {
            var event = function() {
                Snap.animate(-160, 0, function(val) {
                    var m = new Snap.Matrix();
                    m.translate(val, y);
                    g.transform(m);
                }, waves.time);
            }
            event();
            setInterval(event, waves.time);
        },
        SetHtml: function(svg, x, y) {
            var r = $('#' + SvgEngine.ContainerId).find('svg')[0];
            pt = r.createSVGPoint();
            im = r.getScreenCTM();
            pt.x = x;
            pt.y = y + 11;
            var p = pt.matrixTransform(im);
            var div = $("<div></div>");
            div.attr("style", "position: absolute;left:" + p.x + "px;top:" + p.y + "px");
            div.append(svg.node);
            $("body").prepend(div);
        }
    };
}();