// 防抖函数
// 每次调用后在 wait 秒之后执行函数
function debounce (fn, wait) {
    let timer = null;

    return function () {
        if (timer) clearTimeout(timer);

        timer = setTimeout(() => {
            // fn.apply(this, arguments)
            fn.call(this)
        }, wait)
    }
}


