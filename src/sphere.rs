use crate::material::*;
use crate::point::*;

pub struct Sphere {
    pub id: String,
    pub center: Point,
    pub radius: f64,
    pub material: Material,
}

impl Sphere {
    pub fn new(id: String, center: Point, radius: f64, material: Material) -> Self {
        Self {
            id,
            center,
            radius,
            material,
        }
    }
}