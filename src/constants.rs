use crate::vector3::Vector3;

pub const SHAPE_TITLES: [&str; 6] = ["sphere", "plane", "quad", "block", "disk", "tube"];
pub const MATERIALS: [&str; 3] = ["lambertian", "metal", "dielectric"];

//pub const IMAGE_WIDTH: u32 = 350;
pub const IMAGE_HEIGHT: u32 = 250;

pub const PREVIEW_IMAGE_WIDTH: usize = 150;
pub const PREVIEW_ASPECT_RATIO: f64 = 1.333333;
pub const PREVIEW_PIXEL_SAMPLES: usize = 10;
pub const PREVIEW_DEFOCUS_ANGLE: f64 = 0.4;
pub const PREVIEW_MAX_DEPTH: usize = 10;
pub static PREVIEW_CAMERA_CENTER: Vector3 = Vector3 {
    x: 5.0,
    y: 6.0,
    z: 25.0,
};
//pub const PREVIEW_IMAGE_HEIGHT: usize = 100;
//pub const BACKGROUND_COLOR: ColorRGB = ColorRGB{r: 99, g: 99, b: 99};
