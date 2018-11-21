window.addEventListener('load', () => {
    const selects = document.getElementById('selects');
    // 进入页面加载第一个省的数据
    axios.post('/getRegion', {
        parentCode: -1
    }).then(res => {
        // 渲染省数据
        const firstProvince = renderProvince(res.data).getAttribute('code');
        // 渲染市数据
        _renderCity(firstProvince).then(option=>{
            const firstCity = option.getAttribute('code');
            // 渲染区数据
            renderDistrict(firstCity);
        })
    }).catch(err => {
        console.log(err)
    })

    // 事件代理 省级选择 渲染城市
    const province = document.getElementById('province');
    province.addEventListener('change', e=>{
        const _this = e.target;
        // 获取选择的选项
        const selectCity = _this.selectedOptions[0];
        // 省代码
        const code = selectCity.getAttribute('code');
        // 渲染城市和 第一城市的区
        _renderCity(code).then(option=>{
            const firstCity = option.getAttribute('code');
            // 渲染区数据
            renderDistrict(firstCity);
        })
    })

    // 城市选择 渲染区
    const city = document.getElementById('city');
    city.addEventListener('change', e=>{
        const _this = e.target;
        // 获取选择的选项
        const selectDistrict = _this.selectedOptions[0];
        // 城市代码
        const code = selectDistrict.getAttribute('code');
        // 渲染区
        renderDistrict(code);
    })

})

/**
 * 渲染省级数据
 * @param {Array} data 
 * @returns {HTMLElement} 返回第一个option
 */
function renderProvince(data) {
    let firstOption;
    const province = document.getElementById('province');
    data.forEach((item, index)=>{
        if(index === 0) {
            firstOption = renderOption(province, item.parentCode, item.code, item.name);
        }else {
            renderOption(province, item.parentCode, item.code, item.name);
        }
    })
    return firstOption
}

/**
 * 渲染城市数据
 * @param {Number} provinceCode 
 */
async function _renderCity(provinceCode) {
    return new Promise(resolve=>{
        const city = document.getElementById('city');
        // 清空选项
        city.innerHTML = '';
        let firstOption;
        axios.post('/getRegion', {
            parentCode: provinceCode
        }).then(res=>{
            const data = res.data;
            data.forEach((item, index)=>{
                if(index === 0) {
                    firstOption = renderOption(city, item.parentCode, item.code, item.name);
                }else {
                    renderOption(city, item.parentCode, item.code, item.name);
                }
            })
            resolve(firstOption);
        }).catch(err=>console.log(err))
    })
}

/**
 * 渲染区级数据
 * @param {Number} cityCode 
 */
function renderDistrict(cityCode) {
    const district = document.getElementById('district');
    // 清空选项
    district.innerHTML = '';
    let firstOption;
    axios.post('/getRegion', {
        parentCode: cityCode
    }).then(res=>{
        const data = res.data;
        data.forEach((item, index)=>{
            if(index === 0) {
                firstOption = renderOption(district, item.parentCode, item.code, item.name);
            }else {
                renderOption(district, item.parentCode, item.code, item.name);
            }
        })
        return firstOption
    }).catch(err=>console.log(err))
}

/**
 * 渲染选项
 * @param {Node} parentSelect 
 * @param {Number} parentCode 
 * @param {Number} code 
 * @param {String} name 
 * @returns {Node} 返回选项节点
 */
function renderOption(parentSelect, parentCode, code, name) {
    const option = document.createElement('option');
    option.setAttribute('parent-code', parentCode);
    option.setAttribute('code', code);
    option.innerHTML = name;
    parentSelect.appendChild(option);
    return option
}