const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i));

// Player names
this.players = [];
this.letters = []; //Array to store the UI to update names
for (var i = 0; i < gameSettings.playerCount; i++){
  this.letterIndex = 0;
  this.player_id = i+1
  this.players.push(this.add.text(0, 0, 'Player '+this.player_id));
  const UP_LETTER = this.add.text(0, 0, '+', { fill: '#2e2d8c', backgroundColor: '#fcfdff', padding: {x:10, y:10}}).setOrigin(0.5, 0.5);
  UP_LETTER.setInteractive();
  UP_LETTER.on('pointerdown', () => {this.letterIndex = this.letterIndex +1;});
  const DOWN_LETTER = this.add.text(0, 0, '-', { fill: '#2e2d8c', backgroundColor: '#fcfdff', padding: {x:10, y:10}}).setOrigin(0.5, 0.5);
  DOWN_LETTER.setInteractive();

  this.letterText = this.add.text(0, 0, alphabet[this.letterIndex]).setOrigin(0.5, 0.5);
  this.letters.push(UP_LETTER);
  this.letters.push(this.letterText);
  this.letters.push(DOWN_LETTER);
}

Phaser.Actions.GridAlign(this.players, {
  width: 1,
  height: gameSettings.playerCount,
  cellWidth: 50,
  cellHeight: 50,
  x: game.config.width/2,
  y: 250
});
Phaser.Actions.GridAlign(this.letters, {
  width: 3,
  height: gameSettings.playerCount,
  cellWidth: 50,
  cellHeight: 50,
  x: game.config.width/2+100,
  y: 250
});