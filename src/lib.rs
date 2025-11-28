use rand::Rng;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn generate_pixel(x: u32, y: u32) -> Point {
    // let r = rand::thread_rng().gen_range(0, 255) as u8;
    // let g = rand::thread_rng().gen_range(0, 255) as u8;
    // let b = rand::thread_rng().gen_range(0, 255) as u8;

    let r = 255;
    let g = 0;
    let b = 0;

    Point {
        x,
        y,
        color: Color { r, g, b },
    }
}

#[derive(Debug)]
#[wasm_bindgen]
pub struct Point {
    pub x: u32,
    pub y: u32,
    pub color: Color,
}

#[derive(Debug, Clone, Copy)]
#[wasm_bindgen]
pub struct Color {
    pub r: u8,
    pub g: u8,
    pub b: u8,
}
