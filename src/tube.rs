use crate::hittable::*;
use crate::material::*;
use crate::point::*;
use crate::ray::*;
use std::rc::Rc;

pub struct Tube {
    pub top: Point,
    pub bottom: Point,
    pub radius: f64,
    pub material: Rc<dyn Material>,
}

impl Tube {
    pub fn new(top: Point, bottom: Point, radius: f64, material: Rc<dyn Material>) -> Self {
        Self {
            top,
            bottom,
            radius,
            material,
        }
    }
}

impl Hittable for Tube {
    fn hit(&self, ray: &Ray, t_min: f64, t_max: f64) -> Option<HitRecord> {
        //find projection of ray origin
        //projection bottom on oreintation
        let oreintation = &self.top - &self.bottom;
        let oreintation_normal = &oreintation.normalize();
        let proj_bottom_on_oreintaion = &self.bottom.projection_on_vector(&oreintation);
        //projection ray origin on plane;
        let proj_ray_origin_on_bottom_plane = ray.origin.projection_on_plane(&oreintation_normal);
        //ray origin on plane
        let ray_origin_on_plane = &proj_ray_origin_on_bottom_plane + proj_bottom_on_oreintaion;
        //ray direction projection on plane
        let proj_ray_direction_on_plane = ray.direction.projection_on_plane(&oreintation_normal);
        //projected ray
        let ray_proj = Ray::new(ray_origin_on_plane, proj_ray_direction_on_plane);

        //calculate hit point
        let mut roots = vec![];
        let center = &self.bottom;
        let c_o = center - ray_proj.origin;
        let d = ray_proj.direction;
        let a = d.len_2();
        let b = -2.0 * (d.dot(&c_o));
        let c = c_o.len_2() - self.radius * self.radius;
        let discriminant = b * b - 4.0 * a * c;
        if discriminant > 0.0{
            // Find the nearest root that lies in the acceptable range
            let sqr = discriminant.sqrt();
            let root1 = (-b - sqr) / (2.0 * a);
            let root2 = (-b + sqr) / (2.0 * a);
            if root1 >= t_min && root1 <= t_max{
                roots.push(root1);
            }
            if root2 >= t_min && root2 <= t_max{
                roots.push(root2);
            }       
     
            for t in roots{
                let p = ray.point_at(t);
                let proj_len = (&p - &self.bottom).dot(&oreintation_normal);
                if proj_len >= 0.0 && proj_len <= oreintation.len() {
                    let p_proj = p.projection_on_vector(&oreintation);
                    let normal = (&p_proj - &p).normalize();
                    let mut hit_record = HitRecord::new(p, normal.clone(), t, Rc::clone(&self.material));
                    hit_record.set_face_normal(&ray, normal); 
                    return Some(hit_record); 
                }                
            }
        }
        None
    }
}