const vm = new Vue({
    el:'#app',
    data:{
        newTodo:'',
        todoList:[],
        allCompletd:false,
        isShow: function (val) {
            return true
        },
        whatToShow:[true, false, false]
    },
    methods:{
        // 添加新待办
        addNewTodo() {
            const newOne = {
                content:this.newTodo,
                state:false,
                edit:false
            }
            this.todoList.push(newOne);
        },
        // 编辑
        editing(index) {
            this.todoList.forEach((v, i)=>{
                if(i === index) {
                    v.edit = true
                }else {
                    v.edit = false
                }
            })
            this.todoList[index].edit = true;
        },
        // 删除单个事项
        destroy(index) {
            this.todoList.splice(index, 1);
        },
        // 清除已完成
        clearCompleted() {
            this.todoList = this.todoList.filter(item=>item.state === false);
            this.allCompletd = false;
        },
        // 切换全部完成
        toggleAllCompletd() {
            this.allCompletd = !this.allCompletd;
            this.todoList.forEach(item=>item.state = this.allCompletd)
        }, 
        // 显示全部
        showAll(i) {
            this.whatToShow = this.whatToShow.map(item => item = false);
            this.whatToShow[i] = true;
            this.isShow = function (state) {
                return true
            }
        },
        // 显示未完成
        showActive(i) {
            this.whatToShow = this.whatToShow.map(item => item = false);
            this.whatToShow[i] = true;
            this.isShow = function (state) {
                return state === false ? true : false
            }
        },
        //显示已完成
        showCompleted(i) {
            this.whatToShow = this.whatToShow.map(item => item = false);
            this.whatToShow[i] = true;
            this.isShow = function (state) {
                return state === true ? true : false
            }
        }
    },
    computed: {
        uncompleted() {
            let count = 0;
            this.todoList.forEach(item=>{
                if(!item.state) {
                    count++;
                };
                this.allCompletd = count > 0 ? false : true;
            })
            return count
        },
    },
    directives: {
        'todo-focus': function (el) {
            el.focus()
        }
    }
})


