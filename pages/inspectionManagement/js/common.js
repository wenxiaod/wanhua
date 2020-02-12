(function() {
    //获取避免了同源策略的顶级窗体，使用冒泡方法
    let getTop = function(current) {
            if (!current)
                current = window;

            //直接检检查parent是否受到同源策略限制
            try {
                current.parent.location.origin;
            } catch (e) {
                //parent受到同源策略限制时，返回当前window
                return current;
            }

            //此时，parent不受同源策略限制
            //如果parent是顶级window，则返回top
            if (current.parent == top)
                return top;
            else
                return getTop(current.parent); //递归查找有效的顶级window对象
        }
        //将getTop方法注册到window中
    window.getTop = getTop;
    //将sopTop变量注册到window中 ，sop （same origin policy）
    window.sopTop = getTop();
}());