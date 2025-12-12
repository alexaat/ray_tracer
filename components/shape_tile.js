export default function getShapeTile(id, title, isSelected, deleteListener){
    const container = document.createElement('div');

    const background = isSelected ? 'yellow' : 'red'; 
    
    container.style = `
        min-width: 100px;
        border: 2px, solid, black;
        border-radius: 4px;
        padding: 2px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        box-sizing: border-box;
        `;
    container.style.backgroundColor = background;
    container.classList.add("pointer");


    const titleElement = document.createElement('div');
    if(title){
        titleElement.innerHTML = title;
    }
    container.appendChild(titleElement);
    
    const deleteElement = document.createElement('div');
    deleteElement.classList.add('shape-delete-button');
    deleteElement.style = `
        background-image: url("./assets/images/trash.svg");
        height: 20px;
        width: 15px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        `;
    deleteElement.addEventListener("click", () => {
        deleteListener(id);
    });

    container.appendChild(deleteElement);
    
    return container;
}