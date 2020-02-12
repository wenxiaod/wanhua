//鍥涘窛涔濋棬绉戞妧WebSocket閫氳缁勪欢
function JoomonWebSocket(ipStr, portInt) {
    //鍒涘缓閫氳瀵硅薄
    this.ws = new WebSocket("ws://" + ipStr + ":" + portInt + "/");
    this.ws.binaryType = "arraybuffer";
    //鍙戦€佹槑鏂�
    this.Send = function(sendStr) {
        this.ws.send(sendStr);
    };
    //鐧婚檰A璇锋眰
    this.LoginA = function(clientType) {
        var sends = new Int8Array(4);
        sends[0] = 0x00; //鏁版嵁闀垮害楂樹綅
        sends[1] = 0x02; //鏁版嵁闀垮害浣庝綅
        sends[2] = 0x31; //鍛戒护鐮�
        sends[3] = clientType; //瀹㈡埛绔被鍨�
        this.ws.send(sends);
    };
    //鐧婚檰B璇锋眰
    this.LoginB = function(jsonStr) {
        //闇€瑕佺敤鍒皃ush()鏂规硶,閫夋嫨Array鏁扮粍
        var sendsTmp = new Array(3);
        sendsTmp[2] = 0x32; //鍛戒护鐮�
        //鏁版嵁鍖�
        var tmp1 = ""; //瀛樺偍鏍峰紡: E7AB99E782B9
        for (var i = 0; i < jsonStr.length; i++) {
            var tmp2 = EncodeUTF8(jsonStr[i]);
            tmp1 = tmp1 + tmp2;
        }
        var tmp3 = SuccessionHexStrToBytes(tmp1); //瀛樺偍鏍峰紡: 鏁扮粍
        for (var i = 0; i < tmp3.length; i++) {
            sendsTmp.push(tmp3[i]);
        }
        var dataLengthDec = sendsTmp.length - 2; //鏁版嵁闀垮害,鍖呮嫭鍛戒护鐮�
        var dataLengthHex = PadLeft(dataLengthDec.toString(16), 4); //鏁版嵁闀垮害
        sendsTmp[0] = parseInt(dataLengthHex.substring(0, 2), 16); //鏁版嵁闀垮害楂樹綅
        sendsTmp[1] = parseInt(dataLengthHex.substring(2, 4), 16); //鏁版嵁闀垮害浣庝綅
        //瀵煎叆涓嬮潰鐨勯€氳涓撶敤鏁扮粍,閫夋嫨Int8Array,
        //娉ㄦ剰:濡傛灉鐩存帴浣跨敤Array鏁扮粍鍒欏睘浜庢槑鐮佸彂閫佹暟鎹�
        //浣跨敤WebSocket閫氳涓撶敤鏁扮粍閲囩敤浜岃繘鍒舵柟寮忓彂閫�
        var sends = new Int8Array(sendsTmp.length);
        for (var i = 0; i < sendsTmp.length; i++) {
            sends[i] = sendsTmp[i];
        }
        this.ws.send(sends);
    };
    //蹇冭烦
    this.HeartBeat = function() {
        var sends = new Int8Array(3);
        sends[0] = 0x00; //鏁版嵁闀垮害楂樹綅
        sends[1] = 0x01; //鏁版嵁闀垮害浣庝綅
        sends[2] = 0x35; //鍛戒护鐮�
        this.ws.send(sends);
    };
    //娉ㄩ攢璇锋眰
    this.Logout = function(clientType) {
        var sends = new Int8Array(4);
        sends[0] = 0x00; //鏁版嵁闀垮害楂樹綅
        sends[1] = 0x02; //鏁版嵁闀垮害浣庝綅
        sends[2] = 0x33; //鍛戒护鐮�
        sends[3] = clientType; //瀹㈡埛绔被鍨�
        this.ws.send(sends);
    };
    //鎵€鏈夌珯鐐瑰垪琛ㄨ姹�
    this.AllSiteList = function() {
        var sends = new Int8Array(4);
        sends[0] = 0x00; //鏁版嵁闀垮害楂樹綅
        sends[1] = 0x02; //鏁版嵁闀垮害浣庝綅
        sends[2] = 0x3A; //鍛戒护鐮�
        sends[3] = 0xFF; //鎵€鏈�
        this.ws.send(sends);
    };
    //绔欑偣鍒楄〃璇锋眰
    this.SiteList = function(str) {
        //闇€瑕佺敤鍒皃ush()鏂规硶,閫夋嫨Array鏁扮粍
        var sendsTmp = new Array(3);
        sendsTmp[2] = 0x3A; //鍛戒护鐮�
        //鏁版嵁鍖�
        var tmp1 = ""; //瀛樺偍鏍峰紡: E7AB99E782B9
        for (var i = 0; i < str.length; i++) {
            var tmp2 = EncodeUTF8(str[i]);
            tmp1 = tmp1 + tmp2;
        }
        var tmp3 = SuccessionHexStrToBytes(tmp1); //瀛樺偍鏍峰紡: 鏁扮粍
        for (var i = 0; i < tmp3.length; i++) {
            sendsTmp.push(tmp3[i]);
        }
        var dataLengthDec = sendsTmp.length - 2; //鏁版嵁闀垮害,鍖呮嫭鍛戒护鐮�
        var dataLengthHex = PadLeft(dataLengthDec.toString(16), 4); //鏁版嵁闀垮害
        sendsTmp[0] = parseInt(dataLengthHex.substring(0, 2), 16); //鏁版嵁闀垮害楂樹綅
        sendsTmp[1] = parseInt(dataLengthHex.substring(2, 4), 16); //鏁版嵁闀垮害浣庝綅
        //瀵煎叆涓嬮潰鐨勯€氳涓撶敤鏁扮粍,閫夋嫨Int8Array,
        //娉ㄦ剰:濡傛灉鐩存帴浣跨敤Array鏁扮粍鍒欏睘浜庢槑鐮佸彂閫佹暟鎹�
        //浣跨敤WebSocket閫氳涓撶敤鏁扮粍閲囩敤浜岃繘鍒舵柟寮忓彂閫�
        var sends = new Int8Array(sendsTmp.length);
        for (var i = 0; i < sendsTmp.length; i++) {
            sends[i] = sendsTmp[i];
        }
        this.ws.send(sends);
    };
    //楠岃瘉鐮佽姹�
    this.VerificationCode = function() {
        var sends = new Int8Array(4);
        sends[0] = 0x00; //鏁版嵁闀垮害楂樹綅
        sends[1] = 0x02; //鏁版嵁闀垮害浣庝綅
        sends[2] = 0x3C; //鍛戒护鐮�
        sends[3] = 0xFF;
        this.ws.send(sends);
    };
    //妫€娴嬮獙璇佺爜璇锋眰
    this.CheckVerificationCode = function() {
        var sends = new Int8Array(3);
        sends[0] = 0x00; //鏁版嵁闀垮害楂樹綅
        sends[1] = 0x01; //鏁版嵁闀垮害浣庝綅
        sends[2] = 0x3D; //鍛戒护鐮�
        this.ws.send(sends);
    };
    //閲嶅彂楠岃瘉鐮佽姹�
    this.ResendVerificationCode = function() {
        var sends = new Int8Array(3);
        sends[0] = 0x00; //鏁版嵁闀垮害楂樹綅
        sends[1] = 0x01; //鏁版嵁闀垮害浣庝綅
        sends[2] = 0x3E; //鍛戒护鐮�
        this.ws.send(sends);
    };
}

//鐫＄湢
function sleep(n) {
    var start = new Date().getTime();
    while (true)
        if (new Date().getTime() - start > n) break;
};

//鏁版嵁妯″瀷
function DataModel() {
    this.Data; //鍘熷鏁版嵁
    this.SuccessionHexStr = ""; //杩炵画16杩涘埗, 瀛樺偍鏍峰紡: E7AB99E782B9
    this.ReceiveBytes; //鏁扮粍
    this.BytesRecord = "";
    this.Type = ""; //鏍规嵁椤圭洰闇€瑕佸埗瀹氳绾�, 濡傚埗瀹氬彲閫夌被鍨嬩负 stirng,jsonObject,jsonStr
    this.Info = "";
    this.JsonObject;
    this.JsonStr = ""; //this.JsonStr = '[{"",""}]';
}

//瑙ｆ瀽鏁版嵁
function Analysis(data) {
    //閫氳繃缂栫爜鍙嶅悜鑾峰彇浜岃繘鍒舵暟鎹�
    var sendsTmp = new Array();
    var tmp1 = ""; //瀛樺偍鏍峰紡: E7AB99E782B9
    for (var i = 0; i < data.length; i++) {
        var tmp2 = EncodeUTF8(data[i]);
        tmp1 = tmp1 + tmp2;
    }
    var receiveBytes = SuccessionHexStrToBytes(tmp1); //瀛樺偍鏍峰紡: 鏁扮粍		

    //	[鍘熷] data
    //	[杩炵画16杩涘埗] tmp1
    //  [鏁扮粍] receiveBytes

    var entity = new DataModel();
    entity.Data = data; //鍘熷鏁版嵁
    entity.SuccessionHexStr = data; //杩炵画16杩涘埗, 瀛樺偍鏍峰紡: E7AB99E782B9
    entity.ReceiveBytes = receiveBytes; //鏁扮粍
    entity.Type = "string";
    entity.BytesRecord = BytesToHexStr(receiveBytes);
    entity.Info = " 鐩戞祴鍊�: " + data.slice(0);

    //鏍规嵁鍛戒护鐮佽В鏋愭暟鎹�
    if (receiveBytes[2] == 0x31) //鐧婚檰A搴旂瓟
        entity.Info = "瀹㈡埛绔В鏋�,Guid: " + data.slice(4);
    if (receiveBytes[2] == 0x32) //鐧婚檰B搴旂瓟
        entity.Info = "瀹㈡埛绔В鏋�,Guid: " + data.slice(3);
    if (receiveBytes[2] == 0x35) //蹇冭烦搴旂瓟
        entity.Info = "瀹㈡埛绔В鏋�:蹇冭烦搴旂瓟";
    if (receiveBytes[2] == 0x33) //娉ㄩ攢搴旂瓟
        entity.Info = "瀹㈡埛绔В鏋�:娉ㄩ攢搴旂瓟";
    if (receiveBytes[2] == 0x3A) //绔欑偣鍒楄〃搴旂瓟
        entity.Info = "瀹㈡埛绔В鏋�,绔欑偣鍒楄〃: " + data.slice(3);
    if (receiveBytes[2] == 0x3C) //楠岃瘉鐮佸簲绛�
        entity.Info = "瀹㈡埛绔В鏋�,楠岃瘉鐮佸簲绛�: " + data.slice(3);
    if (receiveBytes[2] == 0x3D) //妫€娴嬮獙璇佺爜搴旂瓟
        entity.Info = "瀹㈡埛绔В鏋�,妫€娴嬮獙璇佺爜搴旂瓟: " + data.slice(3);
    if (receiveBytes[2] == 0x3E) //閲嶅彂楠岃瘉鐮佸簲绛�
        entity.Info = "瀹㈡埛绔В鏋�,閲嶅彂楠岃瘉鐮佸簲绛�: " + data.slice(3);
    return entity;
}

//鍗佸叚杩涘埗瀛楃涓茶浆瀛楄妭鏁扮粍
function SuccessionHexStrToBytes(str) {
    var pos = 0;
    var len = str.length;
    if (len % 2 != 0) {
        return null;
    }
    len /= 2;
    var hexA = new Array();
    for (var i = 0; i < len; i++) {
        var s = str.substr(pos, 2);
        var v = parseInt(s, 16);
        hexA.push(v);
        pos += 2;
    }
    return hexA;
}

//鍗佸叚杩涘埗甯︾┖鏍煎瓧绗︿覆杞瓧鑺傛暟缁�
function HexStrToBytes(str) {
    var reg = new RegExp(" ", "g");
    var strNew = str.replace(reg, ""); //鍘绘帀鎵€鏈夌┖鏍�
    return SuccessionHexStrToBytes(strNew);
}

//瀛楄妭鏁扮粍杞崄鍏繘鍒跺瓧绗︿覆
function BytesToSuccessionHexStr(arr) {
    var str = "";
    for (var i = 0; i < arr.length; i++) {
        var tmp = arr[i].toString(16);
        if (tmp.length == 1) {
            tmp = "0" + tmp;
        }
        str += tmp;
    }
    return str;
}

//瀛楄妭鏁扮粍杞甫绌烘牸鍗佸叚杩涘埗瀛楃涓�
function BytesToHexStr(arr) {
    var str = "";
    for (var i = 0; i < arr.length; i++) {
        var tmp = arr[i].toString(16);
        if (tmp.length == 1) {
            tmp = "0" + tmp;
        }
        if (str == "")
            str += tmp;
        else
            str += " " + tmp;
    }
    return str;
}

//琛�0, num鏄暟鍊�,n鏄綅鏁�,涓嶈冻浣嶆暟琛�0, 绀轰緥:Pad(3e,4)缁撴灉鏄�003e
/* 璐ㄦ湸闀垮瓨娉�  by lifesinger */
function PadLeft(num, n) {
    var len = num.toString().length;
    while (len < n) {
        num = "0" + num;
        len++;
    }
    return num;
}

//缂栫爜鎴怳TF-8鏍煎紡
function EncodeUTF8(str) {
    var result = escape(str);
    if (result.substring(0, 1) != '%') { //鏄瓧姣�
        result = result.charCodeAt(0).toString(16);
    } else if (result.substring(1, 2) == 'u') { //鏄舰浣撳瓧
        result = BinToHex(HexToBin(result.substring(2, 6))); // 浜岃繘鍒惰浆鍗佸叚杩涘埗( 鍗佸叚杩涘埗杞簩杩涘埗() )
    } //鏄鍙蜂笉鐢ㄦ洿澶氬鐞�
    var reg = new RegExp("%", "g");
    result = result.replace(reg, "");
    return result;
}

//鍗佸叚杩涘埗杞簩杩涘埗
function HexToBin(s) {
    var c = "";
    var n;
    var ss = "0123456789ABCDEF";
    var digS = "";
    for (var i = 0; i < s.length; i++) {
        c = s.charAt(i);
        n = ss.indexOf(c);
        digS += DecToBin(eval(n)); //鍗佽繘鍒惰浆浜岃繘鍒�

    }
    //return value;
    return digS;
}

//鍗佽繘鍒惰浆浜岃繘鍒�
function DecToBin(n1) {
    var s = "";
    var n2 = 0;
    for (var i = 0; i < 4; i++) {
        n2 = Math.pow(2, 3 - i);
        if (n1 >= n2) {
            s += '1';
            n1 = n1 - n2;
        } else
            s += '0';

    }
    return s;
}

//浜岃繘鍒惰浆鍗佽繘鍒�
function BinToDec(s) {
    var retV = 0;
    if (s.length == 4) {
        for (var i = 0; i < 4; i++) {
            retV += eval(s.charAt(i)) * Math.pow(2, 3 - i);
        }
        return retV;
    }
    return -1;
}

//浜岃繘鍒惰浆鍗佸叚杩涘埗
function BinToHex(s) {
    var retS = "";
    var tempS = "";
    var ss = "";
    if (s.length == 16) {
        tempS = "1110" + s.substring(0, 4);
        tempS += "10" + s.substring(4, 10);
        tempS += "10" + s.substring(10, 16);
        var sss = "0123456789ABCDEF";
        for (var i = 0; i < 3; i++) {
            retS += "%";
            ss = tempS.substring(i * 8, (eval(i) + 1) * 8);

            retS += sss.charAt(BinToDec(ss.substring(0, 4))); //浜岃繘鍒惰浆鍗佽繘鍒�
            retS += sss.charAt(BinToDec(ss.substring(4, 8))); //浜岃繘鍒惰浆鍗佽繘鍒�
        }
        return retS;
    }
    return "";
}