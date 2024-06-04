class PreloadScene extends Phaser.Scene{
    //Preload everything then automatically transition to the MainMenuScene
    constructor(){
        super('PreloadScene');
    }
    preload(){
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude',
            'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }
    create(){
        //The registry allows passing data between scenes
        this.registry.set("money", 0);
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
        this.add.image(400, 300, 'sky');

        //"this" required for every variable in the class
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.bombs = this.physics.add.group();
        this.bomb = this.bombs.create(100, 16, 'bomb');
        this.bomb.setBounce(1);
        this.bomb.setCollideWorldBounds(true);
        this.bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

        /*-------------------- colliders --------------------*/
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        /*--------------- controls and cameras --------------*/
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setLerp(1,0);


        const goTo1 = this.add.text(0, 0, 'Go to Menu', { fill: '#2e2d8c' });
        goTo1.setInteractive();
        goTo1.on('pointerdown', () => {
          this.scene.start('MainMenuScene');
        });

        this.coins = []; //Create them as an array and add/rm members
        this.money = this.registry.get("money");
        this.moneyText = this.add.text(16, 16, '$$: '+this.money, { fontSize: '32px', fill: '#000' });
        this.testText = this.add.text(400, 300, 'TEXT', { fontSize: '32px', fill: '#000' });
        this.moneyText.setScrollFactor(0);
    }
    update(){
        if (this.cursors.left.isDown){
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown){
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        }
        else{
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }
        if (this.cursors.up.isDown && this.player.body.touching.down){
            this.player.setVelocityY(-330);
        }
    }
    collectStar(player, star){
        //star.disableBody(true, true);
        star.destroy()
        this.money += 1;
        this.moneyText.setText('$$: ' + this.money);
    }
    hitBomb(player, bomb){
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        this.gameOver();
    }
    gameOver(){
        this.registry.set("money", this.money);
        this.time.delayedCall(2000, () => this.scene.start('GameOverScene')); //After 2s, go to GameOver screen
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
        this.summaryText = this.add.text(200, 200, 'Good run\nYou have $'+this.registry.get("money"), { fontSize: '32px', fill: '#000' });
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
