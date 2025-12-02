use wasm_bindgen::prelude::*;
use rand::Rng;
use crate::constants::*;
mod constants;
mod sphere;
mod material;
mod vector3;
mod color;
mod grapics;
mod point;
mod camera;

#[wasm_bindgen]
pub fn generate_pixel(x: u32, y: u32) -> ColorRGB {
 
    let r =  rand::rng().random_range(0..255) as u8;  
    let g =  rand::rng().random_range(0..255) as u8;  
    let b =  rand::rng().random_range(0..255) as u8;  

    ColorRGB::new(r, g, b)

    // Point {
    //     x,
    //     y,
    //     color: Color { r, g, b }
    // }   
}

// #[wasm_bindgen]
// pub fn get_image_dimensions() -> Dimen{
//     Dimen { width: IMAGE_WIDTH, height: IMAGE_HEIGHT }
// }

#[wasm_bindgen]
pub fn get_shapes_titles() -> Vec<String>{
    SHAPES.map(|item| {item.to_string()}).to_vec()   
}

// #[derive(Debug)]
// #[wasm_bindgen]
// pub struct Point {
//     pub x: u32,
//     pub y: u32,
//     pub color: Color,
// }

#[derive(Debug, Clone, Copy)]
#[wasm_bindgen]
pub struct ColorRGB {
    pub r: u8,
    pub g: u8,
    pub b: u8,
}
impl ColorRGB{
    fn new(r: u8, g: u8, b: u8) -> ColorRGB{
        ColorRGB { r, g, b }
    }
}


#[derive(Debug, Clone, Copy)]
#[wasm_bindgen]
pub struct Dimen{
    pub width: u32,
    pub height: u32
}


pub fn add(x: i32, y: i32) -> i32{
    x + y
}