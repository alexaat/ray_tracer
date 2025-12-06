export default function createNumberInput(title, value, changeListener){
    const container = document.createElement('div');
    container.style = "display: flex; flex-direction: row; justify-content: space-between; width: 100%; border: 2px, solid, black; padding: 2px; border-radius: 4px; box-sizing: border-box;"
    
    const titleElement = document.createElement('div');
    if (title){
        titleElement.innerHTML = title;
    }
    container.appendChild(titleElement);

    const input = document.createElement('input');
    input.setAttribute('type', 'number');
    if (value){
        input.value = value;
    }
    if (changeListener) {
        input.addEventListener("change", (e) => changeListener(e.target.value));
    }
    input.style = "width: 60px";

    container.appendChild(input);

    return container;
}