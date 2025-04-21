var currentScene = "PreloadScene";

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#ADD8E6',
    physics: {
        default: 'arcade',
        arcade: {
            //gravity: {y: 0},
            debug: false
        }
    },
    scene: [PreloadScene, MainMenuScene, GameScene, GameOverScene]
};

var game = new Phaser.Game(config);