export default function createOptions(prompt, list, changeListener){
    const select = document.createElement('select');
    select.style = "min-width: 100px; border: 2px, solid, black; border-radius: 4px; box-sizing: border-box;";
    const option = document.createElement('option');
    option.value = prompt;
    option.innerHTML = prompt;
    select.appendChild(option);

    for (let s of list){       
        const option = document.createElement('option');
        option.value = s;
        option.innerHTML = s;
        select.appendChild(option);
    }

    select.addEventListener("change", changeListener);

    return select;
}