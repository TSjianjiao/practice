class FullPage {
    constructor() {
        const html = document.documentElement;
        // 所有单页
        const pageList = [...document.querySelectorAll('section')];
        // 所有单页位置
        const pagesTop = [];
        // 每页高度
        const pagesHeight = [];

        pageList.forEach(item=>{
            pagesTop.push(item.offsetTop);
            pagesHeight.push(item.offsetHeight);
        })

        // 总页面数
        const pages = pageList.length;
        // 当前页面
        let currentPage = 0;
        // 上次页面
        let lastPage = 0;
        // 滚轮计数
        let upCount = 0;
        let downCount = 0;
        // 隐藏滚动条
        document.documentElement.style.overflow = 'hidden'
        // 简单测试浏览器是否支持事件，因为火狐不支持mousewheel
        if('onmousewheel' in document) {
            window.addEventListener('mousewheel', e=>{
                wheelThrottled(e)
            })
        }
        window.addEventListener('DOMMouseScroll', e=>{
            wheelThrottled(e)
        })

        const wheelThrottled = throttle(wheel, 1000)

        /**
         * 鼠标滚动事件
         * @param {Object} e 
         */
        function wheel(e) {
            // 区分火狐和谷歌
            let scorllDir = e.detail === 0 ?  -e.wheelDelta : e.detail
            console.log(e)
            if(scorllDir > 0) {
                console.log('🔻');
                html.scrollTop = pageList[++currentPage]
            }else {
                console.log('🔺');
            }
        }

       /**
        * 函数节流
        * @param {Function} fn 
        * @param {Number} delay 
        */
        function throttle(fn, delay) {
            let timerId;
            let last;
            return function () {
                const _this = this;
                const args = [...arguments];
                const now = Date.now();
                if(last && now < last + delay) {
                    clearTimeout(timerId);
                    timerId =  setTimeout(()=>{
                        last = now;
                        fn.apply(_this, args)
                    }, delay)
                }else {
                    clearTimeout(timerId);
                    last = now;
                    fn.apply(_this, args);
                }
            }
        }
    }
}