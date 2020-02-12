(function(window) {
    window.commonfun = {
        GetDtuList: function(callback, errorback, data) {
            var para = "";
            if (data) {
                para = data;
                para = { jsonParameters: para };
            }
            $.ajax.post("/General/GetDtuList", para, callback, errorback);
        },
        GetSitePara: function(dtuId, callback, errorback) {
            var para = { dtuId: dtuId, isCollect: true };
            $.ajax.post("../General/GetSitePara", para, callback, errorback);
        },
        getDefaultDateTime: function(dtuid, callback, errorback) {
            var url = "../General/GetDefaultDateTime";
            var para = { Dtuid: dtuid };
            $.ajax.post(url, para, callback, errorback);
        }
    }
})(window);