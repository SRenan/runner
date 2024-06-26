class PreloadScene extends Phaser.Scene{
    //Preload everything then automatically transition to the MainMenuScene
    constructor(){
        super('PreloadScene');
    }
    preload(){
        //this.load Images, Sprites, Sounds, 
    }
    create(){
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
      const goTo2 = this.add.text(100, 100, 'Run', { fill: '#2e2d8c', backgroundColor: '#fcfdff', padding: {x:10, y:10}});
      goTo2.setInteractive();
      goTo2.on('pointerdown', () => {
        this.scene.start('RunScene');
      });
    }
    update(){
    }
}
class RunScene extends Phaser.Scene{
    constructor(){
        super('RunScene');
    }
    preload(){}
    create(){
    }
    update(){
    }
}

class GameOverScene extends Phaser.Scene{
    //Summary of run and return to MainMenuScene
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
    scene: [PreloadScene, MainMenuScene, RunScene, GameOverScene]
};

var game = new Phaser.Game(config);
