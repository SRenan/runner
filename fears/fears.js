class PreloadScene extends Phaser.Scene{
    //Preload everything then automatically transition to the MainMenuScene
    constructor(){
        super('PreloadScene');
    }
    preload(){
        //this.load Images, Sprites, Sounds, 
        this.load.audio('testBeep', 'assets/sounds/beep.ogg');
        this.load.image('plane10', 'fears/assets/Ships/ship_0010.png');
        this.load.image('hangar', 'fears/assets/hangar600.jpg');
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
        const goTo2 = this.add.text(config.width/2, 100, 'Fly', { fill: '#2e2d8c', backgroundColor: '#fcfdff', padding: {x:10, y:10}}).setOrigin(0.5, 0.5);;
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

class SettingsScene extends Phaser.Scene{
    constructor(){
        super('SettingsScene');
    }   
    preload(){
        this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
    }   
    create(){
      this.bg = this.add.image(400, 300, 'hangar');

      const BACK_BUTTON = this.add.text(game.config.width/2, 150, 'Back', { fill: '#2e2d8c', backgroundColor: '#fcfdff', padding: {x:10, y:10}}).setOrigin(0.5, 0.5);
      BACK_BUTTON.setInteractive()
      BACK_BUTTON.on('pointerdown', () => {
        console.log(currentScene);
        this.scene.stop();
        this.scene.resume(currentScene);
      }); 
      /*----------- Volume ---------------*/
        this.volumeTestSound = this.sound.add('testBeep'); 

        
        const COLOR_PRIMARY = 0x4e342e;
        const COLOR_LIGHT = 0x7b5e57;
        const COLOR_DARK = 0x260e04;

        this.volumeText = this.add.text(400, 200, 'Volume: '+config.settings.volume*100, { fill: '#2e2d8c' }); 
        var volumeSlider = this.rexUI.add.slider({
          x: 200,
          y: 200,
          width: 200,
          height: 20, 
          value: config.settings.volume,
          track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 6, COLOR_DARK),
          thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_LIGHT),
          valuechangeCallback: (value) => {
              config.settings.volume = value;
              this.volumeTestSound.play({volume: config.settings.volume});
          },  
          gap: 0.05,
          space: { top: 4, bottom: 4 },
          input: 'drag', // 'drag'|'click'
        }).layout();
    }   
    update(){
        this.volumeText.setText('Volume: ' + Phaser.Math.RoundTo(config.settings.volume*100, 0));
    }   
}

class GameScene extends Phaser.Scene{
    constructor(){
        super('GameScene');
    }
    preload(){}
    create(){
        currentScene = this.scene.key;
        player = this.physics.add.sprite(250, 550, player_config.sprite_key);
		player.setCollideWorldBounds(true);
        // Settings
        const goToSettings = this.add.text(game.config.width-100, game.config.height-150, 'Settings', { fill: '#2e2d8c', backgroundColor: '#fcfdff', padding: {x:10, y:10}}).setOrigin(0.5, 0.5);
        goToSettings.setInteractive();
        goToSettings.on('pointerdown', () => {
          this.scene.pause(); 
         this.scene.launch('SettingsScene'); 
        });
    }
    update(){
        // Controls
		if (this.input.keyboard.createCursorKeys().left.isDown) {
			player.x -= 5;
		}
		if (this.input.keyboard.createCursorKeys().right.isDown) {
			player.x += 5;
		}
    }
}

class GameOverScene extends Phaser.Scene{
    //Summary of game and return to MainMenuScene
    constructor(){
        super('GameOverScene');
    }
    create(){
        currentScene = this.scene.key;
        const goTo1 = this.add.text(0, 0, 'Go to Menu', { fill: '#2e2d8c' });
        goTo1.setInteractive();
        goTo1.on('pointerdown', () => {
          this.scene.start('MainMenuScene');
        });
    }
}
