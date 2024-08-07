class PreloadScene extends Phaser.Scene{
    //Preload everything then automatically transition to the MainMenuScene
    constructor(){
        super('PreloadScene');
    }
    preload(){
        //this.load Images, Sprites, Sounds, 
        this.load.audio('testBeep', 'assets/beep.ogg');
        this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');

        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('pigs_menu_bg', 'assets/pigs_menu_bg.jpeg');
        this.load.image('pigs_game_bg', 'assets/pigs_game_bg.jpeg');

        this.load.image('dice1', 'assets/diceOne.png');
        this.load.image('dice2', 'assets/diceTwo.png');
        this.load.image('dice3', 'assets/diceThree.png');
        this.load.image('dice4', 'assets/diceFour.png');
        this.load.image('dice5', 'assets/diceFive.png');
        this.load.image('dice6', 'assets/diceSix.png');
    }
    create(){
        //Check whether we have a previous run (This should likely wrapped into one big variable if there is more to save)
        this.money = parseInt(localStorage.getItem('money')) || 0
        //The registry allows passing data between scenes
        this.registry.set("money", this.money);
        this.scene.transition({
            target: 'MainMenuScene'
        });
    }
    update(){
    }
}
class MainMenuScene extends Phaser.Scene{
    constructor(){
        super('MainMenuScene');
    }
    preload(){}
    create(){
      this.bg = this.add.image(400, 300, 'pigs_menu_bg');
      const goTo2 = this.add.text(game.config.width/2, 200, 'Game', { fill: '#2e2d8c', backgroundColor: '#fcfdff', padding: {x:10, y:10}}).setOrigin(0.5, 0.5);
      goTo2.setInteractive();
      goTo2.on('pointerdown', () => {
        this.scene.start('GameScene');
      });
      const goToSettings = this.add.text(game.config.width/2, 300, 'Settings', { fill: '#2e2d8c', backgroundColor: '#fcfdff', padding: {x:10, y:10}}).setOrigin(0.5, 0.5);
      goToSettings.setInteractive();
      goToSettings.on('pointerdown', () => {
        this.scene.start('SettingsScene');
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
        this.volumeTestSound = this.sound.add('testBeep'); 

        const goToMenu = this.add.text(0, 0, 'Go to Menu', { fill: '#2e2d8c' }); 
        goToMenu.setInteractive();
        goToMenu.on('pointerdown', () => {
          this.scene.start('MainMenuScene');
        }); 
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
    preload(){
    }
    create(){
      this.bg = this.add.image(400, 300, 'pigs_game_bg');

      /*------------- Game area ---------------*/
      this.turn_count = 0;
      this.turn_total = 0;
      this.total_text = this.add.text(50, 100, 'Current total: '+this.turn_total, { fill: '#2e2d8c', backgroundColor: '#fcfdff', padding: {x:20, y:20}});

      this.main_dice = this.add.sprite(game.config.width/2, game.config.height/2, 'dice1');
      const rollButton = this.add.text(game.config.width/2, game.config.height/2+200, 'ROLL!', { fill: '#2e2d8c', backgroundColor: '#fcfdff', padding: {x:20, y:20}}).setOrigin(0.5, 0.5);
      rollButton.setInteractive();
      rollButton.on('pointerdown', () => {
         this.rollDice();
      });
      const endTurnButton = this.add.text(game.config.width/2, game.config.height/2+270, 'End turn', { fill: '#2e2d8c', backgroundColor: '#fcfdff', padding: {x:20, y:20}}).setOrigin(0.5, 0.5);
      endTurnButton.setInteractive();
      endTurnButton.on('pointerdown', () => {
         this.endTurn();
      });


      this.current_player = 0;

      /*------------- Side panel --------------*/
      const gameUIpanel = this.add.rectangle(game.config.width-100, game.config.height/2, 200, game.config.height, 0xff0000, 0.5);
      // For each player
      this.players = [];
      this.player_scores = [];
      this.player_scores_text = [];
      const nplayers = 2;
      for (var i = 0; i < nplayers; i++){
        this.player_id = i+1
        this.players.push(this.add.text(0, 0, 'Player '+this.player_id));
        this.player_scores.push(0);
        this.player_scores_text.push(this.add.text(0, 0, 'Total: '+0));
      }
      Phaser.Actions.GridAlign(this.players, {
            width: 1,
            height: nplayers,
            cellWidth: 50,
            cellHeight: 50,
            x: game.config.width-200,
            y: 80
      });
      Phaser.Actions.GridAlign(this.player_scores_text, {
            width: 1,
            height: nplayers,
            cellWidth: 50,
            cellHeight: 50,
            x: game.config.width-100,
            y: 80
      });
      this.setActivePlayer(this.current_player);
      // Player name - highlighted if it's their turn
      // Player score
      const exitButton = this.add.text(game.config.width-100, game.config.height-100, 'Exit', { fill: '#2e2d8c', backgroundColor: '#fcfdff', padding: {x:10, y:10}}).setOrigin(0.5, 0.5);
      exitButton.setInteractive();
      exitButton.on('pointerdown', () => { this.scene.start('MainMenuScene');});
      // Settings
      const goToSettings = this.add.text(game.config.width-100, game.config.height-150, 'Settings', { fill: '#2e2d8c', backgroundColor: '#fcfdff', padding: {x:10, y:10}}).setOrigin(0.5, 0.5);
      goToSettings.setInteractive();
      goToSettings.on('pointerdown', () => { this.scene.start('SettingsScene'); });
      
      /*------------- Game objects --------------*/
      this.target_score = 100;
    }
    update(){
      // Update scores
      this.total_text.setText('Current total: '+this.turn_total);
      this.player_scores_text[this.current_player].setText('Total '+this.player_scores[this.current_player]);
    }

    // Other methods
    rollDice(){
      this.dice_value = Phaser.Math.Between(1, 6);
      this.dice_key = 'dice'+this.dice_value;
      this.main_dice.setTexture(this.dice_key);
      if(this.dice_value == 1){
        this.turn_total = 0;
         this.endTurn();
      } else{
        this.turn_total += this.dice_value;
      }
      this.total_text.setText('Current total: '+this.turn_total);
    }
    setActivePlayer(player_id){
      this.players.forEach((item, index) => {this.players[index].setBackgroundColor("#C70039");});
      this.players[player_id].setBackgroundColor("#000000");
    }
    endTurn(){
      //Add turn_total to player_total
      this.player_scores[this.current_player] += this.turn_total;
      this.player_scores_text[this.current_player].setText('Total '+this.player_scores[this.current_player]);
      //Check for gameOver
      console.log(this.player_scores[this.current_player]);
      if(this.player_scores[this.current_player] >= this.target_score){
        this.gameOver(this.current_player);
      } 
      this.turn_total = 0;
      this.total_text.setText('Current total: '+0);
      //Set active player to next player
      this.current_player = (this.current_player+1) % this.players.length;
      this.setActivePlayer(this.current_player);
    }
    gameOver(player_id){
      //Maybe push a scene that is half the screen to the front
      //Congrats text + summary
      this.scene.start('GameOverScene');
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

        this.add.text(game.config.width/2, game.config.height/2-200, 'Con-gra-tu-layyyytion!').setOrigin(0.5, 0.5);
    }
}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#ADD8E6',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300},
            debug: false
        }
    },
    settings: {
      volume: .75
    },
    scene: [PreloadScene, MainMenuScene, SettingsScene, GameScene, GameOverScene]
};

var game = new Phaser.Game(config);
