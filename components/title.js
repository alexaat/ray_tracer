export default function createTitle(title){
    const container = document.createElement('div');
    container.style = "width: 100%;  text-align: center; padding: 2px; font-size: 20px; box-sizing: border-box;";
    if (title){
        container.innerHTML = title;
    }   
    return container;
}