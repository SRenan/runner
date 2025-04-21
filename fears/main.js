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
    scene: [PreloadScene, MainMenuScene, GameScene, GameOverScene, SettingsScene]
};

var player;
var player_config = {
	player_name: 'player',
	sprite_key: 'plane10'
};

var main_variable = {
    count: 0,
    score: 100
}

var game = new Phaser.Game(config);
