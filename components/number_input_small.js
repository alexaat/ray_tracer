export default function createNumberInputSmall(title, value, changeListener){
    const container = document.createElement('div');
    container.style = "display: flex; flex-direction: row; justify-content: flex-start;  width: 100%;  padding: 2px;"
    
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
    input.style = "width: 36px; margin-left: 8px";

    container.appendChild(input);

    return container;
}