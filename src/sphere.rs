use crate::hittable::*;
use crate::material::*;
use crate::point::*;
use crate::ray::*;
use crate::vector3::*;
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

impl Hittable for Sphere {
    fn hit(&self, ray: &Ray, t_min: f64, t_max: f64) -> Option<HitRecord> {
        let c_o = &(&self.center - &ray.origin);
        let d = &ray.direction;
        let a = d.len_2();
        let b = -2.0 * (d.dot(&c_o));
        let c = c_o.len_2() - self.radius * self.radius;
        let discriminant = b * b - 4.0 * a * c;
        if discriminant < 0.0 {
            return None;
        }
        // Find the nearest root that lies in the acceptable range
        let sqr = discriminant.sqrt();
        let root1 = (-b - sqr) / (2.0 * a);
        let root2 = (-b + sqr) / (2.0 * a);
        if root1 >= t_min && root1 <= t_max {
            if root2 >= t_min && root2 <= t_max {
                let root = f64::min(root1, root2);
                let p = ray.point_at(root);
                let normal = (&p - &self.center) / self.radius;
                let mut hit_record =
                    HitRecord::new(p, normal.clone(), root, Rc::clone(&self.material));
                hit_record.set_face_normal(ray, normal);
                return Some(hit_record);
            } else {
                let p = ray.point_at(root1);
                let normal: Vector3 = (&p - &self.center) / self.radius;
                let mut hit_record =
                    HitRecord::new(p, normal.clone(), root1, Rc::clone(&self.material));
                hit_record.set_face_normal(ray, normal);
                return Some(hit_record);
            }
        } else {
            if root2 >= t_min && root2 <= t_max {
                let p = ray.point_at(root2);
                let normal = (&p - &self.center) / self.radius;
                let mut hit_record =
                    HitRecord::new(p, normal.clone(), root2, Rc::clone(&self.material));
                hit_record.set_face_normal(ray, normal);
                return Some(hit_record);
            }
        }

        None
    }
}
