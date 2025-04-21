import Card from './Card.js';

class Deck {
    constructor() {
        this.cards = [];
        this.initializeDeck();
    }

    initializeDeck() {
        // Create cards for each suite and value
        Object.values(Card.SUITES).forEach(suite => {
            for (let value = 1; value <= 10; value++) {
                this.cards.push(new Card(suite, value));
            }
        });
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    draw() {
        if (this.cards.length === 0) {
            return null;
        }
        return this.cards.pop();
    }

    reset() {
        this.cards = [];
        this.initializeDeck();
    }

    get remainingCards() {
        return this.cards.length;
    }
}

export default Deck; 