//模糊下拉
$.fn.iselect = function(method, options) {
    $.fn.iselect.defaults = {
        textfiled: "text",
        valuefiled: "id",
        url: null,
        onbeforeload: null,
        onselect: null,
        onunselect: null,
        source: [],
        valueTarget: null
    };
    $.fn.iselect.methods = {
        init: function(jq, options) {
            options.textfiled = options.textfiled || $.fn.iselect.defaults.textfiled;
            options.valuefiled = options.valuefiled || $.fn.iselect.defaults.valuefiled;
            options.url = options.url || $.fn.iselect.defaults.url;
            options.onbeforeload = options.onbeforeload || $.fn.iselect.defaults.onbeforeload;
            options.onselect = options.onselect || $.fn.iselect.defaults.onselect;
            options.source = options.source || $.fn.iselect.defaults.source;
            options.valueTarget = options.valueTarget || $.fn.iselect.defaults.valueTarget;
            options.onunselect = options.onunselect || $.fn.iselect.defaults.onunselect;
            $(jq).data('options', options);
            $(jq).on('input', function(e) {
                if (options.valueTarget) $(options.valueTarget).val("");
                if (options.onunselect) options.onunselect();
            });
            if (options.url) {
                $(jq).typeahead({
                    fitToElement: true,
                    showHintOnFocus: true,
                    delay: 500,
                    displayText: function(item) {
                        return item[options.textfiled];
                    },
                    source: function(query, process) {
                        $.ajax.http(options.url, function(result) {
                            if (options.onbeforeunload) options.onbeforeunload(result);
                            process(result);
                        }, { term: $(options.element).val() }, null, null, null, null, false);
                    },
                    updater: function(item) {
                        if (options.valueTarget) $(options.valueTarget).val(item[options.valuefiled]);
                        if (options.onselect) options.onselect(item);
                        return item;
                    }
                });
            } else {
                $(jq).typeahead({
                    fitToElement: true,
                    showHintOnFocus: true,
                    displayText: function(item) {
                        return item[options.textfiled];
                    },
                    source: options.source,
                    updater: function(item) {
                        if (options.valueTarget) $(options.valueTarget).val(item[valuefiled]);
                        if (options.onselect) options.onselect(item);
                        $(jq).data('val', item);
                        return item;
                    }
                });
            }
        },
        val: function(jq) {
            var options = $(jq).data('options');
            var selectedItem = $(jq).data('val');
            if (!selectedItem || selectedItem == '') return null;
            return selectedItem[options.valuefiled];
        }
    };
    if ((typeof method) != "string") {
        return $.fn.iselect.methods["init"](this, method);
    } else return $.fn.iselect.methods[method](this, options);
};
//form表单
$.fn.form = function(options, param) {
    $.fn.form.methods = {
        load: function(jq, data) {
            var obj = data;
            var key, value, tagName, type, arr;
            for (x in obj) {
                key = x;
                value = obj[x];
                $(jq[0]).find(("[name='" + key + "'],[name='" + key + "[]']")).each(function() {
                    tagName = $(this)[0].tagName;
                    type = $(this).attr('type');
                    if (tagName == 'INPUT') {
                        if (type == 'radio') {
                            $(this).attr('checked', $(this).val() == value);
                        } else if (type == 'checkbox') {
                            arr = value.split(',');
                            for (var i = 0; i < arr.length; i++) {
                                if ($(this).val() == arr[i]) {
                                    $(this).attr('checked', true);
                                    break;
                                }
                            }
                        } else {
                            $(this).val(value);
                        }
                    } else if (tagName == 'SELECT' || tagName == 'TEXTAREA') {
                        $(this).val(value);
                    }
                });
            }
        },
        reset: function(jq) {
            return jq.each(function() {
                $(this).data("validator").resetForm();
                $(this)[0].reset();
            });
        },
        validate: function(jq) {
            var result = true;
            var data_validation = "unobtrusiveValidation";
            $(jq[0]).each(function(index, item) {
                var validationInfo = $(item).data(data_validation);
                var _result = !validationInfo || !validationInfo.validate || validationInfo.validate();
                result = result && _result;
            });
            if (!result) {
                return false;
            } else return true;
        },
        tojson: function(jq) {
            var o = {};
            var a = $(jq[0]).serializeArray();
            $.each(a, function() {
                if (o[this.name]) {
                    return true;
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        },
        submitprevent: function(jq) {
            return jq.each(function() {
                $(this).submit(function(e) {
                    e.preventDefault();
                });
            });
        },
        required: function(jq) {
            function setRequired($form, index, item) {
                if ($(item).attr("data-val-required")) {
                    $form.find("label[for='" + $(item).attr("id") + "']").append("<span class='required'>*</span>");
                }
            }
            return jq.each(function() {
                var $form = $(this);
                $(this).each(function(_index, _item) {
                    $(_item).find("input[type='text']").each(function(index, item) {
                        setRequired($form, index, item);
                    });
                    $(_item).find("input[type='password']").each(function(index, item) {
                        setRequired($form, index, item);
                    });
                    $(_item).find("input[type='checkbox']").each(function(index, item) {
                        setRequired($form, index, item);
                    });
                    $(_item).find("textarea").each(function(index, item) {
                        setRequired($form, index, item);
                    });
                    $(_item).find("select").each(function(index, item) {
                        setRequired($form, index, item);
                    });
                });
            });
        }
    };
    return $.fn.form.methods[options](this, param);
};
//ajax请求
$.extend($.ajax, {
    http: function(url, callback, data, loading, contentType, dataType, method, async) {
        // if (loading != false) $.loading.show();
        $.ajax({
            async: async || true,
            type: method || 'post',
            data: data || {},
            url: url,
            dataType: dataType || "json",
            contentType: contentType || "application/x-www-form-urlencoded",
            success: function(result) {

                if (result && result.IsError == true) {
                    if (result.ErrorCode == 2) {
                        top.location.href = "";
                    }
                    $.message.showError(result.Messager);
                    return false;
                }
                callback(result.ResponseData);
            },
            complete: function() {
                $.loading.hide();
            },
            error: function(error) {
                try {
                    var err = JSON.parse(error.responseText);
                    $.message.showError(err.Messager);
                } catch (ex) {}
            }
        });
    },
    form: function(url, callback, data, contentType, dataType, method, async) {
        $.ajax.http(url, callback, data, "application/x-www-form-urlencoded");
    },
    json: function(url, callback, data, contentType, dataType, method, async) {
        $.ajax.http(url, callback, JSON.stringify(data), "application/json;charset=utf-8");
    },
    post: function(url, data, success, error, dataType, loading) {
        // if (loading != false) $.loading.show();
        $.ajax({
            type: "post",
            dataType: dataType || "json",
            url: url,
            data: data,
            error: function(ex) {
                if (error) error(ex);
            },
            complete: function() {
                $.loading.hide();
            },
            success: function(data) {
                if (success) success(data);
            }
        });
    },
    get: function(url, success, error, dataType) {
        $.ajax({
            type: "get",
            dataType: dataType || "json",
            url: url,
            error: function(ex) {
                if (error) error(ex);
            },
            success: function(data) {
                if (success) success(data);
            }
        });
    }
});
//消息提醒
$.message = {
    showWarning: function(text, seconds, callback) {
        iaicn.message.warning(text, seconds || 3, callback);
    },
    showSuccess: function(text, seconds, callback) {
        iaicn.message.success(text, seconds || 3, callback);
    },
    showInfo: function(text, seconds, callback) {
        iaicn.message.info(text, seconds || 3, callback);
    },
    showError: function(text, seconds, callback) {
        iaicn.message.error(text, seconds || 3, callback);
    },
    showConfirm: function(title, text, callback) {
        var res = window.confirm(text);
        if (res) callback();
    }
};
//notify
$.notify = {
        //duration 几秒自动关闭，无需自动关闭时传入0或者不传
        success: function(title, content, duration) {
            iaicn.notification.success({
                message: title,
                description: content,
                duration: duration
            });
        },
        error: function(title, content, duration) {
            iaicn.notification.error({
                message: title,
                description: content,
                duration: duration
            });
        },
        warning: function(title, content, duration) {
            iaicn.notification.warning({
                message: title,
                description: content,
                duration: duration
            });
        },
        info: function(title, content, duration) {
            iaicn.notification.info({
                message: title,
                description: content,
                duration: duration
            });
        }
    }
    //进度等待
$.loading = {
    show: function(text) {
        var len = $('body').find('.loading').length;
        var loading_status = $('.loading-overlay').is(':hidden');
        if (len == 0) {
            $('body').append('<div class="loading-overlay"></div><div class="loading">处理中,请稍候...</div>');
            var a = document.scripts,
                e = '';
            $(a).each(function() {
                var reg = new RegExp("loading.js").test($(this).get(0).src);
                if (reg) {
                    e = $(this).get(0).src;
                }
            });
            var path = '../Content/libs/loading/skin.css';
            $('head').append('<LINK rel=stylesheet type=text/css href=' + path + '>');
            loading_status = true;
            $('.loading-overlay').get(0).style.display = 'block';
            $('.loading').get(0).style.display = 'block';
            return false;
        }
        if (loading_status) {
            $('.loading-overlay').show();
            $('.loading').show();
            return false;
        }
    },
    hide: function() {
        $('.loading-overlay').hide();
        $('.loading').hide();
    }
};
//随机数
$.random = {
    guid: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
};
//storage
$.storage = {
        set: function(key, value) {
            var storage = window.localStorage;

            if (storage) {
                storage.setItem(key, JSON.stringify(value));
            } else {
                $.cookie.set(key, JSON.stringify(value), true);
            }
        },
        get: function(key) {
            var storage = window.localStorage;
            var value = null;
            if (storage) {
                value = storage.getItem(key);
            } else {
                value = $.cookie.get(key);
            }
            if (value == null) return null;
            else return JSON.parse(value);
        },
        del: function(key) {
            var storage = window.localStorage;
            if (storage) {
                return storage.removeItem(key);
            } else {
                return $.cookie.del(key);
            }
        }
    }
    //获取父级frame
$.parentFrame = {
    document: function() {
        return $(window.top.document.getElementById("pageframe").contentWindow.document);
    },
    window: function() {
        return window.top.document.getElementById("pageframe").contentWindow.window;
    }
};
//权限
$.authorize = {
    apply: function() {
        var btnResources = $('body').data('btn-resource');
        if (btnResources == undefined || btnResources == null || btnResources == '') btnResources = [];
        $.each(btnResources, function(index, item) {
            if (item.UserHasPression != 1) {
                $("[name='" + item.Resource_Tag + "']").remove();
                $("[controller='" + item.Resource_Tag + "']").remove();
            }
        });
    }
};
//导出
$.exporter = {
    excel: function($dg, url, $param) {
        var param = {};
        var opt = $dg.bootstrapTable('getOptions');
        param.Pagination = {
            PageNumber: opt.pageNumber,
            PageSize: opt.pageSize,
            SortField: opt.sortName,
            SortType: opt.sortOrder
        };
        param.Columns = [];
        $.each(opt.columns, function(index, item) {
            $.each(item, function(i, t) {
                if (t.checkbox != true && t.radio != true && (t.export == true || t.export == undefined)) {
                    param.Columns.push(t);
                }
            });
        });
        param.FrozenColumns = [];
        if (opt.frozenColumns) {
            $.each(opt.frozenColumns, function(index, item) {
                $.each(item, function(i, t) {
                    if (t.checkbox != true && t.radio != true && (t.export == true || t.export == undefined)) {
                        param.FrozenColumns.push(t);
                    }
                });
            });
        }
        if ($param) param.Param = $param;
        $("#hidExportParam").val(JSON.stringify(param));
        $("#comExportForm").attr("action", url);
        $("#comExportForm").submit();
    }
};
//浏览器版本
$.iebrower = {
        version: function() {
            var userAgent = window.navigator.userAgent.toLowerCase();
            $.browser.msie10 = $.browser.msie && /msie 11\.0/i.test(userAgent);
            if ($.browser.msie10) return 11;
            $.browser.msie10 = $.browser.msie && /msie 10\.0/i.test(userAgent);
            if ($.browser.msie10) return 10;
            $.browser.msie9 = $.browser.msie && /msie 9\.0/i.test(userAgent);
            if ($.browser.msie9) return 9;
            $.browser.msie8 = $.browser.msie && /msie 8\.0/i.test(userAgent);
            if ($.browser.msie8) return 8;
            $.browser.msie7 = $.browser.msie && /msie 7\.0/i.test(userAgent);
            if ($.browser.msie7) return 7;
            $.browser.msie6 = !$.browser.msie8 && !$.browser.msie7 && $.browser.msie && /msie 6\.0/i.test(userAgent);
            if ($.browser.msie6) return 6;
            return 5;
        }
    }
    //select2
$.fn.select = function(opt) {
    if (!opt) {
        $(this).select2({
            placeholder: "-请选择-",
            allowClear: false,
            language: "zh-CN"
        });
        return;
    }
    if (opt.url) {
        if (opt.pagination) {
            $(this).select2({
                ajax: {
                    url: opt.url,
                    dataType: 'json',
                    delay: 250,
                    method: 'post',
                    data: function(params) {
                        if (opt.searchfield) params[opt.searchfield] = params.term;
                        params.page = params.page || 1;
                        params.rows = opt.pagesize || 10;
                        if (opt.params) params = params.extend(opt.params);
                        return params;
                    },
                    processResults: function(data, params) {
                        if (data && data.IsError == true) {
                            $.messager.showError(data.Messager);
                            if (data.ResultCode == 2) {
                                top.location = '/Account/Login';
                                return false;
                            }
                            return false;
                        }
                        params.page = data.ResponseData.pagenumber + 1;
                        params.rows = data.ResponseData.pagesize;
                        var result = [];
                        $.map(data.ResponseData.rows, function(item, index) {
                            result.push({
                                id: item[opt.idfield],
                                text: item[opt.textfield]
                            })
                        });
                        return {
                            results: result,
                            pagination: {
                                more: (params.page * params.rows) < data.ResponseData.total
                            }
                        };
                    },
                    cache: true
                },
                tags: opt.tags || false,
                placeholder: "-请选择-",
                allowClear: opt.allowClear,
                language: "zh-CN"
            })
        } else {
            $(this).select2({
                ajax: {
                    url: opt.url,
                    dataType: 'json',
                    delay: 250,
                    method: 'post',
                    data: function(params) {
                        if (opt.searchfield) params[opt.searchfield] = params.term;
                        if (opt.params) params = params.extend(opt.params);
                        return params;
                    },
                    processResults: function(data, params) {
                        if (data && data.IsError == true) {
                            $.messager.showError(data.Messager);
                            if (data.ResultCode == 2) {
                                top.location = '/Account/Login';
                                return false;
                            }
                            return false;
                        }
                        var result = [];
                        $.map(data.ResponseData, function(item, index) {
                            result.push({
                                id: item[opt.idfield],
                                text: item[opt.textfield]
                            })
                        });
                        return {
                            results: result
                        };
                    },
                    cache: true
                },
                tags: opt.tags || false,
                placeholder: "-请选择-",
                allowClear: opt.allowClear,
                language: "zh-CN",
                escapeMarkup: function(markup) { return markup; },
            })
        }
    } else if (opt.data) {
        $(this).select2({
            data: opt.data,
            placeholder: "-请选择-",
            allowClear: opt.allowClear || true,
            tags: opt.tags || false,
            language: "zh-CN"
        })
    } else {
        $(this).select2({
            placeholder: "-请选择-",
            allowClear: opt.allowClear || true,
            tags: opt.tags || false,
            language: "zh-CN"
        })
    }
};

$.hChart = {
        exportJson: { width: '1800' }
    }
    //处理html拼接
$.mHtmlHelper = {
        //将json格式的数组转化为table
        arrayToTable: function(array, filters) {
            var keys = [];
            if (!array || array.length == 0) {
                return "";
            }
            var html = "<table class='table-content'><tr>";
            var fjson = array[0];
            for (var key in fjson) {
                keys.push(key);
            }
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var fclass = "";
                if (i == 0) {
                    fclass = "";
                } else if (i == keys.length - 1) {
                    fclass = ""
                }
                html += "<th>";
                html += key;
                html += "</th>";
            }
            html += "</tr>";

            for (var i = 0; i < array.length; i++) {
                var json = array[i];
                html += "<tr class='text-center'>";
                for (var j = 0; j < keys.length; j++) {
                    var data = json[keys[j]];
                    if (data === null) {
                        data = "";
                    }
                    if (filters) {
                        for (var k = 0; k < filters.length; k++) {
                            var filter = filters[k];
                            if (filter.index == j) {
                                data = filter.format(data);
                            }
                        }
                    }
                    var align = "";
                    if (parseInt(data) != 'NaN') {
                        align = "align=right";
                    }
                    html += "<td " + align + ">";
                    html += data;
                    html += "</td>";
                }
                html += "</tr>";
            }
            html += "</table>";
            return html;
        },
        formatTable: function(pgId) {
            $("#" + pgId + " table").removeClass("list").addClass("table-content");
            //$("#" + pgId + " table tbody tr").eq(0).addClass("wid-50");
            $("#" + pgId + " table tbody tr:gt(0)").addClass("text-center");
            //$("#" + pgId + " table tbody tr td").removeAttr("align");

        },
        htmlEncode: function(str) {
            var s = "";
            if (str.length == 0) return "";
            s = str.replace(/&/g, "&gt;");
            s = s.replace(/</g, "&lt;");
            s = s.replace(/>/g, "&gt;");
            s = s.replace(/ /g, "&nbsp;");
            s = s.replace(/\'/g, "&#39;");
            s = s.replace(/\"/g, "&quot;");
            s = s.replace(/\n/g, "<br>");
            return s;
        },
        htmlDecode: function(str) {
            var s = "";
            if (str.length == 0) return "";
            s = str.replace(/&gt;/g, "&");
            s = s.replace(/&lt;/g, "<");
            s = s.replace(/&gt;/g, ">");
            s = s.replace(/&nbsp;/g, " ");
            s = s.replace(/&#39;/g, "\'");
            s = s.replace(/&quot;/g, "\"");
            s = s.replace(/<br>/g, "\n");
            return s;
        },
        NoData: function(pgId, result) {
            if ((typeof(result)) == 'string' && result.indexOf("出错了") >= 0) {
                $("#" + pgId).html("<div class='none-data'><img src=\"/Images/nodata.png\" /></div>");
                return true;
            }
            return false;
        },
        NoDataResult: function(pgId) {
            $("#" + pgId).html("<div class='none-data'><img src=\"/Images/nodata.png\" /></div>");
        },
        postForm: function(url, data) {
            var html = '<form name="form"  target="_blank" method="post" action="' + url + '">';
            var datas = data.split('&');
            for (var i = 0; i < datas.length; i++) {
                var data = datas[i];
                var items = data.split('=');
                html += '<input type="hidden" name="' + items[0] + '" value="' + items[1] + '"/>';
            }
            html += '</form>';
            var dom = $(html);
            $("body").append(dom);
            dom.submit();
        }
    }
    //分页控件
$.mPage = {
        bPage: function(pg, totalCount, pSize, pgObjs, callback) {
            var me = this;
            var size = Math.ceil(totalCount / pageSize);
            pgObjs = typeof pgObjs == 'string' ? $('#' + pgObjs) : pgObjs;
            var html = '<input type="hidden" id="SelectedDtuid" /><input type="hidden" id="SelectedDate" /><input type="hidden" class="pagedisplay" id="btnOK" /><a href="#" class="first" title="首页">首页</a> | <a href="#" class="prev" title="上一页">上一页</a><a href="#" class="next" title="下一页">下一页</a>| <a href="#" class="last" title="尾页">尾页</a> | <span>共</span><span class="totalpage"></span><span>页</span>| <span>第</span><spanclass="curpage">0</span><span>页</span> |<span>到第</span><input name="pageNo" type="text"class="page_txt" value="" /><span>页</span><a href="#" class="pageGo">GO</a>';
            pgObjs.html(me.getStr(pg, totalCount, pSize));
            if (pg == 1) {
                $(".first").removeAttr('disabled');
                $(".prev").removeAttr('disabled');
            }
            if (pg == totalCount) {
                $(".last").attr('disabled', true);
                $(".next").attr('disabled', true);
            }


            initEvent();

            function initEvent() {
                $(".first").click(function() {
                    if (parseInt($(".totalpage").html()) > 0) {
                        if (parseInt($(".curpage").html()) == parseInt($(".totalpage").html()) - 1) {
                            $(".last").removeAttr('disabled');
                            $(".next").removeAttr('disabled');
                        }
                        $(".first").attr('disabled', true);
                        $(".prev").attr('disabled', true);
                        $(".curpage").html(1);
                        callback(1);
                    }
                });
                $(".prev").click(function() {
                    var curpage = parseInt($(".curpage").html());
                    if (parseInt($(".totalpage").html()) > 0 && $(".curpage").html() != "1") {
                        $(".curpage").html(curpage - 1);
                        callback(curpage - 1);
                        if ($(".curpage").html() == "1") {
                            $(".first").attr('disabled', true);
                            $(".prev").attr('disabled', true);
                        } else if (parseInt($(".curpage").html()) == parseInt($(".totalpage").html()) - 1) {
                            $(".last").removeAttr('disabled');
                            $(".next").removeAttr('disabled');
                        }
                    }
                });
                $(".next").click(function() {
                    var curpage = parseInt($(".curpage").html());
                    if (curpage < parseInt($(".totalpage").html())) {
                        $(".curpage").html(curpage + 1);
                        callback(curpage + 1);
                        if ($(".curpage").html() == "2") {
                            $(".first").removeAttr('disabled');
                            $(".prev").removeAttr('disabled');
                        } else if ($(".curpage").html() == $(".totalpage").html()) {
                            $(".last").attr('disabled', true);
                            $(".next").attr('disabled', true);
                        }
                    }
                });
                $(".last").click(function() {
                    if ($(".curpage").html() == "1") {
                        $(".first").removeAttr('disabled');
                        $(".prev").removeAttr('disabled');
                    }
                    $(".last").attr('disabled', true);
                    $(".next").attr('disabled', true);
                    $(".curpage").html($(".totalpage").html());
                    callback(parseInt($(".totalpage").html()));
                });
                $(".pageGo").click(function() {
                    if (isDigit($(".page_txt").val())) {
                        if (parseInt($(".page_txt").val()) <= parseInt($(".totalpage").html())) {
                            if ($(".curpage").html() == "1") {
                                $(".first").removeAttr('disabled');
                                $(".prev").removeAttr('disabled');
                            } else if ($(".curpage").html() == $(".totalpage").html()) {
                                $(".last").removeAttr('disabled');
                                $(".next").removeAttr('disabled');
                            }
                            $(".curpage").html($(".page_txt").val());
                            callback(parseInt($(".page_txt").val()));
                        } else {
                            alert("您输入的页数大于总页数!");
                            return;
                        }
                    }
                });
            }

            function isDigit(s) {
                var patrn = /^[0-9]{1,20}$/;
                if (!patrn.exec(s)) return false
                return true
            }






        },
        getStr: function(pg, totalCount, pSize) {
            var size = Math.ceil(totalCount / pageSize);
            html = '<input type="hidden" id="SelectedDtuid" /><input type="hidden" id="SelectedDate" /><input type="hidden" class="pagedisplay" id="btnOK" /><a href="#" class="first" title="首页">首页</a> |';
            var lastHtml = '<a href="#" class="prev" title="上一页">上一页</a>|';
            var nextHtml = '<a href="#" class="next" title="下一页">下一页</a>|';
            html += lastHtml;
            html += nextHtml;
            html += '<a href="#" class="last" title="尾页">尾页</a> | <span>共</span><span class="totalpage">' + size + '</span><span>页</span>| <span>第</span><span class="curpage">' + pg + '</span><span>页</span> |<span>到第</span><input name="pageNo" type="text"class="page_txt" value="" /><span>页</span><a href="#" class="pageGo">GO</a>';
            return html;

        },
        bPageMain: function(pg, totalCount, pgObjs, callback) {
            pgObjs = typeof pgObjs == 'string' ? $('#' + pgObjs) : pgObjs;

            function initPagination() {
                pgObjs.pagination(totalCount, {
                    callback: pageselectCallback,
                    prev_text: '◀', //上一页按钮里text
                    next_text: '▶', //下一页按钮里text
                    items_per_page: 1,
                    num_edge_entries: 1, //两侧首尾分页条目数
                    num_display_entries: 3
                });
            }

            function pageselectCallback(page_index, jq) {
                callback(page_index + 1);
                return false;
            }
            if (pg == 1) {
                initPagination();
            }
        }
    }
    //公共方法
$.common = {
    getQueryString: function(name) {
        if (location.href.indexOf("?") == -1 || location.href.indexOf(name + '=') == -1) {
            return '';
        }
        var queryString = location.href.substring(location.href.indexOf("?") + 1);
        var parameters = queryString.split("&");
        var pos, paraName, paraValue;
        for (var i = 0; i < parameters.length; i++) {
            pos = parameters[i].indexOf('=');
            if (pos == -1) { continue; }
            paraName = parameters[i].substring(0, pos);
            paraValue = parameters[i].substring(pos + 1);
            if (paraName == name) {
                return unescape(paraValue.replace(/\+/g, " "));
            }
        }
        return '';
    },
    request: function(paras) {
        var url = location.href;
        var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
        var paraObj = {}
        for (i = 0; j = paraString[i]; i++) {
            paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
        }
        var returnValue = paraObj[paras.toLowerCase()];
        if (typeof(returnValue) == "undefined") {
            return "";
        } else {
            return returnValue;
        }
    },
    getIntervals: function() {
        var _cacheIntervals = $.cookies.get("_cacheIntervals");
        if (_cacheIntervals == null || _cacheIntervals == 'undefined') {
            return "120";
        };
        return _cacheIntervals;
    },
    openWindow: function(url, name) {
        var iWidth = window.screen.width;
        var iHeight = window.screen.height;
        var name = name;
        var iTop = 0;
        var iLeft = 0;
        var date = new Date(); //日期对象
        var now = date.getFullYear() + "";
        now = now + (date.getMonth() + 1) + ""; //取月的时候取的是当前月-1如果想取当前月+1就可以了
        now = now + date.getDate() + "";
        now = now + date.getHours() + "";
        now = now + date.getMinutes() + "";
        now = now + date.getSeconds() + "";
        now = name + now;
        window.open(url, now, 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=yes,resizeable=no,location=no,status=no');
    }
}

$.mCheckBox = {
    bDropBox: function(id, data) {
        var i = 0;
        var arr;
        var predtuid = "";
        var html = "";
        var tempJson = {
            part0: "",
            part1: "",
            part2: ""
        }
        $.each(data, function(k, v) {
            arr = v.Dtuid.split('.');
            var dtuid = arr[0];
            var value = dtuid + "." + arr[1]
            var row = parseInt((i) / 3);
            if (dtuid != predtuid) {
                //第一次不加尾巴
                if (i != 0) {
                    html += '</dl></dl>';
                    tempJson["part" + ((i - 1) % 3).toString()] += html;
                }
                html = '<dl class="one-section">';
                html += '<dt class="you_choose pic-title_no"><span class="click-place" row="' + row + '"  onclick="clickPlace(this);"><span class="subtract"></span>' + arr[2] + '</span> <span class="choose choose-hide" onclick="beAll(this)">全部</span></dt>';
                html += '<dl class="inner-dlHide" type="shou" style="height: 0px;">';
                i++;
                predtuid = dtuid;
            }
            html += '<dd><span class="wid"></span><input name="chkName" type="checkbox" value="' + value + '">' + v.DtuidName + '</dd>';
        });
        html = "";
        for (var i = 0; i < 3; i++) {
            var index = (i + 1).toString();
            html += '<div class="choose_part' + index + ' only-choose">' + tempJson["part" + i] + '</div>';
        }
        $("#" + id).html(html);
    },
    bDropBoxNew: function(id, data, searchDtuName) {
        var tempStr = "<table style='width:100%;'><tr><td style='width:10%;'>&nbsp;</td>";
        var i = 0;
        var predtuid = "";
        var predtuname = "";
        var arr;
        $.each(data, function(k, v) {
            arr = v.Dtuid.split('.');
            if (arr[2] && searchDtuName && arr[2].indexOf(searchDtuName) < 0) {
                return true;
            }
            if (predtuid != arr[0]) {
                if (i > 0) {
                    if (i % 3 == 0) {
                        tempStr += "</td></tr>";
                        if ((i + 1) < data.length) tempStr += "<tr><td></td>";
                    } else
                        tempStr += "</td>";
                }
                tempStr += "<td style='width:30%;'><img src='../../Style/imgs/sprites/plus.gif' onclick=\"expendPara(this, '" + arr[0] + "')\"><input type='checkbox' ktype='1' name='chkDtu' value='" + arr[0] + "' checked='checked' onchange=\"CheckedDTU(this)\" />" + arr[2];
                i++;
            }
            tempStr += "<div name='td_" + arr[0] + "' style='display:none;'>&nbsp; &nbsp; &nbsp; &nbsp;<input type='checkbox' ktype='1' isPara= '1' name='chkDtu_" + arr[0] + "' value='" + arr[0] + "." + arr[1] + "' checked='checked' />" + v.DtuidName + "</div>";
            predtuid = arr[0];
            predtuname = arr[2];
        });
        ajaxbg.hide();
        if (data.length % 3 != 0) tempStr += "</td></tr>";
        tempStr += "</table>";
        $("#" + id).html(tempStr);
        $("#" + id).attr("class", "");
    },
    getDropBoxMsg: function() {
        //var maxRow = parseInt($(".choose_part1 .click-place:last").attr("row"));
        //var names = [];
        //var nameObj = { name: -1, dom: -1 };
        //for (var i = 0; i <= maxRow; i++) {
        //    $(".click-place[row=" + i + "]").contents().each(function (i, v) {
        //        //文本
        //        if (this.nodeType === 3) {
        //            nameObj.name = this.wholeText;
        //        }
        //        if (this.nodeType == 1 && $(this).attr("class") == "subtract") {
        //            nameObj.dom = $(this).parent().parent().parent();
        //        }
        //        if (nameObj.name != -1 && nameObj.dom != -1) {
        //            names.push($.extend(true, {}, nameObj));
        //            nameObj.name = -1;
        //            nameObj.dom = -1;
        //        }
        //    });
        //}

        var names = [];


        return names;
    },
    bBox: function(id, data) {
        var tempJson = {
            part0: "",
            part1: "",
            part2: ""
        }
        var html = "";
        $.each(data, function(k, v) {
            var row = parseInt(k / 3);
            //tempJson["part" + (k % 3).toString()] += '<p class="one_line_choose" onclick="need(this);"><span class="show_pic"></span><span  row=' + row + ' value=' + v.Dtuid + '>' + v.DtuidName + '</span></p>';
            tempJson["part" + (k % 3).toString()] += '<p class="one_line_choose" row=' + row + ' onclick="need(this);"><input name="chkName" ktype="1"   type="checkbox" value=' + v.Dtuid + ' checked="true">' + v.DtuidName + '</p>';


        });
        for (var i = 0; i < 3; i++) {
            var index = (i + 1).toString();
            html += '<div class="choose_part' + index + ' only-choose">' + tempJson["part" + i] + '</div>';
        }
        $("#" + id).html(html);
    },
    getBoxMsg: function() {
        var maxRow = parseInt($(".choose_part1 p[row]:last").attr("row"));
        var names = [];


        var nameObj = { name: -1, dom: -1 };
        for (var i = 0; i <= maxRow; i++) {
            $(".one_line_choose[row=" + i + "]").contents().each(function(i, v) {
                //文本
                if (this.nodeType === 3) {
                    nameObj.name = this.wholeText;
                }
                if (this.nodeType == 1 && $(this).attr("name") == "chkName") {
                    nameObj.dom = $(this).parent();
                }
                if (nameObj.name != -1 && nameObj.dom != -1) {
                    names.push($.extend(true, {}, nameObj));
                    nameObj.name = -1;
                    nameObj.dom = -1;
                }
            });
        }
        return names;
    },
    //搜索
    searchBox: function(id, name, names) {
        var newArr = names.filter(function(item) {
            if (name === "") {
                return true;
            }
            return item.name.indexOf(name) >= 0
        });
        for (var i = 0; i < 3; i++) {
            $("#" + id).children().eq(i).empty();
        }
        for (var i = 0; i < newArr.length; i++) {
            var nameObj = newArr[i];
            $("#" + id).children().eq(i % 3).append(nameObj.dom);
        }
    },
    setAll: function() {
        for (var i = 0; i < $(".one-section").length; i++) {
            var dom = $(".one-section").eq(i);
            var checkboxs = dom.find("dl[type=shou] input[type=checkbox]");
            var flag = true;
            for (var j = 0; j < checkboxs.length; j++) {
                var chkbox = checkboxs[j];
                if (chkbox.checked == false) {
                    flag = false;
                    dom.find("span.choose").addClass("choose-hide");
                    j = checkboxs.length + 1;
                }
            }
            //说明所有的都选中了
            if (flag === true) {
                dom.find("span.choose").removeClass("choose-hide");
            }
        }
    }
}
$.mSelect = {
    bSelect2: function(objId, json, idName, idValue) {
        var para = {
            placeholder: "Select...",
            allowClear: true,
            minimumInputLength: 1,
            query: function(query) {

            }
        }
        var html = "";
        for (i = 0; i < json.length; i++) {
            var item = json[i];
            var id = item[idName];
            var text = item[idValue];
            html += '<option value="' + id + '">' + text + '</option>';
        }
        html = '<option value="-1">全部分组</option>' + html;
        $("#" + objId).html(html);
        $("#" + objId).select2();
    }
}