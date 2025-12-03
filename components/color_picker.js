export default function createColorPicker(value, changeListener){
    const container = document.createElement('div');
    container.style = "display: flex; flex-direction: row; justify-content: flex-start;  width: 100%;  padding: 2px; align-items: center; border: 2px, solid, black; border-radius: 4px; box-sizing: border-box;"
    const input = document.createElement('input');
    input.setAttribute('type', 'color');
    input.setAttribute('value', value);
    input.setAttribute('id', 'background_color');
    input.addEventListener("change", changeListener);
    container.appendChild(input);

    const label = document.createElement('label');
    label.setAttribute("for", "background_color");
    label.innerHTML = "background color";
    label.style = "margin-left: 8px;"
    container.appendChild(label);

    return container;
}


/*
<div>
  <input type="color" id="foreground" name="foreground" value="#e66465" />
  <label for="foreground">Foreground color</label>
</div>
*/
