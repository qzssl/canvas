;(function(global,factory){
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.Chart = factory(global));
})(window,function(window){
	'use strict';
	
	var canvas,ctx;
	// 图表信息
	var cHeight,cWidth,cMargin;
	// 柱状图信息
	var bMargin,bWidth,tobalBars,totalYNomber,len,btoc,textSpace,
		xyText,cbgColor,fillColor,contentColor,titleColor,title,titlePosition,
		yLength,xLength;
	//数据
	var chartData,ydata;
	function Chart(options){
		var options=options||{};
		var defaultOptions={
			canvas:"#canvas",
			cWidth:200,
			cHeight:300,//图表大小
			ydata:[0,20,40,60,80,100],//y轴坐标数据
			xdata:[2007,2008,2009],//x轴坐标数据
			cMargin:40,//图表中间部分到画布边缘距离
			chartData:[{"xPoint":2007,"yPoint":20,"bgColor":"red"},{"xPoint":2008,"yPoint":20,"bgColor":"yellow"}],//数据
			chartType:"barChart",//类型，柱状或条形
			bWidth:20,//柱状图宽度
			bMargin:40,//柱状图之间的距离
			textSpace:80,//字体间隔
			btoc:10,//字体到y轴x轴距离
		};
		//合并两个对象
		Object.assign(defaultOptions, options);
		// this.canvas=document.getElementById('')
		canvas=document.getElementById(defaultOptions.canvas.replace("#", ""));
		ctx=canvas.getContext("2d");
		//画布大小
		let height=defaultOptions.cHeight+2*defaultOptions.cMargin;
		let width=defaultOptions.cWidth+2*defaultOptions.cMargin;
		canvas.height=height;
		canvas.width=width;

		console.log(defaultOptions)
		cHeight=defaultOptions.cHeight;
		cWidth=defaultOptions.cWidth;
		cMargin=defaultOptions.cMargin;
        // 柱状图信息
        bMargin =defaultOptions.bMargin;//每个柱状条之间距离
        tobalBars = defaultOptions.chartData.length;//有多少条数据
        bWidth = defaultOptions.bWidth;//柱状条宽度       
        totalYNomber = defaultOptions.ydata.length;//Y轴有多少数量,即是将y轴分为多少份
        yLength=Math.floor((cHeight-10)/(totalYNomber-1)); //y轴每一份实际有多长 floor() 方法可对一个数进行下舍入
        len=defaultOptions.chartData.length;
        xLength=Math.floor((cWidth-10)/(len+1))////y轴每一份实际有多长 floor() 方法可对一个数进行下舍入
        textSpace=defaultOptions.textSpace;
        //数据
        chartData=defaultOptions.chartData;
        ydata=defaultOptions.ydata;
        btoc=defaultOptions.btoc;

        this.chartType=defaultOptions.chartType;
		this._init(defaultOptions);
	}

	Chart.prototype={
		_init:function(defaultOptions){
			var that = this;
			initChart(); //图表初始化,绘制图表
			drawMarkers(); // 绘制图表x轴y轴坐标轴数据
        	if(that.chartType==='barChart'){
				drawBar(); // 绘制柱状图
        	}else{
        		drawPolyLine();//绘制折线图
        	}
		}	
	}

	function initChart(){ 
		ctx.font = "14px Arial";
        ctx.lineWidth = 1;
        ctx.fillStyle = "#000";
        ctx.strokeStyle = "#000";
        let height=cHeight+cMargin;
        let width=cWidth+cMargin;
		// y轴
		drawLine(cMargin,cMargin,cMargin,height);
		// x轴
		drawLine(cMargin,height,width,height);
	}
	// 画线的方法
	function drawMarkers(){
        ctx.strokeStyle = "#E0E0E0";
        //设置字体在右
        ctx.textAlign = "right";
        // 绘制 y坐标数据
        for(let i=0; i<totalYNomber; i++){
            let markerVal =  ydata[i];
           	
            let xMarker = cMargin-btoc;
            let y=(canvas.height-cMargin)-yLength*(i);
            let yMarker = parseInt(y);
            //绘制文字fillText(要绘制的文本，x,y,允许的最大文本宽度)
            ctx.fillText(markerVal, xMarker, yMarker+5); // 文字 加5 是下移字体，以对齐中间线
            drawLine(cMargin,yMarker,cWidth+cMargin,yMarker);//中间部分线
        }
        // 绘制 x坐标数据
        ctx.textAlign = "center";
        for(let i=0; i<len; i++){
            let markerVal =chartData[i].xPoint;
            let yMarker = canvas.height-cMargin+2*btoc;
			var x=cMargin+xLength*(i+1);
			let xMarker = parseInt(x);
            ctx.fillText(markerVal, xMarker, yMarker); // 文字
            // drawLine(xMarker,yMarker,xMarker,cMargin);//中间部分线
        }
    }
    //绘制柱形图
    function drawBar(){
    	let y = canvas.height-cMargin;//y轴 
        for(let i=0; i<len; i++){
            var barValY= chartData[i].yPoint;        
			let x=cMargin+xLength*(i+1)-bWidth/2;
			let xMarker = parseInt(x);
			let yMarker = yPoint(barValY);
            drawRect( x, y,bWidth,-yMarker,i);
            ctx.fillText(barValY,x+bWidth/2,canvas.height-cMargin-yMarker-5);
        }
    }
    //获取对应y轴的坐标
    function yPoint(val){
    	let ynum=ydata[totalYNomber-1]-ydata[totalYNomber-2];//y轴两个数之间差值
    	return Math.floor((val*yLength)/ynum);
    }
    //折线图
    function drawPolyLine(){
		ctx.fillStyle="#000";
		ctx.strokeStyle="#000";
    	for(let i=0; i<len-1; i++){
            //实际每格56 对应20  每一px对应20/56
            var yValue=chartData[i].yPoint;
            var yValue2=chartData[i+1].yPoint;
           	var x=cMargin+xLength*(i+1);
			var x2=cMargin+xLength*(i+2);
			var y=canvas.height-cMargin-yPoint(yValue);
			var y2=canvas.height-cMargin-yPoint(yValue2);
			drawLine(x,y,x2,y2);
			ctx.fillText(yValue,x,y-5);
			//ctx.arc(x,y,r,sAngle,eAngle,counterclockwise(false/true))
			//x,y圆中心坐标
			//r半径
			//sAngle,eAngle 起始角、结束角，以弧度计。（弧的圆形的三点钟位置是 0 度）
			//counterclockwise 可选，规定应该逆时针还是顺时针绘图。False = 顺时针，true = 逆时针。
			drawArc(x,y,2,0,2*Math.PI);

        }
        ctx.fillText(yValue,x2,y2-5);//绘制最后一个数据
        drawArc(x2,y2,2,0,2*Math.PI);
    }
    //绘制圆
    function drawArc(x,y,r,s,e,c){
    	ctx.save();
    	ctx.beginPath();
    	ctx.arc(x,y,r,s,e);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
    }
    //绘制直线
    function drawLine(x, y, cX, cY){
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(cX, cY);
        ctx.stroke();
    }
	//绘制方块
    function drawRect( x, y, width,height,i){
        ctx.beginPath();
        ctx.rect( x, y, width, height);
        ctx.fillStyle =chartData[i].bgColor;
        ctx.strokeStyle = chartData[i].bgColor;
        ctx.fill();
        ctx.closePath();
    }
	return Chart;
})