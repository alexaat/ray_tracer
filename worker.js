import init, {render_pixel} from "./pkg/ray_tracer.js";

let ready = init();

self.onmessage = async ({data}) =>  {    
    await ready;
    const {x, y, inputWASM} = data;
    const color = render_pixel(inputWASM, x, y);
    postMessage({x, y, color});
};