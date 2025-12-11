export default function createOptions(prompt, list, show, showListener, menuClickListener){

    const container = document.createElement('div');        
    container.style = "min-width: 100px; border: 2px, solid, black; border-radius: 4px; box-sizing: border-box; padding-left: 2px; padding-right: 2px; padding-top: 2px;";
    
    const promptElement = document.createElement('div');
    promptElement.style = "width: 100%; display: flex; flex-direction: row; justify-content: space-between";
    const promptElementValueOne = document.createElement('div');
    promptElementValueOne.innerHTML = prompt;
    const promptElementValueTwo = document.createElement('div');
    if(show) {
        promptElementValueTwo.style = 'background-image: url("./assets/images/up.png"); height: 20px; width: 15px; background-size: cover; background-position: center; background-repeat: no-repeat;';
    }else {
        promptElementValueTwo.style = 'background-image: url("./assets/images/down.png"); height: 20px; width: 15px; background-size: cover; background-position: center; background-repeat: no-repeat;';
    }
    promptElement.appendChild(promptElementValueOne);
    promptElement.appendChild(promptElementValueTwo);
    container.appendChild(promptElement);

    container.classList.add('pointer');
  
    const menu = document.createElement('div');    
    if(show){
        menu.style = "display: block;";
    } else {
        menu.style = "display: none;";   
    }  
    
    for (let option of list){
        const menuItem = document.createElement('div');
        menuItem.innerHTML = option;
        menuItem.addEventListener("click", () => {
            menuClickListener(option);
            showListener(false);           
        });
        menuItem.classList.add('pointer');
        menu.appendChild(menuItem);
    }
    container.appendChild(menu);
  
    container.addEventListener("click", () => showListener(!show));   

    return container;
}