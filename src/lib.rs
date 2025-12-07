mod camera;
mod color;
mod constants;
mod grapics;
mod hittable;
mod material;
mod point;
mod ray;
mod shapes;
mod sphere;
mod vector3;
use crate::camera::PREVIEW_CAMERA;
use crate::color::*;
use crate::constants::*;
use crate::shapes::*;
use rand::Rng;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn generate_pixel(x: u32, y: u32) -> ColorRGB {
    let r = rand::rng().random_range(0..255) as u8;
    let g = rand::rng().random_range(0..255) as u8;
    let b = rand::rng().random_range(0..255) as u8;
    ColorRGB::new(r, g, b)
}

#[wasm_bindgen]
pub fn get_shapes_titles() -> Vec<String> {
    SHAPE_TITLES.map(|item| item.to_string()).to_vec()
}

#[wasm_bindgen]
pub fn get_scene() -> String {
    let shapes = match SHAPES.lock() {
        Ok(shapes) => format!("{:?}", shapes),
        Err(e) => format!("error: {:?}", e),
    };

    let preview_camera = match PREVIEW_CAMERA.lock() {
        Ok(preview_camera) => format!("{:?}", preview_camera),
        Err(e) => format!("error: {:?}", e),
    };

    format!("preview_camera: {:?}, shapes: {}", preview_camera, shapes)
}

pub fn add(x: i32, y: i32) -> i32 {
    x + y
}

#[wasm_bindgen]
pub fn set_scene(scene: String) -> String {
    format!("OK {}", scene)
}

#[wasm_bindgen]
pub fn render_pixel(x: u32, y: u32) -> String {
    format!("#ff0000")
}
