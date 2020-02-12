var Showbo = { author: 'showbo', homepage: 'http://www.lenomC100.com' };
//鏄惁涓篿e娴忚鍣�  
Showbo.IsIE = !!document.all;
//ie娴忚鍣ㄧ増鏈�  
Showbo.IEVersion = (function() { if (!Showbo.IsIE) return -1; try { return parseFloat(/msie ([\d\.]+)/i.exec(navigator.userAgent)[1]); } catch (e) { return -1; } })();
//鎸塱d鑾峰彇瀵硅薄  
Showbo.$ = function(Id, isFrame) {
        var o;
        if ("string" == typeof(Id)) o = document.getElementById(Id);
        else if ("object" == typeof(Id)) o = Id;
        else return null;
        return isFrame ? (Showbo.IsIE ? frames[Id] : o.contentWindow) : o;
    }
    //鎸夋爣绛惧悕绉拌幏鍙栧璞�  
    //椤甸潰鐨勯珮鍜屽******************************  
Showbo.isStrict = document.compatMode == "CSS1Compat";
Showbo.BodyScale = { x: 0, y: 0, tx: 0, ty: 0 }; //锛坸锛寉锛夛細褰撳墠鐨勬祻瑙堝櫒瀹瑰櫒澶у皬  锛坱x锛宼y锛夛細鎬荤殑椤甸潰婊氬姩瀹藉害鍜岄珮搴� 
Showbo.getClientHeight = function() { /*if(Showbo.IsIE)*/ return Showbo.isStrict ? document.documentElement.clientHeight : document.body.clientHeight; /*else return self.innerHeight;*/ }
Showbo.getScrollHeight = function() { var h = !Showbo.isStrict ? document.body.scrollHeight : document.documentElement.scrollHeight; return Math.max(h, this.getClientHeight()); }
Showbo.getHeight = function(full) { return full ? this.getScrollHeight() : this.getClientHeight(); };
Showbo.getClientWidth = function() { /*if(Showbo.IsIE)*/ return Showbo.isStrict ? document.documentElement.clientWidth : document.body.clientWidth; /*else return self.innerWidth;*/ }
Showbo.getScrollWidth = function() { var w = !Showbo.isStrict ? document.body.scrollWidth : document.documentElement.scrollWidth; return Math.max(w, this.getClientWidth()); }
Showbo.getWidth = function(full) { return full ? this.getScrollWidth() : this.getClientWidth(); };
Showbo.initBodyScale = function() {
        Showbo.BodyScale.x = Showbo.getWidth(false);
        Showbo.BodyScale.y = Showbo.getHeight(false);
        Showbo.BodyScale.tx = Showbo.getWidth(true);
        Showbo.BodyScale.ty = Showbo.getHeight(true);
    }
    //椤甸潰鐨勯珮鍜屽******************************  
Showbo.Msg = {
    INFO: 'info',
    ERROR: 'error',
    WARNING: 'warning',
    IsInit: false,
    timer: null,
    dvTitle: null,
    dvCT: null,
    dvBottom: null,
    dvBtns: null,
    lightBox: null,
    dvMsgBox: null,
    defaultWidth: 300,
    moveProcessbar: function() {
        var o = Showbo.$('dvProcessbar'),
            w = o.style.width;
        if (w == '') w = 20;
        else {
            w = parseInt(w) + 20;
            if (w > 100) w = 0;
        }
        o.style.width = w + '%';
        o.style.zIndex = "100000";
    },
    InitMsg: function(width) {
        //ie涓嬩笉鎸夌収娣诲姞浜嬩欢鐨勫惊搴忔潵鎵ц锛屾墍浠ヨ娉ㄦ剰鍦ㄨ皟鐢╝lert绛夋柟娉曟椂瑕佹娴嬫槸鍚﹀凡缁忓垵濮嬪寲IsInit=true       
        var ifStr = '<iframe src="javascript:false" mce_src="javascript:false" style="position:absolute; visibility:inherit; top:0px;left:0px;width:100%; height:100%; z-index:-1;' +
            'filter=\'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)\';"></iframe>',
            html = '<div class="top"><div class="right"><div class="title" id="dvMsgTitle" style="border-bottom:0px;"></div></div></div>' +
            '<div class="body"><div class="right"><div class="ct" id="dvMsgCT"></div></div></div>' +
            '<div class="bottom" id="dvMsgBottom"><div class="right"><div class="buttons" id="dvMsgBtns"></div></div></div>';
        this.dvMsgBox = document.createElement("div");
        this.dvMsgBox.id = "dvMsgBox";
        this.dvMsgBox.innerHTML += html;
        document.body.appendChild(this.dvMsgBox);
        this.lightBox = document.createElement("div");
        this.lightBox.id = "ShowBolightBox";
        document.body.appendChild(this.lightBox);
        if (Showbo.IsIE && Showbo.IEVersion < 7) { //鍔爄frame灞備慨姝e6涓嬫棤娉曢伄鐩栦綇select鐨勯棶棰�  
            this.lightBox.innerHTML += ifStr;
            this.dvMsgBox.innerHTML += ifStr;
        }
        this.dvBottom = Showbo.$('dvMsgBottom');
        this.dvBtns = Showbo.$('dvMsgBtns');
        this.dvCT = Showbo.$('dvMsgCT');
        this.dvTitle = Showbo.$('dvMsgTitle');
        this.IsInit = true;
    },
    checkDOMLast: function() { //姝ゆ柟娉曢潪甯稿叧閿紝瑕佷笉鏃犳硶鏄剧ず寮瑰嚭绐楀彛銆備袱涓璞vMsgBox鍜宭ightBox蹇呴』澶勫湪body鐨勬渶鍚庝袱涓妭鐐瑰唴  
        if (document.body.lastChild != this.lightBox) {
            document.body.appendChild(this.dvMsgBox);
            document.body.appendChild(this.lightBox);
        }
    },
    createBtn: function(p, v, fn) {
        var btn = document.createElement("input");
        btn.type = "button";
        btn.className = 'btns';
        btn.value = v;
        if (v == '确定') {
            try {

                btn.id = 'qd';
                btn.addEventListener("click", function() {}, false);
            } catch (e) {

            }

        }
        btn.onmouseover = function() { this.className = 'btnfocus'; }
        btn.onmouseout = function() { this.className = 'btns'; }

        btn.onclick = function() {

            Showbo.Msg.hide();

            if (fn) fn(p);
        }
        return btn;
    },
    alert: function(msg) {
        this.show({ buttons: { yes: '纭畾' }, msg: msg, title: '娑堟伅' });
    },
    // **********************************************************提示框******************************************************************************
    // confirm: function(msg, fn) {
    //     //fn涓哄洖璋冨嚱鏁帮紝鍙傛暟鍜宻how鏂规硶鐨勪竴鑷�  
    //     this.show({ buttons: { yes: '登录', no: '退出' }, msg: msg, title: '提示', fn: fn });
    // },
    prompt: function(labelWord, defaultValue, txtId, fn) {
        if (!labelWord) labelWord = '璇疯緭鍏ワ細';
        if (!defaultValue) defaultValue = "";
        if (!txtId) txtId = "msg_txtInput";
        this.show({ title: '杈撳叆鎻愮ず', msg: labelWord + '<input type="text"  id="' + txtId + '" style="width:200px" value="' + defaultValue + '"/>', buttons: { yes: '纭', no: '鍙栨秷' }, fn: fn });
    },
    wait: function(msg, title) {
        if (!msg) msg = '姝ｅ湪澶勭悊..';
        this.show({ title: title, msg: msg, wait: true });
    },
    show: function(cfg) {
        //cfg:{title:'',msg:'',wait:true,icon:'榛樿涓轰俊鎭�',buttons:{yes:'',no:''},fn:function(btn){鍥炶皟鍑芥暟,btn涓虹偣鍑荤殑鎸夐挳锛屽彲浠ヤ负yes锛宯o},width:鏄剧ず灞傜殑瀹絵  
        //濡傛灉鏄瓑寰呭垯wait鍚庨潰鐨勯厤缃笉闇€瑕佷簡銆傘€�   
        if (!cfg) throw ("娌℃湁鎸囧畾閰嶇疆鏂囦欢锛�");
        //娣诲姞绐椾綋澶у皬鏀瑰彉鐩戝惉  
        if (Showbo.IsIE) window.attachEvent("onresize", this.onResize);
        else window.addEventListener("resize", this.onResize, false);

        if (!this.IsInit) this.InitMsg(); //鍒濆鍖杁om瀵硅薄  
        else this.checkDOMLast(); //妫€鏌ユ槸鍚﹀湪鏈€鍚�  

        //妫€鏌ユ槸鍚﹁鎸囧畾瀹斤紝榛樿涓�300  
        if (cfg.width) this.defaultWidth = cfg.width;
        this.dvMsgBox.style.width = this.defaultWidth + 'px';
        this.dvMsgBox.style.zIndex = "100000";
        //鍙互鐩存帴浣跨敤show鏂规硶鍋滄涓鸿繘搴︽潯鐨勭獥鍙�  
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.dvTitle.innerHTML = '';
        if (cfg.title) this.dvTitle.innerHTML = cfg.title;
        this.dvCT.innerHTML = '';
        if (cfg.wait) {
            if (cfg.msg) this.dvCT.innerHTML = cfg.msg;
            this.dvCT.innerHTML += '<div class="pro"><div class="bg" id="dvProcessbar"></div></div>';
            this.dvBtns.innerHTML = '';
            this.dvBottom.style.height = '10px';
            this.timer = setInterval(function() { Showbo.Msg.moveProcessbar(); }, 1000);
        } else {
            //if(!cfg.icon)cfg.icon=Showbo.Msg.INFO;  
            if (!cfg.buttons || (!cfg.buttons.yes && !cfg.buttons.no)) {
                cfg.buttons = { yes: '纭畾' };
            }
            if (cfg.icon) this.dvCT.innerHTML = '<div class="icon ' + cfg.icon + '"></div>';
            if (cfg.msg) this.dvCT.innerHTML += cfg.msg + '<div class="clear"></div>';
            this.dvBottom.style.height = '45px';
            this.dvBtns.innerHTML = '<div class="height"></div>';
            if (cfg.buttons.yes) {
                this.dvBtns.appendChild(this.createBtn('yes', cfg.buttons.yes, cfg.fn));
                if (cfg.buttons.no) this.dvBtns.appendChild(document.createTextNode('或'));
            }
            if (cfg.buttons.no) this.dvBtns.appendChild(this.createBtn('no', cfg.buttons.no, cfg.fn));
        }
        Showbo.initBodyScale();
        this.dvMsgBox.style.display = 'block';

        this.lightBox.style.display = 'block';

        this.onResize(false);
    },
    hide: function() {
        this.dvMsgBox.style.display = 'none';
        this.lightBox.style.display = 'none';
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        if (Showbo.IsIE) window.detachEvent('onresize', this.onResize);
        else window.removeEventListener('resize', this.onResize, false);
    },
    onResize: function(isResize) {
        if (isResize) Showbo.initBodyScale();
        Showbo.Msg.lightBox.style.width = Showbo.BodyScale.tx + 'px';
        Showbo.Msg.lightBox.style.height = Showbo.BodyScale.ty + 'px';
        Showbo.Msg.dvMsgBox.style.top = 240 + 'px';
        Showbo.Msg.dvMsgBox.style.left = Math.floor((Showbo.BodyScale.x - Showbo.Msg.dvMsgBox.offsetWidth) / 2) + 'px';
    }

}