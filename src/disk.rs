use crate::hittable::*;
use crate::material::*;
use crate::point::*;
use crate::ray::*;
use crate::vector3::*;
use std::rc::Rc;

pub struct Disk {
    pub center: Point,
    pub normal: Vector3,
    pub radius: f64,
    pub material: Rc<dyn Material>
}
impl Disk {
    pub fn new(center: Point, normal: Vector3, radius: f64, material: Rc<dyn Material>) -> Self {
        Self { center, normal, radius, material }
    }
}

impl Hittable for Disk {
    fn hit(&self, ray: &Ray, t_min: f64, t_max: f64) -> Option<HitRecord> {
        let d = &self.normal.dot(&self.center);
        let denominator = self.normal.dot(&ray.direction);
        if denominator.abs() < 0.00000001 {
            return None;
        }
        let t = (d - &ray.origin.dot(&self.normal)) / denominator;
        if t < t_min || t > t_max {
            return None;
        }
        let p = ray.point_at(t);

        if (&p-&self.center).len_2() > self.radius.powi(2){
            return None
        }    

        let mut hit_record = HitRecord::new(p, self.normal.clone(), t, Rc::clone(&self.material));
        hit_record.set_face_normal(ray, self.normal.clone());
        Some(hit_record)
    }
}