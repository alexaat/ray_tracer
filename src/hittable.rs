use crate::material::*;
use crate::point::*;
use crate::ray::*;
use crate::vector3::*;
use std::rc::Rc;

pub struct HitRecord {
    pub p: Point,
    pub normal: Vector3,
    pub t: f64,
    pub front_face: bool,
    pub material: Rc<dyn Material>,
}
impl HitRecord {
    pub fn new(p: Point, normal: Vector3, t: f64, material: Rc<dyn Material>) -> Self {
        Self {
            p,
            normal,
            t,
            front_face: false,
            material,
        }
    }

    pub fn set_face_normal(&mut self, ray: &Ray, outward_normal: Vector3) {
        self.front_face = ray.direction.dot(&outward_normal) < 0.0;
        if self.front_face {
            self.normal = outward_normal;
        } else {
            self.normal = -1.0 * outward_normal;
        }
    }
}
pub trait Hittable {
    fn hit(&self, ray: &Ray, t_min: f64, t_max: f64) -> Option<HitRecord>;
}

pub struct HittableList {
    pub shapes: Vec<Box<dyn Hittable>>,
}
impl HittableList {
    pub fn add(&mut self, shape: impl Hittable + 'static) {
        self.shapes.push(Box::new(shape))
    }
    pub fn new() -> Self {
        Self { shapes: vec![] }
    }
}

impl Hittable for HittableList {
    fn hit(&self, ray: &Ray, t_min: f64, t_max: f64) -> Option<HitRecord> {
        let mut hit_record_option: Option<HitRecord> = None;
        for shape in &self.shapes {
            let new_hit_record_option = shape.hit(ray, t_min, t_max);
            //found new hit_record
            if let Some(new_hit_record) = new_hit_record_option {
                //check that hit_record is None
                if let Some(ref hit_record) = hit_record_option {
                    //compare t
                    let current_t = hit_record.t;
                    let new_t = new_hit_record.t;
                    if new_t < current_t {
                        hit_record_option = Some(new_hit_record);
                    }
                } else {
                    //set hit record
                    hit_record_option = Some(new_hit_record);
                }
            }
        }

        hit_record_option
    }
}
