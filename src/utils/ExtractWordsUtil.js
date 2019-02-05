const addWord = (words, word) => {
    if (word) words.push(word)
}

export const getAllWordsInContent = content => {
    let used = {
        // Always include html and body.
        html: true,
        body: true
    }
    var words = content.split(/[^a-zA-Z0-9_-]/g);
    var contentWithoutSpaces =  content.replace(/\s/g, "");
    if((contentWithoutSpaces.includes('.join')) || (contentWithoutSpaces.includes('"+"')) ||(contentWithoutSpaces.includes("'+'")) ){
        words =[];
        var arrayOfLines = content.match(/[^\r\n]+/g);
        for(var i = 0; i<arrayOfLines.length;i++){
            words.push(eval(arrayOfLines[i]));
        }
    }
    for (let word of words) {
        used[word] = true
    }
    return used
}

export const getAllWordsInSelector = selector => {
    // Remove attr selectors. "a[href...]"" will become "a".
    selector = selector.replace(/\[(.+?)\]/g, "").toLowerCase()
    // If complex attr selector (has a bracket in it) just leave
    // the selector in. ¯\_(ツ)_/¯
    if (selector.includes("[") || selector.includes("]")) {
        return []
    }
    let skipNextWord = false,
        word = "",
        words = []

    for (let letter of selector) {
        if (skipNextWord && !(/[ #.]/).test(letter)) continue
        // If pseudoclass or universal selector, skip the next word
        if (/[:*]/.test(letter)) {
            addWord(words, word)
            word = ""
            skipNextWord = true
            continue
        }
        if (/[a-zA-Z0-9\_\-]/.test(letter)) {
            word += letter
        } else {
            addWord(words, word)
            word = ""
            skipNextWord = false
        }
    }

    addWord(words, word)
    return words
}
