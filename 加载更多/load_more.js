class LoadMore{
    constructor(selector) {
        if(!selector || selector instanceof String) {
            throw '⛔实例对象时写入正确选择器'
        }
        this.onNeedMore;
        // 触底元素
        this.ele = document.querySelector(selector);
        // 父元素
        this.parent = this.ele.parentElement;
        const instance = this;
        let _eventList = [];
        /**
         * 初始化
         * @description 使用箭头函数使this指向调用者,否则this为undefined
         */
        const _init = ()=>  {
            // 给onNeedMore属性赋值实际上会将事件函数放入eventList数组中
            Object.defineProperty(this, 'onNeedMore', {
                get() {
                    return _eventList
                },
                set(newEvent) {
                    if(newEvent instanceof Function) {
                        _eventList.push(newEvent)
                    }else {
                        throw new Error('⚡onNeedMore值必须为函数')
                    }
                }
            })
            this.ele.style = `
                position:static;
                height:0;
            `;
            // 节流滚动事件
            const scrollFn = _throttle((e)=>{
                // 获取滚动目标
                const scrollTarget = e.target.scrollingElement || e.target
                // 可视区域高度
                const viewHeight = document.documentElement.clientHeight;
                // 滚动距离
                const sTop = scrollTarget.scrollTop;
                // 底部元素距离父元素顶部的距离
                // 父级没有定位的话减去父级元素的offsetTop
                const bottomToTop = this.ele.offsetParent.nodeName === 'BODY' ? this.ele.offsetTop - this.parent.offsetTop : this.ele.offsetTop;
                if( sTop + viewHeight >= bottomToTop) {
                    // 触底触发事件函数
                    _fire(e)
                }
            }, 100);
            // 注册滚动事件
            if(this.parent.nodeName === 'BODY') {
                window.addEventListener('scroll', (e)=>{
                    scrollFn(e)
                })
            }else {
                this.parent.addEventListener('scroll', (e)=>{
                    scrollFn(e)
                })
            }
        }
        _init();

        /**
         * 触发事件
         * @param {Object} e 事件对象
         * @description 触发该实例的所有事件
         */
        function _fire(e) {
            _eventList.forEach(eventFn=>{
                eventFn.call(instance, e)
            })
        }


        /**
         * 函数节流
         * @param {Function} fn 
         * @param {Number} delay 
         */
        function _throttle(fn, delay) {
            let timerId;
            let last;
            return (...ags) => {
                const _this = this;
                const now = Date.now();
                let res;
                if(last && now < last + delay) {
                    clearTimeout(timerId);
                    timerId = setTimeout(()=>{
                        last = now;
                        res = fn.apply(_this, ags);
                    }, delay);
                }else {
                    clearTimeout(timerId);
                    last = now;
                    res = fn.apply(_this, ags);
                }
                return res
            }
        }
    }
}


