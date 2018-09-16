import dependencyGrammar from "./dependencyGrammar"
import bar from "./bar"
import './css/main.css'
class myCharts {
    constructor(id) {
        if(id[0]==='#'){
            this.container = document.getElementById(id.slice(1))
        }else if(id[0]==='.'){
            this.container = document.getElementsByClassName(id.slice(1))
        }else{
            console.error('请输入id 或者 class')
        }
        this.evens = {};
    }
    setOptions(cfg){
        if(cfg.type === 'bar'){
            bar(this,cfg);
        }else if(cfg.type === 'dependencyGrammar'){
            dependencyGrammar(this,cfg);
        }
        return this;
    }
    on(type,fn){
        //注册事件
        this.evens[type] = this.evens[type] || [];
        this.evens[type].push(fn);
        return this;
    }
    emit(type,prams){
        if(this.evens[type] && this.evens[type].length){
            this.evens[type].forEach(function(fn,idx){
                fn(prams);
            })
        } 
        return this;       
    }
}
export default myCharts;