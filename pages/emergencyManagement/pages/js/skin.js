$(function() {
    var skinPath = $.cookie("skinPath");
    if (skinPath != undefined) {
        try {
            window.parent.ChangeCSS(skinPath);
        } catch (e) {
            window.parent.parent.ChangeCSS(skinPath);
        }
    }
})

//鎹㈣偆
function ChangeCSS(color) {
    for (var index = 0; index < window.frames.length; index++) {
        var fram = window.frames[index];
        $(fram.document).contents().find("#cssfile").attr('href', "/Content/themes/" + color + "/style.css");
        $(fram.document).contents().find("iframe").contents().find("#cssfile").attr('href', "/Content/themes/" + color + "/style.css");
    }
    $("#cssfile").attr('href', "/Content/themes/" + color + "/style.css");
    $.cookie("skinPath", '', { expires: -1 });
    $.cookie("skinPath", color, { expires: 365, path: "/" });
}