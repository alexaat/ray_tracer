use crate::hittable::*;
use crate::material::*;
use crate::point::*;
use crate::ray::*;
use crate::vector3::*;
use std::rc::Rc;

pub struct Plane {
    pub point: Point,
    pub normal: Vector3,
    pub material: Rc<dyn Material>,
}

impl Plane {
    pub fn new(point: Point, normal: Vector3, material: Rc<dyn Material>) -> Self {
        Self {
            point,
            normal,
            material,
        }
    }
}

impl Hittable for Plane {
    fn hit(&self, ray: &Ray, t_min: f64, t_max: f64) -> Option<HitRecord> {
        let d = &self.normal.dot(&self.point);
        let denominator = self.normal.dot(&ray.direction);
        if denominator.abs() < 0.00000001 {
            return None;
        }
        let t = (d - &ray.origin.dot(&self.normal)) / denominator;
        if t < t_min || t > t_max {
            return None;
        }
        let p = ray.point_at(t);
        let mut hit_record = HitRecord::new(p, self.normal.clone(), t, Rc::clone(&self.material));
        hit_record.set_face_normal(ray, self.normal.clone());
        Some(hit_record)
    }
}