
  'use strict';
  var Bird = require('../prefabs/bird');
  var Ground = require('../prefabs/ground');
  var Pipe = require('../prefabs/pipe');
  var PipeGroup = require('../prefabs/pipeGroup');
  var Scoreboard = require('../prefabs/scoreboard');
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

      this.pipes = this.game.add.group();

      this.bird = new Bird(this.game, 100, this.game.height/2);
      this.game.add.existing(this.bird);

      this.ground = new Ground(this.game,0,400,335,112);
      this.game.add.existing(this.ground);


      this.flapKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      this.flapKey.onDown.addOnce(this.startGame, this);
      this.flapKey.onDown.add(this.bird.flap, this.bird);

      this.game.input.onDown.addOnce(this.startGame, this);
      this.game.input.onDown.add(this.bird.flap, this.bird);

      this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

      // this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.7, this.generatePipes, this);
      // this.pipeGenerator.timer.start();

      this.score = 0;
      this.scoreText = this.game.add.bitmapText(this.game.width/2,10,'flappyfont', this.score.toString(), 24);

      this.instructionGroup = this.game.add.group();
      this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 100, 'getReady'));
      this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 325, 'instructions'));
      this.instructionGroup.setAll('anchor.x', 0.5);
      this.instructionGroup.setAll('anchor.y', 0.5);

      this.pipeGenerator = null;

      this.gameover = false;

      this.scoreSound = this.game.add.audio('score');
      this.pipeHitSound = this.game.add.audio('pipeHit');
    },
    update: function() {
      this.game.physics.arcade.collide(this.bird, this.ground, this.deathHandler, null, this);

      if(!this.gameover){
        this.pipes.forEach(function(pipeGroup){
          this.checkScore(pipeGroup);
          this.game.physics.arcade.collide(this.bird, pipeGroup, this.deathHandler, null, this);
        }, this);
      }
    },
    shutdown: function(){
      this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
      this.bird.destroy();
      this.pipes.destroy();
      // this.ground.destroy();
      // this.background.destroy();
      this.scoreboard.destroy();
    },
    startGame: function(){
      if (!this.bird.alive && !this.gameover){
        this.bird.body.allowGravity = true;
        this.bird.alive = true;

        this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.25, this.generatePipes, this);
        this.pipeGenerator.timer.start();

        this.instructionGroup.destroy();
      }
    }, 
    checkScore: function(pipeGroup){
      if(pipeGroup.exists && !pipeGroup.hasScored && pipeGroup.topPipe.world.x <= this.bird.world.x){
        pipeGroup.hasScored = true;

        this.score++;
        this.scoreText.setText(this.score.toString());
        //this.scoreText.visible = true;
        this.scoreSound.play();
      }
    },
    deathHandler: function(bird, enemy){

      if (enemy instanceof Ground && !this.bird.onGround){
          enemy.groundHitSound.play();
          this.scoreboard = new Scoreboard(this.game);
          this.game.add.existing(this.scoreboard);
          this.scoreboard.show(this.score);
          this.bird.onGround = true;
        }else if (enemy instanceof Pipe){
          this.pipeHitSound.play();
        };

      if (!this.gameover){
        this.gameover = true;
        this.bird.kill();
        this.pipes.callAll('stop');
        this.pipeGenerator.timer.stop(true);
        this.ground.stopScroll();
      }
    },
    generatePipes: function(){
      var pipeY = this.game.rnd.integerInRange(-100,100);
      var pipeGroup = this.pipes.getFirstExists(false);
      if(!pipeGroup){
          pipeGroup = new PipeGroup(this.game, this.pipes);
      }

      pipeGroup.reset(this.game.width, pipeY);
    },

  };
  
  module.exports = Play;