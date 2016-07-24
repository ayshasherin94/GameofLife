$(document).ready(function(){
  grid('hex', 5, 5, 1000, 500);
});

function grid(type, w, h, totalW, totalH){
	var $this = this;
	this.type = type || 'hex';// hexagons
	this.blockW = w || 25;
	this.blockH = h || 25;
	this.container;
	
  $('#grid').empty();
		this.container = document.createElement('div');
		this.container.style.position = 'center';
		this.container.style.width = '100%';
		this.container.style.height = '100%';
		this.container.id = 'gridContainer';
		
  
		var c = document.createElement("canvas");
	    c.width  = totalW;
	    c.height = totalH;
	    
		var totalW = totalW || $(document).width();
		var totalH = totalH || $(document).height();
		
	
	if(this.type == 'hex'){
		
		var c = drawHexGrid({}, c);
		this.container.appendChild(c);
		document.getElementById('grid').appendChild(this.container);
	}
	
	function drawHexGrid(opts,c) {
		
		var alpha 		= opts.alpha || 1;
		var color 		= opts.color || '#1e1e1e';
		var lineWidth  	= opts.lineWidth || 1;
		var radius 		= opts.radius || 20;
		
	    
	    var mapGridCanvas = c.getContext("2d");
	    mapGridCanvas.clearRect(0, 0, c.width, c.height);
	    mapGridCanvas.globalAlpha = alpha;
	    mapGridCanvas.strokeStyle = color;
	    mapGridCanvas.lineWidth = lineWidth;
	
	    //length of line
	    r = radius;
	    part = 60;
	    hexSize = r*Math.sqrt(3);
	    yHexSize = r*Math.sqrt(2.25);
	    xHexes = 2000 / hexSize;
	    yHexes = 2000 / yHexSize;
	
	    mapGridCanvas.beginPath();
	
	    //loop through hex "rows" and every other row shift
	    for (xGrid=0;xGrid<=xHexes;xGrid++){
	        for (yGrid=0;yGrid<=yHexes;yGrid++){
	            if (yGrid % 2 == 0) {
	                //even row
	                shiftX = hexSize/2;
	            }
	            else {
	                //odd row
	                shiftX=0;
	            }
	            for (i=0;i<=6;i++) {
	                var a = i * part - 90;
	                x = r * Math.cos(a * Math.PI / 180)+xGrid*hexSize+shiftX;
	                y = r * Math.sin(a * Math.PI / 180)+yGrid*yHexSize;
	                if (i == 0) {
	                    mapGridCanvas.moveTo(x,y);
	                }
	                else {
	                    mapGridCanvas.lineTo(x,y);
	                }
	            }
	        }
	    }
	    mapGridCanvas.stroke();
	    
	    return c;
	}
		
	function removeGrid(){	
		document.removeChild(this.container);
	}
	
};
