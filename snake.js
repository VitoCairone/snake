//var _ = require('underscore');

function Game() {
	this.body = [[0,0], [1,0], [2,0], [3,0], [4,0], [5,0], [6,0]];
	// for (var i = 7; i <= 20; i++) {
	// 	this.body.push([0, i]);
	// }
	this.across = 80;
	this.down = 30;
	this.mice = this.randomMice(20);
	this.iChange = 1;
	this.jChange = 0;
	this.score = 0;
	this.over = false;
}

Game.prototype.collidesWithWall = function() {
	var head = this.body[this.body.length - 1];
	if (head[0] < 0 || head[0] >= this.across) {
		return true;
	}
	return (head[1] < 0 || head[1] >= this.down);
}

Game.prototype.deleteMouse = function(idx) {
	this.mice = this.mice.slice(0, idx).concat(this.mice.slice(idx + 1));
}

Game.prototype.eatMouseNum = function(idx) {
	this.growSnake();
	this.score += 10;
	this.deleteMouse(idx);
	this.respawnMice();
}

//Returns a direction code (one of u, d, l, r)
Game.prototype.direction = function() {
	var head = this.body[this.body.length - 1];
	var neck = this.body[this.body.length - 2];
	if (head[0] === neck[0] - 1) {
		return 'l';
	} else if (head[1] === neck[1] + 1) {
		return 'd';
	} else if (head[1] === neck[1] - 1) {
		return 'u';
	}
	return 'r';
}

//Helper for .turn()
//Determines which direction would cause the snake to move exactly backwards
//Requests to move in this direction are ignored
Game.prototype.fullReverse = function() {
	switch (this.direction()) {
		case 'r': return 'l';
		case 'l': return 'r';
		case 'u': return 'd';
		case 'd': return 'u';
	}
}

Game.prototype.growSnake = function() {
	var tail = this.body[0];
  var iDiff = this.body[1][0] - tail[0];
	var jDiff = this.body[1][1] - tail[1];
	this.body.unshift([tail - iDiff, tail - jDiff]);
}

Game.prototype.isOver = function() {
	return (this.collidesWithWall() || this.isEatingSelf());
}

Game.prototype.isEatingSelf = function() {
	var headIndex = this.body.length - 1;
	var head = this.body[headIndex];
	for (var i = 0; i < headIndex; i++) {
		if (this.body[i][0] === head[0] && this.body[i][1] === head[1]) {
			return true;
		}
	}
	return false;
}

//Returns the index in Game.mice of the mouse or -1 if none found
Game.prototype.mouseAt = function(position) {
	for (var i = 0; i < this.mice.length; i++) {
		if (this.mice[i][0] === position[0] && this.mice[i][1] === position[1]) {
			return i;
		}
	}
	return -1;
}

Game.prototype.randomMice = function(num) {
	var mice = [];
	//console.log("Across is " + this.across);
	for (var ctr = 0; ctr < num; ctr++) {
		var i = Math.floor(Math.random() * this.across);
		var j = Math.floor(Math.random() * this.down);
		//console.log("Pushing " + i + " and " + j + " into mice array");
		mice.push([i, j]);
	}
	return mice;
}

Game.prototype.respawnMice = function() {
	if (this.mice.length === 0) {
		this.mice = this.randomMice(20);
	} else {
		//console.log("Mouse count is " + this.mice.length + " before push");
		if (Math.random() < 0.3) {
			this.mice.push(this.randomMice(1)[0]);
			if (Math.random() < 0.3) {
				this.mice.push(this.randomMice(1)[0]);
			}
		}
		//console.log("Mouse count is " + this.mice.length + " after push");
	}
}

Game.prototype.step = function() {
	var headIndex = this.body.length - 1;
	var head = this.body[headIndex];

	//Advance a step forward
	for (var i = 0; i < headIndex; i++) {
		this.body[i] = this.body[i+1];
	}
	head = [head[0] + this.iChange, head[1] + this.jChange];
	this.body[headIndex] = head;

	//Check for mice and eat them
	var mouseIdx = this.mouseAt(head);
	if (mouseIdx !== -1) {
		this.eatMouseNum(mouseIdx);
	}
}

Game.prototype.tongue = function() {
	var head = this.body[this.body.length - 1];
	var neck = this.body[this.body.length - 2];
	return [head[0] + (head[0] - neck[0]),
				  head[1] + (head[1] - neck[1])];
}


//direction code is one of 'u', 'd', 'r', 'l'
Game.prototype.turn = function(directionCode) {
	if (directionCode === this.fullReverse()) {
		return;
	}

	switch (directionCode) {
		case 'd':
			this.iChange = 0;
			this.jChange = 1;
			break;
		case 'u':
			this.iChange = 0;
			this.jChange = -1;
			break;
		case 'r':
			this.iChange = 1;
			this.jChange = 0;
			break;
		case 'l':
			this.iChange = -1;
			this.jChange = 0;
			break;
	}
}