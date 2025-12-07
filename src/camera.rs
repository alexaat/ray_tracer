use crate::point::*;
use crate::vector3::*;
use std::sync::Mutex;
use wasm_bindgen::prelude::*;
use crate::hittable::*;
use crate::color::Color;
use crate::ray::Ray;
use crate::grapics::color_to_rgb;

#[derive(Debug, Clone)]
#[wasm_bindgen]
pub struct Camera {
    image_width: usize,
    image_height: usize,
    pixel00_loc: Vector3,
    pixel_delta_u: Vector3,
    pixel_delta_v: Vector3,
    camera_center: Vector3,
    max_depth: usize,
    defocus_disk_u: Vector3,
    defocus_disk_v: Vector3,
    defocus_angle: f64,
    pixel_samples: usize,
    background: Vector3  
}

pub static PREVIEW_CAMERA: Mutex<Option<Camera>> = Mutex::new(None);

#[wasm_bindgen]
pub fn get_preview_camera() -> String {
    match PREVIEW_CAMERA.lock() {
        Ok(preview_camera) => format!("preview_camera: {{{:?}}}", preview_camera),
        Err(e) => format!("preview_camera error: {:?}", e),
    }
}

/*
#[wasm_bindgen]
pub fn set_preview_camera(
    pixel_samples: usize,
    vfov: f64,          // Vertical view angle (field of view)
    lookfrom: JsValue,  // Point camera is looking from
    lookat: JsValue,    // Point camera is looking at
    vup: JsValue,       // Camera-relative "up" direction
    defocus_angle: f64, // Variation angle of rays through each pixel
    focus_dist: f64,    // Distance from camera lookfrom point to plane of perfect focus
    aspect_ratio: f64,
    image_width: usize,
    max_depth: usize,
    background: JsValue,
) {
    let lookfrom: Vector3 = from_value(lookfrom).unwrap_or(Vector3::new(10.0, 10.0, 10.0));
    let lookat: Vector3 = from_value(lookat).unwrap_or(Vector3::new(0.0, 0.0, 0.0));
    let vup: Vector3 = from_value(vup).unwrap_or(Vector3::new(0.0, 1.0, 0.0));
    let background = from_value(background).unwrap_or(ColorRGB::new(190, 190, 190));

    let mut image_height: usize = (image_width as f64 / aspect_ratio) as usize;
    if image_height < 1 {
        image_height = 1;
    }
    //calculate viewport size
    let theta = vfov.to_radians();
    let h = (theta / 2.0).tan();
    let viewport_height = 2.0 * h * focus_dist;
    let viewport_width = viewport_height * (image_width as f64 / image_height as f64);
    // Calculate the u,v,w unit basis vectors for the camera coordinate frame.
    let w = (&lookfrom - lookat).normalize();
    let u = (vup.cross(&w)).normalize();
    let v = w.cross(&u);
    //set up scene
    let camera_center = lookfrom;
    // Calculate the vectors across the horizontal and down the vertical viewport edges.
    // Vector across viewport horizontal edge
    let viewport_u = viewport_width * &u;
    // Vector down viewport vertical edge
    let viewport_v = viewport_height * -1.0 * &v;
    //delta vectors in pixels
    let pixel_delta_u = &viewport_u / (image_width as f64);
    let pixel_delta_v = &viewport_v / (image_height as f64);

    // Calculate the location of the upper left pixel.
    let viewport_upper_left =
        &camera_center - (focus_dist * w) - &viewport_u / 2.0 - &viewport_v / 2.0;
    let pixel00_loc = &viewport_upper_left + 0.5 * (&pixel_delta_u + &pixel_delta_v);

    // Calculate the camera defocus disk basis vectors.
    let defocus_radius = focus_dist * ((defocus_angle / 2.0).to_radians()).tan();
    let defocus_disk_u = u * defocus_radius;
    let defocus_disk_v = v * defocus_radius;

    if let Ok(mut preview_camera) = PREVIEW_CAMERA.lock() {
        *preview_camera = Some(Camera {
            image_width,
            image_height,
            pixel00_loc,
            pixel_delta_u,
            pixel_delta_v,
            camera_center,
            max_depth,
            defocus_disk_u,
            defocus_disk_v,
            defocus_angle,
            pixel_samples,
            background: Vector3::new((background.r as f64)/255.0, (background.g as f64)/255.0, (background.b as f64)/255.0),
        });
    }
}
*/

///////////////////////////////////////////////////

pub static CAMERA: Mutex<Option<Camera>> = Mutex::new(None);

#[derive(serde::Deserialize, Debug)]
pub struct CameraSetup {
    pub pixel_samples: usize,
    pub vfov: f64,
    pub lookfrom: Point,
    pub lookat: Point,
    pub vup: Vector3,
    pub defocus_angle: f64,
    pub focus_dist: f64,
    pub aspect_ratio: f64,
    pub image_width: usize,
    pub max_depth: usize,
    pub background: Vector3,
}

impl Camera {
    pub fn new(setup: CameraSetup) -> Self {
                
        let pixel_samples: usize = setup.pixel_samples;
        //camera position and vertical field of view
        let vfov: f64 = setup.vfov; // Vertical view angle (field of view)
        let lookfrom = setup.lookfrom; // Point camera is looking from
        let lookat = setup.lookat; // Point camera is looking at
        let vup = setup.vup; // Camera-relative "up" direction
        //defocus
        let defocus_angle: f64 = setup.defocus_angle; // Variation angle of rays through each pixel
        let focus_dist: f64 = setup.focus_dist; // Distance from camera lookfrom point to plane of perfect focus
        //aspect ratio
        let aspect_ratio = setup.aspect_ratio;
        //calculate canvas size
        let image_width: usize = setup.image_width;
        let mut image_height: usize = (image_width as f64 / aspect_ratio) as usize;
        if image_height < 1 {
            image_height = 1;
        }
        //calculate viewport size
        let theta = vfov.to_radians();
        let h = (theta / 2.0).tan();
        let viewport_height = 2.0 * h * focus_dist;
        let viewport_width = viewport_height * (image_width as f64 / image_height as f64);
        // Calculate the u,v,w unit basis vectors for the camera coordinate frame.
        let w = (&lookfrom - lookat).normalize();
        let u = (vup.cross(&w)).normalize();
        let v = w.cross(&u);
        //set up scene
        let camera_center = lookfrom;
        // Calculate the vectors across the horizontal and down the vertical viewport edges.
        // Vector across viewport horizontal edge
        let viewport_u = viewport_width * &u;
        // Vector down viewport vertical edge
        let viewport_v = viewport_height * -1.0 * &v;
        //delta vectors in pixels
        let pixel_delta_u = &viewport_u / (image_width as f64);
        let pixel_delta_v = &viewport_v / (image_height as f64);

        // Calculate the location of the upper left pixel.
        let viewport_upper_left =
            &camera_center - (focus_dist * w) - &viewport_u / 2.0 - &viewport_v / 2.0;
        let pixel00_loc = &viewport_upper_left + 0.5 * (&pixel_delta_u + &pixel_delta_v);

        // Calculate the camera defocus disk basis vectors.
        let defocus_radius = focus_dist * ((defocus_angle / 2.0).to_radians()).tan();
        let defocus_disk_u = u * defocus_radius;
        let defocus_disk_v = v * defocus_radius;
       
        Self {
            image_width,
            image_height,
            pixel00_loc,
            pixel_delta_u,
            pixel_delta_v,
            camera_center,
            max_depth: setup.max_depth,
            defocus_disk_u,
            defocus_disk_v,
            defocus_angle,
            pixel_samples,
            background: setup.background           
        }
    }

    pub fn render(&self,  world: &HittableList, x: usize, y: usize) -> (u8,u8,u8) {            
        let pixel_center = &self.pixel00_loc + x * &self.pixel_delta_u + y * &self.pixel_delta_v;
        let color = self.calculate_avarage_color(&pixel_center, world);
        let rgb = color_to_rgb(color);   
        (rgb.0, rgb.1, rgb.2)  
    }

    fn get_color_from_world(&self, ray: &Ray, world: &HittableList, depth: usize) -> Color {
        let hit_record_option = world.hit(ray, 0.001, f64::INFINITY);
        if let Some(hit_record) = hit_record_option {
            if depth == 0 {
                return Vector3::new(0.0, 0.0, 0.0);
            }
            let mut shape_color = Color::new(1.0, 1.0, 1.0);
            let scattered_option = hit_record
                .material
                .scatter(ray, &hit_record, &mut shape_color);
            if let Some(scattered) = scattered_option {
                return shape_color * self.get_color_from_world(&scattered, world, depth - 1);
            }
            return Color::new(0.0, 0.0, 0.0);
        }
        self.background.clone()
    }

    fn calculate_avarage_color(&self, pixel_center: &Vector3, world: &HittableList) -> Color {
        let mut colors = vec![];
        for _ in 0..self.pixel_samples {
            let delta_x = rand::random_range(0.0..0.5) * self.pixel_delta_u.len();
            let delta_y = rand::random_range(0.0..0.5) * self.pixel_delta_v.len();
            let delta_v = Vector3::new(delta_x, delta_y, 0.0);
            let v = pixel_center + delta_v;
            // add defocus
            let p = Vector3::generate_random_unit_vector_on_disk();
            let defocus_disk_sample =
                &self.camera_center + (p.x * &self.defocus_disk_u) + (p.y * &self.defocus_disk_v);
            let mut ray_origin = &defocus_disk_sample;
            if self.defocus_angle <= 0.0 {
                ray_origin = &self.camera_center;
            }
            let ray_direction = v - ray_origin;           
            let ray = Ray::new(ray_origin.clone(), ray_direction);          
            let color = self.get_color_from_world(&ray, world, self.max_depth);
            colors.push(color);
        }
        if colors.len() == 0 {
            return Color::new(0.0, 0.0, 0.0);
        }
        let mut color = Color::new(0.0, 0.0, 0.0);
        //calculate avarage color
        for c in &colors {
            color = color + c;
        }
        color = color / (colors.len() as f64);
        Color::clamp_color(&mut color);
        Color::color_linear_to_gamma(&mut color);
        color
    }

}
