class Scene1 extends Phaser.Scene{
    constructor(){
        super('Scene1');
    }
    preload(){}
    create(){
        const SAMPLE_TEXT = this.add.text(100, 100, 'This scene is not in the main file. Just make sure the scene file is \ncalled first in the HTML.', { fill: '#2e2d8c', backgroundColor: '#fcfdff', padding: {x:10, y:10}});
    }
    update(){
    }
}