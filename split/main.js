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
    scene: [Scene1]
};

var main_variable = {
    count: 0,
    score: 100
}

var game = new Phaser.Game(config);
