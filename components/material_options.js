export default function createMaterialOptions(list, selected, changeListener){
    const select = document.createElement('select');
    select.style = "min-width: 100px; border: 2px, solid, black; border-radius: 4px; box-sizing: border-box;";
    for (let s of list){       
        const option = document.createElement('option');
        option.value = s;
        option.innerHTML = s;       
        if (s == selected) {            
            option.selected = true;
        }        
        select.appendChild(option);
    }
    select.addEventListener("change", (e) => changeListener(e.target.value));

    return select;
}