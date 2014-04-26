
  'use strict';
  var Bird = require('../prefabs/bird');
  var Ground = require('../prefabs/ground');
  var PipeGroup = require('../prefabs/pipeGroup');
  function Play() {}
  Play.prototype = {
    create: function() {
      // this.game.physics.startSystem(Phaser.Physics.ARCADE);
      // this.sprite = this.game.add.sprite(this.game.width/2, this.game.height/2, 'yeoman');
      // this.sprite.inputEnabled = true;
      
      // this.game.physics.arcade.enable(this.sprite);
      // this.sprite.body.collideWorldBounds = true;
      // this.sprite.body.bounce.setTo(1,1);
      // this.sprite.body.velocity.x = this.game.rnd.integerInRange(-500,500);
      // this.sprite.body.velocity.y = this.game.rnd.integerInRange(-500,500);

      // this.sprite.events.onInputDown.add(this.clickListener, this);

      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.game.physics.arcade.gravity.y = 1200;

      this.background = this.game.add.sprite(0,0,'background');

      this.bird = new Bird(this.game, 100, this.game.height/2);
      this.game.add.existing(this.bird);

      this.pipes = this.game.add.group();

      this.ground = new Ground(this.game,0,400,335,112);
      this.game.add.existing(this.ground);

      this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

      var flapKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

      flapKey.onDown.add(this.bird.flap, this.bird);

      this.input.onDown.add(this.bird.flap, this.bird);

      this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 2.5, this.generatePipes, this);
      this.pipeGenerator.timer.start();
    },
    update: function() {
      this.game.physics.arcade.collide(this.bird, this.ground);
    },
    generatePipes: function(){
      var pipeY = this.game.rnd.integerInRange(-100,100);
      var pipeGroup = this.pipes.getFirstExists(false);
      if (!pipeGroup){
        pipeGroup = new PipeGroup(this.game, this.pipes);
      }
      pipeGroup.x = this.game.width;
      pipeGroup.y = pipeY;
      //pipeGroup.reset(this.game.width + pipeGroup.width/2, pipeY);
    }
    // clickListener: function() {
    //   this.game.state.start('gameover');
    // }
  };
  
  module.exports = Play;