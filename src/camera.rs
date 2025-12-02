use wasm_bindgen::prelude::*;
use crate::ColorRGB;
use crate::constants::*;

#[derive(Debug, Clone, Copy)]
#[wasm_bindgen]
pub struct Camera {
    pub image_width: usize,
    pub image_height: usize,
    pub background: ColorRGB   
}

pub static mut PREVIEW_CAMERA: Camera = Camera{
    image_width: PREVIEW_IMAGE_WIDTH,
    image_height: PREVIEW_IMAGE_HEIGHT,
    background: BACKGROUND_COLOR
};

#[wasm_bindgen]
pub fn get_preview_camera() -> Camera{
    unsafe  {
        PREVIEW_CAMERA.clone()
    }
 
}

#[wasm_bindgen]
pub fn set_preview_camera(width: usize, height: usize) -> Camera{
    unsafe {
        PREVIEW_CAMERA.image_width = width;
        PREVIEW_CAMERA.image_height = height;
        PREVIEW_CAMERA.clone()
    }
}

