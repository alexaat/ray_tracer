import createNumberInputSmall from "./number_input_small.js";
import createTitleSmall from "./title_small.js";

// export default function createVectorInput(title, x, y, z){
//     const container = document.createElement('div');
//     container.style = "display: flex; flex-direction: column; justify-content: space-between; width: 100%; border: 2px, solid, black; padding: 2px; border-radius: 4px; box-sizing: border-box;"
//     container.appendChild(createTitleSmall(title));
//     const vector = document.createElement('div');
//     vector.style = "display: flex; flex-direction: row; justify-content: space-between;"
//     vector.appendChild(createNumberInputSmall(x.title, x.value, x.changeListener));
//     vector.appendChild(createNumberInputSmall(y.title, y.value, y.changeListener));
//     vector.appendChild(createNumberInputSmall(z.title, z.value, z.changeListener));
//     container.appendChild(vector);

//     return container;
// };  

export default function createVectorInput(title, vector, changeListener){
    const container = document.createElement('div');
    container.style = "display: flex; flex-direction: column; justify-content: space-between; width: 100%; border: 2px, solid, black; padding: 2px; border-radius: 4px; box-sizing: border-box;"
    container.appendChild(createTitleSmall(title));
    const vectorElement = document.createElement('div');
    vectorElement.style = "display: flex; flex-direction: row; justify-content: space-between;"
    vectorElement.appendChild(createNumberInputSmall("x", vector[0], (val) => changeListener([Number(val), vector[1], vector[2]])));
    vectorElement.appendChild(createNumberInputSmall("y", vector[1], (val) => changeListener([vector[0], Number(val), vector[2]])));
    vectorElement.appendChild(createNumberInputSmall("z", vector[2], (val) => changeListener([vector[0], vector[1], Number(val)])));
    container.appendChild(vectorElement);

    return container;
};  