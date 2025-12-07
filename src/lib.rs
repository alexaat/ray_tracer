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
use crate::camera::CameraSetup;
use crate::camera::PREVIEW_CAMERA;
use crate::color::*;
use crate::constants::*;
use crate::hittable::HittableList;
use crate::io::*;
use crate::shapes::*;
use crate::source_model::SourceModel;
use crate::vector3::*;
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

fn setup_world(data: SourceModel) {
    let mut world = HittableList::new();

    //1. get camera
    let cam = data.camera;
    let background = Vector3::new(
        cam.background.x / 255.0,
        cam.background.y / 255.0,
        cam.background.z / 255.0,
    );
    let cam_setup = CameraSetup {
        pixel_samples: cam.pixel_samples,
        vfov: cam.vfov,
        lookfrom: cam.lookfrom,
        lookat: cam.lookat,
        vup: cam.vup,
        defocus_angle: cam.defocus_angle,
        focus_dist: cam.focus_dist,
        aspect_ratio: cam.aspect_ratio,
        image_width: cam.image_width,
        max_depth: cam.max_depth,
        background,
    };

    //2. get materials
    let mut materials: HashMap<String, Rc<dyn Material>> = HashMap::new();
    for (key, value) in &data.materials {
        let material_type = value.material_type.as_str();
        let mut color = Vector3::new(1.0, 1.0, 1.0);

        if let Some(c) = value.color.clone() {
            if color.x >= 0.0
                && color.x <= 255.0
                && color.y >= 0.0
                && color.y <= 255.0
                && color.z >= 0.0
                && color.z <= 255.0
            {
                color = Color::new(c.x / 255.0, c.y / 255.0, c.z / 255.0);
            }
        };
        let fuzz = if let Some(f) = value.fuzz { f } else { 1.0 };
        let refraction_index = if let Some(r_i) = value.refraction_index {
            r_i
        } else {
            1.0
        };
        match material_type {
            "lambertian" => {
                let m = Lambertian::new(color, fuzz);
                materials.insert(String::from(key), Rc::new(m));
            }
            "metal" => {
                let m = Metal::new(color, fuzz);
                materials.insert(String::from(key), Rc::new(m));
            }
            "dielectric" => {
                let m = Dielectric::new(color, refraction_index);
                materials.insert(String::from(key), Rc::new(m));
            }
            _ => {}
        }
    }
}
