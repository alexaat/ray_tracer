mod block;
mod camera;
mod color;
mod constants;
mod grapics;
mod hittable;
mod io;
mod material;
mod plane;
mod point;
mod quad;
mod ray;
mod source_model;
mod sphere;
mod vector3;
mod disk;
mod tube;
mod cylinder;
use crate::block::Block;
use crate::camera::CameraSetup;
use crate::camera::*;
use crate::color::*;
use crate::constants::*;
use crate::hittable::HittableList;
use crate::io::*;
use crate::material::*;
use crate::plane::*;
use crate::quad::Quad;
use crate::sphere::*;
use crate::vector3::*;
use std::collections::HashMap;
use std::rc::Rc;
use wasm_bindgen::prelude::*;
use std::sync::Mutex;
use crate::disk::Disk;
use crate::tube::Tube;
use crate::cylinder::Cylinder;

#[wasm_bindgen]
pub fn get_shapes_titles() -> Vec<String> {
    SHAPE_TITLES.map(|item| item.to_string()).to_vec()
}

#[wasm_bindgen]
pub fn render_pixel(scene: String, x: usize, y: usize) -> String {
    let data = read_data_from_string(scene).unwrap();

    *SCENE.lock().unwrap() = Some(format!("scene: {:?}", data));

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
    for shape in data.shapes {
        for (key, value) in &shape {
            let title = key as &str;
            match title {
                "sphere" => {
                    let center_option = &value.center;
                    let radius_option = value.radius;
                    let material_option = &value.material;

                    if let Some(center) = center_option {
                        if let Some(radius) = radius_option {
                            if let Some(material_title) = material_option {
                                if let Some(material) = materials.get(material_title) {
                                    let sphere =
                                        Sphere::new(center.clone(), radius, material.clone());
                                    world.add(sphere);
                                }
                            }
                        }
                    }
                },
                "plane" => {
                    if let Some(center) = &value.center {
                        if let Some(normal) = &value.normal {
                            if let Some(material_title) = &value.material {
                                if let Some(material) = materials.get(material_title) {
                                    let plane = Plane::new(
                                        center.clone(),
                                        normal.clone(),
                                        material.clone(),
                                    );
                                    world.add(plane);
                                }
                            }
                        }
                    }
                },
                "quad" => {
                    if let Some(q) = &value.q {
                        if let Some(u) = &value.u {
                            if let Some(v) = &value.v {
                                if let Some(material_title) = &value.material {
                                    if let Some(material) = materials.get(material_title) {
                                        let quad = Quad::new(
                                            q.clone(),
                                            u.clone(),
                                            v.clone(),
                                            material.clone(),
                                        );
                                        world.add(quad);
                                    }
                                }
                            }
                        }
                    }
                },
                "block" => {
                    if let Some(a) = &value.a {
                        if let Some(b) = &value.b {
                            if let Some(material_title) = &value.material {
                                if let Some(material) = materials.get(material_title) {
                                    let mut block =
                                        Block::new(a.clone(), b.clone(), material.clone());
                                    if let Some(rotate) = &value.rotate {
                                        block.rotate = rotate.clone();
                                    }
                                    world.add(block.get_hittable_list());
                                }
                            }
                        }
                    }
                },
                "disk" => {
                    if let Some(center)= &value.center{
                        if let Some(normal) = &value.normal {
                            if let Some(radius) = value.radius{
                                if let Some(material_title) = &value.material{
                                    if let Some(material) = materials.get(material_title){
                                        let disk = Disk::new(center.clone(), normal.clone(), radius, material.clone());
                                        world.add(disk);
                                    }
                                }
                            }
                        }
                    }
                },
                "tube" => {
                    if let Some(top) = &value.top {
                        if let Some(bottom) =  &value.bottom{
                            if let Some(radius) = value.radius{
                                if let Some(material_title) = &value.material{
                                    if let Some(material) = materials.get(material_title){
                                        let tube = Tube::new(top.clone(), bottom.clone(), radius, material.clone());
                                        world.add(tube);
                                    } 
                                }
                            }
                        }
                    }
                },
                "cylinder" => {
                    if let Some(top) = &value.top {
                        if let Some(bottom) =  &value.bottom{
                            if let Some(radius) = value.radius{
                                if let Some(material_title) = &value.material{
                                    if let Some(material) = materials.get(material_title){
                                        let cylinder = Cylinder::new(top.clone(), bottom.clone(), radius, material.clone());
                                        world.add(cylinder.get_hittable_list());
                                    } 
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

    let color = camera.render(&world, x, y);

    let mut r = format!("{:x}", color.0);
    if r.len() == 1 {
        r = format!("0{}", r);
    }
    let mut g = format!("{:x}", color.1);
    if g.len() == 1 {
        g = format!("0{}", g);
    }
    let mut b = format!("{:x}", color.2);
    if b.len() == 1 {
        b = format!("0{}", b);
    }

    format!("#{}{}{}", r, g, b)
}

pub static SCENE: Mutex<Option<String>> = Mutex::new(None);
#[wasm_bindgen]
pub fn get_scene() -> String{
    SCENE.lock().unwrap().as_ref().unwrap().clone()
}

#[wasm_bindgen]
pub fn validate_query(scene: String) -> bool{
    if let Ok(scene) = read_data_from_string(scene){
        if scene.camera.image_width < 1 || scene.camera.image_width > 5000 {
            return false;
        }
        if scene.camera.aspect_ratio < 0.01 || scene.camera.aspect_ratio > 100.0 {
            return false;
        }
        if scene.camera.pixel_samples < 1 || scene.camera.pixel_samples > 1000 {
            return false;
        }
        if scene.camera.vfov < 1.0 || scene.camera.vfov > 179.0 {
            return false;
        }
        if scene.camera.lookfrom.x < -1000000.0 || scene.camera.lookfrom.x > 1000000.0 {
            return false;
        }
        if scene.camera.lookfrom.y < -1000000.0 || scene.camera.lookfrom.y > 1000000.0 {
            return false;
        }
        if scene.camera.lookfrom.z < -1000000.0 || scene.camera.lookfrom.z > 1000000.0 {
            return false;
        }
        if scene.camera.lookat.x < -1000000.0 || scene.camera.lookat.x > 1000000.0 {
            return false;
        }
        if scene.camera.lookat.y < -1000000.0 || scene.camera.lookat.y > 1000000.0 {
            return false;
        }
        if scene.camera.lookat.z < -1000000.0 || scene.camera.lookat.z > 1000000.0 {
            return false;
        }
        if scene.camera.vup.x < -1000000.0 || scene.camera.vup.x > 1000000.0 {
            return false;
        }
        if scene.camera.vup.y < -1000000.0 || scene.camera.vup.y > 1000000.0 {
            return false;
        }
        if scene.camera.vup.z < -1000000.0 || scene.camera.vup.z > 1000000.0 {
            return false;
        }
        if scene.camera.defocus_angle < 0.0 || scene.camera.defocus_angle > 180.0 {
            return false;
        }
        if scene.camera.focus_dist < 0.0 || scene.camera.focus_dist > 1000000.0 {
            return false;
        }
        if scene.camera.max_depth < 1 || scene.camera.max_depth > 500 {
            return false;
        }
        
        return true;
    }
    false
}