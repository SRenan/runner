import PreloadScene from './PreloadScene.js';
import MainMenuScene from './MainMenuScene.js';
import GameScene from './GameScene.js';
import GameOverScene from './GameOverScene.js';

var currentScene = "PreloadScene";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#ADD8E6',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: false
        }
    },
    scene: [PreloadScene, MainMenuScene, GameScene, GameOverScene]
};

const game = new Phaser.Game(config);