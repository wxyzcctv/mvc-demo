fakeData()

function Model(options){
    this.data = options.data
    this.resouce = options.resouce
}
Model.prototype.fetch = function(id){
    return axios.get(`/${this.resouce}s/${id}`).then((response) => {
        this.data = response.data
        return response
    })
}
Model.prototype.updata = function(id,data){
    return axios.put(`/${this.resouce}s/${id}`, data).then((response) => {
        this.data = response.data
        return response
    })
}
function View({el,template}){
    this.el = el
    this.template = template
}
View.prototype.render = function(data){
    let html = this.template
    for(let key in data){
        html = html.replace(`__${key}__`,data[key])
    }
    $(this.el).html(html)
}
//----------上面是MVC类，下面是对象

let model = new Model({
    data: {
        name: '',
        number: 0,
        id: ''
    },
    resouce:'book'
})

let view = new View({
    el: '#app',
    template: `
    <div>
        书名：《__name__》
        数量：<span id="number">__number__</span>
    </div>
    <div>
        <button id="addOne">加1</button>
        <button id="minusOne">减1</button>
        <button id="reset">归零</button>
    </div>
    `
})

var controller = {
    init(options) {
        let view = options.view
        let model = options.model
        this.view = view
        this.model = model
        this.view.render(this.model.data)
        this.bindEvents()
        this.model.fetch(1)
            .then(() => {
                this.view.render(this.model.data)
            })
    },
    addOne() {
        var oldNumber = $('#number').text()//获取到的是字符串string
        var newNumber = oldNumber - 0 + 1//先减0是为了将string变为数值
        this.model.updata(1, { number: newNumber }).then(({ data }) => {
            this.view.render(this.model.data)
        })
        //点击之后发送一个普通请求到后端，并且传入改动的数据，如果发送成功，前端才进行新的数据显示
        //将获取到的数据作为字符串的形式传给显示的部分
    },
    minusOne() {
        var oldNumber = $('#number').text()
        var newNumber = oldNumber - 0 - 1
        this.model.updata(1, { number: newNumber }).then(() => {
            this.view.render(this.model.data)
        })
    },
    reset() {
        this.model.updata(1, { number: 0 }).then(() => {
            this.view.render(this.model.data)
        })
    },
    bindEvents() {
        $(this.view.el).on('click', '#addOne', this.addOne.bind(this))
        $(this.view.el).on('click', '#minusOne', this.minusOne.bind(this))
        $(this.view.el).on('click', '#reset', this.reset.bind(this))
    }
}
controller.init({ view: view, model: model })




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