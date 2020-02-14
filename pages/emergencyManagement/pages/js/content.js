function showimage(url) {
    layer.open({
        type: 1,
        title: false,
        closeBtn: 0,
        area: ['auto', 'auto'],
        skin: 'layui-layer-nobg', //没有背景色
        shadeClose: true,
        content: '<img src=' + url + ' />'
    });
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}

function UpdateCause(id) {
    layer.prompt({
        title: '请填写关闭预警的原因，并确认',
        formType: 2
    }, function(text, index) {
        $.ajax({
            type: 'post',
            url: "/Event/updatecancellingcause",
            data: {
                Id: id,
                Cause: text
            },
            async: false,
            datatype: "json",
            success: function(data) {
                if (data.Result == "1") {
                    layer.msg("操作成功", {
                        icon: 1,
                        time: 1000
                    });
                    $("#table").bootstrapTable('refresh');
                } else {
                    layer.msg(data.Msg, {
                        icon: 7,
                        time: 1000
                    });
                }
            },
            error: function() {
                layer.msg('操作失败', {
                    icon: 5,
                    time: 1000
                });
            }
        });
        layer.close(index);
    });
}

function UpdateWorn(objdata) {
    var pageNumber = $("#table").bootstrapTable("getOptions").pageNumber;
    window.location.href = "/Event/EditEventPage?row=" + objdata + "&type=confirm" + "&pageNumber=" + pageNumber + "&pageType=" + "EventList";
}
var pageNumber = 1;
var o = {
    funload: function(Cid, isparent) {
        Seach();
    }
}
var p = null;
$(function() {
    p = getUrlParam("pzytz");
    console.log("二级" + p);

    $(".form_datetime").datetimepicker({
        weekStart: 0, //一周从哪一天开始
        todayBtn: 1, //
        format: 'yyyy-mm-dd hh:ii:ss',
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        startDate: new Date("1950/01/01"),
        endDate: new Date("2100/01/01"),
        forceParse: 0,
        showMeridian: 1,
        language: 'cn' //语言
    });
    GetCompany($("#Company"), o);
    //回车搜索
    $("#Conditions").keydown(function(event) {
        var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
        if (keyCode == 13) {
            Seach();
            return false;
        }
    });
    pageNumber = parseInt(ZsyUI.Core.getQueryString("pageNumber") || pageNumber);
});

function Query() {
    var result = ValidateData($("#form"));
    if (!result) {
        return;
    }
    Seach();
}

function Seach() {
    var showcolom = $("#wornstate")[0].checked ? false : true; //判断是否显示列
    var start = $("#start").val();
    var end = $("#end").val();
    if (start || start != "") {
        if (!(isNaN(start) && !isNaN(Date.parse(start)))) {
            layer.msg("时间格式错误！,请重新选择", {
                icon: 7,
                time: 1000
            });
            return;
        }
    }
    if (end || end != "") {
        if (!(isNaN(end) && !isNaN(Date.parse(end)))) {
            layer.msg("时间格式错误！,请重新选择", {
                icon: 7,
                time: 1000
            });
            return;
        }
    }
    var Conditions = $("#Conditions").val();
    var arr_ids = [];
    $("#table").bootstrapTable('destroy');
    $("#table").bootstrapTable({
        method: "post",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        url: "/Event/GetWornList",
        dataType: "json",
        singleSelect: true,
        Conditions: Conditions,
        pagination: true,
        selectPage: pageNumber,
        pageNumber: pageNumber,
        pageSize: 50,
        pageList: [50, 100, 200, 500],
        paginationDetailHAlign: "right",
        paginationHAlign: "right",
        editable: true, //开启编辑模式
        sidePagination: "server", //服务端处理分页
        queryParams: function(params) {
            //
            //alert($("#Company").val());
            var param = {
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
                Conditions: this.Conditions,
                CompanyId: $("#Company").selectpicker('val') ? $("#Company").selectpicker('val') : 0,
                start: start,
                end: end,
                wornstate: $("#wornstate")[0].checked ? 1 : 0,
                vId: p
            };
            return param;
        }, //发送给服务器的参数
        onLoadSuccess: function(data) { //加载成功时执行
            console.log(arr_ids);
            for (var i = 0; i < arr_ids.length; i++) {
                try {
                    var viewer = new Viewer(document.getElementById('dowebok' + arr_ids[i] + ''), {
                        url: 'data-original'
                    });
                } catch (e) {

                }
            }
        },
        onLoadError: function() { //加载失败时执行
            layer.msg("加载数据失败", {
                time: 1500,
                icon: 2
            });
        },
        responseHandler: function(res) {
            return {
                rows: res.result.DataList,
                total: res.result.Pagetotal
            };
        },
        columns: [{
                title: '序号',
                field: 'Id',
                align: 'center',
                width: '60px',
                formatter: function(value, row, index) {
                    var count = index;
                    count = count + 1;
                    var id = '<label>' + count + '</label>';
                    return id;
                }
            }, {
                title: '操作',
                field: 'WornState',
                width: '150px',
                align: 'center',
                visible: showcolom,
                formatter: function(value, row, index) {
                    var str = "&nbsp;";
                    if (row.WornState == 0) {
                        str += "<a href='javascript:void(0)' class='col-base ' data-href=\"/Event/UpdateIsWarn?\"  onclick='UpdateWorn(" + row.Id + ")'>确认</a> ";
                        str += "<a href='javascript:void(0)' class='col-base'  onclick='UpdateCause(" + row.Id + ")'>关闭</a> ";
                    } else {}
                    return str;
                }
            }, {
                title: '预警编码',
                field: 'Code',
                align: 'center',
                formatter: function(value, row, index) {
                    if (!value) {
                        return "";
                    }
                    return value;
                }
            }, {
                title: '预警名称',
                field: 'Title',
                align: 'center',
                formatter: function(value, row, index) {
                    if (!value) {
                        return "";
                    }
                    return value;
                }
            }, {
                title: '预警等级',
                field: 'LevelName',
                align: 'center',
                formatter: function(value, row, index) {
                    if (!value || value == "") {
                        var str = "";
                        return str;
                    } else {
                        return value;
                    }
                }
            }, {
                title: '预警类型',
                field: 'EventTypeName',
                align: 'center',
                formatter: function(value, row, index) {
                    if (!value || value == "") {
                        var str = "";
                        return str;
                    } else {
                        return value;
                    }
                }
            }, {
                title: '预警来源',
                field: 'SourceName',
                align: 'center',
                formatter: function(value, row, index) {
                    if (!value) {
                        return "";
                    }
                    return value;
                }
            }, {
                title: '上报公司',
                field: 'CreatorCompany',
                align: 'center',
                formatter: function(value, row, index) {
                    if (!value) {
                        return "";
                    }
                    return value;
                }
            }, {
                title: '上报人员',
                field: 'Creator',
                align: 'center',
                formatter: function(value, row, index) {
                    if (!value) {
                        return "";
                    }
                    return value;
                }
            }, {
                title: '上报时间',
                field: 'ReportTime',
                align: 'center',
                formatter: function(value, row, index) {
                    if (!value) {
                        return "";
                    }
                    return GetDateFormat(value);
                }
            },

            {
                title: '地址',
                field: 'Address',
                align: 'center',
                formatter: function(value, row, index) {
                    if (!value) {
                        return "";
                    }
                    var info = ControlLength(value, 20);
                    return "<lable title='" + "" + value + "" + "' ><span>" + info + "</span></lable>";
                }
            }, {
                title: '影响范围',
                field: 'Influence',
                align: 'center',
                formatter: function(value, row, index) {
                    if (!value) {
                        return "";
                    }
                    var info = ControlLength(value, 20);
                    return "<lable title='" + "" + value + "" + "' ><span>" + info + "</span></lable>";
                }
            }, {
                title: '预警描述',
                field: 'Describe',
                align: 'left',
                formatter: function(value, row, index) {
                    if (!value) {
                        return "";
                    }
                    var info = ControlLength(value, 20);
                    return "<lable title='" + "" + value + "" + "' ><span>" + info + "</span></lable>";
                }
            }, {
                title: '预警图片',
                field: 'PicPath',
                align: 'center',
                formatter: function(value, row, index) {
                    var str = "<ul id='dowebok" + row.Id + "' style='display: inline-flex;'>";
                    var imgsrc = (row.PicPathList || []).map(p => p.split(";")[0]);
                    if (imgsrc.length == 0) {
                        return "无图片";
                    }
                    for (var i = 0; i < (imgsrc.length); i++) {
                        str += "<li style='float:left;padding: 0 2px 2px 0;'><img data-original='" + imgsrc[i] + "' src='" + imgsrc[i] + "' alt='图片' width='25px;' height='25px;'></li>";
                    }
                    str += "</ul>";
                    arr_ids.push(row.Id)
                    return str;

                    //var str = '';
                    //str += "<div id='layer-photos-demo" + index + "' class='layer-photos-demo'>";
                    //var imgsrc = row.PicPathList;
                    //var photos = new Array();
                    //for (var i = 0; i < (imgsrc.length); i++) {
                    //    var photo = {
                    //        alt: "图片",
                    //        pid: index,
                    //        src: imgsrc[i],
                    //        thumb: ''
                    //    }
                    //    photos.push(photo);
                    //}
                    //return "<a  href='javascript:void(0)' onclick='showPicture(" + JSON.stringify(photos) + ")' style='color:#0c68a7;' >共" + imgsrc.length + "张图片</a>";
                }
            }, {
                title: '备注',
                field: 'Remark',
                align: 'left',
                formatter: function(value, row, index) {
                    if (!value) {
                        return "";
                    }
                    return value;
                }
            }, {
                title: '关闭原因',
                field: 'CancellingCause',
                align: 'left',
                visible: showcolom ? false : true,
                formatter: function(value, row, index) {
                    if (!value) {
                        return "";
                    }
                    var info = ControlLength(value, 20);
                    return "<lable title='" + "" + value + "" + "' ><span>" + info + "</span></lable>";
                }
            },
        ]
    });
    tabHeight();


    $(window).resize(function() {
        tabHeight();
    });
};

function showPicture(jsondata) {
    var photosJSON = {
            title: "图片信息",
            id: "merchantManage",
            start: 0,
            data: jsondata
        }
        // 相册层
    layer.photos({
        photos: photosJSON,
        closeBtn: 1
    });
}

function ControlLength(data, len) {
    if (data.length > len) {
        data = data.slice(0, len) + "...";
    }
    return data;
}