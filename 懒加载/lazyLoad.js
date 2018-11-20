/**
 * 函数节流
 * @param {Function} fun 
 * @param {Number} delay 
 * @returns {Function} 返回一个匿名函数
 */
function throttle(fn, ms, args) { 
    let last, timerId;
    return (args)=>{
        let now = Date.now();
        if(last && now < last + ms) {
            clearTimeout(timerId);
            timerId = setTimeout(()=>{
                fn(args)
            }, ms);
        }else {
            last = now;
            fn(args)
        }
    }
}


/**
 * 获取元素距离窗口上下的距离值
 * @description getBoundingClientRect方法返回距离
 * @param {HTMLElemnt} dom 
 * @returns {Object} top和bottom组成的对象
 *  
 */
function getClientRect(dom) {
    return {
        top: dom.getBoundingClientRect().top,
        bottom: dom.getBoundingClientRect().bottom
    }
}

// dom加载完成
// 目的是设置placeholder
window.addEventListener('DOMContentLoaded', () => {
    // 图片数组
    let imgList = [...document.images];
    // 写入placeholder图片
    // 这一步要在获取图片高度之前做，不然没有高度
    imgList.forEach(img => {
        // 设置占位图片
        img.src = img.getAttribute('placeholder');
    })
    
    // 这里等待全部资源加载完毕
    // 目的是能获取正确的图片宽高
    window.addEventListener('load', () => {
        // 可视区域高度
        let viewHeight = document.documentElement.clientHeight;
        // 先调一次让前几张图片先加载
        lazyLoad()
        // 滚动事件，函数节流
        window.addEventListener('scroll', throttle(lazyLoad, 300))
        
        // 懒加载主函数
        function lazyLoad() {
            imgList.forEach((img, index) => {
                // 获取top和bottom值
                let offst = getClientRect(img);
                if ((offst.top < viewHeight && offst.top > 0) 
                    || (offst.bottom < viewHeight && offst.bottom > 0)) {
                    // 满足条件就将src属性写上
                    imgList[index].src = img.getAttribute('load-src');
                    imgList[index].setAttribute('placeholder', '');
                }
            })
            // 如果所有的图片已经加载 移除事件
            if (imgList.every(img => img.getAttribute('placeholder') === '')) {
                window.removeEventListener('scroll', lazyLoad);
            }
        }
    })
})