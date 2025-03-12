
function mostUsedWord(text, bannedWords = []) {
    if (typeof text !== 'string' || text.trim() === '') {
        throw new TypeError('invalid input')
    }
    // write your code below
    const obj = {

    }
    const arr = text.replaceAll(".", '').replaceAll(',', '').split(' ').map((m) => m.toLowerCase());

    for (const element of arr) {
        if (obj[element]) {
            obj[element] = obj[element] + 1
        } else {
            obj[element] = 1
        }
    }
    if (bannedWords.length > 0) {
        for (const element of bannedWords) {
            if (obj[element]) {
                obj[element] = 0
            }
        }
    }
    let max = 0, tKey = null
    for (const [key, value] of Object.entries(obj)) {
        if (max <= value) {
            max = value
            tKey = key
        }
    }
    return tKey
}


// answer => ball

const text = 'Bob hit a ball, the hit ball flew far after it was hit.';
const bannedWords = ['hit'];

const answer = mostUsedWord(text, bannedWords);
// answer => ball
