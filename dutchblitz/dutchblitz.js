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
        this.load.spritesheet('cards', 'Tilesheet/cardsLarge_tilemap.png', { 
            frameWidth: 42,
            frameHeight: 60,
            margin: 1,
            spacing: 5
        });


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
      const goTo2 = this.add.text(config.width/2, 100, 'Blitz', { fill: '#2e2d8c', backgroundColor: '#fcfdff', padding: {x:10, y:10}}).setOrigin(0.5, 0.5);;
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

        playcardsIds = [...Array(13).keys(), 
            ...Array.from({length: 13}, (_, i) => i + 14), 
            ...Array.from({length: 13}, (_, i) => i + 28), 
            ...Array.from({length: 13}, (_, i) => i + 42)];
        // Create players
        this.players = [];
        const playerPositions = [
            { x: game.config.width / 2, y: 50 },
            { x: game.config.width / 2, y: game.config.height - 50 }
        ];

        /*------------------ Game setup ------------------*/
        const colors = ['red', 'blue', 'yellow', 'green'];
        const numbers = Array.from({ length: 10 }, (_, i) => i + 1);
        const allcards = {};

        numbers.forEach(number => {
            colors.forEach(color => {
            const cardId = `${color}${number}`;
            allcards[cardId] = { id: cardId, color, number };
            });
        });
        // Shuffle cards
        const dpile1 = Phaser.Utils.Array.Shuffle(Object.values(allcards));
        const dpile2 = Phaser.Utils.Array.Shuffle(Object.values(allcards));

        const centerX = game.config.width / 2;
        const centerY = game.config.height / 2;
        const cardImage = this.add.image(centerX, centerY, 'cards', 14).setOrigin(0.5, 0.5);

        playerPositions.forEach((pos, index) => {
            const player = this.add.container(pos.x, pos.y);
            player.cards = [];
            for (let i = 0; i < 4; i++) {
            const card = this.add.image(i * 30, 0, 'card').setOrigin(0.5, 0.5);
            player.add(card);
            player.cards.push(card);
            }
            const drawPile = this.add.image(150, 0, 'cards', 13).setOrigin(0.5, 0.5);
            player.add(drawPile);
            player.drawPile = drawPile;
            this.players.push(player);
        });

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
