use crate::point::*;
use crate::vector3::*;
pub struct Ray {
    pub origin: Point,
    pub direction: Vector3,
}

impl Ray {
    pub fn new(origin: Point, direction: Vector3) -> Self {
        Self { origin, direction }
    }
    pub fn point_at(&self, t: f64) -> Vector3 {
        &self.origin + t * &self.direction
    }
}