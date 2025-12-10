export default function createMaterialOptions(list, selected, show, showListener, menuClickListener){
    
    const container = document.createElement('div');        
    container.style = "min-width: 100px; border: 2px, solid, black; border-radius: 4px; box-sizing: border-box; padding-left: 2px; padding-right: 2px; padding-top: 2px;";
    container.classList.add('pointer');
    container.classList.add('material-options');

    //current material
    const currentElement = document.createElement('div');
    currentElement.style = "width: 100%; display: flex; flex-direction: row; justify-content: space-between";
    const currentElementValueOne = document.createElement('div');
    currentElementValueOne.innerHTML = selected;
    const currentElementValueTwo = document.createElement('div');
    if(show) {
        currentElementValueTwo.style = 'background-image: url("./assets/images/up.png"); height: 20px; width: 15px; background-size: cover; background-position: center; background-repeat: no-repeat;';
    }else {
        currentElementValueTwo.style = 'background-image: url("./assets/images/down.png"); height: 20px; width: 15px; background-size: cover; background-position: center; background-repeat: no-repeat;';
    }
    currentElement.appendChild(currentElementValueOne);
    currentElement.appendChild(currentElementValueTwo);
    container.appendChild(currentElement);

    const menu = document.createElement('div');    
    if(show){
        menu.style = "display: block;";
    } else {
        menu.style = "display: none;";   
    }

    const options = list.filter(material => material != selected);
    for (let option of options){
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
    
    
    // const select = document.createElement('select');
    // select.style = "min-width: 100px; border: 2px, solid, black; border-radius: 4px; box-sizing: border-box;";
    // for (let s of list){       
    //     const option = document.createElement('option');
    //     option.value = s;
    //     option.innerHTML = s;       
    //     if (s == selected) {            
    //         option.selected = true;
    //     }        
    //     select.appendChild(option);
    // }
    // select.addEventListener("change", (e) => changeListener(e.target.value));

    // return select;



}