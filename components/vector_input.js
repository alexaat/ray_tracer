import createNumberInputSmall from "./number_input_small.js";
import createTitleSmall from "./title_small.js";

export default function createVectorInput(title, vector, changeListener){
    const container = document.createElement('div');
    container.style = `
        display: flex;
        flex-direction: column;
        width: 100%;
        border: 1px solid black;
        padding: 2px;   
        border-radius: 4px;
        box-sizing: border-box;`;
    
    container.appendChild(createTitleSmall(title));
    const vectorElement = document.createElement('div');
    vectorElement.style = "display: flex; justify-content: space-between; flex-direction: column;"

    vectorElement.appendChild(createNumberInputSmall("x", vector[0], (val) => {
        vector = [Number(val), vector[1], vector[2]];
        changeListener(vector);
    }, {min: -1000000, max: 1000000, step: 0.5}));
    vectorElement.appendChild(createNumberInputSmall("y", vector[1], (val) => {
        vector = [vector[0], Number(val), vector[2]];
        changeListener(vector);
    }, {min: -1000000, max: 1000000, step: 0.5}));
    vectorElement.appendChild(createNumberInputSmall("z", vector[2], (val) => {
        vector = [vector[0], vector[1], Number(val)];
        changeListener(vector);
    }, {min: -1000000, max: 1000000, step: 0.5}));
    container.appendChild(vectorElement);

    return container;
};  