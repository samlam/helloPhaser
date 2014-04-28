'use strict';

var Bird = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'bird', frame);

  // initialize your prefab here
  this.anchor.setTo(0.5, 0.5);

  this.animations.add('flap');
  this.animations.play('flap', 12, true);

  this.alive = false;

  this.game.physics.arcade.enableBody(this);
  this.body.allowGravity = false;

  this.flapSound = this.game.add.audio('flap');

  this.events.onKilled.add(this.onKilled, this);
};

Bird.prototype = Object.create(Phaser.Sprite.prototype);
Bird.prototype.constructor = Bird;

Bird.prototype.update = function() {
  
  // write your prefab's specific update code here
  if (this.angle < 90 && this.alive){
  	this.angle += 2.5;
  }
};

Bird.prototype.flap = function(){
	this.flapSound.play();

	this.body.velocity.y = -400;

	this.game.add.tween(this).to({angle:-40}, 100).start();
};

Bird.prototype.onKilled = function(){
	this.exists = true;
	this.visible = true;
	this.animations.stop();

	var duration = 90 / this.y * 300;
	this.game.add.tween(this).to({angle:90}, duration).start();
	console.log('killed');
	console.log('alive:', this.alive);
};

module.exports = Bird;
