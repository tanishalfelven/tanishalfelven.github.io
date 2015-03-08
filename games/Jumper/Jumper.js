var canvas = document.getElementById("canvas");
canvas.width = 400;
canvas.height = 400;
var ctx = canvas.getContext("2d");

var clearCanvas = function(){
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
};

var bindInput = function(){
	document.body.addEventListener("keydown", function (e) {
	    keys[e.keyCode] = true;
	});
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
	ctx.fillText(""+score, 5, 10);
};

var gameloop = function(){
	handleInput();
	render();
	update();
	setTimeout(function(){gameloop();}, 1000/30);
};

var start = function(){
	for(var i = 0; i < 15; i++)
		platforms.push(new Platform(Math.random() * canvas.width, Math.random() * canvas.height));
	player = new Player(200, 200);
	bindInput();
	
	gameloop();
};

var platforms = [];
var keys = [];
var player;
var left_key = 37,
	right_key = 39;
	space = 32;
var score = 0;
var highscore = 0;

start();