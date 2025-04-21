class Card {
    constructor(suite, value) {
        this.suite = suite;
        this.value = value;
        this.faceUp = false;
    }

    flip() {
        this.faceUp = !this.faceUp;
    }

    toString() {
        return `${this.value} of ${this.suite}`;
    }
}

// Define the suites and their colors
Card.SUITES = {
    HEARTS: { name: 'hearts', color: 0xff0000 },    // Red
    DIAMONDS: { name: 'diamonds', color: 0xff69b4 }, // Pink
    CLUBS: { name: 'clubs', color: 0x000000 },      // Black
    SPADES: { name: 'spades', color: 0x0000ff }     // Blue
};

export default Card; 