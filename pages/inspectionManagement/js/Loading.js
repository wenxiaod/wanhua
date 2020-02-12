// <reference path="jquery-1.11.3.js" />
function loading() {
    var len = $('.loading').length;
    if (len == 0) {
        $('body').append('<div class="loading-overlay"></div><div class="loading">处理中,请稍候...</div>')
    }
    var loading_status = $('.loading-overlay').is(':hidden');
    if (loading_status) {
        $('.loading-overlay').show();
        $('.loading').show();
    } else {
        $('.loading-overlay').hide();
        $('.loading').hide();
    }
}