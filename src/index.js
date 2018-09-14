import dependencyGrammar from "./dependencyGrammar"
import bar from "./bar"

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
          return bar(this,cfg);
      }else if(cfg.type === 'dependencyGrammar'){
          return dependencyGrammar(this,cfg);
      }
  }
  on(type,fn){
      //注册事件
      this.evens[type] = this.evens[type] || [];
      this.evens[type].push(fn)
  }
}
export default  myCharts;