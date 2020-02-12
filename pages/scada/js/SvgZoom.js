$.svg = {
    //svg不自适应宽高(不改变svg的宽高)
    //containerId：包含svg容器的Id名称（用户自定元素），topContainerId包含svg得上一层div的id名称
    ViewBoxNoAdapt: function(containerId) {
        var vwidth, vheight;
        var swidth = $("#" + containerId + "").find("svg:eq(0)").attr("width");
        var sheight = $("#" + containerId + "").find("svg:eq(0)").attr("height");
        var dwidth = $("#" + containerId + "").width();
        var dheight = $("#" + containerId + "").height();
        var wratio = swidth / dwidth;
        var hratio = sheight / dheight;
        if (hratio > 1 && wratio > 1) {
            if (wratio > hratio) {
                vwidth = swidth * wratio;
                vheight = sheight * wratio;
            } else {
                vheight = sheight * hratio;
                vwidth = swidth * hratio;
            }
        } else if (wratio > 1) {
            vwidth = swidth * wratio;
            vheight = sheight
        } else {
            vwidth = swidth;
            vheight = sheight * hratio;
        }
        $("#" + containerId + "").find("svg:eq(0)").get(0).setAttribute("viewBox", " 0 0 " + vwidth + " " + vheight + "");
    },
    //svg自适应宽高（宽高和container宽高一直）
    //containerId：包含svg容器的Id名称（用户自定元素），topContainerId包含svg得上一层div的id名称
    ViewBoxAdapt: function(containerId) {
        var vwidth, vheight;
        var swidth = $("#" + containerId + "").find("svg:eq(0)").attr("width");
        var sheight = $("#" + containerId + "").find("svg:eq(0)").attr("height");
        var dwidth = $("#" + containerId + "").width();
        var dheight = $("#" + containerId + "").height();
        var wratio = swidth / dwidth;
        var hratio = sheight / dheight;
        if (hratio > 1 && wratio > 1) {
            if (wratio > hratio) {
                vwidth = dwidth * wratio;
                vheight = dheight * wratio;
            } else {
                vheight = dheight * hratio;
                vwidth = dwidth * hratio;
            }
        } else if (wratio > 1) {
            vwidth = dwidth * wratio;
            vheight = dheight
        } else {
            vwidth = dwidth;
            vheight = dheight * hratio;
        }
        $("#" + containerId + "").find("svg:eq(0)").get(0).setAttribute("viewBox", " 0 0 " + vwidth + " " + vheight + "");
        $("#" + containerId + "").find("svg:eq(0)").get(0).setAttribute("width", dwidth);
        $("#" + containerId + "").find("svg:eq(0)").get(0).setAttribute("height", dheight);
        $("#" + containerId + "").find("svg:eq(0)").parent("div:eq(0)").css("width", "98%")
        $("#" + containerId + "").find("svg:eq(0)").parent("div:eq(0)").css("height", "97%")
    },
    //更改颜色得容器
    //topContainerId包含svg得上一层div的id名称,color颜色
    BackGroundColor: function(topContainerId, color) {
        $("#" + topContainerId + "").css("background-color", color);
    }
}