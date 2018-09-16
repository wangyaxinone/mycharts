# mycharts
基于d3.js 封装一些项目中的图表

>### 使用方法:
>1. npm i -S mycharts
>2. import myCharts from "mycharts"
>3. 调用GDepParser方法，传递参数：
>   ```
>   var node_list = [
>        {id:0,fid:0,word:'测试0',post:'test1',dep_type:'TEST1',color:'#333',bgColor:'red'},
>        {id:1,fid:0,word:'测试1',post:'test2',dep_type:'TEST2'}
>   ];
>   var d1 = new myCharts('#d1');
>   d1.setOptions({
>      type:'dependencyGrammar',
>      data: node_list
>   })
>   .on('click',function(data){
>      console.log(data)
>   })
>   ```
