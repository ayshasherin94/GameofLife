
var rows;
var columns;
var box;
var instance;
var tracking = false;
var generation = 0;

function builder(maze)
{
    /* create the element to hold the maze itself */
    var token = document.createElement("div");
    token.setAttribute("id", "maze");

    /* kick off the builder iterator */
    iter(function (row) { return mazeRowBuilder(maze, token, row) }, rows, function () { displayer(box, token) }, 
                    function(i, n) { progress("rendering", i, n) });     
                    
    /**
     * Create an HTML element that represents a row in the maze
     */
    function mazeRowBuilder(maze, token, y)
    {
        var row = document.createElement("div");
        row.setAttribute("class", "mrow");

        token.appendChild(row);

        iter(function (column) { return mazeCellBuilder(maze, row, column, y) }, columns);

        return y + 1;
    }
    
    /**
     * Creates an HTML element that represent an individual cell in the maze
     */
    function mazeCellBuilder(maze, row, x, y)
    {
        row.appendChild(maze.cells[x][y]);
        
        return x + 1;
    }
}

function progress(label, n, total)
{
    /* set the label on the progress bar */
    document.getElementById(label).style.color = "#18416A";
    
    /* move the progress bar */
    document.getElementById("bar").style.width = Math.round((n / total) * 100) + "%";
}

/**
 * Make the maze visible 
 */
function displayer(parent, token)
{    
    progress("display", 1, 2);
    
    setTimeout( function() 
    {
        /* make the progress indicator invisible */
        document.getElementById("progress").style.display = "none";

        /* make the newly created maze visible */
        parent.style.visibility = "visible";

        /* attach the maze to the container box */
        parent.appendChild(token);    

        /* enable the generate and solve buttons */
        document.forms.mazeform.slv.disabled = false; 
        document.forms.mazeform.bld.disabled = false;
    }, 250);
}

/**
 * A maze object, which is an 2D array of cells
 */
function maze()
{
    this.cells = new Array();
    
    /**
     * Provides a level of indirection to the builder() method which can't
     * use a 'this' reference
     */
    this.build = function()
    {
        builderxxxx(this); 
    }
    
    /**
     * Kicks of the initialization iteration, then continues with the generator()
     */
    function builderxxxx(maze)
    { 
        iter( function(column) { return rowInitializer(maze, column) }, columns, 
                    function() { builder(maze) },
                    function(i, n) { progress("initializing", i, n) });     
    }

    /**
     * Initializes the maze one row at a time
     */
    function rowInitializer(maze, x)
    {
        maze.cells[x] = new Array(columns);

        for(y = 0; y < rows; y++)
        {
            maze.cells[x][y] = createToken(x, y);
        }
        
        return x + 1;
    }
    
    /**
     * Create an HTML element that represents an individual cell
     */
    function createToken(x, y)
    {
        var div = document.createElement("div");
		
		div.alive = false;
		div.next = false;
    
        var classes = "cell";
    
        if(x == 0)
        {
            classes = classes + " left";
        }
    
        if(y == 0)
        {
            classes = classes +  " top";
        }
    
        div.setAttribute("class", classes);
		
		div.state = function(state)
		{
			this.alive = state;
			this.style.backgroundPosition = state ? "1px 1px" : "-12px -12px";			
		}
		
		div.onmouseover = function() 
		{
			if(document.body.tracking)
			{
				this.state(!this.alive);
			}
		}
		
		div.onmousedown = function()
		{
			this.state(!this.alive);
		}
    
        return div;
    }
}

/**
 * A generalized continuation mechanism for javascript
 *
 * Calls a function f(i) until it returns a result that indicates processing is complete.  The
 * value "state" passed to f() is the result of the previous call to f().  Every "max" iterations,
 * processing is yielded to allow responsiveness.
 * 
 * f    - a function that takes a state parameter and returns an updated state
 * done - the final state that indicates that iteration is complete
 * fc   - an optional continuation function that is called when processing is complete
 * fp   - an optional callback function used to indicate progress though the iteration
 */
function iter(f, done, fc, fp)
{
    var max   = 50; // a reasonable number
    var count = 0;    

    /* define the loop function that will manage the calls to f() */
    var loop = function (state)
    {
        while((state = f(state)) != done)
        {   
            if (count < max) 
            {
                count++;
            } 
            else 
            {
                count = 0;
                setTimeout(function() { loop(state) }, 0);
                break;
            }
        }
        
        if(fp)
        {
            fp(state, done);
        }
          
        if(fc && (state == done)) 
        {
            setTimeout(function() { fc() }, 0);
        }
    }
    
    /* call the loop function with the initial state */
    loop(0);
}

/**
 ** Make sure all the scripts have loaded before turning on the generate button
 */
window.onload = function()
{
    document.forms.mazeform.bld.disabled = false;   
	
	build();
}

/**
 * Creates the maze and renders it on the page.
 */
function build()
{
    columns = Number(document.forms.mazeform.x.value);
    rows    = Number(document.forms.mazeform.y.value);
    
    generation = 0;
	document.getElementById("gennum").innerHTML = generation;
	
    dom(rows, columns);
}

/**
 *
 */
function dom(nrows, ncolumns)
{
    rows     = nrows;
    columns  = ncolumns;
	size     = 9;
    
    /* disable the Generate and Solve buttons until it's generated */
    document.forms.mazeform.slv.disabled = true;
    document.forms.mazeform.stp.disabled = true;
    document.forms.mazeform.bld.disabled = true;
    document.forms.mazeform.clr.disabled = false;
    
    /* get the HTML element for the container to hold the maze */
    /* and delete the old one if any */
    box   = document.getElementById("box");
    omaze = document.getElementById("maze");
    if(omaze != null)
    {
        box.removeChild(omaze);
    }
	
	document.body.onmousedown = function() 
	{ 
		document.body.tracking = true; 
	}
	document.body.onmouseup = function() 
	{ 
		document.body.tracking = false; 
	}
      
    /* restore the label styles */  
    var elem = document.getElementsByTagName("span");
    for(i = 0; i < elem.length; i++) 
    {
        if(elem[i].getAttribute("name") == "label") 
        {
            elem[i].style.color = "#ccc";
        }
    }
    
    /* make progress indicator visible */
    document.getElementById("progress").style.display = "block";

    /* set the width of the box based on the size of the maze */
    box.style.width = ((columns * size) + 2) + "px";
    
    /* the style of the CSS class ".cell" needs to be updated dynamically
       which has some browser-specific quirks */
    var style = document.styleSheets[2];
    var rules = style.cssRules;
    
    /* IE doesn't understand the cssRules property */
    if(rules != undefined)
    {   
        ie = false;
    }
    else
    {
        ie = true;
    }
    
    /* create maze object */
    instance = new maze();
    
    /* render and display */
    instance.build();
    
    /* tell the form not to actually submit anything */
    return false;
}


/* indicates that the solver should be stopped */
var stop;

function solve()
{
    /* initialize the flag */
    stop = false;
    
    /* Add a new breadcrumb every zillisecond */
    setTimeout(function() { solver(instance) }, 0);
    
    /* Disable the form button again */
    document.forms.mazeform.slv.disabled = true;
    document.forms.mazeform.stp.disabled = false;
}

/**
 * Indicate we want to stop
 */
function susp()
{
    stop = true;
	
    document.forms.mazeform.slv.disabled = false;
    document.forms.mazeform.stp.disabled = true;
}

function cler()
{
	susp();
	
    for(x = 0; x < columns; x++)
	{
	    for(y = 0; y < rows; y++)
		{
			if(instance.cells[x][y].alive)
			{
				instance.cells[x][y].state(false);
			}
		}
    }  	
	
    generation = 0;
	document.getElementById("gennum").innerHTML = generation;
}

/**
 * Main algorithm to solve the maze
 */
function solver(maze)
{
    if(stop)
    {
        return;    
    }
    
    var x;
    var y;
	var changed = [];
    
    // calculate next state
    for(x = 0; x < columns; x++)
	{
	    for(y = 0; y < rows; y++)
		{
			var cell = maze.cells[x][y];
			var count = liveNeighbors(maze, x, y);
			if(cell.alive)
			{
				cell.next = (count == 2 || count == 3); // live cells die if less than 2 or more than 3 live neighbors
			}
			else
			{
				cell.next = (count == 3); // dead cells become alive if there are 3 live neighbors
			}
			
			if(cell.alive != cell.next)
			{
				changed.push(cell);
			}
		}
    }  
	
	for(var i = 0; i < changed.length; i++)
	{
		changed[i].state(!changed[i].alive);
	}
	
	generation++;
	document.getElementById("gennum").innerHTML = generation;
	
    if(! stop)
    {
        setTimeout(function () { solver(maze) }, 50);
    }
}

function liveNeighbors(maze, x, y)
{
	var live = 0;
	var dx, dy, nx, ny;
	
	for(dx = (x - 1); dx <= (x + 1); dx++)
	{
		for(dy = (y - 1); dy <= (y + 1); dy++)
		{
			nx = (dx < 0) ? columns - 1 : dx;
			ny = (dy < 0) ? rows - 1: dy;
			nx = (dx > (columns - 1)) ? 0 : nx;
			ny = (dy > (rows - 1)) ? 0 : ny;
			
			if(nx != x || ny != y)
			{
				if(maze.cells[nx][ny].alive)
				{
					live++;
				}
			}
		}
	}
	
	return live;
}