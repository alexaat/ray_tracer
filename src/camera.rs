use wasm_bindgen::prelude::*;
use crate::ColorRGB;
use crate::constants::*;
use std::sync::Mutex;
use crate::vector3::*;

#[derive(Debug, Clone)]
#[wasm_bindgen]
pub struct Camera {
    pub image_width: usize,
    pub image_height: usize,
    pub pixel00_loc: Vector3,
    pub pixel_delta_u: Vector3,
    pub pixel_delta_v: Vector3,
    pub camera_center: Vector3,
    pub max_depth: usize,
    pub defocus_disk_u: Vector3,
    pub defocus_disk_v: Vector3,
    pub defocus_angle: f64,
    pub pixel_samples: usize,
    pub background: Vector3   
}

// impl ToString for Camera{
//     fn to_string(&self) -> std::string::String {
//         format!("{{image_width: {}, image_height: {}, background: {} }}", self.image_width, self.image_height, self.background.to_string()) 
        
//     }
// }




// pub static PREVIEW_CAMERA: Mutex<Camera> = Mutex::new(Camera{
//     image_width: PREVIEW_IMAGE_WIDTH,
//     image_height: PREVIEW_IMAGE_WIDTH*PREVIEW_ASPECT_RATIO as usize,
//     pixel00_loc: Vector3,
//     pixel_delta_u: Vector3,
//     pixel_delta_v: Vector3,
//     camera_center: PREVIEW_CAMERA_CENTER,
//     max_depth: PREVIEW_MAX_DEPTH,
//     defocus_disk_u: Vector3,
//     defocus_disk_v: Vector3,
//     defocus_angle: PREVIEW_DEFOCUS_ANGLE,
//     pixel_samples: PREVIEW_PIXEL_SAMPLES,
//     background: BACKGROUND_COLOR
// });

pub static PREVIEW_CAMERA: Mutex<Option<Camera>> = Mutex::new(None);

#[wasm_bindgen]
pub fn get_preview_camera() -> String{  
    match PREVIEW_CAMERA.lock(){
        Ok(preview_camera) => format!("preview_camera: {{{:?}}}", preview_camera),         
        Err(e) => format!("preview_camera error: {:?}", e)
    }
    //*PREVIEW_CAMERA.lock().unwrap()
}


/* 
        "pixel_samples" : 200,
        "vfov" : 22,
        "lookfrom" : [5, 6, 25],
        "lookat" : [0, 0, 0],
        "vup": [0, 1, 0],
        "defocus_angle": 0.4,
        "focus_dist": 19,
        "aspect_ratio": 1.333333,
        "image_width": 200,
        "max_depth": 50,
        "background": [173, 216, 230]
    */


#[wasm_bindgen]
pub fn set_preview_camera(
    pixel_samples: usize,
    vfov: f64,  // Vertical view angle (field of view)
    lookfrom: Vector3, // Point camera is looking from
    lookat: Vector3, // Point camera is looking at
    vup: Vector3, // Camera-relative "up" direction
    defocus_angle: f64, // Variation angle of rays through each pixel
    focus_dist: f64, // Distance from camera lookfrom point to plane of perfect focus
    aspect_ratio: f64,
    image_width: usize,
    max_depth: usize,
    background: Vector3

){

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


        if let Ok(mut preview_camera) = PREVIEW_CAMERA.lock(){
            *preview_camera = Some(
                Camera {
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
                    background    
                }
            );
        }

 



}

// #[wasm_bindgen]
// pub fn set_preview_camera(width: usize, height: usize) -> Camera{
//     let mut data = PREVIEW_CAMERA.lock().unwrap();
//     data.image_height = height;
//     data.image_width = width;
//     *data
// }

