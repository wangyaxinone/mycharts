import * as d3 from 'd3'
import d3tip from 'd3-tip'
export default function(_this,cfg){
        var data = cfg.data;
        var color = d3.schemeCategory10;
        _this.container.innerHTML = '';
        var container = d3.select(_this.container)
        var width = parseFloat(container.style('width'))
        var height = parseFloat(container.style('height'))
        var margin = Object.assign({top: 30, right: 30, bottom: 30, left: 30},cfg.margin) 
        var chart = container.append('svg').attr('width', width).attr('height', height)
        var mainWidth = width - margin.left - margin.right
        var mainHeight = height - margin.top - margin.bottom
        var hover_color
        //提示框
        var tip = d3tip().attr('class', 'd3-tip').html(function (d) { return d.y })
        chart.call(tip)
        //比例尺
        var y = d3
        .scaleLinear()
        .domain([0, d3.max(data, function (d) { return d.y })])
        .rangeRound([mainHeight, 0])

        var x = d3
        .scaleBand()
        .rangeRound([0, mainWidth])
        .padding(0.1)

        if(cfg.data[0].x){
            x.domain(data.map(function (d,i) { return d.x  }))
        }else{
            x.domain(data.map(function (d,i) { return i}))
        }
        //轴
        var xAxis = d3
        .axisBottom()
        .scale(x)
        .ticks(data.length)
        .tickPadding(15)
        var yAxis = d3
        .axisLeft(y)
        // .tickFormat(function (d) { return d + '%' })

        chart
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('width', x.bandwidth())
        .attr('height', function (d) {
            return 0
        })
        .attr('x', function (d, i) {
            if(cfg.data[0].x){
                return x(d.x) + margin.left
            }else{
                return x(i) + margin.left
            }
            
        })
        .attr('y', function (d) {
            return mainHeight + margin.top
        })
        .attr('fill', function(d,i){
            return color[i];
        })
        .attr('class', 'bar')
        .attr('rx','5')
        .attr('ry','5')
        .on('mouseover.tip',tip.show)
        .on('mouseover.hover',function(){
            var d_this = d3.select(this);
            hover_color = d_this.attr('fill')
            d_this
                .attr('fill',cfg.hover || 'yellow')

        })
        .on('mouseout', function(){
            d3.select(this)
            .attr('fill',hover_color)

           tip.hide()
        })
        .transition()
        .duration(350)
        .ease(d3.easeLinear)
        .delay(function (d, i) {
            return i * 100
        })
        .attr('height', function (d) {
            return mainHeight - y(d.y)
        })
        .attr('y', function (d) {
            return y(d.y) + margin.top
        })
        chart
        .selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .attr('x', function (d, i) {
            if(cfg.data[0].x){
                return x(d.x) + margin.left
            }else{
                return x(i) + margin.left
            }
        })
        .attr('y', function (d) {
            return y(d.y) + margin.top
        })
        .attr('dx', x.bandwidth() / 2)
        .attr('dy', '1em')
        .attr('fill', '#fff')
        .attr('text-anchor', 'middle')
        .text(function (d) { return d.y })
        chart.append('g')
        .call(xAxis)
        .attr('transform', 'translate(' + margin.left + ',' + (height - margin.bottom) + ')')
        .selectAll('text')
        // .attr('transform','rotate(-45),translate(-15,-10)')

        chart.append('g')
        .call(yAxis)
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .append('text')
        .text('hello（%）')
        .attr('fill', '#333')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .attr('text-anchor', 'end')
}