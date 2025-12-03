use wasm_bindgen::prelude::*;
use crate::vector3::*;
pub type Color = Vector3;

#[derive(Debug, Clone, Copy)]
#[wasm_bindgen]
pub struct ColorRGB {
    pub r: u8,
    pub g: u8,
    pub b: u8,
}
impl ColorRGB{
    pub fn new(r: u8, g: u8, b: u8) -> ColorRGB{
        ColorRGB { r, g, b }
    }
}

// impl ToString for ColorRGB{
//     fn to_string(&self) -> std::string::String {
//         format!("{{r: {}, g: {}, b: {}}}", self.r, self.g, self.b)
//     }
// }