use crate::material::*;
use crate::point::*;
use std::rc::Rc;

pub struct Sphere {
    pub center: Point,
    pub radius: f64,
    pub material: Rc<dyn Material>,
}

impl Sphere {
    pub fn new(center: Point, radius: f64, material: Rc<dyn Material>) -> Self {
        Self {
            center,
            radius,
            material,
        }
    }
}