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

export function uuid() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

export function formatToWASM(camera, shapes){
    let materials = new Map();  
    let _shapes = [];    

    for (let shape of shapes){
        const material = shape.material;       
        const id = uuid();       
        materials.set(id, material);
        const shapeAsMap = new Map();
        shapeAsMap.set(shape.title, {...shape.properties, material: id})
        _shapes.push(Object.fromEntries(shapeAsMap));
    }
    
    const obj = {camera, materials: Object.fromEntries(materials), shapes: _shapes};

    return JSON.stringify(obj);    
}

export function random_array(min, max){
    let arr = [];  
    for(let i = min; i <=max; i++){
      arr.push(i);
    }
    return shuffle(arr);
}

export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}