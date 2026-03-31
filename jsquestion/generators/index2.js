function* startGame() {
    const answer = yield 'Do you love JavaScript?';
    if (answer !== 'Yes') {
        return "Oh wow... Guess we're done here";
    }
    return 'JavaScript loves you back ❤️';
}

const game = startGame();


console.log(game.next().value); // JavaScript loves you back ❤️
game.next("Yes")
console.log(game.next().value); // JavaScript loves you back ❤️

/*


A: game.next("Yes").value and game.next().value
B: game.next.value("Yes") and game.next.value()
C: game.next().value and game.next("Yes").value
D: game.next.value() and game.next.value("Yes")

*/
