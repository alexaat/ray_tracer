use wasm_bindgen::prelude::*;
use crate::sphere::*;
use crate::vector3::*;
use crate::material::*;
use std::sync::Mutex;

pub static SHAPES: Mutex<Vec<Sphere>> = Mutex::new(vec![]);

#[wasm_bindgen]
pub fn add_shpere(id: String, x: f64, y: f64, z: f64, r: f64) -> String{
    let sphere = Sphere::new(id, Vector3::new(x, y, z), r, Material {  });
    if let Ok(mut data) = SHAPES.lock(){
        let message = format!("sphere{{id: {}, x: {}, y: {}, z: {}, radius: {}}}", sphere.id, sphere.center.x, sphere.center.y, sphere.center.z, sphere.radius);
        data.push(sphere);
        return message;
    } 
    String::from("error")
}

#[wasm_bindgen]
pub fn update_sphere(id: String, x: f64, y: f64, z: f64, r: f64) -> String{
    if let Ok(mut data) = SHAPES.lock(){
        for sphere in data.iter_mut() {
            if sphere.id == id {
                sphere.radius = r;
                sphere.center = Vector3::new(x, y, z);
                let message = format!("sphere{{id: {}, x: {}, y: {}, z: {}, radius: {}}}", sphere.id, sphere.center.x, sphere.center.y, sphere.center.z, sphere.radius);
                return message;
            }
        }
    }
    String::from("error")
}