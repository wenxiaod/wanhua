var ComFunJS = new Object({
    //寮瑰嚭甯姪鍑芥暟
    winsuccess: function(content) {
        top.toastr.success(content);

    }, //鎴愬姛绐楀彛
    winsuccessnew: function(content) {
        top.toastr.success(content);

    }, //鎴愬姛绐楀彛New
    winprompt: function(callbact) {
        layer.prompt(function(val) {
            callbact.call(this, val);
        });
    },

    winwarning: function(content) {
        top.toastr.warning(content)
    }, //璀﹀憡绐楀彛
    wintips: function(content, callback) {
        layer.msg(content, {
            offset: 200,
            shift: 6
        });
    }, //鎻愮ず
    wintip: function(tip, dom) {
        layer.tips(tip, dom)
    }, //鎻愮ず
    winload: function() {
        layer.load();
    }, //鍔犺浇
    wintab: function(data) {
        layer.tab({
            area: ['600px', '300px'],
            tab: [{
                title: 'TAB1',
                content: '鍐呭1'
            }, {
                title: 'TAB2',
                content: '鍐呭2'
            }, {
                title: 'TAB3',
                content: '鍐呭3'
            }]
        });
    },
    wincloseload: function() {
        layer.closeAll('loading');
    }, //鍏抽棴鍔犺浇
    winconfirm: function(title, yes, no) {
        layer.confirm(title, {
            btn: ['纭', '鍙栨秷'], //鎸夐挳
            shade: false //涓嶆樉绀洪伄缃�
        }, function() {
            layer.closeAll('dialog');
            return yes.call(this);
        }, function() {
            return no && no.call(this);
        });
    },
    winAlert: function(title) { //甯︿竴涓‘璁ゆ寜閽殑鎻愮ず妗嗭紝鐐瑰嚮纭鎸夐挳鍏抽棴
        layer.confirm(title, {
            btn: ['纭'], //鎸夐挳
            shade: false //涓嶆樉绀洪伄缃�
        }, function() {
            layer.closeAll('dialog');
        });
    }, //纭妗�
    winAlert2: function(title, yes) { //甯︿竴涓‘璁ゆ寜閽殑鎻愮ず妗嗭紝鐐瑰嚮纭鎸夐挳鍏抽棴
        layer.confirm(title, {
            btn: ['纭'], //鎸夐挳
            shade: true //鏄剧ず閬僵
        }, function() {
            layer.closeAll('dialog');
            return yes.call(this);
        });
    }, //纭妗�
    winviewform: function(url, title, width, height, callbact) {
        var width = width || $("body").width() * 2 / 3;
        var height = height || $(window).height() - 40; //$("body").height();
        var optionwin = {
            type: 2,
            fix: true, //涓嶅浐瀹�
            area: [width + 'px', height + 'px'],
            //maxmin: true,
            content: url,
            title: title,
            shadeClose: false, //鍔犱笂杈规
            scrollbar: false,
            shade: 0.4,
            shift: 0,
            success: function(layero, index) {},
            end: function() {
                if (callbact) {
                    return callbact.call(this);
                }
            }
        }
        layer.open(optionwin);
    },
    //娌℃湁鏈€澶у寲
    winviewformNoMax: function(url, title, width, height, callbact) {
        var width = width || $("body").width() * 2 / 3;
        var height = height || $(window).height() - 40; //$("body").height();
        var optionwin = {
            type: 2,
            fix: true, //涓嶅浐瀹�
            area: [width + 'px', height + 'px'],
            maxmin: false,
            content: url,
            title: title,
            shadeClose: false, //鍔犱笂杈规
            scrollbar: false,
            shade: 0.4,
            shift: 0,
            success: function(layero, index) {},
            end: function() {
                if (callbact) {
                    return callbact.call(this);
                }
            }
        }
        layer.open(optionwin);
    },
    winviewformNoClose: function(url, title, width, height, option) {
        var width = width || $("body").width() - 300;
        var height = height || $("#main").height();
        var optionwin = {
            type: 2,
            fix: true, //涓嶅浐瀹�
            closeBtn: 0,
            area: [width + 'px', height + 'px'],
            maxmin: false,
            content: url,
            title: title,
            shadeClose: false, //鍔犱笂杈规
            success: function(layero, index) {}
        }
        layer.open(optionwin);
    }, //鏅€氭煡鐪嬬綉椤电獥鍙�
    winviewformright: function(url, title, callbact) {
        if ($(".layui-layer").length == 0) {
            var width = $("body").width() * 2 / 3;
            var height = $(window).height();
            var optionwin = {
                type: 2,
                fix: true, //涓嶅浐瀹�
                area: [width + 'px', height + 'px'],
                content: url,
                title: title,
                shift: 0,
                shade: 0.4,
                shadeClose: false,
                scrollbar: false,
                success: function(layero, index) {
                    var frameid = $("iframe", $(layero)).attr('id');
                    //$(layero).css("left", $(layero).position().left * 1 + 5 + "px");              
                    //$("body", top.frames[frameid].document).css({ "background": "#F8F8F8" });
                    $("body").one("click", function(event) {
                        layer.close(index)
                    });
                },
                end: function() {
                    if (callbact) {
                        return callbact.call(this);
                    }
                }
            }
            return layer.open(optionwin);
        } else {
            var framename = $(".layui-layer").find("iframe")[0].name;
            window.frames[framename].document.location.href = url;
        }

    },
    winbtnwin: function(url, title, width, height, option, btcallbact) {
        var width = width || $("body").width() - 300;
        var height = height || $(window).height() * 0.8; //var height = height || $("#main").height();
        var optionwin = {
            type: 2,
            fix: true, //涓嶅浐瀹�
            area: [width + 'px', height + 'px'],
            maxmin: true,
            content: url,
            title: title,
            shade: 0.4,
            shift: 0,
            shadeClose: false,
            scrollbar: false,
            success: function(layero, index) {
                if ($(layero).find(".successfoot").length == 0) {
                    var footdv = $('<div class="successfoot" style="border-bottom-width: 1px; padding: 0 20px 0 10px;margin-top: -3px;height:50px;background: #fff;"></div>');
                    var btnConfirm = $("<a href='javascript:void(0)' class='btn btn-sm btn-success' style='float:right; margin-top: 10px;width: 140px;'><i class='fa fa-spinner fa-spin' style='display:none'></i> 纭�   璁�</a>");
                    var btnCancel = $("<a href='javascript:void(0)' class='btn btn-sm btn-danger' style='float:right; margin-top: 10px;margin-right: 10px;width: 80px;'>鍙�  娑�</a>");
                    var msg = $("<input type='hidden' class='r_data' >");

                    btnConfirm.appendTo(footdv).bind('click', function() {
                        return btcallbact.call(this, layero, index, btnConfirm);
                    })
                    btnCancel.appendTo(footdv).bind('click', function() {
                        layer.close(index)
                    })
                    $(layero).append(footdv).append(msg);

                    try {} catch (e) {}
                }

            }
        }
        layer.open(optionwin);
    }, //甯︾‘璁ゆ鐨勭獥鍙�
    winviewhtml: function(content, title, width, height, callbact) {
        var width = width || 600;
        var height = height || 400;
        layer.open({
            type: 1,
            title: title,
            skin: 'layui-layer-rim', //鍔犱笂杈规
            area: [width + 'px', height + 'px'],
            content: content,
            shadeClose: true,
            success: function(layero, index) {
                if (callbact) {
                    return callbact.call(this, layero, index);
                }
            }

        });
    }, //鍔犺浇HTML
    winold: function(url) {
        var iWidth = 610; //寮瑰嚭绐楀彛鐨勫搴�;
        var iHeight = 600; //寮瑰嚭绐楀彛鐨勯珮搴�;
        //鑾峰緱绐楀彛鐨勫瀭鐩翠綅缃�
        var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
        //鑾峰緱绐楀彛鐨勬按骞充綅缃�
        var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
        var params = 'width=' + iWidth +
            ',height=' + iHeight +
            ',top=' + iTop +
            ',left=' + iLeft +
            ',channelmode=yes' //鏄惁浣跨敤鍓ч櫌妯″紡鏄剧ず绐楀彛銆傞粯璁や负 no
            +
            ',directories=yes' //鏄惁娣诲姞鐩綍鎸夐挳銆傞粯璁や负 yes
            +
            ',fullscreen=no' //鏄惁浣跨敤鍏ㄥ睆妯″紡鏄剧ず娴忚鍣�
            +
            ',location=no' //鏄惁鏄剧ず鍦板潃瀛楁銆傞粯璁ゆ槸 yes
            +
            ',menubar=no' //鏄惁鏄剧ず鑿滃崟鏍忋€傞粯璁ゆ槸 yes
            +
            ',resizable=no' //绐楀彛鏄惁鍙皟鑺傚昂瀵搞€傞粯璁ゆ槸 yes
            +
            ',scrollbars=yes' //鏄惁鏄剧ず婊氬姩鏉°€傞粯璁ゆ槸 yes
            +
            ',status=yes' //鏄惁娣诲姞鐘舵€佹爮銆傞粯璁ゆ槸 yes
            +
            ',titlebar=yes' //榛樿鏄� yes
            +
            ',toolbar=no' //榛樿鏄� yes
        ;
        window.open(url, name, params);
    }, //鑰佺獥鍙�
    setCookie: function(name, value) {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
    },
    getCookie: function(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

        if (arr = document.cookie.match(reg))

            return unescape(arr[2]);
        else
            return null;
    },
    delCookie: function(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(name);
        if (cval != null) {
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/;";
        }
    }

    ,
    winbtnwin111: function(url, title, width, height, option, btcallbact, c) {
        var width = width || $("body").width() - 300;
        var height = height || $(window).height() * 0.8; //var height = height || $("#main").height();
        var optionwin = {
            type: 2,
            fix: true, //涓嶅浐瀹�
            area: [width + 'px', height + 'px'],
            maxmin: true,
            content: url,
            title: title,
            shade: 0.4,
            shift: 0,
            shadeClose: false,
            scrollbar: false,
            success: function(layero, index) {
                if ($(layero).find(".successfoot").length == 0) {
                    var footdv = $('<div class="successfoot" style="border-bottom-width: 1px; padding: 0 20px 0 10px;margin-top: -3px;height:50px;background: #fff;"></div>');
                    var btnConfirm = $("<a href='javascript:void(0)' class='btn btn-sm btn-success' style='float:right; margin-top: 10px;width: 140px;'><i class='fa fa-spinner fa-spin' style='display:none'></i> 纭�   璁�</a>");
                    var btnCancel = $("<a href='javascript:void(0)' class='btn btn-sm btn-danger' style='float:right; margin-top: 10px;margin-right: 10px;width: 80px;'>鍙�  娑�</a>");
                    var msg = $("<input type='hidden' class='r_data' >");

                    btnConfirm.appendTo(footdv).bind('click', function() {
                        return btcallbact.call(this, layero, index, btnConfirm);
                    })
                    btnCancel.appendTo(footdv).bind('click', function() {
                        layer.close(index)
                    })
                    $(layero).append(footdv).append(msg);
                    c(index);
                    try {} catch (e) {}
                }
            }
        }
        layer.open(optionwin);
    }, //甯︾‘璁ゆ鐨勭獥鍙�
});