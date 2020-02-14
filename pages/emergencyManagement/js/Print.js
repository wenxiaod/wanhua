LodopFuncs = function() {}
var LODOP;

//strTaskName;打印任务名  htmlUrl：打印页面路径及打印单据Id
LodopFuncs.Print = {
    //打印预览
    Preview: function(strTaskName, htmlUrl) {
        //检查LODOP的版本及是否安装LODOP并得到打印对象
        LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
        //打印初始化 strTaskName: 打印任务名
        LODOP.PRINT_INIT(strTaskName);
        $.ajax({
            url: htmlUrl, //这里是静态页的地址
            type: "GET", //静态页用get方法，否则服务器会抛出405错误
            success: function(data) {
                //普通文本打印
                LODOP.ADD_PRINT_HTM(32, "3%", "94%", "98%", data);
                //设置打印项风格
                LODOP.SET_PRINT_STYLEA(0, "Vorient", 3);
                //打印预览
                LODOP.PREVIEW();
            },
            error: function() {
                top.showErrMsg("打印页面获取失败，请检查路径是否正确！");
            }
        });
    },
    //打印
    Print: function(strTaskName, htmlUrl) {
        //检查LODOP的版本及是否安装LODOP并得到打印对象
        LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
        //打印初始化 strTaskName: 打印任务名
        LODOP.PRINT_INIT(strTaskName);
        $.ajax({
            url: htmlUrl, //这里是静态页的地址
            type: "GET", //静态页用get方法，否则服务器会抛出405错误
            success: function(data) {
                //普通文本打印
                LODOP.ADD_PRINT_HTM(32, "3%", "94%", "98%", data);
                //设置打印项风格
                LODOP.SET_PRINT_STYLEA(0, "Vorient", 3);
                //打印
                LODOP.PRINT();
            },
            error: function() {
                top.showErrMsg("打印页面获取失败，请检查路径是否正确！");
            }
        });
    },
    //打印维护
    Maintain: function(strTaskName, htmlUrl) {
        //检查LODOP的版本及是否安装LODOP并得到打印对象
        LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
        //打印初始化 strTaskName: 打印任务名
        LODOP.PRINT_INIT(strTaskName);
        $.ajax({
            url: htmlUrl, //这里是静态页的地址
            type: "GET", //静态页用get方法，否则服务器会抛出405错误
            success: function(data) {
                //普通文本打印
                LODOP.ADD_PRINT_HTM(32, "3%", "94%", "98%", data);
                //设置打印项风格
                LODOP.SET_PRINT_STYLEA(0, "Vorient", 3);
                //打印维护
                LODOP.PRINT_SETUP();
            },
            error: function() {
                top.showErrMsg("打印页面获取失败，请检查路径是否正确！");
            }
        });
    },
    //打印设计
    Design: function(strTaskName, htmlUrl) {
        //检查LODOP的版本及是否安装LODOP并得到打印对象
        LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
        //打印初始化 strTaskName: 打印任务名
        LODOP.PRINT_INIT(strTaskName);
        $.ajax({
            url: htmlUrl, //这里是静态页的地址
            type: "GET", //静态页用get方法，否则服务器会抛出405错误
            success: function(data) {
                //普通文本打印
                LODOP.ADD_PRINT_HTM(32, "3%", "94%", "98%", data);
                //设置打印项风格
                LODOP.SET_PRINT_STYLEA(0, "Vorient", 3);
                //打印设计
                LODOP.PRINT_DESIGN();
            },
            error: function() {
                top.showErrMsg("打印页面获取失败，请检查路径是否正确！");
            }
        });
    }
};

//strTaskName;打印任务名  htmlUrl：打印页面路径  beginNumber：开始页  pageSize：每页条数  pageNumber：打印总页数  pageCondition：分页条件
LodopFuncs.PagingPrint = {
    //分页打印预览  
    PagingPreview: function(strTaskName, htmlUrl, beginNumber, pageSize, pageNumber) {
        //检查LODOP的版本及是否安装LODOP并得到打印对象
        LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
        //打印初始化 strTaskName: 打印任务名
        LODOP.PRINT_INIT(strTaskName);

        var page = "";
        var pageCount = 0;

        //设置分页页码显示
        if (pageNumber > 10) {
            pageCount = 6;
        } else if (pageNumber > 100) {
            pageCount = 10;
        } else {
            pageCount = 2;
        }
        for (var i = 0; i < pageCount; i++) {
            page += "#";
        }

        //分页打印
        for (var i = 0; i < pageNumber; i++) {
            htmlUrl += "beginNumber=" + beginNumber + "&pageSize=" + pageSize + "&pageCondition=" + pageCondition + "";
            $.ajax({
                url: htmlUrl, //这里是静态页的地址
                type: "GET", //静态页用get方法，否则服务器会抛出405错误
                success: function(data) {
                    //普通文本打印
                    LODOP.ADD_PRINT_HTM(32, "3%", "94%", "98%", data);
                    //设置打印项风格
                    LODOP.SET_PRINT_STYLEA(0, "Vorient", 3);
                    //分页
                    LODOP.NewPageA();
                    //普通文本打印
                    LODOP.ADD_PRINT_HTM(1, 600, 300, 100, "总页号：<font color='#0000ff' format='ChineseNum'><span tdata='pageNO'>第" + page + "页</span>/<span tdata='pageCount'>共" + page + "页</span></font>");
                    //设置打印项风格
                    LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
                    //设置打印项风格
                    LODOP.SET_PRINT_STYLEA(0, "Horient", 1);
                    //纯文本打印
                    LODOP.ADD_PRINT_TEXT(3, 34, 196, 20, "总页眉：《" + strTaskName + "》");
                    //设置打印项风格
                    LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
                },
                error: function() {
                    top.showErrMsg("打印页面获取失败，请检查路径是否正确！");
                }
            });
            beginNumber++;
            if (beginNumber > pageNumber) continue;
        }
        //打印预览
        LODOP.PREVIEW();
    }
};