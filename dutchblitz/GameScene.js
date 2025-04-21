import Card from './Card.js';
import Deck from './Deck.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.deck = null;
    }

    preload() {
        // Load any card assets here
    }

    create() {
        // Initialize the deck
        this.deck = new Deck();
        this.deck.shuffle();

        // Example of using the deck
        console.log('Deck initialized with ' + this.deck.remainingCards + ' cards');
        
        // Draw a few cards as an example
        for (let i = 0; i < 5; i++) {
            const card = this.deck.draw();
            if (card) {
                console.log('Drew: ' + card.toString());
                console.log('Card color: ' + card.suite.color);
            }
        }
    }

    update() {
        // Game loop code here
    }
}

export default GameScene; 