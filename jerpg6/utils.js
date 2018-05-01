var alphabet = "aabcdeefghiijklmnoopqrstuuvwxyyz";

function randint(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

Array.prototype.selectRandom = function() {
    return this[randint(0, this.length)];
};

function random_word(min, max) {
    var word = "";
    var length = randint(min, max);
    for (var i=0; i<length; i++) {
        word += alphabet.charAt(randint(0, alphabet.length));
    }
    return word;
}