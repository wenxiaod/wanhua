isFirst = true
$(function() {
        LoadCompanyId()
    })
    ///加载公司数据
function LoadCompanyId(cmpId) {
    fnGetCompanyList(cmpId, function(data) {
        //if (data == null) {
        //    layer.msg("加载公司数据失败", {
        //        icon: 2,
        //        time: 1000
        //    });
        //    return false;
        //}
        $("#Company").text(data[0].CompanyName);
        if (data.length <= 1) {
            $("#selCompanyList").parent("div:eq(0)").remove();
            return;
        }
        $("#selCompanyList").show();
        $("#selCompanyList").change(fnSetCompanyId);
        $("#selCompanyList").select2({
            tags: false,
            placeholder: "点击选择公司",
            multiple: false,
            maximumSelectionLength: 50
        });
        //AssembleSelect(data);

    })

}

function fnGetCompanyList(cmpId, callback) {
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: '../../Pages/HttpRequest/ReplaceCompany.ashx',
        data: {
            opt: "GetCompanyList",
            CompanyId: cmpId
        },
        success: function(back) {
            if (typeof callback == 'function')
                callback(back);


        },
        error: function(e) {
            console.log(e);
        }
    });
}

function AssembleSelect(back) {
    if (!isNaN(back)) return;
    //selCompanyList.length = 0;
    //var SelectedCompany = 0;
    //for (var i = 0; i < back.length; i++) {
    //    selCompanyList.options.add(new Option(back[i].CompanyName, back[i].CompanyId));
    //}
    //if (back.length > 1) {
    //    selCompanyList.value = back[0].CompanyId;
    //} else {
    //    selCompanyList.value = back[0].CompanyId;
    //}
    if (isFirst && isFirst != undefined) {
        GetCompany();
    }
}

function fnSetCompanyId() {
    if (isFirst && isFirst != undefined) {
        isFirst = false;
        return;
    }
    if (selCompanyList.value != null && selCompanyList.value != "" && selCompanyList.value != undefined) {
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: '../../Pages/HttpRequest/ReplaceCompany.ashx',
            data: {
                opt: "ReplaceCompany",
                newcmpId: $("#selCompanyList").val(),
                newcmpName: $("#selCompanyList").select2('data')[0].text
            },
            success: function(back) {
                window.location.href = window.location.href;
            }
        })
    }
}

function GetCompany() {
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: '../../Pages/HttpRequest/ReplaceCompany.ashx',
        data: {
            opt: "GetCompany"
        },
        success: function(data) {
            if ($("#selCompanyList").find("option:eq(0)").val() != data["CompanyId"]) {
                $("#selCompanyList").find("option").each(function() {
                    if ($(this).val() == data["CompanyId"].toString()) {
                        $("#selCompanyList").select2("val", data["CompanyId"].toString());
                        $("#select2-selCompanyList-container").text(data["CompanyName"]);
                        $("#select2-selCompanyList-container").attr("title", data["CompanyName"]);
                        $(this).attr("selected", true);

                    }

                })
            } else
                isFirst = false;
        }
    })
}