(function() {
var canvas = document.getElementById("canvas");
canvas.width = 400;
canvas.height = 400;
var ctx = canvas.getContext("2d");

function Platform(x, y){
	this.x = x;
	this.y = y;
	this.randomWidth();
};
Platform.prototype.height = 5;
Platform.prototype.speed = 2;
Platform.prototype.update = function(){
	this.y += this.speed;
	this.draw();
};
Platform.prototype.isOutOfBounds = function(){
	return this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height;
};	
Platform.prototype.draw = function(){
	ctx.fillStyle = "red";
	ctx.fillRect(this.x, this.y, this.width, this.height);
};
Platform.prototype.randomWidth = function(){
	this.width = Math.random()*70 + 30;
};
Platform.prototype.reset = function(){
	this.randomWidth();
	this.x = (Math.random()*canvas.width) - this.width;
	this.y = 0;
};

function Player(x, y){
	this.x = x;
	this.y = y;
	this.spawnX = x;
	this.spawnY = y;
};
//Player is square, so size and width are both 5
Player.prototype.size = 10;
Player.prototype.velX = 0;
Player.prototype.velY = 0;
Player.prototype.friction = 0.95;
Player.prototype.isJumping = false;
Player.prototype.move = function(moveDir){
	//LEFT  = -1
	//RIGHT = 1
	var speed = 3;
	if(moveDir == 1){
		if(this.velX < speed)
			this.velX++;
	}else if(moveDir == -1){
		if(this.velX > -speed)
			this.velX--;
	}
};
Player.prototype.jump = function(){
	if(this.isOnPlatform()){
		this.velY = -12;
		this.y-=1;
		this.isJumping = true;
	}
};
Player.prototype.update = function(){
	if(!this.isJumping)
		this.velX *= this.friction;
	this.x += this.velX;
	this.x = Math.max(0, Math.min(this.x, canvas.width-this.size));

	if(this.x == 0)
		this.x = canvas.width - this.size;
	else if(this.x + this.size == canvas.width)
		this.x = 0;

	if(!this.isOnPlatform())
		this.applyGravity();
	else{
		var platform = this.getPlatformBelow();
		if(platform.isMoving){
			this.x += platform.moveSpeed * platform.moveDir;
		}
	}
};
Player.prototype.getPlatformBelow = function(){
	if(this.isJumping)
		return undefined;
	var bottom = this.y + this.size;
	for(var i = 0; i < platforms.length; i++){
		if(platforms[i].y == bottom){
			if(this.x + this.size > platforms[i].x && this.x < platforms[i].x + platforms[i].width){
				return platforms[i];
			}
		}
	}
	return undefined;
};
Player.prototype.isOnPlatform = function(){
	if(this.isJumping)
		return false;
	var bottom = this.y + this.size;
	var buffer = 3;
	for(var i = 0; i < platforms.length; i++){
		if(platforms[i].y - buffer <= bottom && bottom <= platforms[i].y + buffer){
			if(this.x + this.size > platforms[i].x && this.x < platforms[i].x + platforms[i].width){
				this.y = platforms[i].y - this.size;
				return true;
			}
		}
	}
	return false;
};
Player.prototype.applyGravity = function(){
	var speed = 4.5;
	if(this.velY < speed)
		this.velY += 1 * this.friction;
	this.y += this.velY;

	if(this.velY > 0 && this.isJumping)
		this.isJumping = false;
	if(this.y > canvas.height)
		this.reset();
};
Player.prototype.isOutOfBounds = function(){
	return this.y > canvas.height;
};
Player.prototype.reset = function(){
	if(score > highscore){
		highscore = score
		askUserName();
		//prompt("Submite new High-Score?");
	}

	shiftColor();
	score = 0;
	this.x = this.spawnX;
	this.y = this.spawnY;
	this.velX = 0;
	this.velY = 0;
}
Player.prototype.draw = function(){
	ctx.fillStyle = "#00654f";
	ctx.fillRect(this.x, this.y, this.size, this.size);

	ctx.lineStyle = "black";
	ctx.strokeRect(this.x, this.y, this.size, this.size);
};

var clearCanvas = function(){
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	var grd = ctx.createLinearGradient(0,0,0,1000);
	grd.addColorStop(0,"black");
	grd.addColorStop(1, color);

	ctx.fillStyle=grd;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
};
var getRandomColor = function() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};
function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}
function rgbToHex(R,G,B) {return "#" + toHex(R)+toHex(G)+toHex(B)}
function toHex(n) {
 n = parseInt(n,10);
 if (isNaN(n)) return "00";
 n = Math.max(0,Math.min(n,255));
 return "0123456789ABCDEF".charAt((n-n%16)/16)
      + "0123456789ABCDEF".charAt(n%16);
}
function shiftColor(){
	if(!isShifting){
		isShifting = true;
		nextColor = getRandomColor();
	}
	if(color == nextColor){
		isShifting = false;
		nextColor = undefined;
		return;
	}
	var cR = hexToR(color);
	var cG = hexToG(color);
	var cB = hexToB(color);

	var nR = hexToR(nextColor);
	var nG = hexToG(nextColor);
	var nB = hexToB(nextColor);

	cR += (cR - nR > 0) ? -1 : (cR - nR == 0)? 0 : 1;
	cG += (cG - nG > 0) ? -1 : (cG - nG == 0)? 0 : 1;;
	cB += (cB - nB > 0) ? -1 : (cB - nB == 0)? 0 : 1;;

	color = rgbToHex(cR, cG, cB);

	setTimeout(shiftColor, 0);
};

var nextLetter = function(s){
    return s.replace(/([a-zA-Z])[^a-zA-Z]*$/, function(a){
        var c= a.charCodeAt(0);
        switch(c){
            case 90: return 'A';
            default: return String.fromCharCode(++c);
        }
    });
};

var lastLetter = function(s){
    return s.replace(/([a-zA-Z])[^a-zA-Z]*$/, function(a){
        var c= a.charCodeAt(0);
        switch(c){
            case 65: return 'Z';
            default: return String.fromCharCode(--c);
        }
    });
};

var bindInput = function(){	   
	document.body.addEventListener("keydown", function (e) {
	    keys[e.keyCode] = true;
        switch(e.keyCode){
            case 37: case 39: case 38:  case 40: // Arrow keys
            case 32: e.preventDefault(); break; // Space
            default: break; // do not block other keys
        }

	}, false);
	document.body.addEventListener("keyup", function (e) {
	    keys[e.keyCode] = false;
	});
}
var handleInput = function(){
	if(keys[right_key])
		player.move(1);
	else if(keys[left_key])
		player.move(-1);
	if(keys[space])
		player.jump();
};

var update = function(){
	for(var i = 0; i < platforms.length; i++){
		if(platforms[i].isOutOfBounds()){
			platforms[i].reset();
			continue;
		}
		platforms[i].update();
	}
	player.update();
	score++;
};

var render = function(){
	clearCanvas();
	for(var i = 0; i < platforms.length; i++)
		platforms[i].draw();
	player.draw();

	ctx.font = "15px Consolas";
	ctx.fillStyle = "white";
	ctx.fillText("Score: "+score, 5, 15);
};

var postScore = function(score, id){
	$.ajax({
		"url":"https://docs.google.com/forms/d/1nPc9r9_jZUaosKUq1Cn_mWaTH-WEl1OpLq01qFXHelc/formResponse",
		"data":{
			"entry.1910678939":score,
			"entry.1964420102":id
		},
		"type":"POST",
		"dataType":"xml"
	});
};

var updateScores = function(){
	$.ajax({
	    url:"https://spreadsheets.google.com/feeds/cells/1vQS6-m1MsvT0Nf71HzAXjV1fpGFDGhs1-mktEVq7TyU/2/public/basic?alt=json",
	    dataType:"jsonp",
	    success:function(data) {
	        // data.feed.entry is an array of objects that represent each cell
	        var html = "<p>";
	        for(var i = 0; i < data.feed.entry.length; i++){
	        	var content = data.feed.entry[i].content.$t;
	        	if(typeof content === "string"){
		        	if(content.match(/^[0-9]+$/)){
		        		html += "<td>";
		        		html += content;
		        		html += "</td></tr>";
		        	}else if(content.length == 3){
		        		html += "<tr><td>";
		        		html += content;
		        		html += "</td>\t";
		        	}
		        }
	        }
	        html += "</p>";
			document.getElementById("data").innerHTML = html;
	    },
	});
};

var askUserName = function(){
	clearInterval(loop);

	ctx.font = "22px Consolas";
	var text = ['A', 'A', 'A'];
	if(NAME.length > 0)
		text = NAME;
	width = ctx.measureText(text[0] + " " + text[1] +" " +text[2]).width;
	var isDrawn = true;
	var selected = 0;

	loop = setInterval(function(){
		drawInitialsScreen(text);

		if(keys[right_key])
			selected = (selected >= 2) ? selected : selected+1;
		else if(keys[left_key])
			selected = (selected <= 0) ? selected : selected-1;
		if(keys[up_key])
			text[selected] = nextLetter(text[selected]);
		if(keys[down_key])
			text[selected] = lastLetter(text[selected]);
		if(keys[enter]){
			NAME = text;
			clearInterval(loop);
			postScore(highscore, NAME.join(""));
			startGame();
		}
		if(keys[escape]){
			clearInterval(loop);
			startGame();
		}

		if(isDrawn){
			ctx.fillStyle = "white";
			ctx.fillText("_", canvas.width/2 - width/2 + width/2.5*selected, 200);
		}
		isDrawn = !isDrawn;
	}, 100);
};

var drawInitialsScreen = function(text){
	clearCanvas();
	var question = "Enter your initials:";
	var question_width = ctx.measureText(question).width;

	var skip = "Press 'ESC' to skip saving...";
	var skip_width = ctx.measureText(skip).width;

	var score = "SCORE: "+highscore;
	var score_width = ctx.measureText(score).width;

	ctx.font = "22px Consolas";
	ctx.fillStyle = "white";

	ctx.fillText(question, (canvas.width/2) - (question_width/2), 50);
	ctx.fillText(skip, (canvas.width/2) - (skip_width/2), 100);
	ctx.fillText(score, (canvas.width/2) - (score_width/2), 130);
	width = ctx.measureText(text[0] + " " + text[1] +" " +text[2]).width;
	ctx.fillText(text[0] + " " + text[1] +" " +text[2], canvas.width/2 - width/2, 200);
};

function gameloop(){
	handleInput();
	render();
	update();
};

var startGame = function(){
	loop = setInterval(gameloop, 1000 / 33);
}

function start(){
	clearCanvas();
	var start_text = "Press SPACEBAR to begin.";
	var start_text_width = 145.1484375;

	ctx.font = "22px Consolas";
	ctx.fillStyle = "white";

	ctx.fillText(start_text, (canvas.width/2) - (start_text_width), 200);

	loop = setTimeout(start, 50);
	if(keys[space]){
		clearTimeout(loop);
		startGame();
	}
}

var init = function(){
	updateScores()
	for(var i = 0; i < 15; i++)
		platforms.push(new Platform(Math.random() * canvas.width, Math.random() * canvas.height));
	player = new Player(200, 200);
	bindInput();
	start();
};

var platforms = [];
var keys = [];
var player;
var left_key = 37,
	right_key = 39;
	up_key = 38,
	down_key = 40,
	space = 32,
	enter = 13,
	escape = 27;
var score = 0;
var highscore = 0;
var loop;
var NAME = [];
var color = "pink";
var isShifting = false;
var nextColor = undefined;

init();
})();

var updateScores = function(){
	$.ajax({
	    url:"https://spreadsheets.google.com/feeds/cells/1vQS6-m1MsvT0Nf71HzAXjV1fpGFDGhs1-mktEVq7TyU/2/public/basic?alt=json",
	    dataType:"jsonp",
	    success:function(data) {
	        // data.feed.entry is an array of objects that represent each cell
	        var html = "<p>";
	        for(var i = 0; i < data.feed.entry.length; i++){
	        	var content = data.feed.entry[i].content.$t;
	        	if(typeof content === "string"){
		        	if(content.match(/^[0-9]+$/)){
		        		html += "<td>";
		        		html += content;
		        		html += "</td></tr>";
		        	}else if(content.length == 3){
		        		html += "<tr><td>";
		        		html += content;
		        		html += "</td>\t";
		        	}
		        }
	        }
	        html += "</p>";
			document.getElementById("data").innerHTML = html;
	    },
	});
};