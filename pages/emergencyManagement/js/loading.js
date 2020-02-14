//获取浏览器页面可见高度和宽度
var _PageHeight = document.documentElement.clientHeight,
    _PageWidth = document.documentElement.clientWidth;
//计算loading框距离顶部和左部的距离（loading框的宽度为215px，高度为61px）
var _LoadingTop = _PageHeight > 61 ? (_PageHeight - 61) / 2 : 0,
    _LoadingLeft = _PageWidth > 215 ? (_PageWidth - 215) / 2 : 0;
//在页面未加载完毕之前显示的loading Html自定义内容
var _LoadingHtml = '<div id="loading" style="position:absolute;left:0;width:100%;height:' + _PageHeight + 'px;top:0;background:#fff;z-index:10000;"><div style="position: absolute; cursor: wait; left: ' + _LoadingLeft + 'px; top:' + _LoadingTop + 'px; width: auto; height: 60px; line-height: 60px; padding-left: 50px; padding-right: 10px; background:url(../images/loading.gif) no-repeat scroll 11px 13px; border: 1px solid #E5E5E5;">页面加载中，请等待...</div></div>';
//呈现loading效果
function Load() {
    document.write(_LoadingHtml);
}
Load();
//移除loading效果
function LoadRemove() {
    var loadingMask = document.getElementById('loading');
    loadingMask.parentNode.removeChild(loadingMask);
}
//监听加载状态改变
document.onreadystatechange = completeLoading;

//加载状态为complete时移除loading效果
function completeLoading() {
    if (document.readyState == "complete") {
        LoadRemove();
        //var time = setTimeout(function () {
        //    var loadingMask = document.getElementById('loading');
        //    loadingMask.parentNode.removeChild(loadingMask);
        //}, 500);

    }
}