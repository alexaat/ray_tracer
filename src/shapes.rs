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