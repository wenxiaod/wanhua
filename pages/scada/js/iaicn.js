function nofind() {
    var img = event.srcElement;
    img.src = "/Content/img/404.png";
    img.onerror = null;
}

(function() {
    //鑾峰彇閬垮厤浜嗗悓婧愮瓥鐣ョ殑椤剁骇绐椾綋锛屼娇鐢ㄥ啋娉℃柟娉�
    let getTop = function(current) {
            if (!current)
                current = window;

            //鐩存帴妫€妫€鏌arent鏄惁鍙楀埌鍚屾簮绛栫暐闄愬埗
            try {
                current.parent.location.origin;
            } catch (e) {
                //parent鍙楀埌鍚屾簮绛栫暐闄愬埗鏃讹紝杩斿洖褰撳墠window
                return current;
            }

            //姝ゆ椂锛宲arent涓嶅彈鍚屾簮绛栫暐闄愬埗
            //濡傛灉parent鏄《绾indow锛屽垯杩斿洖top
            if (current.parent == top)
                return top;
            else
                return getTop(current.parent); //閫掑綊鏌ユ壘鏈夋晥鐨勯《绾indow瀵硅薄
        }
        //灏唃etTop鏂规硶娉ㄥ唽鍒皐indow涓�
    window.getTop = getTop;
    //灏唖opTop鍙橀噺娉ㄥ唽鍒皐indow涓� 锛宻op 锛坰ame origin policy锛�
    window.sopTop = getTop();
}());


var iaicn = (function() {
    'use strict';

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    var formatRegex = new RegExp("{-?[0-9]+}", "g");
    var undefined$1 = window.undefined;

    var format = function format(str) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        if (!str) {
            return '';
        }
        if (args.length === 0) {
            return str;
        }

        if (args.length === 1 && _typeof(args[0]) === 'object') {
            var obj = args[0];
            // "${name}, ${age}".format({name: "duhongming", age: 29})
            return str.replace(/\${-?[\w]+}/g, function(item) {
                var name = item.substring(2, item.length - 1);
                if (name) return obj[name];
                return name;
            });
        }

        return str.replace(formatRegex, function(item) {
            var intVal = parseInt(item.substring(1, item.length - 1));
            var replace;
            if (intVal >= 0) {
                replace = args[intVal];
            } else if (intVal === -1) {
                replace = "{";
            } else if (intVal === -2) {
                replace = "}";
            } else {
                replace = "";
            }
            return replace;
        });
    };

    var getStringTemplate = function getStringTemplate(func) {
        return func.toString().split(/\n/).slice(1, -1).join('\n');
    };

    var trim = function trim(str) {
        if (str === null || str === undefined$1) return str;
        var a = str.match(new RegExp("^\\s*(\\S+(\\s+\\S+)*)\\s*$"));
        return a === null ? "" : a[1];
    };

    var trimEnd = function trimEnd(str) {
        if (str === null || str === undefined$1) return str;
        return str.replace(new RegExp("\\s+$"), "");
    };

    var trimStart = function trimStart(str) {
        if (str === null || str === undefined$1) return str;
        return str.replace(new RegExp("^\\s+"), "");
    };

    var string = {
        format: format,
        trim: trim,
        trimStart: trimStart,
        trimEnd: trimEnd,
        getStringTemplate: getStringTemplate,
        encodeHtml: function encodeHtml(html) {
            return String(html).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        },
        decodeHtml: function decodeHtml(html) {
            var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
            return String(html).replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all, t) {
                return arrEntities[t];
            });
        }
    };

    var $window = $(window);
    var $document = $(document);
    var isTouch = 'createTouch' in document;
    var html = document.documentElement;
    var isIE6 = !('minWidth' in html.style);
    var isLosecapture = !isIE6 && 'onlosecapture' in html;
    var isSetCapture = 'setCapture' in html;

    var types = {
        start: isTouch ? 'touchstart' : 'mousedown',
        over: isTouch ? 'touchmove' : 'mousemove',
        end: isTouch ? 'touchend' : 'mouseup'
    };

    var getEvent = isTouch ? function(evt) {
        return !event.touches ? event.originalEvent.touches.item(0) : event;
    } : function(event) {
        return event;
    };

    var DragEvent = function DragEvent() {
        this.start = $.proxy(this.start, this);
        this.over = $.proxy(this.over, this);
        this.end = $.proxy(this.end, this);
        this.onstart = this.onover = this.onend = $.noop;
    };

    DragEvent.types = types;

    DragEvent.prototype = {

        start: function start(event) {
            var evt = this.startFix(event);
            $document.on(types.over, this.over).on(types.end, this.end);
            this.onstart(evt);
            return false;
        },

        over: function over(event) {
            var evt = this.overFix(event);
            this.onover(evt);
            return false;
        },

        end: function end(event) {
            var evt = this.endFix(event);
            $document.off(types.over, this.over).off(types.end, this.end);
            this.onend(evt);
            return false;
        },

        startFix: function startFix(event) {
            var evt = getEvent(event);

            this.target = $(evt.target);
            this.selectstart = function() {
                return false;
            };

            $document.on('selectstart', this.selectstart).on('dblclick', this.end);

            if (isLosecapture) {
                this.target.on('losecapture', this.end);
            } else {
                $window.on('blur', this.end);
            }

            if (isSetCapture) {
                this.target[0].setCapture();
            }

            return evt;
        },

        overFix: function overFix(event) {
            return getEvent(event);
        },

        endFix: function endFix(event) {
            var evt = getEvent(event);

            $document.off('selectstart', this.selectstart).off('dblclick', this.end);

            if (isLosecapture) {
                this.target.off('losecapture', this.end);
            } else {
                $window.off('blur', this.end);
            }

            if (isSetCapture) {
                this.target[0].releaseCapture();
            }

            return evt;
        }
    };

    /**
     * 鍚姩鎷栨嫿
     * @param   {HTMLElement} elem  琚嫋鎷界殑鍏冪礌
     * @param   {string} event 瑙﹀彂鎷栨嫿鐨勪簨浠跺璞°€傚彲閫夛紝鑻ユ棤鍒欑洃鍚� elem 鐨勬寜涓嬩簨浠跺惎鍔�
     * @param   {function} fnAllowDrag 瑙﹀彂鎷栨嫿鐨勪簨浠跺璞°€傚彲閫夛紝鑻ユ棤鍒欑洃鍚� elem 鐨勬寜涓嬩簨浠跺惎鍔�
     * @return {object} 杩斿洖鎿嶄綔瀵硅薄
     */
    DragEvent.create = function(elem, event, fnAllowDrag) {
        var $elem = $(elem);
        var dragEvent = new DragEvent();
        var startType = DragEvent.types.start;
        var noop = function noop() {};
        var className = elem.className.replace(/^\s|\s.*/g, '') + '-drag-start';
        var minX;
        var minY;
        var maxX;
        var maxY;

        var api = {
            onstart: noop,
            onover: noop,
            onend: noop,
            off: function off() {
                $elem.off(startType, dragEvent.start);
            }
        };

        dragEvent.onstart = function(event) {
            var allowDrap = fnAllowDrag ? fnAllowDrag(event) : true;
            if (!allowDrap) return;
            var isFixed = $elem.css('position') === 'fixed';
            var dl = $document.scrollLeft();
            var dt = $document.scrollTop();
            var w = $elem.outerWidth();
            var h = $elem.outerHeight();

            minX = 1;
            minY = 1;
            maxX = isFixed ? $window.width() - w + minX : $document.width() - w;
            maxY = isFixed ? $window.height() - h + minY : $document.height() - h;

            var offset = $elem.offset();
            var left = this.startLeft = isFixed ? offset.left - dl : offset.left;
            var top = this.startTop = isFixed ? offset.top - dt : offset.top;

            this.clientX = event.clientX;
            this.clientY = event.clientY;

            $elem.addClass(className);
            api.onstart.call(elem, event, left, top);
        };

        dragEvent.onover = function(event) {
            var left = event.clientX - this.clientX + this.startLeft;
            var top = event.clientY - this.clientY + this.startTop;
            var style = $elem[0].style;

            left = Math.max(minX, Math.min(maxX - 1, left));
            top = Math.max(minY, Math.min(maxY - 1, top));

            style.left = left + 'px';
            style.top = top + 'px';

            api.onover.call(elem, event, left, top);
        };

        dragEvent.onend = function(event) {
            var position = $elem.position();
            var left = position.left;
            var top = position.top;
            $elem.removeClass(className);
            api.onend.call(elem, event, left, top);
        };

        dragEvent.off = function() {
            $elem.off(startType, dragEvent.start);
        };

        if (event) {
            dragEvent.start(event);
        } else {
            $elem.on(startType, dragEvent.start);
        }

        return api;
    };



    var utils = Object.freeze({
        string: string,
        drag: DragEvent
    });

    /*global $*/

    var levelPadding = 24;
    var uuid = 1;

    function listToTree(data, options) {
        options = options || {};
        var ID_KEY = options.idKey || 'id';
        var PARENT_KEY = options.parentKey || 'parent';
        var CHILDREN_KEY = options.childrenKey || 'children';
        var rootId = options.rootId || 0;

        var tree = [],
            childrenOf = {};
        var item, id, parentId;

        for (var i = 0, length = data.length; i < length; i++) {
            item = data[i];
            id = item[ID_KEY];
            parentId = item[PARENT_KEY] || 0;
            childrenOf[id] = childrenOf[id] || [];
            item[CHILDREN_KEY] = childrenOf[id];
            if (parentId !== rootId) {
                childrenOf[parentId] = childrenOf[parentId] || [];
                childrenOf[parentId].push(item);
            } else {
                tree.push(item);
            }
        }

        return tree;
    }

    function _buildMenuItem(node, level) {
        var hasChildren = node.children && node.children.length > 0;
        if (hasChildren) {
            return this._buildSubmenu(node, level);
        }
        var name = node.Name || node.NodeName;
        var id = node.id || node.ID || node.Id || node.NodeId || node.NodeID;
        var firstCh = name.charAt(0);
        var icon = node.icon || this.options.getIcon && this.options.getIcon(node);
        var html = '\n        <li class="ant-menu-item" role="menuitem" data-id=' + id + ' aria-selected="false" style="padding-left: ' + this.levelPadding * level + 'px;">\n            <a href="/chart/barChart">\n                <i class="' + icon + '" zh="' + firstCh + '"></i>' + name + '<b class="iai-badge" style="display:none"></b>\n            </a>\n        </li>';
        return $(html);
    }

    function _buildSubmenu(node, level) {
        var name = node.Name || node.NodeName;
        var id = node.id || node.ID || node.Id || node.NodeId || node.NodeID;
        var firstCh = name.charAt(0);
        var icon = node.icon || this.options.getIcon && this.options.getIcon(node);
        var html = '\n        <li class="ant-menu-submenu-inline ant-menu-submenu" data-id=' + id + '>\n            <div class="ant-menu-submenu-title" aria-expanded="false" aria-haspopup="true" style="padding-left: ' + this.levelPadding * level + 'px;">\n                <span><i class="' + icon + '" zh="' + firstCh + '"></i>' + name + '</span>\n                <b class="iai-badge" style="display:none"></b>\n            </div>\n        </li>';
        var hasChildren = node.children && node.children.length > 0;
        var $node = $(html);
        if (hasChildren) {
            var ul = $('<ul class="ant-menu ant-menu-inline  ant-menu-sub" role="menu" aria-activedescendant="" style="display:none">');
            $node.append(ul);
            node.children.forEach(function(element) {
                var subitem = this._buildMenuItem(element, level + 1);
                ul.append(subitem);
            }, this);
        }
        return $node;
    }

    function IaiMenu(options) {
        //options.getIcon
        //options.onClick
        this.options = options;
        this.levelPadding = options.levelPadding || levelPadding;
        this.container = $(options.el);
        this.idPrex = ++uuid;
    }

    IaiMenu.prototype = {
        render: function render(data) {
            var me = this;
            this.data = data;
            var menu = $('<ul class="iai-menu ant-menu ant-menu-inline ant-menu-dark ant-menu-root" role="menu"></ul>');
            data.forEach(function(node) {
                var item = me._buildMenuItem(node, 1);
                menu.append(item);
            }, this);
            me = null;
            this.container.append(menu);
            this.attachEvent();
        },
        select: function select(id, emitEvent) {
            emitEvent = emitEvent === undefined ? true : emitEvent;
            var item = this.container.find('[data-id="' + id + '"]');
            if (item.length == 0) {
                return;
            }

            var parent = item.parent();
            while (parent.length > 0 && !parent.hasClass('ant-menu-root')) {
                if (parent.hasClass('ant-menu-sub')) {
                    !parent.hasClass('ant-menu-item-selected') && parent.addClass('ant-menu-item-selected');
                } else if (parent.hasClass('ant-menu-submenu')) {
                    console.log('kdkdkd');
                    !parent.hasClass('ant-menu-submenu-open') && parent.addClass('ant-menu-submenu-open ant-menu-item-active');
                    parent.find('ul:eq(0)').show();
                }
                parent = parent.parent();
            }
            item.addClass('ant-menu-item-selected ant-menu-item-active');
            //this.options.onClick && this.options.onClick(id);
            if (item.hasClass('ant-menu-submenu')) {
                emitEvent && item.find('.ant-menu-submenu-title span').click();
                this.container.scrollTop(item.offset().top - 100);
                return;
            }
            emitEvent && item.find('a').click();
            this.container.scrollTop(item.offset().top - 100);
        },
        setBadge: function setBadge(id, val) {
            var badge = this.container.find('[data-id="' + id + '"]').find('.iai-badge');
            $(badge[0]).text(val).show();
            return this;
        },
        clearBadge: function clearBadge(id, color) {
            var badge = this.container.find('[data-id="' + id + '"]').find('.iai-badge');
            $(badge[0]).text('').hide();
            return this;
        },
        addItemClass: function addItemClass(id, className) {
            var $li = this.container.find('[data-id="' + id + '"]');
            $li.addClass(className);
            return this;
        },
        removeItemClass: function removeItemClass(id, className) {
            var $li = this.container.find('[data-id="' + id + '"]');
            $li.removeClass(className);
            return this;
        },
        attachEvent: function attachEvent() {
            var $menu = this.container.find('.iai-menu');
            var me = this;
            $menu.on('click', function(evt) {
                evt.preventDefault();
                var $this = $(evt.target);
                var IsSubmenu = $this.hasClass('ant-menu-submenu-title');
                if (IsSubmenu) {
                    var isOpened = $this.parent().hasClass('ant-menu-submenu-open');
                    $this.parent()[isOpened ? 'removeClass' : 'addClass']('ant-menu-submenu-open');
                    isOpened ? $this.next().hide() : $this.next().show();
                }
            });
            $menu.on('click', '.ant-menu-item a', function(evt) {
                evt.preventDefault();
                $menu.find('.ant-menu-item,.ant-menu-submenu').removeClass('ant-menu-item-selected').removeClass('ant-menu-item-active');
                $(this).parent().addClass('ant-menu-item-selected ant-menu-item-active');
                var p = $(this).parent().parent();
                p.addClass('ant-menu-item-selected');
                while (p.length >= 1) {
                    if (p.hasClass('ant-menu-submenu')) {
                        p.addClass('ant-menu-item-active');
                    }
                    p = p.parent();
                }
                me.options.onClick && me.options.onClick($(this).parent().data('id'));
            });
            $menu.on('click', '.ant-menu-submenu-title span', function(evt) {
                $menu.find('.ant-menu-item,.ant-menu-submenu').removeClass('ant-menu-item-selected').removeClass('ant-menu-item-active');
                $(this).parent().parent().addClass('ant-menu-item-selected ant-menu-item-active');
                me.options.onClick && me.options.onClick($(this).parent().parent().data('id'));
            });
        },
        _buildMenuItem: _buildMenuItem,
        _buildSubmenu: _buildSubmenu
    };
    IaiMenu.listToTree = listToTree;

    var html$1 = '\n<div class="panel panel-default iai-dialog" style="position: absolute;display: none;">\n<div class="panel-heading dialog-title">\n    <div style="float:right;">\n        <button type="button" class="close" style="outline: none;"><span>&times;</span></button>\n    </div>\n    <div class="panel-title" style="">\u3000</div>\n</div>\n\n<div style="overflow:auto" class="panel-body"></div>\n<div class="panel-footer controls" style="text-align: right;"></div>\n</div>';

    var noop = function noop() {};

    var zIndex = 100;

    var defaultConfig = {
        id: '',
        content: '', // html, HTMLElement, 妯℃澘id
        width: 'auto',
        height: 'auto',
        maxHeight: null,
        buttons: null,
        showButton: true,
        okValue: '纭畾',
        cancelValue: '鍙栨秷',
        onclose: noop, // 杩斿洖false灏卞彇娑坈lose鎿嶄綔
        closeToHiden: false // 鍏抽棴鍙槸闅愯棌锛屼笉鍒犻櫎鍏冪礌
    };

    function Dialog(opts, ok, cancel) {

        /*
            绂佹璁块棶椤剁骇window锛岄伩鍏嶅悓婧愮瓥鐣ラ檺鍒�
        */
        if (opts.inline !== true && window != top) {
            if (window.parent == top) {
                try {
                    window.parent.location.origin;
                    //鍙互璁块棶椤剁骇瀵硅薄锛屽嵈涓嶅彈鍚屾簮绛栫暐闄愬埗
                    return new window.parent.iaicn.Dialog(opts, ok, cancel);
                } catch (e) {
                    //涓嶅彲浠ヨ闂《绾у璞★紝鍙楀悓婧愮瓥鐣ラ檺鍒舵椂锛屽湪褰撳墠window鍒涘缓 Dialog
                }
            } else {
                return new window.parent.iaicn.Dialog(opts, ok, cancel);
            }
        }
        var options = {};
        $.extend(options, defaultConfig, opts);
        this.options = options;
        this.showButton = options.showButton || options.buttons.length > 0;
        var $overlay = $('<div class="iai-modal-mask" style="display: none;"></div>');
        var $dialog = $(html$1);

        $('body').append($overlay);
        $('body').append($dialog);

        this.dialog = $dialog;
        this.title = $dialog.find('.panel-title');
        this.overlay = $overlay;

        var zidx = this.__getZindex();
        $dialog.css('z-index', zidx + 10);
        $overlay.css('z-index', zidx);

        options.content = string.trimStart(options.content);
        var content;
        if (typeof options.content === "string") {
            content = $(options.content.charAt(0) === '<' ? options.content : document.getElementById(options.content).innerHTML);
        } else {
            content = $(options.content);
        }

        content.show();
        $dialog.find('.panel-body').empty().append(content);
        this.title.html(options.title);

        // set size
        $dialog.height('auto');
        if (options.height === 'auto') {
            var css = { height: 'auto' };
            if (options.maxHeight) {
                var maxHeight = options.maxHeight;
                if (maxHeight.charAt(maxHeight.length - 1) == '%') {
                    maxHeight = $(window).height() * parseFloat(maxHeight) / 100 - 120; // TODO 闇€瑕佽绠�
                }
                css['max-height'] = maxHeight + 'px';
            }
            $dialog.find('.panel-body').css(css);
        } else {
            if (options.height.charAt(options.height.length - 1) == '%') {
                options.height = $(window).height() * parseFloat(options.height) / 100 - 120; // TODO 闇€瑕佽绠�
            }
            $dialog.find('.panel-body').height(options.height);
        }

        if (options.width === 'auto') {
            $dialog.width('auto');
        } else {
            $dialog.width(options.width);
        }

        this.__setButton(ok, cancel);
        this.__setFooterInfo();
        this.__initEvent();
    }

    $.extend(Dialog.prototype, {
        show: function show() {
            this.overlay.show();
            this.dialog.show();
            this.dialog.css({ marginLeft: 0, marginTop: 0 });
            this.__center();
            return this;
        },
        close: function close() {
            if (!this.options) return;

            var ret = this.options.onclose();
            if (ret === false) return;

            this.dialog.hide();
            this.overlay.hide();

            if (!this.options.closeToHiden) {
                if (typeof this.options.content !== "string") {
                    var content = $(this.dialog.find('.panel-body').html());
                    content.hide();
                    $('body').append(content);
                }
                this.dialog.remove();
                this.overlay.remove();
            }
            this.options = null;
            delete this.win;
        },
        hiden: function hiden() {
            this.dialog.hide();
            this.overlay.hide();
        },
        setTitle: function setTitle(title) {
            this.title.html(title);
        },
        __getZindex: function __getZindex() {
            var z = zIndex;
            zIndex += 10;
            return z;
        },
        __setButton: function __setButton(ok, cancel) {
            var options = this.options;
            var me = this;
            if (!this.showButton) {
                this.dialog.find('.panel-footer').remove();
                //this.dialog.find('.sw-dialog-content').css('margin-bottom', 10);
                return;
            }

            // 鎸夐挳缁�
            if (!$.isArray(options.buttons)) {
                options.buttons = [];
            }

            // 纭畾鎸夐挳
            if (ok !== undefined) {
                options.ok = ok;
            }

            if (options.ok) {
                options.buttons.push({
                    cmd: 'ok',
                    value: options.okValue,
                    callback: options.ok
                });
            }

            // 鍙栨秷鎸夐挳
            if (cancel !== undefined) {
                options.cancel = cancel;
            }

            if (options.cancel) {
                options.buttons.push({
                    cmd: 'cancel',
                    value: options.cancelValue,
                    callback: options.cancel
                });
            }

            this.callbacks = {};

            this.dialog.find('.panel-footer').empty();
            var html = '';
            $.each(options.buttons, function(idx, val) {
                me.callbacks[val.cmd] = val.callback;
                if (val.cmd === 'cancel') html += string.format('<button class="ant-btn ant-btn-dashed" data-cmd=${cmd}><span>${value}</span></button>', val);
                else if (val.cmd === 'ok') html += string.format('<button class="ant-btn ant-btn-primary" data-cmd=${cmd}><span>${value}</span></button>', val);
            });
            this.dialog.find('.panel-footer').append($(html));
            this.dialog.find('.panel-footer .btn:last').css('margin-right', 0);
        },
        __setFooterInfo: function __setFooterInfo() {
            if (this.options.footerInfo) {
                this.dialog.find('.panel-footer').append(this.options.footerInfo);
            }
        },
        __initEvent: function __initEvent() {
            var me = this;
            this.dialog.on('click', '.close', function(event) {
                //event.preventDefault();
            });
            this.dialog.on('mousedown', '.close', function(event) {
                //event.stopPropagation();
            });

            this.dialog.on('mouseup', '.close', function(event) {
                if (event.button === 2) // 鍙抽敭鐐瑰嚮
                    return;
                me.close();
                //event.preventDefault();
            });

            this.dialog.on(DragEvent.types.start, '.dialog-title', function(event) {
                DragEvent.create(me.dialog[0], event, function(ev) {
                    var target = ev.target;
                    return target.parentElement.className !== "close";
                });
            });

            this.dialog.on('click', '[data-cmd]', function(event) {
                var $this = $(this);
                if (!$this.attr('disabled')) {
                    // IE BUG
                    var cmd = $this.data('cmd');
                    var callback = me.callbacks[cmd] || window[cmd] || noop;
                    if (cmd === 'cancel') {
                        var ret = callback($this, this);
                        if (ret !== false) me.close();
                    } else {
                        callback(me, this);
                    }
                }

                event.preventDefault();
            });

            this.dialog.find('panel-body').bind('mousewheel DOMMouseScroll', function(event) {
                var scrollHeight = $(this)[0].scrollHeight,
                    delta;
                if (event.originalEvent.wheelDelta) delta = event.originalEvent.wheelDelta / 120; //firefox闄ゅ鐨勬祻瑙堝櫒
                if (event.originalEvent.detail) delta = -event.originalEvent.detail / 3; //firefox
                if ($(this).scrollTop() === scrollHeight - $(this).outerHeight() && delta < 0 || $(this).scrollTop() == 0 && delta > 0) {
                    event.stopPropagation();
                    return false;
                }
            });
        },
        __center: function __center() {
            var dialog = this.dialog;
            var $window = $(window);
            var $document = $(document);
            var dl = $document.scrollLeft();
            var dt = $document.scrollTop();
            var ww = $window.width();
            var wh = $window.height();
            var ow = dialog.width();
            var oh = dialog.height();
            var left = (ww - ow) / 2 + dl;
            var top = (wh - oh) * 382 / 1000 + dt; // 榛勯噾姣斾緥
            var style = dialog[0].style;

            style.left = Math.max(parseInt(left), dl) + 'px';
            style.top = Math.max(parseInt(top), dt) + 'px';
        },
        __resize: function __resize() {
            this.__center();
        }
    });

    var count = 1;
    Dialog.getId = function() {
        return count++;
    };

    /**
     * 鏍规嵁url鑾峰彇html鏄剧ず瀵硅瘽妗�
     */
    Dialog.open = function(url, options, callback) {
        var id = 'div_dialog_' + ini.Dialog.getId();
        var dlg = new top.ini.Dialog({
            title: options.title,
            content: string.format('<div id={0}></div>', id),
            height: options.height,
            width: options.width,
            ok: callback || noop,
            cancel: function cancel() {}
        });
        dlg.id = id;
        ini.ajax.getServerHtml(url, function(html) {
            top.$('#' + id).html(html);
            dlg.show();
        });
        return dlg;
    };

    Dialog.openWindow = function(url, options) {
        var opts = {};
        $.extend(opts, defaultConfig, options);
        var Dialog = top.iaicn.Dialog;
        var id = 'div_dialog_' + Dialog.getId();
        var ifmId = id + '_' + 'ifm';
        var content = '<iframe scrolling="auto" allowtransparency="true" id="' + ifmId + '" name="' + ifmId + '"  frameborder="0" src="" style="height: ' + options.height + ';"></iframe>';
        opts.content = content;
        opts.okValue = opts.okValue || '纭畾';
        opts.cancel = opts.cancel || function() {};
        var dlg = new Dialog(opts);
        dlg.id = id;
        var $ifm = top.$('#' + ifmId);
        $ifm.css({ height: options.height, width: '100%' });
        $ifm.load(function() {
            $ifm[0].contentWindow.ownerWin = window;
            dlg.win = $ifm[0].contentWindow;
            var h = top.$($ifm[0].contentWindow.document).outerHeight();
        });

        dlg.dialog.find('.panel-body').css('padding', 0);
        dlg.show();
        $ifm[0].src = url;
        return dlg;
    };

    var defaultTop = 24;
    var defaultBottom = 24;
    var defaultPlacement = 'bottomRight';

    function getCssStyleString(style) {
        if (typeof style === 'string') {
            return style;
        }
        var css = '';
        for (var p in style) {
            css += p + ':' + style[p] + ';';
        }
        return css;
    }

    function getPlacementStyle(placement) {
        var style;
        switch (placement) {
            case 'topLeft':
                style = 'left:0;top:' + defaultTop + ';bottom:auto;';
                break;
            case 'bottomLeft':
                style = 'left:0;top:auto;bottom:' + defaultBottom + ';';
                break;
            case 'bottomRight':
                style = 'right:0;top:auto;bottom:' + defaultBottom + ';';
                break;
            default:
                style = 'right:0;top:' + defaultTop + ';bottom:auto;';
        }

        return style;
    }

    var placementInstances = {};
    var iconTypeMaping = {
        error: 'cross-circle-o',
        success: 'check-circle-o',
        info: 'info-circle-o',
        warning: 'exclamation-circle-o'
    };

    function Notification() {}

    Notification.prototype.render = function(props) {
        var _this = this;

        this.props = props;
        props.placement = props.placement || defaultPlacement;
        var icon = props.icon || '';
        var type = props.type || '';
        var costomstyle = props.style ? getCssStyleString(props.style) : '';
        var hasIcon = icon !== '';
        var closable = props.closable;
        var message = props.message || '';
        var description = props.description || '';

        var dom = this.dom = document.createElement('div');
        dom.className = 'ant-notification-notice ant-notification-notice-closable';
        dom.style.cssText = costomstyle;
        var placement = this.getPlacement(props.placement);
        var iconTemplate = hasIcon ? '<i class="anticon anticon-' + icon + ' ant-notification-notice-icon ant-notification-notice-icon-' + type + '"></i>' : '';

        var htmlTemplate = '\n<div class="ant-notification-notice-content">\n<div class="' + (hasIcon ? 'ant-notification-notice-with-icon' : '') + '">\n    ' + iconTemplate + '\n    <div class="ant-notification-notice-message">' + message + '</div>\n    <div class="ant-notification-notice-description">' + description + '</div>\n</div>\n</div>\n' + (closable ? '<a tabindex="0" class="ant-notification-notice-close"><span class="ant-notification-notice-close-x"></span></a>' : '');
        dom.innerHTML = htmlTemplate;
        placement.appendChild(dom);
        this.installEvent();

        if (props.duration) {
            // 璁剧疆涓簄ull鎴�0鏃朵笉闇€瑕佽嚜鍔ㄥ叧闂�
            this.closeTimer = setTimeout(function() {
                _this.close();
            }, (props.duration || defaultProps.duration) * 1000);
        }
    };

    Notification.prototype.installEvent = function() {
        var _this2 = this;

        this.dom.addEventListener('click', function(evt) {
            if (evt.target.className.indexOf('-close') > 0) {
                _this2.close();
            }
        });
    };

    Notification.prototype.clearCloseTimer = function() {
        if (this.closeTimer) {
            clearTimeout(this.closeTimer);
            this.closeTimer = null;
        }
    };

    Notification.prototype.close = function() {
        var props = this.props;
        this.clearCloseTimer();
        props.onClose && props.onClose();
        this.destory();
    };

    Notification.prototype.destory = function() {
        this.dom.remove ? this.dom.remove() : this.dom.removeNode(true);
        this.dom = null;
    };

    Notification.prototype.getPlacement = function(placement) {
        if (placementInstances[placement]) {
            return placementInstances[placement];
        }
        var div = document.createElement('div');
        div.className = 'ant-notification ant-notification-' + placement;
        div.style.cssText = getPlacementStyle(placement);
        document.body.appendChild(div);
        placementInstances[placement] = div;
        return div;
    };

    Notification.success = function(config) {
        var notification = new Notification(config);
        notification.render(config);
    };

    function open(props) {
        var cfg = props || {};
        cfg.duration = cfg.duration === undefined ? 2.5 : cfg.duration;
        cfg.closable = cfg.closable === undefined ? true : cfg.closable;
        //cfg.message = message;
        //cfg.description = description;

        new Notification().render(cfg);
    }

    var api = {
        open: open
    };

    ['success', 'info', 'warning', 'error'].forEach(function(type) {
        api[type] = function(args) {
            args.icon = iconTypeMaping[type] || 'info-circle';
            args.type = type;
            api.open(args);
        };
    });

    api.warn = api.warning;
    var notification = api;

    var defaultDuration$1 = 2;
    var messageContainer = null;

    function getMessageContainer() {
        if (messageContainer) {
            return messageContainer;
        }

        messageContainer = document.createElement('div');
        messageContainer.className = 'ant-message';
        document.body.appendChild(messageContainer);
        return messageContainer;
    }

    function Message(config) {
        this.config = config;
    }
    Message.prototype.render = function() {
        var _this = this;

        var icon = this.config.icon;
        var content = this.config.content;
        var type = this.config.type;
        var iconClassNames = ['anticon'];
        var closable = this.closable === undefined ? true : this.closable;
        type === 'loading' && iconClassNames.push('anticon-spin');
        iconClassNames.push('anticon-' + icon);

        var html = '<div class="ant-message-notice">\n    <div class="ant-message-notice-content">\n        <div class="ant-message-custom-content ant-message-' + type + '">\n            <i class="' + iconClassNames.join(' ') + '"></i><span>' + content + '</span>\n        </div>\n        ' + (closable ? '<a tabindex="0" class="ant-message-notice-close"><span class="ant-notification-notice-close-x"></span></a>' : '') + '\n    </div>\n</div>';

        var docfrag = document.createElement('div');
        docfrag.innerHTML = html;
        var container = getMessageContainer();
        var dom = this.dom = docfrag.firstChild;
        container.appendChild(dom);
        docfrag.remove ? docfrag.remove() : docfrag.removeNode(true);

        if (this.config.duration) {
            // 璁剧疆涓簄ull鎴�0鏃朵笉闇€瑕佽嚜鍔ㄥ叧闂�
            this.closeTimer = setTimeout(function() {
                _this.close();
            }, (this.config.duration || defaultDuration$1) * 1000);
        }

        this.installEvent();
    };

    Message.prototype.installEvent = function() {
        var _this2 = this;

        var closeIcon = this.dom.querySelector('.ant-message-notice-close');
        if (!closeIcon) {
            return;
        }
        closeIcon.addEventListener('click', function() {
            _this2.close();
        });
    };

    Message.prototype.setContent = function(content) {
        var contentEl = this.dom.querySelector('.ant-message-custom-content span');
        contentEl && (contentEl.innerHTML = content);
    };

    Message.prototype.clearCloseTimer = function() {
        if (this.closeTimer) {
            clearTimeout(this.closeTimer);
            this.closeTimer = null;
        }
    };

    Message.prototype.close = function() {
        var props = this.config;
        this.clearCloseTimer();
        props.onClose && props.onClose();
        this.destory();
    };

    Message.prototype.destory = function() {
        this.dom.remove ? this.dom.remove() : this.dom.removeNode(true);
        this.dom = null;
    };

    function notice(content) {
        var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultDuration$1;
        var type = arguments[2];
        var onClose = arguments[3];

        var iconType = {
            info: 'info-circle',
            success: 'check-circle',
            error: 'cross-circle',
            warning: 'exclamation-circle',
            loading: 'loading'
        }[type];
        var messageClass = null;
        try {
            messageClass = top == window ? Message : top.iaicn.Message;
        } catch (e) {
            messageClass = Message;
        }

        var instance = new messageClass({
            duration: duration,
            content: content,
            icon: iconType,
            type: type,
            onClose: onClose
        });
        instance.render();
        return instance;
    }

    var message = {
        info: function info(content, duration, onClose) {
            return notice(content, duration, 'info', onClose);
        },
        success: function success(content, duration, onClose) {
            return notice(content, duration, 'success', onClose);
        },
        error: function error(content, duration, onClose) {
            return notice(content, duration, 'error', onClose);
        },

        // Departed usage, please use warning()
        warn: function warn(content, duration, onClose) {
            return notice(content, duration, 'warning', onClose);
        },
        warning: function warning(content, duration, onClose) {
            return notice(content, duration, 'warning', onClose);
        },
        loading: function loading(content, duration, onClose) {
            return notice(content, duration, 'loading', onClose);
        },
        destroy: function destroy() {
            if (messageContainer) {
                messageContainer.remove();
                messageContainer = null;
            }
        }
    };

    /* global $ */
    function Confirm(props) {
        this.props = props;
        this.target = props.target;
    }

    Confirm.prototype = {
        render: function render() {
            var message = this.props.message;
            var html = '\n<div class="ant-popover" style="z-index:1001">\n    <div class="ant-popover-content">\n        <div class="ant-popover-arrow"></div>\n        <div class="ant-popover-inner">\n            <div class="ant-popover-inner-content">\n                <div class="ant-popover-message"><i class="anticon anticon-exclamation-circle"></i>\n                    <div class="ant-popover-message-title">' + message + '</div>\n                </div>\n                <div class="ant-popover-buttons">\n                    <button type="button" class="ant-btn ant-btn-sm" action="cancel"><span>\u53D6\u6D88</span></button><button type="button" class="ant-btn ant-btn-primary ant-btn-sm" action="confirm"><span>\u786E\u5B9A</span></button>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>';

            var $dom = $(html);
            if (!this.target) {
                var $overlay = $('<div class="iai-modal-mask" style="z-index:1000"></div>');
                document.body.appendChild($overlay[0]);
                this.$overlay = $overlay;
            }
            document.body.appendChild($dom[0]);
            this.$dom = $dom;

            this.installEvent();
            this.toTargetPosition();
            this.toCenter();
            return this;
        },
        installEvent: function installEvent() {
            var me = this;
            //openedConfirms.push(this);
            this.$dom.on('click', 'button', function() {
                var action = $(this).attr('action');
                action == 'cancel' ? me.props.onCancel && me.props.onCancel() : me.props.onOk && me.props.onOk();
                me.close();
            });
            this.$overlay && this.$overlay.on('click', function() {
                me.close();
            });
            // if (!Confirm.__doc_event__) {
            //     $(document).on('click', function() {
            //         openedConfirms.forEach(x=>x.close());
            //         openedConfirms = null;
            //     });
            //     Confirm.__doc_event__ = true;
            // }
        },
        toTargetPosition: function toTargetPosition() {
            if (!this.target) {
                return;
            }
            var $target = $(this.target);
            var targetOffset = $target.offset();
            var top = targetOffset.top - this.$dom.outerHeight() - 8;
            var left = targetOffset.left - this.$dom.width() / 2 + $target.width();
            this.$dom.css({ top: top + 'px', left: left + 'px' });
            this.$dom.addClass('ant-popover-placement-top');
        },
        toCenter: function toCenter() {
            if (this.target) {
                return;
            }
            var $dom = this.$dom;
            var $window = $(window);
            var $document = $(document);
            var dl = $document.scrollLeft();
            var dt = $document.scrollTop();
            var ww = $window.width();
            var wh = $window.height();
            var ow = $dom.width();
            var oh = $dom.height();
            var left = (ww - ow) / 2 + dl;
            var top = (wh - oh) * 382 / 1000 + dt; // 榛勯噾姣斾緥
            var style = $dom[0].style;

            style.left = Math.max(parseInt(left), dl) + 'px';
            style.top = Math.max(parseInt(top), dt) + 'px';
        },
        close: function close() {
            this.$dom.remove();
            this.$dom[0] = null;
            this.$dom = null;
            this.$overlay && this.$overlay.remove();
            this.$overlay = null;
            this.onClose && this.onClose();
        }
    };

    var confirm = {
        open: function open(message, onOk, onCancel) {
            if (arguments.length == 1 && _typeof(arguments[0]) === 'object') {
                return new Confirm(arguments[0]).render();
            }
            return new Confirm({ message: message, onOk: onOk, onCancel: onCancel }).render();
        }
    };

    /*global $*/

    var itemSelectedClassName = 'ant-select-dropdown-menu-item-selected';

    function matchKeyword(str, keyword) {
        return str.indexOf(keyword);
    }

    function AutoComplete(props) {
        this.props = props;
        this.target = props.target;
        this.container = props.container;
    }

    AutoComplete.prototype.render = function() {
        this.installEvent();
    };

    AutoComplete.prototype.installEvent = function(evt) {
        var _this = this;

        var me = this;
        var $input = $(this.target);
        $input.on('keydown', function(evt) {
            var key = evt.keyCode;
            if (!_this.showList) return;
            switch (key) {
                case 40:
                    //down
                    _this.selectedIndex++;
                    break;
                case 38:
                    //up
                    _this.selectedIndex--;
                    evt.stopPropagation();
                    evt.preventDefault();
                    break;
                case 13:
                    //enter
                    _this.doSelect();
                    break;
                case 27:
                    //esc
                    _this.hide();
                    break;
            }

            console.log(_this.selectedIndex);
            if (_this.selectedIndex < 0 || _this.selectedIndex >= _this.data.length) {
                _this.selectedIndex = _this.selectedIndex < 0 ? 0 : _this.data.length - 1;
                return;
            }
            console.log(_this.selectedIndex);
            $(_this.container).find('.' + itemSelectedClassName).removeClass(itemSelectedClassName);
            $(_this.container).find('li:eq(' + _this.selectedIndex + ')').addClass(itemSelectedClassName);
        });

        $input.on('keyup', function(evt) {
            var val = string.trim($input.val());
            if (!val) {
                return;
            }
            if (val != _this.prevKeyword) {
                _this.show(val);
            }
            _this.prevKeyword = val;
        });

        $(this.container).on('click', 'li', function() {
            me.selectedIndex = $(this).attr('data-index');
            me.doSelect();
        });

        $input.on('blur', function() {
            window.setTimeout(function() {
                me.hide();
                $input.val('');
            }, 120);
        });
    };

    AutoComplete.prototype.getDataSource = function(keyword) {
        if (this.props.dataSource) {
            this.isLocalData = true;
            var data = this.props.dataSource || [];
            var result = [];
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var text = typeof item === 'string' ? item : item[this.props.textField];
                var index = matchKeyword(text, keyword);
                if (index >= 0) {
                    result.push({ weight: index, text: text.replace(new RegExp(keyword, 'g'), '<hi style="color: #189bf6">' + keyword + '</hi>'), data: item });
                }
            }
            result.sort(function(x, y) {
                return x.weight > y.weight;
            });
            return result;
        }
        return this.props.getDataSource(keyword);
    };

    AutoComplete.prototype.doSelect = function(index) {
        var item = this.data[index === undefined ? this.selectedIndex : index];
        var original = this.isLocalData ? item.data : item;
        this.props.onSelected && this.props.onSelected(original);
        $(this.target).val('');
        this.hide();
    };

    AutoComplete.prototype.show = function(keyword) {
        var _this2 = this;

        this.timerId && window.clearTimeout(this.timerId);
        this.timerId = window.setTimeout(function() {
            var data = _this2.getDataSource(keyword) || [];
            _this2.data = data;
            if (data.length == 0) {
                return;
            }

            _this2.showList = true;
            _this2.selectedIndex = 0;
            var html = [];
            html.push('<ul class="ant-select-dropdown-menu ant-select-dropdown-menu-vertical  ant-select-dropdown-menu-root" >');
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var text = typeof item === 'string' ? item : _this2.isLocalData ? item.text : item[_this2.props.textField];
                var defaultSelectClass = i === 0 ? 'ant-select-dropdown-menu-item-selected' : '';
                html.push('<li data-index=' + i + ' class="' + defaultSelectClass + ' ant-select-dropdown-menu-item" style="user-select: none;">' + text + '</li>');
            }
            html.push('</ul>');
            $(_this2.container).html(html.join('')).show();
        }, 250);
    };

    AutoComplete.prototype.hide = function() {
        this.showList = false;
        this.prevKeyword = null;
        $(this.container).hide();
    };

    ! function onLoaded() {
        document.addEventListener('click', function(evt) {
            try {
                var func = function func(button) {
                    button.className += ' ant-btn-clicked';
                    window.setTimeout(function() {
                        button.className = button.className.replace(' ant-btn-clicked', '');
                        button = null;
                    }, 500);
                };
                var btn = evt.target;
                if (btn.tagName == 'BUTTON' && btn.className.indexOf('ant-btn') >= 0) {
                    func(btn);
                } else if (btn.parentNode.tagName == 'BUTTON' && btn.parentNode.className.indexOf('ant-btn') >= 0) {
                    func(btn.parentNode);
                }
            } catch (e) {

            }
        });
    }();

    var main = {
        SideMenu: IaiMenu,
        utils: utils,
        Dialog: Dialog,
        Notification: Notification,
        notification: notification,
        Message: Message,
        message: message,
        confirm: confirm.open,
        AutoComplete: AutoComplete
    };

    return main;

}());
//# sourceMappingURL=iaicn-bundle.js.map