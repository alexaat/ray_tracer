use crate::color::*;

pub fn color_to_rgb(color: Color) -> (u8, u8, u8) {
    let k = 255.999;
    let r = (color.x * k) as u8;
    let g = (color.y * k) as u8;
    let b = (color.z * k) as u8;
    (r, g, b)
}

pub fn linear_to_gamma(val: f64) -> f64 {
    if val > 0.0 {
        return val.sqrt();
    }
    0.0
}