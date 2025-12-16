export default function createPropertiesPlaceholder(){
    const container = document.createElement('div');
    container.style = `
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 120px;
        `;
    container.classList.add('card-static');    
    container.innerHTML = "empty";
    return container;
}