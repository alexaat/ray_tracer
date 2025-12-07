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
mod plane;
use crate::camera::CameraSetup;
use crate::color::*;
use crate::constants::*;
use crate::hittable::HittableList;
use crate::io::*;
use crate::source_model::SourceModel;
use crate::vector3::*;
use rand::Rng;
use wasm_bindgen::prelude::*;
use std::collections::HashMap;
use std::rc::Rc;
use crate::material::*;
use crate::sphere::*;
use crate::plane::*;
use crate::camera::*;


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
    camera.render(&world, x, y)
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

    //3. get shapes
    for shape in data.shapes{
        for (key, value) in & shape {
            let title = key as &str;
            match title  {
                "sphere" => {
                    let center_option = &value.center;
                    let radius_option = value.radius;
                    let material_option = &value.material;
                    
                    if let Some(center) = center_option {
                        if let Some(radius) = radius_option{
                            if let Some(material_title) = material_option{
                                if let Some(material) = materials.get(material_title){
                                    let sphere = Sphere::new(center.clone(), radius, material.clone());
                                    world.add(sphere);
                                }
                            }
                        }
                    }                
                },
                "plane" => {
                    if let Some(center) = &value.center{
                        if let Some(normal) = &value.normal{
                            if let Some(material_title) = &value.material{
                                if let Some(material) = materials.get(material_title){
                                    let plane = Plane::new(center.clone(), normal.clone(), material.clone());
                                    world.add(plane);
                                }
                            }
                        }
                    }
                },
                _ => {}
            }
        }
    }   

    let camera = Camera::new(cam_setup);

}
