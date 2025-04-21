var currentScene = "PreloadScene";

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
    scene: [PreloadScene, MainMenuScene, PreGameScene, GameScene, GameOverScene, SettingsScene]
};

var gameSettings = {
  playerCount: 2,
  aiCount: 0,
  targetScore: 100
};

var game = new Phaser.Game(config);