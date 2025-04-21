class PreloadScene extends Phaser.Scene{
    //Preload everything then automatically transition to the MainMenuScene
    constructor(){
        super('PreloadScene');
    }
    preload(){
        this.load.setBaseURL('assets/');
        this.load.audio('testBeep', 'sounds/beep.ogg');

        this.load.image('sky', 'sky.png');
        this.load.image('sky2', 'sky2.png');
        this.load.image('ground', 'platform.png');
        this.load.image('star', 'star.png');
        this.load.image('ball', 'ball.png');
        this.load.image('bomb', 'bomb.png');
        this.load.image('brick', 'brick.png');
        this.load.image('paddle', 'paddle.png');

        this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');

    }
    create(){
    }
    update(){
        this.scene.transition({
            target: 'MainMenuScene'
        });
    }
}
class MainMenuScene extends Phaser.Scene{
    constructor(){
        super('MainMenuScene');
    }
    preload(){}
    create(){
      currentScene = this.scene.key;
      const goTo2 = this.add.text(config.width/2, 100, 'Break', { fill: '#2e2d8c', backgroundColor: '#fcfdff', padding: {x:10, y:10}}).setOrigin(0.5, 0.5);;
      goTo2.setInteractive();
      goTo2.on('pointerdown', () => {
        this.scene.start('GameScene');
      });
      const goToSettings = this.add.text(game.config.width/2, 300, 'Settings', { fill: '#2e2d8c', backgroundColor: '#fcfdff', padding: {x:10, y:10}}).setOrigin(0.5, 0.5);
      goToSettings.setInteractive();
      goToSettings.on('pointerdown', () => {
        this.scene.launch('SettingsScene');
      });
      const exitbutton = this.add.text(game.config.width/2, 400, 'Exit', { fill: '#2e2d8c', backgroundColor: '#fcfdff', padding: {x:10, y:10}}).setOrigin(0.5, 0.5);
      exitbutton.setInteractive();
      exitbutton.on('pointerdown', () => {
        game.destroy(true);
      });
    }
    update(){
    }
}

class GameScene extends Phaser.Scene{
    constructor(){
        super('GameScene');
    }
    preload(){}
    create(){
        let ballAttached = true;
        let lives = 3;
        let livesText;
        let isGameOver = false;

        currentScene = this.scene.key;
        this.add.image(400, 300, 'sky');

        this.paddle = this.physics.add.sprite(400,550,"paddle");
        this.paddle.setCollideWorldBounds(true);
        this.paddle.setImmovable(true);
    
        this.ball = this.physics.add.sprite(400,520,"ball");
        this.ball.setCollideWorldBounds(true);
        this.ball.setBounce(1);
    
        this.bricks = this.physics.add.staticGroup();
        const colors = [0xff0000,0xff7105,0xffff00,0x00ff00,0x00c4fa,0xeb02c4];
    
        for(let row=0; row<colors.length;row++) {
            for(let col=0; col<8;col++) {
                const brick = this.bricks.create(100+col*80,100+row*30,"brick");
                brick.setTint(colors[row]);
            }
        }

        /*------------------ UI ------------------*/
        const goTo1 = this.add.text(0, 0, 'Go to Menu', { fill: '#2e2d8c' });
        goTo1.setInteractive();
        goTo1.on('pointerdown', () => {
          this.scene.start('MainMenuScene');
        });

        //Right panel
        const rightUIpanel = this.add.rectangle(game.config.width-50, game.config.height/2-50, 100, game.config.height-100, 0xff0123, 0.5);
        this.debugText = this.add.text(game.config.width/2, 50, 'debug', { fontSize: '16px', fill: '#000' });

        /*--------------- controls and cameras --------------*/
        this.cursors = this.input.keyboard.createCursorKeys();
    }
    update(){
        /*--------------- controls -------------*/
        this.setDebugText();
    }

    setDebugText(){
        this.debugText.setText(
        );
    }
    launchBall() {
        if(ballAttached) {
            ballAttached = false;
            ball.setVelocity(300,-300);
        }
    }
}

class GameOverScene extends Phaser.Scene{
    //Summary of game and return to MainMenuScene
    constructor(){
        super('GameOverScene');
    }
    create(){
        const goTo1 = this.add.text(0, 0, 'Go to Menu', { fill: '#2e2d8c' });
        goTo1.setInteractive();
        goTo1.on('pointerdown', () => {
          this.scene.start('MainMenuScene');
        });
    }
}
