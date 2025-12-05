mod constants;
mod sphere;
mod material;
mod vector3;
mod color;
mod grapics;
mod point;
mod camera;
mod shapes;
mod ray;
mod hittable;
use wasm_bindgen::prelude::*;
use rand::Rng;
use crate::constants::*;
use crate::color::*;
use crate::shapes::*;
use crate::camera::PREVIEW_CAMERA;

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

#[wasm_bindgen]
pub fn get_shapes_titles() -> Vec<String>{
    SHAPE_TITLES.map(|item| {item.to_string()}).to_vec()   
}

#[wasm_bindgen]
pub fn get_scene() -> String{

    let shapes = match SHAPES.lock(){
        Ok(shapes) => format!("{:?}", shapes),
        Err(e) => format!("error: {:?}", e)  
    };

    let preview_camera = match  PREVIEW_CAMERA.lock(){
        Ok(preview_camera) => format!("{:?}", preview_camera),
        Err(e) => format!("error: {:?}", e)
    };

    format!("preview_camera: {:?}, shapes: {}", preview_camera, shapes)
    
}

pub fn add(x: i32, y: i32) -> i32{
    x + y
}