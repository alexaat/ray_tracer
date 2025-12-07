mod camera;
mod color;
mod constants;
mod grapics;
mod hittable;
mod io;
mod material;
mod point;
mod ray;
mod shapes;
mod source_model;
mod sphere;
mod vector3;
use crate::camera::PREVIEW_CAMERA;
use crate::color::*;
use crate::constants::*;
use crate::hittable::HittableList;
use crate::io::*;
use crate::shapes::*;
use crate::source_model::SourceModel;
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
    // let shapes = match SHAPES.lock() {
    //     Ok(shapes) => format!("{:?}", shapes),
    //     Err(e) => format!("error: {:?}", e),
    // };

    // let preview_camera = match PREVIEW_CAMERA.lock() {
    //     Ok(preview_camera) => format!("{:?}", preview_camera),
    //     Err(e) => format!("error: {:?}", e),
    // };

    // format!("preview_camera: {:?}, shapes: {}", preview_camera, shapes)

    String::from("scene")
}

pub fn add(x: i32, y: i32) -> i32 {
    x + y
}

/////////////////////////////////////////////////////////

#[wasm_bindgen]
pub fn set_scene(scene: String) -> String {
    match read_data_from_string(scene) {
        Ok(source_model) => format!("sorce_model: {:?}", source_model),
        Err(e) => format!("sorce_model: {:?}", e),
    }
}

#[wasm_bindgen]
pub fn render_pixel(x: u32, y: u32) -> String {
    format!("#ff0000")
}

fn setup_world(source_model: SourceModel) {
    let mut world = HittableList::new();
}
