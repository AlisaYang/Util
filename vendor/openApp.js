/* eslint-disable */
/**
 * 打开本地APP 或者  跳转商店
 */
!(function () {
    // 判断浏览器
    const Navigator = navigator.userAgent;
    const ifChrome = !!(
        Navigator.match(/Chrome/i) != null && Navigator.match(/Version\/\d+\.\d+(\.\d+)?\sChrome\//i) == null
    );
    const ifAndroid = !!Navigator.match(/(Android);?[\s\/]+([\d.]+)?/);
    const ifiPad = !!Navigator.match(/(iPad).*OS\s([\d_]+)/);
    const ifiPhone = !!(!ifiPad && Navigator.match(/(iPhone\sOS)\s([\d_]+)/));
    const ifIos = !!Navigator.match(/iPhone|iPad|iPd/i);
    const ifSafari = ifIos && Navigator.match(/Safari/);
    // ios 设备的版本号
    let iosVersion = Navigator.match(/OS\s*(\d+)/);
    iosVersion = iosVersion ? iosVersion[1] || 0 : 0;
    // 安卓版本号
    let androidVersion = Navigator.match(/Android\s*(\d+)/);
    androidVersion = androidVersion ? androidVersion[1] || 0 : 0;

    // 是否从微信打开
    const ifWeixin = Navigator.indexOf('MicroMessenger') >= 0; // weixin
    const iframe = 'plugIn_downloadAppPlugIn_loadIframe';
    let isIfr = false;

    // 绑定事件
    function bind(dom, event, fun) {
        const tag = document.getElementsByTagName(dom)[0];
        // bind event
        if (dom.addEventListener) {
            dom.addEventListener(event, fun, 1);
        } else if (dom.attachEvent) {
            dom.attachEvent(event, fun);
        } else if (tag) {
            tag.addEventListener(event, fun, 1);
        } else {
            throw new Error('不存在的方法');
        }
    }

    // 打开APP
    function openApp(option, isAutoLaunchApp) {
        let openLink = null;
        let downloadUrl = null;
        if (ifIos) {
            openLink = option.iosLink || null;
            // 开启应用宝跳转
            downloadUrl = option.iosYyb || false ? option.yybDownloadUrl || null : option.iosDownloadUrl || null;
        } else if (ifAndroid) {
            openLink = option.androidLink || null;
            // 开启应用宝跳转
            downloadUrl = option.androidYyb || false ? option.yybDownloadUrl || null : option.androidDownloadUrl || null;
        }
        const params = option.params || [];
        openLink = formatUrl(openLink, params); // 格式化url 加参数
        // android5 及以上的高版本
        if (ifAndroid && androidVersion >= 5) {
            // 延后50毫秒
            setTimeout(() => {
                // 如果为自动跳转直接用应用宝链接
                if (isAutoLaunchApp) openLink = option.yybDownloadUrl || null;
                location.href = openLink;
            }, 50);
        }
        // 设备是ios9 及以上的版本
        if (ifIos && iosVersion >= 9) {
            // 如果是自动跳转或者未开启Universal Link 用之前的链接 否则用 Universal Link
            const iosUniversalLinkDisabled = !(option.iosUniversalLinkEnabled || false);
            openLink = (isAutoLaunchApp || iosUniversalLinkDisabled) ? openLink : option.ios9Link;
            document.location.href = openLink;
            // 不是 Safari 浏览器才跳转下载链接
            if (!ifSafari) {
                setTimeout(() => {
                    document.location.href = downloadUrl;
                }, 100);
            }
            if (ifIos) {
                document.location.href = openLink;
            } else {
                setTimeout(() => {
                    document.location.reload();
                }, 1000);
            }
            // 如果是自动跳转 则直接返回
            if (isAutoLaunchApp) return;
        } else {
            document.querySelector(`#${iframe}`).src = openLink; // 将iframe增加src
        }
        // 使用计算时差的方案打开APP
        const checkOpen = function (cb) {
            const _clickTime = +new Date();
            function check(elsTime) {
                if (elsTime > 3000 || document.hidden || document.webkitHidden) {
                    cb(1);
                } else {
                    cb(0);
                }
            }
            // 启动间隔20ms运行的定时器，并检测累计消耗时间是否超过3000ms，超过则结束
            let _count = 0;
            let intHandle;
            intHandle = setInterval(() => {
                _count++;
                const elsTime = +new Date() - _clickTime;
                if (_count >= 100 || elsTime > 3000) {
                    clearInterval(intHandle);
                    check(elsTime);
                }
            }, 20);
        };
        checkOpen(opened => {
            // APP没有打开成功  并且开启自动跳转到下载页
            if (opened === 0 && option.autoRedirectToDownloadUrl) {
                location.href = downloadUrl;
            }
        });
    }

    // 格式化url
    function formatUrl(url, params) {
        let arr = [];
        for (const p in params) {
            if (p && params[p]) {
                arr.push(`${p}=${encodeURIComponent(params[p])}`);
            }
        }
        arr = arr.join('&');
        const u = url.split('?');
        let newUrl = null;
        if (u.length == 2) {
            newUrl = `${u[0]}?${u[1]}&${arr}`;
        } else {
            newUrl = `${u[0]}?${arr}`;
        }
        return newUrl;
    }

    function isWeixin() {
        const ua = navigator.userAgent.toLowerCase();
        return ua.match(/MicroMessenger/i) == 'micromessenger';
    }

    function hiddenTip(weixinTip) {
        bind('body', 'click', () => {
            if (weixinTip.style.display === 'block') weixinTip.style.display = 'none';
        });
    }

    // 初始化
    function init(option) {
        const weixinTip = document.getElementsByClassName('weixin-tip')[0];
        hiddenTip(weixinTip);
        if (option.button) {
            option.button.setAttribute('href', 'javascript:void(0)');
            bind(option.button, 'click', () => {
                if (isWeixin() && !ifIos) {
                    weixinTip.style.display = 'block';
                    return false;
                }
                if (!isIfr) {
                    const ifr = document.createElement('iframe');
                    ifr.id = iframe;
                    document.body.appendChild(ifr);
                    document.getElementById(iframe).style.display = 'none';
                    document.getElementById(iframe).style.width = '0px';
                    document.getElementById(iframe).style.height = '0px';
                    isIfr = true;
                }
                // 打开APP
                openApp(option, false);
            });
        }
        // 如果开启自动打开
        if (option.autoLaunchApp) {
            // 打开APP
            openApp(option, true);
        }
    }

    window.Link = function (option) {
        init(option);
    };
}());


// const openApp = (btn, id) => {
//     new window.Link({
//         button: btn, // 按钮
//         androidLink: `hxn://hxn/app?uri=com.hxn.app.atction.home.detail&id=${id}`, // 安卓的打开链接
//         // androidDownloadUrl: '', // 安卓的下载链接
//         androidYyb: false, // android 是否开启应用宝下载
//         iosLink: `hxn://hxn/app?uri=com.hxn.app.atction.home.detail&id=${id}`, // ios 打开链接
//         ios9Link: 'https://help.hxn.cn/', // ios 的Universal Link
//         // iosDownloadUrl: '', // ios 的下载链接
//         iosUniversalLinkEnabled: true, // 是否开启 Universal Link
//         iosYyb: false, // ios 是否开启应用宝下载
//         // yybDownloadUrl: "",// 应用宝下载链接
//         autoLaunchApp: false, // 是否打开页面就唤起APP
//         autoRedirectToDownloadUrl: false, // 是否自动跳转到下载页面
//     });
// };