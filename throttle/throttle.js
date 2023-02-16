// 节流函数
// 总在 wait 秒之后才执行函数
function throttle (fn, wait) {
    let timer = null;

    return function () {
        if (!timer) {
            timer = setTimeout(() => {
                timer = null;
                fn.call(this);
            }, wait)
        }
    }
}


