import myCharts from "../src/index.js"
require('../dist/myCharts.css')
var a= new myCharts('#d1');
a.setOptions({
    type:'bar',
    data:[
        {
            y:12,
            color:'red'
        },
        {
            y:10
        },
        {
            y:3
        },
        {
            y:12,
            color:'red'
        },
        {
            y:10
        },
        {
            y:3
        },
    ]
})
var node_list = [
    {id:0,fid:0,word:'测试0',post:'test1',dep_type:'TEST1',bgColor:'rgb(31, 119, 180)',color:'#fff'},
    {id:1,fid:0,word:'测试1',post:'test2',dep_type:'TEST2',bgColor:'rgb(31, 119, 180)',color:'#fff'}
];
var d2 = new myCharts('#d2');
d2.setOptions({
    type:'dependencyGrammar',
    data: node_list
}).on('click',function(data){
    console.log(data)
})
