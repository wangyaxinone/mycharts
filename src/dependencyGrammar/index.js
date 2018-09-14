import * as d3 from 'd3'
import d3tip from 'd3-tip'
export default function yiCun(_this,params){
     if (!params.data){
 
         if (params.error) params.error('no node list');
         return;
     }
     var node_list = params.data;
     if (!_this.container){
 
         if (params.error) params.error('no view id');
         return;
     }
     var select = _this.container;
     params.container = select;
     var node_info = getNodeParams(params);
 
     // 获得root节点
     var root = -1;
     for(var i = 0; i < node_list.length; i++) {
 
         var node = node_list[i];
         if (node["id"] === node["fid"] ){
             root = node["id"];
             break
         }
     }
     if (root === -1) {
 
         if (params.error) params.error('no root');
         return
     }
     //计算每个节点的入边条数
     node_info.word_input_edge_nums = get_input_edge_info(node_info.node_list);
 
     //计算每一个节点的宽高信息
     node_info.word_width_height_info  = get_width_height_info(node_info);
 
     //填充邻接表 fid->cid_list
     node_info.cid_list = get_cid_list(node_info.node_list);
 
     //计算每个节点边交叉个数,为后面计算边的高度准备数据
     node_info.edge_cross_deep = get_edge_cross_deep(node_info.node_list);
  
     //得到最大深度
     node_info.edge_max_deep = get_edge_max_deep(node_info.edge_cross_deep);
 
     //计算svg的宽高
     node_info.svg_attr = get_svg_attr(node_info);
 
     //计算每一个节点的左上坐标
     node_info.words_translate = get_words_translate(node_info);
 
     //计算每一个边的四个点,从左下到右下
      node_info.edge_path = get_edge_path(node_info);
 
     //计算edge上面每一个Lable的位置和长宽
     node_info.edge_label_info = get_edge_label_info(node_info);
 
     //生成html代码
     node_info.html = get_html(node_info);
     
    //  var select = select.replace('#','');
    //  var child = select.childNodes[0];
    //  select.removeChild(child);
    // select.innerHTML = '';
    // d3.select(select)
    //  .append(node_info)
    //  select.appendChild(node_info.html);
    //  $(select).html(node_info.html);

 
 function getNodeParams(params) {
 
     var node_info = {
        tooltip:params.tooltip,
         node_list:params.data,
         word_height:40,
         fontSize:16,//一个中文汉字的宽度
         arrow_width:10,
         word_left_space:20, //每个词之间的空
         edge_height:20,//边之间的高度
         svg_min_width:500,//最小宽度
         svg_top_margin:10,
         svg_left_margin:10,
         one_lable_width:10,//一个lable的横向宽度
         one_lable_height:16, //lable标签的高度
         word_top_margin:5,//词部分上面预留
         array_direction:'child',//箭头指向子节点
         container:params.container
     };
     if (params.node_params){
 
         var node_params = params.node_params;
         if (node_params.word_height) node_info.word_height = node_params.word_height;
         if (node_params.fontSize) node_info.fontSize = node_params.fontSize;
         if (node_params.arrow_width) node_info.arrow_width = node_params.arrow_width;
         if (node_params.word_left_space) node_info.word_left_space = node_params.word_left_space;
         if (node_params.edge_height) node_info.edge_height = node_params.edge_height;
         if (node_params.svg_min_width) node_info.svg_min_width = node_params.svg_min_width;
         if (node_params.svg_top_margin) node_info.svg_top_margin = node_params.svg_top_margin;
         if (node_params.svg_left_margin) node_info.svg_left_margin = node_params.svg_left_margin;
         if (node_params.one_lable_width) node_info.one_lable_width = node_params.one_lable_width;
         if (node_params.one_lable_height) node_info.one_lable_height = node_params.one_lable_height;
         if (node_params.word_top_margin) node_info.word_top_margin = node_params.word_top_margin;
         if (node_params.array_direction) node_info.array_direction = node_params.array_direction;
     }
     return node_info;
 }
 
 //获取入边条数信息
 function get_input_edge_info(node_list){
 
     var res = [];
     var i;
     for (i=0; i< node_list.length; i++){
         res[i] = 0
     }
 
     for (i=0; i< node_list.length; i++) {
         var id = node_list[i].id;
         var fid = node_list[i].fid;
         if ( id === fid ){
             continue
         }
         res[fid] += 1
     }
     return res
 }
 
 
 //填充宽高信息
 function  get_width_height_info( node_info){
     var width_height_info = [];
 
     for (var i=0; i< node_info.node_list.length; i++){
         //width
         var width = node_info.fontSize * node_info.node_list[i].word.length* 1.15;
         var sum_arrow_width = node_info.arrow_width * (node_info.word_input_edge_nums[i] + 1)*1.5;
         var post_text_width = node_info.one_lable_width * (node_info.node_list[i].post.length +2)*1.3;
 
         if( width < sum_arrow_width ){
             width = sum_arrow_width
         }
         if (width < post_text_width*1.5) width = post_text_width*1.5;
         //height
         var height = node_info.word_top_margin*3 +  node_info.fontSize  + node_info.one_lable_height;
         width_height_info[i] = {"width":width, "height":height}
     }
     return width_height_info
 }
 
 //cidlist
 function get_cid_list(node_list) {
     var cid_list= [];
     var i;
     for (i=0; i< node_list.length; i++){ //初始化内存
         cid_list[i] = []
     }
 
     for (i=0 ;i < node_list.length ; i++ ) {
 
         if( node_list[i].id === node_list[i].fid ) {
             continue
         }
         cid_list[node_list[i].fid].push(node_list[i].id)
     }
     return cid_list
 }
 /*
 *  deep[i] = 1 + max{ deep[j] }, j in i_cover_area
 * */
 //cross deep
 function get_edge_cross_deep(node_list) {
     //初始化矩阵
     var cross_deep = [];
     for (var i= 0;i < node_list.length; i++) {
            cross_deep[i]= get_deep_by_id(i, node_list)
     }
     return cross_deep
 }
 
 
 function  get_deep_by_id(id, node_list) {
     var fid = node_list[id].fid;
 
     if (id === fid) { return 0;}
 
     var d = 1;
     if (id > fid) {d= -1;}
 
     if (id + d === fid) { return 1;}
 
     var max_deep = 0;
     var deep = 0;
     for (var i = id + d; i !== parseInt(fid); i += d ) {
         deep = get_deep_by_id(i, node_list);
         if (deep > max_deep) {
             max_deep  = deep;
         }
     }
     return max_deep + 1 ;
 }
 
 
 function  get_edge_max_deep(edge_cross_deep ) {
     var max = 0;
     for (var i =0; i< edge_cross_deep.length ;i++) {
         if ( max < edge_cross_deep[i]) {
             max = edge_cross_deep[i]
         }
     }
     return max
 }
 
 function  get_svg_attr(node_info) {
     var attr ={};
 
     var width = 0;
     var height;
     for (var i=0; i< node_info.word_width_height_info.length; i++) {
         width += node_info.word_width_height_info[i].width + node_info.word_left_space
     }
 
     height = node_info.word_height + node_info.edge_max_deep * node_info.edge_height;
 
     attr.width = width - node_info.word_left_space;
     attr.height = height;
 
     attr.width += node_info.svg_left_margin*2;
     attr.height += node_info.svg_top_margin*2;
 
     return attr
 }
 
 function  get_words_translate(node_info){
     var words_translate = [];
     var left_dis = node_info.svg_left_margin;
     var top_dis = node_info.svg_top_margin + node_info.edge_max_deep * node_info.edge_height;
 
     for (var i=0; i< node_info.word_width_height_info.length; i++) {
         var x = left_dis;
         var y = top_dis;
         left_dis += node_info.word_width_height_info[i].width;
         left_dis += node_info.word_left_space;
 
         words_translate[i] = {x:x,y:y}
     }
     return words_translate
 }
 
 function  get_edge_path(node_info) {
     var edge_path = [];
 
     for (var i=0; i< node_info.word_width_height_info.length; i++) {
 
         var bias = get_output_bias(i,node_info);
         // var x = node_info.words_translate[i].x + node_info.word_width_height_info[i].width/2.0;
         var x = node_info.words_translate[i].x;
         x += bias;
         var p1 = {
             x: x,
             y:node_info.words_translate[i].y
         };
         var fid = node_info.node_list[i].fid;
 
         //var part_deep = get_cid_to_fid_part_deep(i, fid, node_info)
         var p2 = {
             x: x,
             y: (node_info.edge_max_deep - node_info.edge_cross_deep[i] ) * node_info.edge_height + node_info.svg_top_margin
         };
 
         bias = get_arrow_bias(i,fid, node_info);
         // var fx = node_info.words_translate[fid].x + node_info.word_width_height_info[fid].width/2.0;
         var fx = node_info.words_translate[fid].x;
         fx += bias;
         var p3 = {
             x:fx,
             y: p2.y
         };
 
         var p4 = {
             x:fx,
             y:p1.y
         };
         if (node_info.array_direction === 'parent') {
 
             edge_path[i] = [p1,p2,p3,p4]
         }else {
             edge_path[i] = [p4,p3,p2,p1];
         }
     }
     return edge_path
 }
 
 
 //计算每一个输出的偏移量
 function  get_output_bias(id, node_info) {
     var bias;
     //获取位置 idx
     var idx = 0;
     var cid_list = node_info.cid_list[id];
     for (var i =0 ;i< cid_list.length; i++) {
         if (cid_list[i] < id ){
             idx += 1
         }
     }
     //根据位置计算偏移
     var arrow_width = node_info.arrow_width;
     var width = node_info.word_width_height_info[id].width;
     var input_width = arrow_width * (cid_list.length + 1);
 
     var left_margin = (width - input_width)/2.0;
     bias = left_margin + idx * arrow_width + arrow_width/2.0;
 
     // bias -= (width)/2.0;
     return bias
 
 }
 //计算每一个箭头的偏移量
 function  get_arrow_bias(cid, fid, node_info){
     var bias;
     var f_cid_list = node_info.cid_list[fid];
     var idx = 0;
     var i;
     var left_num = 0;
     for (i = 0; i < f_cid_list.length; i++){
 
         if (parseInt(f_cid_list[i]) === cid) {
             idx = i
         }
         if (parseInt(f_cid_list[i]) < fid) {
             left_num += 1
         }
     }
 
     if (cid > fid) {
 
         idx += 1;
         idx = f_cid_list.length - idx + left_num + 1
     }else {
 
         idx = left_num - idx - 1;
     }
 
     var arrow_width = node_info.arrow_width;
     var width = node_info.word_width_height_info[fid].width;
     var input_width = arrow_width * (f_cid_list.length + 1);
 
     var left_margin = (width - input_width)/2.0;
     bias = left_margin + (idx) * arrow_width + arrow_width/2.0;
     return bias
 }
 
 function get_edge_label_info(node_info) {
     var edge_label_info = [];
     for (var i = 0; i < node_info.edge_path.length ; i++) {
         var label = {};
         label.width = node_info.node_list[i].dep_type.length * node_info.one_lable_width;
         label.height = node_info.one_lable_height;
         label.x = (node_info.edge_path[i][1].x + node_info.edge_path[i][2].x ) / 2.0 - label.width/2.0;
         label.y = node_info.edge_path[i][1].y  + label.height/2.0;
         edge_label_info[i] = label
     }
     return edge_label_info
 }
 
 function  get_html(node_info) {
     var hover_color
     var hasTooltip
     if(node_info.tooltip){
         var show = String(node_info.tooltip.show)
        if(show==='true'){
            hasTooltip= true;
        }else if(show==='false'){
            hasTooltip= false;
        }else{
            hasTooltip= true;
        }
     }
     var d_container = d3.select(node_info.container);
     var viewBox = "0,0," + node_info.svg_attr.width + "," +node_info.svg_attr.height;
     var svg = d_container
        .append('svg')
        .attr('viewBox',viewBox)
        .attr('width',node_info.svg_attr.width)
        .attr('height',node_info.svg_attr.height)
     //提示框
     var tip = d3tip().attr('class', 'd3-tip').html(function (d,i) {
         if(node_info.tooltip){
             if( node_info.tooltip.formatter){

                 return node_info.tooltip.formatter(node_info.node_list[i]);
             }
         }
        return  node_info.node_list[i].post
        })

    svg.call(tip)
    var g_node = svg
        .selectAll('.node')
        .data(node_info.words_translate)
        .enter()
        .append('g')
        .attr("class", "node")
        .attr('width',function(d,i){
            return node_info.word_width_height_info[i].width;
        })
        .attr('height',function(d,i){
            return node_info.word_width_height_info[i].height;
        })
        .attr('transform',function(d,i){
            return 'translate('+ d.x + ',' + d.y + ')'
        })
        
    g_node
        .append('rect')
        .attr('strokeWidth',3)
        .attr('opacity',0.5)
        .attr('stroke','#333')
        .attr('height',function(d,i){
            return 0;
        })
        .attr('width',function(d,i){
            return 0;
        })
        .transition()
        .duration(350)
        .ease(d3.easeLinear)
        .delay(function (d, i) {
            return i * 100
        })
        .attr('height',function(d,i){
            return node_info.word_width_height_info[i].height;
        })
        .attr('width',function(d,i){
            return node_info.word_width_height_info[i].width;
        })
        
    var node_g = g_node
        .append('g')
        .attr('class','node_g')
        .attr('transform','translate(0,12)')

    node_g
        .append('rect')
        .attr('fill',function(d,i){
            return node_info.node_list[i].bgColor || 'rgb(251, 104, 96)'
        })
        .attr('width',function(d,i){
            return node_info.word_width_height_info[i].width;   
        })
        .attr('height',function(d,i){
            return 0;   
        })
        .attr('x','0')
        .attr('y','-12')
        .transition()
        .duration(350)
        .ease(d3.easeLinear)
        .delay(function (d, i) {
            return i * 100
        })
        .attr('height',function(d,i){
            return node_info.word_width_height_info[i].height;   
        })
    if(hasTooltip){
        node_g
            .on('mouseover.tip',tip.show)
    }
    node_g
        .style('cursor','pointer')
        .on('mouseover.hover',function(d,i){
            var d_this = d3.select(this).select('rect');
            hover_color = d_this.attr('fill')
            d_this
                .attr('fill', function(){
                    return node_info.node_list[i].hoverBgColor || 'yellow'
                })
            if(_this.evens['mouseover'] && _this.evens['mouseover'].length){
                _this.evens['mouseover'].forEach(function(fn,idx){
                    fn(node_info.node_list[i],i);
                })
            }
        })
        .on('click',function(d,i){
            if(_this.evens['click'] && _this.evens['click'].length){
                _this.evens['click'].forEach(function(fn,idx){
                    fn(node_info.node_list[i],i);
                })
            }
        })
        .on('mouseout', function(d,i){
            var d_this = d3.select(this).select('rect');
            d_this
                .attr('fill', hover_color)
            tip.hide()
            if(_this.evens['mouseout'] && _this.evens['mouseout'].length){
                _this.evens['mouseout'].forEach(function(fn,idx){
                    fn(node_info.node_list[i],i);
                })
            }
        })
        .append('text')
        .append('tspan')
        .text(function(d,i){
            return node_info.node_list[i].word
        })
        .style('font-size',node_info.fontSize+'px')
        .attr('fill',function(d,i){
            return node_info.node_list[i].color || '#333'
        })
        .attr('dx',function(d,i){
            return node_info.word_width_height_info[i].width/2.0 - node_info.fontSize * node_info.node_list[i].word.length /2.0
        })
        .attr('dy',node_info.word_top_margin)
        
    node_g
        .append('text')
        .append('tspan')
        .text(function(d,i){
            return i +"|" + node_info.node_list[i].post;
        })
        .style('font-size',node_info.fontSize+'px')
        .attr('fill',function(d,i){
            return node_info.node_list[i].color || '#333'
        })
        .attr('dx',function(d,i){
            return node_info.word_width_height_info[i].width/2.0 - node_info.one_lable_width * (i +"|" + node_info.node_list[i].post).length /2.0;
        })
        .attr('dy',function(d,i){
            return node_info.word_width_height_info[i].height/2.0
        })  
        
    //定义箭头
    svg
        .append('defs')
        .append('marker')
        .attr('id','arrowhead')
        .attr('viewBox','0 0 10 10')
        .attr('refX','8')
        .attr('refY','5')
        .attr('markerWidth','8')
        .attr('markerHeight','5')
        .attr('orient','auto')
        .attr('fill','#999')
        .append('path')
        .attr('d','M 0 0 L 7 5 L 0 10 z')  
    for (var i=0; i< node_info.edge_cross_deep.length; i+=1) {

        if (i == node_info.node_list[i].fid) { continue }
        var bian = svg
            // .selectAll('.bian')
            // .data(node_info.edge_cross_deep)
            // .enter()
            .append('g')
            .attr('class','bian')
       
        bian
            .append('path')
            .attr('marker-end','url(#arrowhead)')
            .attr('fill','none')
            .attr('stroke','#999')
            .attr('stroke-width','2')
            .attr('d',function(){
                var p_list = ''
                for (var p=0; p < node_info.edge_path[i].length; p++) {
                    var ch = "L";
                    if (p == 0) ch = "M";
    
                    p_list += ch + node_info.edge_path[i][p].x + " " +   node_info.edge_path[i][p].y
                }
                p_list += "";
                return p_list;
            })
        var label = bian
            .append('g')
            .attr('transform',function(){
                return "translate(" + node_info.edge_label_info[i].x + "," + node_info.edge_label_info[i].y + ")";
            })
        label
            .append('rect')
            .attr('width',function(){
                return node_info.edge_label_info[i].width;
            })
            .attr('height',function(){
                return node_info.edge_label_info[i].height;
            })
            .attr('fill','#f6f6f6')
            .attr('y','-15')
        label
            .append('text')
            .attr('width',function(){
                return node_info.edge_label_info[i].width;
            })
            .attr('height',function(){
                return node_info.edge_label_info[i].height;
            })
            .append('tspan')
            .text(function(){
               return node_info.node_list[i].dep_type;
            })
            .style('font-size',node_info.fontSize+'px')
            .attr('width',function(){
                return node_info.edge_label_info[i].width;
            })
            .attr('height',function(){
                return node_info.edge_label_info[i].height;
            })
    }
    


 }
 
}