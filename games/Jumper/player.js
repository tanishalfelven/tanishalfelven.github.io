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
		//prompt("Submite new High-Score?");
	}
	score = 0;
	this.x = this.spawnX;
	this.y = this.spawnY;
	this.velX = 0;
	this.velY = 0;
}
Player.prototype.draw = function(){
	ctx.fillStyle = "#00654f";
	ctx.fillRect(this.x, this.y, this.size, this.size);
};