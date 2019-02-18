fakeData()

function Model(options) {
    this.data = options.data
    this.resource = options.resource
}
Model.prototype.fetch = function (id) {
    return axios.get(`/${this.resource}s/${id}`).then((response) => {
        this.data = response.data
        return response
    })
}
Model.prototype.update = function (id, data) {
    return axios.put(`/${this.resource}s/${id}`, data).then((response) => {
        this.data = response.data
        return response
    })
}

//----------上面是MVC类，下面是对象

let model = new Model({
    data: {
        name: '',
        number: 0,
        id: ''
    },
    resource: 'book'
})

let view = new Vue({
    el: '#app',
    data: {
        book: {
            name: '未命名',
            number: 0,
            id: ''
        },
        n:1
    },
    template: `
    <div>
        <div>
            书名：《{{book.name}}》
            数量：<span id="number">{{book.number}}</span>
        </div>
        <div>
            <input v-model="n"> 
            N 的值是{{n}}
        </div>
        <div>
            <button v-on:click="addOne">加N</button>
            <button v-on:click="minusOne">减N</button>
            <button v-on:click="reset">归零</button>
      </div>
    </div>
    `,
    created() {
        model.fetch(1).then(() => {
            this.book = model.data
        })
    },
    methods: {
        addOne() {
            model.update(1, {
                number: this.book.number + (this.n - 0)
            }).then(() => {
                this.view.book = this.model.data
            })

        },
        minusOne() {
            model.update(1, {
                number: this.book.number - (this.n - 0)
            }).then(() => {
                this.view.book = this.model.data
            })
        },
        reset() {
            model.update(1, {
                number: 0
            }).then(() => {
                this.view.book = this.model.data
            })
        },
    }
})


//*********//


function fakeData() {
    //在后台正真返回response之前使用括号中的函数
    let book = {
        name: 'JavaScript 高级程序设计',
        number: 2,
        id: 1
    }
    axios.interceptors.response.use(function (response) {
        // let config = response.config
        // let {url,method,data} = config //此处的data是请求的data
        let { config: { url, method, data } } = response
        if (url === '/books/1' && method === 'get') {
            response.data = book
        } else if (url === '/books/1' && method === 'put') {
            data = JSON.parse(data)//不加上这一句在实现数据的相互转换的时候就不能实现正常的交互
            Object.assign(book, data)
            //这个API就相当于用data中的数据去更新book中的数据
            response.data = book
        }
        return (response)
    })
}