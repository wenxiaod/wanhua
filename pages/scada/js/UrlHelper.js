var UrlHelper = {
    getQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
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
    },
    formSubmit: function(url, elementValue) {
        var turnForm = document.createElement("form");
        document.body.appendChild(turnForm);
        turnForm.method = 'post';
        turnForm.action = url;
        for (var x in elementValue) {
            var newElement = document.createElement("input");
            newElement.setAttribute("type", "hidden");
            newElement.name = x;
            newElement.value = elementValue[x];
            turnForm.appendChild(newElement);
        }
        turnForm.submit();
    }
}