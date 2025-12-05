use crate::color::*;
use crate::hittable::*;
use crate::ray::*;
use crate::vector3::*;

#[derive(Clone, serde::Deserialize, Debug)]
pub struct Material {
    pub color: Color,
    pub fuzz: f64,
}
impl Material {
    pub fn new(color: Color, fuzz: f64) -> Self {
        Self { color, fuzz }
    }
        fn scatter(&self, _: &Ray, hit_record: &HitRecord, color: &mut Color) -> Option<Ray> {
        *color = self.fuzz * self.color.clone();
        let mut rand_unit_vector = Vector3::generate_random_unit_vector();
        if rand_unit_vector.dot(&hit_record.normal) < 0.0 {
            rand_unit_vector = -1.0 * rand_unit_vector;
        }
        let mut direction = &hit_record.normal + rand_unit_vector;
        if direction.len_2() <= 0.000000001 {
            direction = hit_record.normal.clone();
        }
        let scattered = Ray::new(hit_record.p.clone(), direction);
        return Some(scattered);
    }
}
