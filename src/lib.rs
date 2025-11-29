use wasm_bindgen::prelude::*;
use rand::Rng;
use crate::constants::{IMAGE_HEIGHT, IMAGE_WIDTH};
mod constants;


#[wasm_bindgen]
pub fn generate_pixel(x: u32, y: u32) -> Point {
 
    let r =  rand::rng().random_range(0..255) as u8;  
    let g =  rand::rng().random_range(0..255) as u8;  
    let b =  rand::rng().random_range(0..255) as u8;  

    Point {
        x,
        y,
        color: Color { r, g, b },
    }
}

#[wasm_bindgen]
pub fn get_image_dimensions() -> Dimen{
    Dimen { width: IMAGE_WIDTH, height: IMAGE_HEIGHT }
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

#[derive(Debug, Clone, Copy)]
#[wasm_bindgen]
pub struct Dimen{
    pub width: u32,
    pub height: u32
}