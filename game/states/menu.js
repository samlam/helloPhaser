
'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    this.background = this.game.add.sprite(0,0,'background');
    this.ground = this.game.add.tileSprite(0,400,335,112, 'ground');
    this.ground.autoScroll(-100,0);

    this.titleGroup = this.game.add.group();

    this.title = this.game.add.sprite(0,0,'title');
    this.titleGroup.add(this.title);

    this.bird = this.game.add.sprite(190,5,'bird');
    this.titleGroup.add(this.bird);

    //this.bird.animations.add('flap'); //add all frames
    this.bird.animations.add('flap',[0,1,2]); //add specified frames
    this.bird.animations.play('flap',20,true);

    this.titleGroup.x = 30;
    this.titleGroup.y = 100;

    this.game.add.tween(this.titleGroup).to({y:115}, 750, Phaser.Easing.Linear.NONE, true, 0, 1000, true);

    this.startButton = this.game.add.button(this.game.width/2, 
    	this.game.height/2, 
    	'startButton', 
    	this.startClick, 
    	this);
    this.startButton.anchor.setTo(0.5,0.5);
  },
  startClick: function(){
  	this.game.state.start('play');
  },
  update: function() {

  }
};

module.exports = Menu;