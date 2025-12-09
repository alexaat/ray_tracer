use crate::hittable::*;
use crate::material::*;
use crate::point::*;
use crate::ray::*;
use crate::vector3::*;
use std::rc::Rc;

pub struct Quad {
    pub q: Point,
    pub u: Vector3,
    pub v: Vector3,
    pub material: Rc<dyn Material>,
    pub rotate: Vector3,
}
impl Quad {
    pub fn new(q: Point, u: Vector3, v: Vector3, material: Rc<dyn Material>) -> Self {
        Self {
            q,
            u,
            v,
            material,
            rotate: Vector3::new(0.0, 0.0, 0.0),
        }
    }
}
impl Hittable for Quad {
    fn hit(&self, ray: &Ray, t_min: f64, t_max: f64) -> Option<HitRecord> {
        let q = self.q.rotate(&self.rotate);
        let u = self.u.rotate(&self.rotate);
        let v = self.v.rotate(&self.rotate);

        //plane normal
        let normal = u.cross(&v);
        //D coef
        let d = normal.dot(&q);
        //denominator
        let denominator = normal.dot(&ray.direction);
        if denominator.abs() < 0.00000001 {
            return None;
        }
        //distance to intersection point
        let t = (d - &ray.origin.dot(&normal)) / denominator;
        if t > t_max || t < t_min {
            return None;
        }
        //intersection point
        let intersection = ray.point_at(t);
        //check that hit plane within bounderies
        let planar_hitpt_vector = &intersection - &q;
        //let w = &normal / (normal.dot(&normal));
        let w = &normal / normal.len_2();
        let a = w.dot(&planar_hitpt_vector.cross(&v));
        let b = w.dot(&u.cross(&planar_hitpt_vector));
        if a >= 0.0 && a <= 1.0 && b >= 0.0 && b <= 1.0 {
            let mut hit_record = HitRecord::new(
                intersection.clone(),
                normal.clone(),
                t,
                Rc::clone(&self.material),
            );
            hit_record.set_face_normal(ray, normal.normalize());

            return Some(hit_record);
        }
        None
    }
}
