//Date
Date.prototype.Format = function(fmt) {
    var o = {
        "y+": this.getFullYear(),
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
Date.prototype.addSeconds = function(d) {
    this.setSeconds(this.getSeconds() + d);
    return this;
};
Date.prototype.addMinutes = function(d) {
    this.setMinutes(this.getMinutes() + d);
    return this;
};
Date.prototype.addHours = function(d) {
    this.setHours(this.getHours() + d);
    return this;
};
Date.prototype.addDays = function(d) {
    this.setDate(this.getDate() + d);
    return this;
};
Date.prototype.addWeeks = function(w) {
    this.addDays(w * 7);
    return this;
};
Date.prototype.addMonths = function(m) {
    var d = this.getDate();
    this.setMonth(this.getMonth() + m);
    if (this.getDate() < d)
        this.setDate(0);
    return this;
};
Date.prototype.addYears = function(y) {
    var m = this.getMonth();
    this.setFullYear(this.getFullYear() + y);
    if (m < this.getMonth()) {
        this.setDate(0);
    }
    return this;
};
Date.prototype.dateDiff = function(interval, objDate) {
    var dtEnd = new Date(objDate);
    if (isNaN(dtEnd)) return undefined;
    switch (interval) {
        case "fs":
            return parseInt((dtEnd - this));
        case "s":
            return parseInt((dtEnd - this) / 1000);
        case "n":
            return parseInt((dtEnd - this) / 60000);
        case "h":
            return parseInt((dtEnd - this) / 3600000);
        case "d":
            return parseInt((dtEnd - this) / 86400000);
        case "w":
            return parseInt((dtEnd - this) / (86400000 * 7));
        case "m":
            return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - this.getFullYear()) * 12) - (this.getMonth() + 1);
        case "y":
            return dtEnd.getFullYear() - this.getFullYear();
    }
}
Date.prototype.dateDiffToDate = function(endDate) {
    var dtEnd = new Date(endDate);
    if (isNaN(dtEnd)) return undefined;
    var seconds = this.dateDiff("s", endDate);
    var date = new Date(1970, 1, 1);
    date.addSeconds(seconds);
    return date;
}

Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

//String
String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")), replaceWith);
    } else {
        return this.replace(reallyDo, replaceWith);
    }
}
String.prototype.toDate = function() {
    var jsondate = this.replace("/Date(", "").replace(")/", "");

    if (jsondate.indexOf("+") > 0) {
        jsondate = jsondate.substring(0, jsondate.indexOf("+"));
    } else if (jsondate.indexOf("-") > 0) {
        jsondate = jsondate.substring(0, jsondate.indexOf("-"));
    }
    var date = new Date(parseInt(jsondate, 10));
    return date;
}
String.prototype.hasValue = function() {
    if (this != undefined && this != "" && this != null) {
        return true;
    } else {
        return false;
    }
}
String.prototype.hasGuidValue = function() {
    if (this != undefined && this != "" && this != null && this != "00000000-0000-0000-0000-000000000000") {
        return true;
    } else {
        return false;
    }
}
String.prototype.toFixed = function(len, isSplit) {
        var v = this;
        if (v == null) return '-';
        else if (v.toString() == '' || v.toString() == '-65535.01' || v.toString() == '-') return '-';
        else if (isSplit == false) v = parseFloat(this).toFixed(len)
        else if (this.toString().indexOf('.') > 0) v = parseFloat(this).toFixed(len);
        return v;
    }
    //Array
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}
Array.prototype.inArray = function(value, key) {
    for (var i = 0; i < this.length; i++) {
        if (key != undefined) {
            if (this[i][key] == value) return true;
        } else {
            if (value == this[i]) return true;
        }
    }
    return false;
}
Array.prototype.getKeyArray = function(key) {
    var arr = [];
    for (var i = 0; i < this.length; i++) {
        if (key != undefined) {
            arr.push(this[i][key]);
        }
    }
    return arr;
}
Array.prototype.serializeObject = function(lName) {
    var o = {};
    $t = this;

    for (var i = 0; i < $t.length; i++) {
        for (var item in $t[i]) {
            o[lName + '[' + i + '].' + item.toString()] = $t[i][item].toString();
        }
    }
    return o;
};

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt /*, from*/ ) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0) ?
            Math.ceil(from) :
            Math.floor(from);
        if (from < 0)
            from += len;
        for (; from < len; from++) {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
}
//Object
/* 
 * @param {Object} target 目标对象。 
 * @param {Object} source 源对象。 
 * @param {boolean} deep 是否复制(继承)对象中的对象。 
 * @returns {Object} 返回继承了source对象属性的新对象。 
 */
Object.extend = function(target, /*optional*/ source, /*optional*/ deep) {
    target = target || {};
    var sType = typeof source,
        i = 1,
        options;
    if (sType === 'undefined' || sType === 'boolean') {
        deep = sType === 'boolean' ? source : false;
        source = target;
        target = this;
    }
    if (typeof source !== 'object' && Object.prototype.toString.call(source) !== '[object Function]')
        source = {};
    while (i <= 2) {
        options = i === 1 ? target : source;
        if (options != null) {
            for (var name in options) {
                var src = target[name],
                    copy = options[name];
                if (target === copy)
                    continue;
                if (deep && copy && typeof copy === 'object' && !copy.nodeType)
                    target[name] = this.extend(src ||
                        (copy.length != null ? [] : {}), copy, deep);
                else if (copy !== undefined)
                    target[name] = copy;
            }
        }
        i++;
    }
    return target;
};

//Number
//四舍五入，保留两位小数
Number.prototype.toDecimal = function() {
    var f = parseFloat(this);
    if (isNaN(f)) {
        return;
    }
    f = Math.round(this * 100) / 100;
    return f;
}
Number.prototype.toPercent = function() {
    return (Math.round(this * 10000) / 100).toFixed(0) + '%';
}