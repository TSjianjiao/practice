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
 * 获取offset值
 * @description 由于offset值相对于第一个被定位的父级，所以要找到最外层的容器，并叠加他们的offset值
 * @param {HTMLElemnt} dom 
 * @returns {Object} 包含offsetTop和offsetLeft的对象
 *  
 */
function getOffset(dom) {
    let offsetParent = dom.offsetParent;
    let sumOffsetTop = dom.offsetTop;
    let sumOffsetLeft = dom.offsetLeft;
    if (offsetParent.nodeName !== 'BODY') {
        let offset = getOffset(offsetParent);
        sumOffsetTop += offset.top;
        sumOffsetLeft += offset.left;
    }
    return {
        top: sumOffsetTop,
        left: sumOffsetLeft
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
            // 获取滚动值
            let sTop = window.scrollY;
            console.log(sTop)
            imgList.forEach((img, index) => {
                // 获取offsetTop和left值
                let offst = getOffset(img);
                if (sTop >= offst.top - img.offsetHeight * 4 / 3
                    || viewHeight + sTop >= offst.top * 4 / 3) {
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