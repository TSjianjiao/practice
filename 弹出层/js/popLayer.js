;(function(global) {
    /**
     * 初始化
     */
    let layerTarget;
    // 整个网页高宽， 一定要等待dom加载完后才获取
    let pageHeight;
    let pageWidth;
    let viewHeight;
    window.addEventListener('DOMContentLoaded', ()=>{
        pageHeight = document.documentElement.offsetHeight;
        pageWidth = screen.width;
        viewHeight = document.documentElement.clientHeight
    })
    // 弹出层高宽
    let popWidth;
    let popHeight;


    /**
     * 创造弹出层
     * @param {Object} customerOptions 
     */
    function createLayer(customerOptions) {
        // 合并默认和用户设置
        let options = assignOptions({
                    width:300,
                    height:200,
                    isAbsoluteCenter: true
                }, customerOptions);
        // 弹出层宽高
        popWidth = options.width;
        popHeight = options.height;
        let isAC = options.isAbsoluteCenter;
        // 创建文档片段
        layerTarget = document.createDocumentFragment();
        // 最外层容器
        layerTarget.appendChild(createOuterContainer(popWidth, popHeight, isAC));
        // mask
        layerTarget.appendChild(createPopMask());
        return layerTarget
    }
    
    /**
     * 创建最外层容器
     * @param {Number} w 
     * @param {Number} h 
     */
    function createOuterContainer(w, h, isAC) {
        let outerContainer = document.createElement('div');
        // 加入标题栏
        outerContainer.appendChild(createTitle());
        // 加入拖拽块
        outerContainer.appendChild(createDragBlock());
        // 默认居中
        outerContainer.style = `   
                position:absolute;
                top:0;
                left:0;
                right:0;
                bottom:0;
                margin:auto;
                width: ${w}px;
                height: ${h}px;
                background-color: #fff;
                transition:top .5s ease-in-out;
                z-index:99999`;
        if(isAC) {
            window.onresize = (e)=>{ 
                clearTimeout(setCenter.id);
                // 函数节流
                setCenter.id = setTimeout((e)=>{
                    setCenter(outerContainer);
                }, 300)
            }
            window.onscroll = (e)=>{
                clearTimeout(setCenter.id);
                // 函数节流
                setCenter.id = setTimeout((e)=>{
                    setCenter(outerContainer);
                }, 100)
            }
        }
        return outerContainer
    }
    
    /**
     * 创建标题栏
     */
    function createTitle() {
        let div = document.createElement('div');
        div.style = `
            height:50px;
            background-color:pink;
            cursor: move
        `
        // 注册事件
        div.onmouseup = ()=>div.onmousemove = null;
        // div.onmouseleave = ()=>div.onmousemove = null;
        div.onmousedown = (e)=>{
            // 保存鼠标和弹出层的偏移量
            let offX = e.offsetX;
            let offY = e.offsetY;
            let parent = div.parentElement;
            div.onmousemove = (e)=>{
                // 鼠标位置
                let mouseX = e.clientX;
                let mouseY = e.clientY;
                // 弹出层移动位置
                parent.style.left = `${mouseX - offX}px`;
                parent.style.top = `${mouseY - offY}px`;
                parent.style.bottom = '';
                parent.style.right = '';
                parent.style.transition = '';
                parent.style.margin = '';
            }
        }
        return div
    }

    /**
     * 创建拖拽块
     */
    function createDragBlock() {
        let dargBlock = document.createElement('sapn');
        dargBlock.innerHTML = `🍭`
        dargBlock.style = `
            display:inline-block;
            position:absolute;
            width:100px;
            height:50px;
            background-color:#000;
            right:0;
            top:${popHeight - 20}px;
            cursor:nw-resize
        `;
        
        // 注册事件
        dargBlock.onmouseup = ()=>dargBlock.onmousemove = null;
        dargBlock.onmousedown = (e)=>{
            // 保存鼠标和弹出层的偏移量
            let offX = e.offsetX;
            let offY = e.offsetY;
            let parent = dargBlock.parentElement;
            dargBlock.onmousemove = (e)=>{
                // 鼠标位置
                let mouseX = e.clientX;
                let mouseY = e.clientY;
                parent.style.width = `${mouseX - offX}px`;
                parent.style.height = `${mouseY - offY}px`;
                dargBlock.style.top = `${parent.offsetHeight - 20}px`;
            }
        }
        return dargBlock
    }
    /**
     * 创建遮罩层
     * @param {Object} customerOptions 
     */
    function createPopMask(customerOptions) {
        // 获取配置
        let options = assignOptions({
            'width': pageWidth,
            'height': pageHeight,
            'background-color': '#000',
            'opacity': 0.5
        }, customerOptions)
        // 制造mask
        let mask = document.createElement('div');
        // 设置样式
        mask.style = `position:absolute;
            top:0;
            left:0;
            width:${options.width}px;
            height:${options.height}px;
            background-color: #000;
            opacity: 0.5`
        return mask
    }

    /**
     * 让元素居中
     * @param {HTMLElement} dom 
     */
    function setCenter(dom) {
        if(!(dom instanceof Node)) {
            warn('必须是节点⚠')
        }else {
            let w = dom.offsetWidth;
            let h = dom.offsetHeight;
            let top = document.documentElement.scrollTop;
            let left = document.documentElement.clientWidth;
            let viewHeight = document.documentElement.clientHeight;
            dom.style.right = '';
            dom.style.bottom = '';
            dom.style.transition = 'top .5s ease-in-out'
            dom.style.top = top + (viewHeight - h) / 2 +'px';
            dom.style.left = (left - w) / 2 + 'px';
        }
    }

    function setButton() {

    }

    function removeButton() {

    }

    function resizeble() {

    }
    
    function moveble() {
        
    }

    function defultPosition() {

    }

    function setBackground() {

    }

    function setPopEffect() {

    }


    function addCustomLayer() {
        
    }

    /**
     * 弹出悬浮层
     * @param {Function} callBack 
     */
    function pop(callBack = ()=>{}) {
        document.body.style.overflowX = "hidden";
        document.body.appendChild(layerTarget);
        callBack();
    }

    /**
     * 合并用户和默认配置
     * @param {Object} defultOptions 
     * @param {Object} customerOptions 
     */
    function assignOptions(defultOptions, customerOptions) {
        return Object.assign({}, defultOptions, customerOptions)
    }
    /**
     * 错误提示
     * @param {String} message
     */
    function warn(message = "❗发生错误") {
        throw new Error(message)
    }

    // 全局挂载
    global.popLayer = {
        createLayer,
        pop
    };
})(this)
