Tool = function() {};
Tool.Data = {
    //获取类型
    GetType: function(Type) {
        $.ajax({
            type: 'POST',
            url: '/Tool/GetDictionary',
            data: { Type: Type },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data.Code == "1") {
                    var List = data.List;
                    for (var i = 0; i < List.length; i++) {
                        $("<option></option>").val(List[i].Id).text(List[i].Title).appendTo("#Type");
                    }
                    $("#Type").selectpicker('refresh');
                    $("#Type").selectpicker('render');
                }
            }
        })
    },
    //获取级别
    GetLevel: function(Type) {
        $.ajax({
            type: 'POST',
            url: '/Tool/GetDictionary',
            data: { Type: Type },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data.Code == "1") {
                    var List = data.List;
                    for (var i = 0; i < List.length; i++) {
                        $("<option></option>").val(List[i].Id).text(List[i].Title).appendTo("#Level");
                    }
                    $("#Level").selectpicker('refresh');
                    $("#Level").selectpicker('render');
                }
            }
        })
    },
    Parent: function(Id) {
        $.ajax({
            type: 'POST',
            url: '/Tool/GetParent',
            data: { Id: Id },
            async: false,
            dataType: "json",
            success: function(data) {
                if (data.Code == "1") {
                    var List = data.List;
                    for (var i = 0; i < List.length; i++) {
                        if (List[i].Id != parseInt(Id)) {
                            $("<option></option>").val(List[i].Id).text(List[i].Title).appendTo("#ParentId");
                        }
                    }
                    $("#ParentId").selectpicker('refresh');
                    $("#ParentId").selectpicker('render');
                }
            }
        });
    }
}