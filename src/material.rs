use crate::color::*;
use crate::constants::MATERIALS;
use crate::hittable::*;
use crate::ray::*;
use crate::vector3::*;
use rand::Rng;
use wasm_bindgen::prelude::*;

pub trait Material {
    fn scatter(&self, ray: &Ray, hit_record: &HitRecord, color: &mut Color) -> Option<Ray>;
    fn reflect(&self, v: &Vector3, n: &Vector3) -> Vector3 {
        v - 2.0 * v.dot(&n) * n
    }
    fn refract(&self, uv: &Vector3, n: &Vector3, etai_over_etat: f64) -> Vector3 {
        let cos_theta = f64::min((-1.0 * uv).dot(&n), 1.0);
        let r_out_perp = etai_over_etat * (uv + cos_theta * n);
        let r_out_parallel = -1.0 * ((1.0 - r_out_perp.len_2()).abs()).sqrt() * n.clone();
        r_out_perp + r_out_parallel
    }
    fn reflectance(&self, cosine: f64, refraction_index: f64) -> f64 {
        // Use Schlick's approximation for reflectance.
        let mut r0 = (1.0 - refraction_index) / (1.0 + refraction_index);
        r0 = r0 * r0;
        r0 + (1.0 - r0) * (1.0 - cosine).powi(5)
    }
}

#[derive(Clone, serde::Deserialize, Debug)]
pub struct Lambertian {
    pub color: Color,
    pub fuzz: f64,
}
impl Lambertian {
    pub fn new(color: Color, fuzz: f64) -> Self {
        Self { color, fuzz }
    }
}
impl Material for Lambertian {
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

pub struct Metal {
    pub color: Color,
    pub fuzz: f64,
}
impl Metal {
    pub fn new(color: Color, fuzz: f64) -> Self {
        Self { color, fuzz }
    }
}
impl Material for Metal {
    fn scatter(&self, ray: &Ray, hit_record: &HitRecord, color: &mut Color) -> Option<Ray> {
        *color = self.color.clone();
        let v = &ray.direction;
        let n = &hit_record.normal;
        //let mut reflected = v - 2.0 * v.dot(n.clone()) * n;
        let mut reflected = hit_record.material.reflect(v, n);
        //add fuzz
        let rand_unit_vector = Vector3::generate_random_unit_vector();
        reflected = reflected.normalize() + self.fuzz * rand_unit_vector;
        let scattered = Ray::new(hit_record.p.clone(), reflected);
        if scattered.direction.dot(&n) < 0.0 {
            return None;
        }
        return Some(scattered);
    }
}

pub struct Dielectric {
    pub refraction_index: f64,
    pub color: Color,
}
impl Dielectric {
    pub fn new(color: Color, refraction_index: f64) -> Self {
        Self {
            color,
            refraction_index,
        }
    }
}
impl Material for Dielectric {
    fn scatter(&self, ray: &Ray, hit_record: &HitRecord, color: &mut Color) -> Option<Ray> {
        *color = self.color.clone();
        let mut ri = self.refraction_index;
        if hit_record.front_face {
            ri = 1.0 / ri;
        }
        let uv = &ray.direction.normalize();
        let n = &hit_record.normal;
        let cos_theta = f64::min((-1.0 * uv).dot(&n), 1.0);
        let sin_theta = (1.0 - cos_theta * cos_theta).sqrt();
        let cannot_refract = ri * sin_theta > 1.0;
        let mut direction = hit_record.material.refract(uv, n, ri);
        let mut rng = rand::rng();
        let rand_f64: f64 = rng.random();
        if cannot_refract || hit_record.material.reflectance(cos_theta, ri) > rand_f64 {
            direction = hit_record.material.reflect(uv, n);
        }
        Some(Ray::new(hit_record.p.clone(), direction))
    }
}

#[wasm_bindgen]
pub fn get_material_titles() -> Vec<String> {
    MATERIALS.map(|item| item.to_string()).to_vec()
}
