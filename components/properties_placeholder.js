export default function createPropertiesPlaceholder(){
    const container = document.createElement('div');
    container.style = "display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100px; height: 120px; padding: 2px; box-sizing: border-box; border: 2px, solid, black; border-radius: 4px;";
    container.innerHTML = "empty";
    return container;
}