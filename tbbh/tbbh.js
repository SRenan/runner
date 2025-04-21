class PreloadScene extends Phaser.Scene{
    //Preload everything then automatically transition to the MainMenuScene
    constructor(){
        super('PreloadScene');
    }
    preload(){
        this.load.audio('testBeep', 'assets/sounds/beep.ogg');

        this.load.image('sky', 'assets/sky.png');
        this.load.image('sky2', "assets/sky2.png");
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('crosshair_circle', 'assets/crosshairs/circle_dot.png');
        this.load.spritesheet('dude',
            'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
        this.load.spritesheet('dude_red',
            'assets/dude_red.png',
            { frameWidth: 32, frameHeight: 48 }
        );
        this.load.image('dude1', 'assets/star.png');
        this.load.image('dude2', 'assets/bomb.png');

        this.load.spritesheet('platform_atlas',
            'assets/atlas/Tilesheet/platformPack_tilesheet.png',
            { frameWidth: 64, frameHeight: 64 }
        )

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
      const goTo2 = this.add.text(config.width/2, 100, 'Survive', { fill: '#2e2d8c', backgroundColor: '#fcfdff', padding: {x:10, y:10}}).setOrigin(0.5, 0.5);;
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
        currentScene = this.scene.key;
        this.add.image(400, 300, 'sky');
        this.player = this.physics.add.sprite(game.config.width/2, game.config.height/2, 'dude');
        this.player.setCollideWorldBounds(true);

        this.bombs = this.physics.add.group();

        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

        this.topPlayerSpeed = 200;

        /*------------------ Game state variables ------------*/
        this.gameState = "paused";
        this.currentAction = "idle";
        this.target = new Phaser.Math.Vector2();
        // mouse click listener
        this.input.on('pointerdown', (pointer) => {
            if(this.currentAction == "move"){
                const {worldX, worldY} = pointer; // Set the target position to the mouse click
                this.target.x = worldX;
                this.target.y = worldY;
                this.input.setDefaultCursor('crosshair');
                //this.currentAction = "idle";
            }
        });


        /*------------------ UI ------------------*/
        const goTo1 = this.add.text(0, 0, 'Go to Menu', { fill: '#2e2d8c' });
        goTo1.setInteractive();
        goTo1.on('pointerdown', () => {
          this.scene.start('MainMenuScene');
        });

        //Bottom action panel
        const gameUIpanel = this.add.rectangle(game.config.width/2, game.config.height-50, game.config.width, 100, 0xff0000, 0.5);
        const button1 = this.add.rectangle(50, game.config.height-50, 90, 90, 0x000000);
        const button2 = this.add.rectangle(150, game.config.height-50, 90, 90, 0x000000);
        const button3 = this.add.rectangle(game.config.width-50, game.config.height-50, 90, 90, 0x000000);

        const moveButton = this.add.text(50, game.config.height-50, 'M', { fill: '#2e2d8c', backgroundColor: '#fcfdff', padding: {x:20, y:20}}).setOrigin(0.5, 0.5);
        const cancelButton = this.add.text(150, game.config.height-50, 'X', { fill: '#2e2d8c', backgroundColor: '#fcfdff', padding: {x:20, y:20}}).setOrigin(0.5, 0.5);

        button1.setInteractive();
        button1.on('pointerdown', () => {
           this.input.setDefaultCursor('crosshair');
           this.currentAction = "move";
           
        });
        button2.setInteractive();
        button2.on('pointerdown', () => {
           this.input.setDefaultCursor('auto');
           this.currentAction = "idle";
        });
        const endTurnButton = this.add.text(game.config.width-50, game.config.height-50, 'End', { fill: '#2e2d8c', backgroundColor: '#fcfdff', padding: {x:20, y:20}}).setOrigin(0.5, 0.5);
        endTurnButton.setInteractive();
        endTurnButton.on('pointerdown', () => {
           this.endTurn();
        });

        //Right panel
        const rightUIpanel = this.add.rectangle(game.config.width-50, game.config.height/2-50, 100, game.config.height-100, 0xff0123, 0.5);
        this.debugText = this.add.text(game.config.width/2, 50, 'debug', { fontSize: '16px', fill: '#000' });

        /*--------------- controls and cameras --------------*/
        this.cursors = this.input.keyboard.createCursorKeys();
    }
    update(){
        /*--------------- controls -------------*/
        if(this.gameState == "run"){
            this.physics.moveToObject(this.player, this.target, 200);
        }
        if (this.player.body.speed > 0) {
            // Calculate it's distance to the target
            const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.target.x, this.target.y);
            // If it's close enough,
            if (d < 4) {
              // Reset it's body so it stops, hide our arrow
              this.player.body.reset(this.target.x, this.target.y);
            }
          }
        this.setDebugText();
    }

    setDebugText(){
        this.debugText.setText(
            'mode: ' + this.currentAction + '\n' +
            'target: ' + this.target.x + '|' + this.target.y
        );
    }

    prepareMove(){
        // mouse click listener
        this.input.on('pointerdown', (pointer) => {
            const {worldX, worldY} = pointer; // Set the target position to the mouse click
            this.target.x = worldX;
            this.target.y = worldY;
        });
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
