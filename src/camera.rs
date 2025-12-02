use wasm_bindgen::prelude::*;
use crate::ColorRGB;
use crate::constants::*;
use std::sync::Mutex;

#[derive(Debug, Clone, Copy)]
#[wasm_bindgen]
pub struct Camera {
    pub image_width: usize,
    pub image_height: usize,
    pub background: ColorRGB   
}

pub static PREVIEW_CAMERA: Mutex<Camera> = Mutex::new(Camera{
    image_width: PREVIEW_IMAGE_WIDTH,
    image_height: PREVIEW_IMAGE_HEIGHT,
    background: BACKGROUND_COLOR
});


#[wasm_bindgen]
pub fn get_preview_camera() -> Camera{   
    *PREVIEW_CAMERA.lock().unwrap()
}

#[wasm_bindgen]
pub fn set_preview_camera(width: usize, height: usize) -> Camera{
    let mut data = PREVIEW_CAMERA.lock().unwrap();
    data.image_height = height;
    data.image_width = width;
    *data
}

