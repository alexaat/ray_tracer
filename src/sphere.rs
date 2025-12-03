use crate::material::*;
use crate::point::*;

#[derive(Debug)]
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

// impl ToString for Sphere{
//     fn to_string(&self) -> std::string::String {
//         format!("{{id: {}, center: {}, radius: {}, material: {:?}}}", self.id, self.center.to_string(), self.radius, self.material)
//     }
// }