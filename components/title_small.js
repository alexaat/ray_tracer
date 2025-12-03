export default function createTitleSmall(title){
    const container = document.createElement('div');
    container.style = "width: 100%;  text-align: left; padding: 2px; font-size: 14px;";
    if (title){
        container.innerHTML = title;
    }   
    return container;
}