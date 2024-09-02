function arrayToText(arreglo) {
    let text = '';
    arreglo.forEach(c => {        
        if(c.id == null) {
            text += ``
        } else {
            text += `${ c.id },`;
        }
    });
    text = text.slice(0, -1);
    
    return text;
}

module.exports = {
    arrayToText
}