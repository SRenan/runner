/* -------------- Basic endless runner -------------
Character is fixed
Obstacles have negative velocity
--------------------------------------------------*/
class PreloadScene extends Phaser.Scene{
    //Preload everything then automatically transition to the MainMenuScene
    constructor(){
        super('PreloadScene');
    }
    preload(){
        this.load.image('sky', 'assets/sky.png');
        this.load.image("sky2", "assets/sky2.png");
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude',
            'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
        this.load.spritesheet('dude_red',
            'assets/dude_red.png',
            { frameWidth: 32, frameHeight: 48 }
        );
        this.load.image('dude1', 'assets/star.png');
        this.load.image('dude2', 'assets/bomb.png');
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
      const goTo2 = this.add.text(100, 100, 'Run', { fill: '#2e2d8c', backgroundColor: '#fcfdff', padding: {x:10, y:10}});
      goTo2.setInteractive();
      goTo2.on('pointerdown', () => {
        this.scene.start('RunScene');
      });
      const goToGarage = this.add.text(100, 200, 'Garage', { fill: '#2e2d8c', backgroundColor: '#fcfdff', padding: {x:10, y:10}});
      goToGarage.setInteractive();
      goToGarage.on('pointerdown', () => {
        this.scene.start('GarageScene');
      });
    }
    update(){
    }
}

class HUDScene extends Phaser.Scene{
    constructor(){
        super('HUDScene');
    }
    create(){
        const goToMenu = this.add.text(0, 40, 'HUD to Menu', { fill: '#2e2d8c' });
        goToMenu.setInteractive();
        goToMenu.on('pointerdown', () => {
          this.scene.stop('HUDScene');
          this.scene.stop('RunScene');
          this.scene.start('MainMenuScene');
        });
    }
}

class SettingsScene extends Phaser.Scene{
    constructor(){
        super('SettingsScene');
    }
    create(){
        const volumeSlider = this.rexUI.add.slider({
        });
    }
}

class RunScene extends Phaser.Scene{
    constructor(){
        super('RunScene');
        this.timer = 0;
    }
    preload(){}
    create(){
        this.add.image(400, 300, 'sky');

        //Parallax
        this.background = this.add.tileSprite(0, 0, config.width, 256, "sky2")
            .setOrigin(0)
            .setScrollFactor(0, 1); //this line keeps your background from scrolling outside of camera bounds
        //"this" required for every variable in the class
        this.ground = this.physics.add.staticGroup();
        this.ground.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms = this.physics.add.group({immovable: true, allowGravity: false});

        this.player = this.physics.add.sprite(100, 450, player_config.sprite_key);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers(player_config.sprite_key, { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [ { key: player_config.sprite_key, frame: 4 } ],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers(player_config.sprite_key, { start: 5, end: 8 }),
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
            child.setVelocityX(-100);
        });

        this.bombs = this.physics.add.group();
        this.bomb = this.bombs.create(100, 16, 'bomb');
        this.bomb.setBounce(1);
        this.bomb.setCollideWorldBounds(true);
        this.bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

        /*-------------------- colliders --------------------*/
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.stars,  this.ground);
        this.physics.add.collider(this.bombs,  this.ground);
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars,  this.platforms);
        this.physics.add.collider(this.bombs,  this.platforms);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        /*--------------- controls and cameras --------------*/
        this.cursors = this.input.keyboard.createCursorKeys();
        //this.cameras.main.startFollow(this.player);
        //this.cameras.main.followOffset.x = -300;
        //this.cameras.main.followOffset.y = 200;
        //this.cameras.main.setLerp(1,0.001);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        /*-------------------- Interface ----- --------------*/
        const goToMenu = this.add.text(0, 0, 'Go to Menu', { fill: '#2e2d8c' });
        goToMenu.setInteractive();
        goToMenu.on('pointerdown', () => {
          this.scene.start('MainMenuScene');
        });
        this.scene.launch('HUDScene');

        this.coins = []; //Create them as an array and add/rm members
        this.money = this.registry.get("money");
        this.moneyText = this.add.text(16, 16, '$$: '+this.money, { fontSize: '32px', fill: '#000' });
        this.testText = this.add.text(400, 300, 'TEXT', { fontSize: '32px', fill: '#000' });
        this.moneyText.setScrollFactor(0);

        this.paused = false;
    }
    update(time, delta){
        this.player.anims.play('right', true);
        //this.background.setTilePosition(100);
        this.background.tilePositionX += 1;

        /*-------------------- Controls --------------------*/
        if (this.cursors.up.isDown && this.player.body.touching.down){
            this.player.setVelocityY(-330);
        }
        if (this.keyESC.isDown){
           //TODO: THis is messy. Should probably make a GameMenuScene that handles resuming.
            this.paused = !this.paused;
              console.log(this.paused);
            if(!this.paused){
              this.scene.pause("RunScene");
              this.scene.launch("PauseScene");
            } else{
              this.scene.resume("RunScene");
            }
        }
        
        /*-------------------- Timers --------------------*/
        this.timer += delta;
        if(this.timer >= 3000){
            this.createBomb();
            this.createPlatform();
            this.timer = 0;
        }
    }
    createBomb(){
        const bomb = this.bombs.create(600, 300, 'bomb');
        bomb.setVelocityX(-100);
    }
    createPlatform(){
        const randY = Phaser.Math.Between(20, 50)*10;
        const platform = this.platforms.create(1000, randY, 'ground');
        platform.setVelocityX(-100);
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
        this.scene.stop('HUDScene');
        this.time.delayedCall(2000, () => this.scene.start('GameOverScene')); //After 2s, go to GameOver screen
        localStorage.setItem('money', this.money);
    }
}

class GarageScene extends Phaser.Scene{
    constructor(){
        super('GarageScene');
    }
    create(){
        const goToMenu = this.add.text(600, 0, 'Go to Menu', { fill: '#2e2d8c' });
        goToMenu.setInteractive();
        goToMenu.on('pointerdown', () => {
          this.scene.start('MainMenuScene');
        });
        this.money = this.registry.get("money");
        this.moneyText = this.add.text(16, 16, '$$: '+this.money, { fontSize: '32px', fill: '#000' });

        /*---------------------- Choose runner ---------------*/
        // Display a dynamic list of available outfits.
        // Display a list of outfits that can be bought.
        // Display currently selected.
        this.player = this.physics.add.sprite(100, 450, player_config.sprite_key);
        this.player.setCollideWorldBounds(true);

        const setSkin1 = this.add.text(400, 100, 'Skin1', { fill: '#2e2d8c' });
        setSkin1.setInteractive();
        setSkin1.on('pointerdown', () => {
          player_config.sprite_key = 'dude'
          this.player.setTexture(player_config.sprite_key);
        });
        const setSkin2 = this.add.text(400, 200, 'Skin2', { fill: '#2e2d8c' });
        setSkin2.setInteractive();
        setSkin2.on('pointerdown', () => {
          player_config.sprite_key = 'dude_red'
          this.player.setTexture(player_config.sprite_key);
        });
        
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
        const goToMenu = this.add.text(0, 0, 'Go to Menu', { fill: '#2e2d8c' });
        goToMenu.setInteractive();
        goToMenu.on('pointerdown', () => {
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
    settings: {
      volume: 1
    },
    scene: [PreloadScene, MainMenuScene, SettingsScene, HUDScene, RunScene, GarageScene, GameOverScene]
};

var player_config = {
    player_name: 'player',
    sprite_key: 'dude'
};

var game = new Phaser.Game(config);
