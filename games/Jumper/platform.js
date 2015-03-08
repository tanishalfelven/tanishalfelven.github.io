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