export function vectorToColor(vector) {
    // [190, 190, 150] -> #2f2f99
    return `#${vector[0].toString(16)}${vector[1].toString(16)}${vector[2].toString(16)}`;
}

export function colorToVector(color) {
    //#2f2f55 -> [190, 190, 98]
    color = color.slice(1);
    const colors = color.match(/.{1,2}/g);
    return [parseInt(colors[0], 16), parseInt(colors[1], 16), parseInt(colors[2], 16)];
}

export function formatToWASM(camera, shapes){
    const obj = {camera, shapes}
    return JSON.stringify(obj);    
}