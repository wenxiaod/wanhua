function Layer() {};

Layer.prototype = {

    Thislayer: window.layer, // 获取当前窗口的layer对象
    Win: window, // 获取顶层窗口对象
    colseTime: 1000, // 关闭弹出框的默认时间 1S
    width: '800px', // 默认窗口的宽度
    height: '600px', // 默认窗口的高度
    px: 'px', // 对话框宽高单位
    /**
     * 警告框
     * @param {} content    警示的内容
     */
    showAlert: function(content) {
        this.Thislayer.alert(content, { icon: 0 });
    },
    /**
     * 操作成功提示框
     * @param {} content    提示内容  默认：操作成功
     * @param {} callback    回调方法
     */
    showSucAlert: function(content, callback) {
        var length = arguments.length; //  实际传入参数的长度
        var options = { icon: 1, time: this.colseTime };
        if (length == 0) { // 没有传入任何参数
            this.Thislayer.alert("操作成功", options);
        } else if (length == 1) { // 传入了提示内容
            this.Thislayer.alert(content, options);
        } else if (length == 2) { // 有回调函数的,将不自动关闭
            this.Thislayer.alert(content, { icon: 1 }, callback);
        }
    },
    /**
     * 操作失败提示框
     * @param {} content    提示内容 默认：操作失败
     * @param {} time       关闭时间(单位毫秒) 默认：1S,0:表示不自动关闭  
     */
    showFailAlert: function(content, time) {
        var length = arguments.length; //  实际传入参数的长度
        var options = { icon: 2, time: this.colseTime };
        if (length == 0) { // 没有传入任何参数
            this.Thislayer.alert("操作失败", options);
        } else if (length == 1) { // 传入了提示内容
            this.Thislayer.alert(content, options);
        } else if (length == 2) { // 传入了关闭时间
            options.time = time;
            this.Thislayer.alert(content, options);
        }
    },
    /**
     * 打开一个对话框(没有回调函数)
     * @param {} title       对话框标题(必须)
     * @param {} url        对话框URL(必须)
     * @param {} width        对话框宽度 默认：800px
     * @param {} height        对话框高低 默认：600px
     */
    openDialogNoCallBack: function(title, url, width, height) {
        this.Thislayer.open({
            type: 2,
            title: title,
            shadeClose: true,
            shade: 0.5,
            content: url,
            maxmin: false,
            btn: ['确定', '取消'],
            area: [width, height]
        });
    },
    /**
     * 获取当前的窗口对象
     * @return {}
     */
    getCurrentWin: function() {
        return this.Win.frames['ifr_center'];
    },

    /**
     * 打开一个对话框(带回调函数)
     * @param {} title       对话框标题(必须)
     * @param {} url        对话框URL(必须)
     * @param {} width        对话框宽度 默认：800px
     * @param {} height        对话框高低 默认：600px
     */
    openDialogWithCallBack: function(title, url, width, height, callback1, callback) {
        this.Thislayer.open({
            type: 2,
            title: title,
            shadeClose: true,
            shade: 0.5,
            content: url,
            area: [width, height],
            maxmin: false,
            btn: ['确定', '取消'],
            resize: false,
            yes: callback1,
            end: callback
        });

    },
    /**
     * 打开一个对话框(没有回调函数)
     * @param {} title       对话框标题(必须)
     * @param {} url        对话框URL(必须)
     * @param {} width        对话框宽度 默认：800px
     * @param {} height        对话框高低 默认：600px
     * @param {} callback   窗口销毁时的回调方法
     */
    openDialog: function(title, url, width, height, callback1, callback) {

        var length = arguments.length; //  实际传入参数的长度
        if (length == 2) { // 默认宽高
            this.openDialogNoCallBack(title, url, this.width, this.height)
        } else if (length == 3) { // 只传入宽度参数
            width += this.px;
            this.openDialogNoCallBack(title, url, width, this.height)
        } else if (length == 4) { // 传入宽度和高度
            width += this.px;
            height += this.px;
            this.openDialogNoCallBack(title, url, width, height)
        } else if (length == 5) { // 带回调函数
            width += this.px;
            height += this.px;
            this.openDialogWithCallBack(title, url, width, height, callback1);
        } else if (length == 6) { // 带回调函数
            width += this.px;
            height += this.px;
            this.openDialogWithCallBack(title, url, width, height, callback1, callback);
        }
    },

    /**
     * 关闭弹出层
     * @param {} index
     */
    closeLayer: function(index) {
        this.Thislayer.close(index);
    },
    /**
     * 关闭所有的Dialog
     */
    closeDialog: function() {
        this.Thislayer.closeAll('iframe');
    },
    /**
     * 关闭Dialog带有操作成功的提示
     * @param {} content
     */
    closeDialogWithMsg: function(content) {
        this.Thislayer.closeAll('iframe');
        if (!content) content = "操作成功";
        this.showSucMsg(content);
    },
    /**
     * 显示提示框
     * @param {} content
     */
    showMsg: function(content) {
        this.Thislayer.msg(content, { time: this.colseTime });
    },
    /**
     * 显示操作成功的提示框
     * @param {} content
     */
    showSucMsg: function(content) {
        if (!content) content = "操作成功";
        this.Thislayer.msg(content, { icon: 1, time: this.colseTime });
    },
    /**
     * 显示验证框
     * @param {} content   提示内容
     * @param {} yesFunction 确定以后的回调函数
     */
    showConfirm: function(content, yesFunction) {
        this.Thislayer.confirm(content, {
            btn: ['确定', '取消'],
            shadeClose: true,
            shade: 0.5,
            icon: 3
        }, yesFunction);
    }

};

var Layer = new Layer();