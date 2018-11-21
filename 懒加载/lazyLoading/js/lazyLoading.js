// 懒加载类
class LazyLoad {
	// 构造器
	constructor () {
		// 获取当前屏幕可视窗口的高 兼容IE
		this.windowH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

		// 调用初始化方法
		this.init();
	}
	// 初始化方法
	init () {
		// 获取所有图片
		let imgArr = document.querySelectorAll('img');

		// 循环图片数组 
		for (let i = 0; i < imgArr.length; i++) {
			// 获取每一张图片的上下到窗口的距离 -- 调用getClientRect方法
			let imgTop = this.getClientRect(imgArr[i]).clientTop;
			let imgBottom = this.getClientRect(imgArr[i]).clientBottom;

			// 如果图片出现在可视区域内（图片上边进入可视窗口 或 图片下边进入可视窗口）
			if ((imgTop > 0 && imgTop < this.windowH) || (imgBottom > 0 && imgBottom < this.windowH)) {
				// 用图片的data-src 替换掉src
				imgArr[i].src = imgArr[i].dataset.src;
			}
		}
	}
	// 实现 getClientRect() 方法
	getClientRect (img) {
		let clientTop = img.getBoundingClientRect().top;
		let clientBottom = img.getBoundingClientRect().bottom;

		return {
			clientTop,
			clientBottom
		}
	}
}
