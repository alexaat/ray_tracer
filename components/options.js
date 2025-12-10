// export default function createOptions(prompt, list, changeListener){
//     const select = document.createElement('select');
//     select.style = "min-width: 100px; border: 2px, solid, black; border-radius: 4px; box-sizing: border-box;";
//     const option = document.createElement('option');
//     option.value = prompt;
//     option.innerHTML = prompt;
//     select.appendChild(option);

//     for (let s of list){       
//         const option = document.createElement('option');
//         option.value = s;
//         option.innerHTML = s;
//         select.appendChild(option);
//     }

//     select.addEventListener("change", changeListener);

//     return select;
// }

export default function createOptions(prompt, list, show, showListener, menuClickListener){

    const container = document.createElement('div');        
    container.style = "min-width: 100px; border: 2px, solid, black; border-radius: 4px; box-sizing: border-box; padding: 2px;";
    
    const promptElement = document.createElement('div');
    promptElement.style = "width: 100%; display: flex; flex-direction: row; justify-content: space-between";
    const promptElementValueOne = document.createElement('div');
    promptElementValueOne.innerHTML = prompt;
    const promptElementValueTwo = document.createElement('div');
    promptElementValueTwo.style = "position: relative; top: -10px; z-index: 1;"
    if(show) {
        promptElementValueTwo.innerHTML = "︿";
        promptElementValueTwo.style = "position: relative; top: -6px; z-index: 1;"
    }else {
        promptElementValueTwo.innerHTML = "﹀";
        promptElementValueTwo.style = "position: relative; top: 6px; z-index: 1;"
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