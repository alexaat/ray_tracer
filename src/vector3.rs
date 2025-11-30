use crate::color::*;
use crate::grapics::*;
use std::fmt::{self, Debug};
use std::ops::{Add, Div, Mul, Sub};
use wasm_bindgen::prelude::*;

#[derive(serde::Deserialize, Debug)]
#[wasm_bindgen]
pub struct Vector3 {
    pub x: f64,
    pub y: f64,
    pub z: f64,
}

impl Vector3 {
    pub fn new(x: f64, y: f64, z: f64) -> Self {
        Vector3 { x, y, z }
    }
    pub fn dot(&self, other: &Vector3) -> f64 {
        self.x * other.x + self.y * other.y + self.z * other.z
    }

    pub fn rotate(&self, rotation: &Vector3) -> Self{
        let mut rotated = self.clone();
        rotated = rotated.rotate_around_x(rotation.x);
        rotated = rotated.rotate_around_y(rotation.y);
        rotated = rotated.rotate_around_z(rotation.z);
        rotated
    }

    pub fn rotate_around_z(&self, theta: f64) -> Self{
        let cos_theta = theta.to_radians().cos();
        let sin_theta = theta.to_radians().sin();

        let x_prime = self.x*cos_theta - self.y*sin_theta;
        let y_prime = self.y*cos_theta + self.x*sin_theta;

        Self::new(x_prime, y_prime, self.z) 
    }
    pub fn rotate_around_y(&self, theta: f64) -> Self{
        let cos_theta = theta.to_radians().cos();
        let sin_theta = theta.to_radians().sin();

        let x_prime = self.x*cos_theta - self.z*sin_theta;
        let z_prime = self.z*cos_theta + self.x*sin_theta;

        Self::new(x_prime, self.y, z_prime)
    }
    pub fn rotate_around_x(&self, theta: f64) -> Self{
        let cos_theta = theta.to_radians().cos();
        let sin_theta = theta.to_radians().sin();

        let y_prime = self.y*cos_theta + self.z*sin_theta;
        let z_prime = self.z*cos_theta - self.y*sin_theta;

        Self::new(self.x, y_prime, z_prime)
    }

    pub fn projection_on_vector(&self, target: &Vector3) -> Vector3 {
        (self.dot(target)/target.len_2())*target   
    }

    pub fn projection_on_plane(&self, normal: &Vector3) -> Vector3{
        let projection_on_vector = self.projection_on_vector(&normal);
        self - projection_on_vector
    }

    pub fn angle_in_degrees(&self, other: &Vector3) -> f64{
        (((self.dot(other))/(self.len() * other.len())).acos()).to_degrees()
    }

    pub fn cross(&self, other: &Vector3) -> Self {
        let x = self.y * other.z - self.z * other.y;
        let y = self.z * other.x - self.x * other.z;
        let z = self.x * other.y - self.y * other.x;
        Self { x, y, z }
    }
    pub fn len_2(&self) -> f64 {
        self.x.powi(2) + self.y.powi(2) + self.z.powi(2)
    }
    pub fn len(&self) -> f64 {
        self.len_2().sqrt()
    }

    pub fn normalize(&self) -> Self {
        self / self.len()
    }

    pub fn generate_random_unit_vector() -> Self {
        loop {
            let rand_x: f64 = rand::random_range(-1.0..1.0);
            let rand_y: f64 = rand::random_range(-1.0..1.0);
            let rand_z: f64 = rand::random_range(-1.0..1.0);
            let v = Vector3::new(rand_x, rand_y, rand_z);
            if v.len_2() > 0.0 && v.len_2() < 1.0 {
                return v.normalize();
            }
        }
    }

    pub fn generate_random_unit_vector_on_disk() -> Self {
        loop {
            let rand_x: f64 = rand::random_range(-1.0..1.0);
            let rand_y: f64 = rand::random_range(-1.0..1.0);
            let v = Vector3::new(rand_x, rand_y, 0.0);
            if v.len_2() < 1.0 {
                return v;
            }
        }
    }

    pub fn clamp_color(color: &mut Color) {
        if color.x < 0.0 {
            color.x = 0.0;
        }
        if color.y < 0.0 {
            color.y = 0.0;
        }
        if color.z < 0.0 {
            color.z = 0.0;
        }
        if color.x > 1.0 {
            color.x = 1.0;
        }
        if color.y > 1.0 {
            color.y = 1.0;
        }
        if color.z > 1.0 {
            color.z = 1.0;
        }
    }

    pub fn color_linear_to_gamma(color: &mut Color) {
        let r = linear_to_gamma(color.x);
        let g = linear_to_gamma(color.y);
        let b = linear_to_gamma(color.z);
        color.x = r;
        color.y = g;
        color.z = b;
    }

    pub fn random_range(min: f64, max: f64) -> Color {
        Color::new(
            rand::random_range(min..max),
            rand::random_range(min..max),
            rand::random_range(min..max),
        )
    }
}

impl PartialEq for Vector3 {
    fn eq(&self, v: &Vector3) -> bool {
        self.x == v.x && self.y == v.y && self.z == v.z
    }
}

// impl Debug for Vector3 {
//     fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
//         write!(f, "({}, {}, {})", self.x, self.y, self.z)
//     }
// }

impl Clone for Vector3 {
    fn clone(&self) -> Self {
        Vector3 {
            x: self.x,
            y: self.y,
            z: self.z,
        }
    }
}

impl Add<Vector3> for Vector3 {
    type Output = Self;
    fn add(self, other: Self) -> Self {
        Self {
            x: self.x + other.x,
            y: self.y + other.y,
            z: self.z + other.z,
        }
    }
}
impl Add<&Vector3> for Vector3 {
    type Output = Self;
    fn add(self, other: &Self) -> Self {
        Self {
            x: self.x + other.x,
            y: self.y + other.y,
            z: self.z + other.z,
        }
    }
}
impl Add<Vector3> for &Vector3 {
    type Output = Vector3;

    fn add(self, other: Vector3) -> <Self as Add<Vector3>>::Output {
        Vector3 {
            x: self.x + other.x,
            y: self.y + other.y,
            z: self.z + other.z,
        }
    }
}
impl Add<&Vector3> for &Vector3 {
    type Output = Vector3;

    fn add(self, other: &Vector3) -> <Self as Add<&Vector3>>::Output {
        Vector3 {
            x: self.x + other.x,
            y: self.y + other.y,
            z: self.z + other.z,
        }
    }
}

impl Sub for Vector3 {
    type Output = Self;
    fn sub(self, other: Self) -> Self {
        Self {
            x: self.x - other.x,
            y: self.y - other.y,
            z: self.z - other.z,
        }
    }
}
impl Sub<&Vector3> for Vector3 {
    type Output = Vector3;
    fn sub(self, other: &Vector3) -> <Self as Sub<&Vector3>>::Output {
        Self {
            x: self.x - other.x,
            y: self.y - other.y,
            z: self.z - other.z,
        }
    }
}
impl Sub<Vector3> for &Vector3 {
    type Output = Vector3;
    fn sub(self, other: Vector3) -> <Self as Sub<Vector3>>::Output {
        Vector3 {
            x: self.x - other.x,
            y: self.y - other.y,
            z: self.z - other.z,
        }
    }
}
impl Sub<&Vector3> for &Vector3 {
    type Output = Vector3;

    fn sub(self, other: &Vector3) -> <Self as Sub<&Vector3>>::Output {
        Vector3 {
            x: self.x - other.x,
            y: self.y - other.y,
            z: self.z - other.z,
        }
    }
}

impl Mul for Vector3 {
    type Output = Vector3;
    fn mul(self, rhs: Vector3) -> <Self as Mul<Vector3>>::Output {
        Vector3::new(self.x * rhs.x, self.y * rhs.y, self.z * rhs.z)
    }
}
impl Mul<f64> for Vector3 {
    type Output = Self;

    fn mul(self, rhs: f64) -> Self {
        Self {
            x: self.x * rhs,
            y: self.y * rhs,
            z: self.z * rhs,
        }
    }
}

impl Mul<usize> for Vector3 {
    type Output = Self;

    fn mul(self, rhs: usize) -> Self {
        Self {
            x: rhs as f64 * self.x,
            y: rhs as f64 * self.y,
            z: rhs as f64 * self.z,
        }
    }
}
impl Mul<usize> for &Vector3 {
    type Output = Vector3;
    fn mul(self, rhs: usize) -> <Self as Mul<usize>>::Output {
        Vector3 {
            x: self.x * (rhs as f64),
            y: self.y * (rhs as f64),
            z: self.z * (rhs as f64),
        }
    }
}
impl Mul<Vector3> for usize {
    type Output = Vector3;

    fn mul(self, rhs: Vector3) -> <Self as Mul<Vector3>>::Output {
        Vector3 {
            x: self as f64 * rhs.x,
            y: self as f64 * rhs.y,
            z: self as f64 * rhs.z,
        }
    }
}
impl Mul<&Vector3> for usize {
    type Output = Vector3;
    fn mul(self, rhs: &Vector3) -> <Self as Mul<&Vector3>>::Output {
        Vector3 {
            x: self as f64 * rhs.x,
            y: self as f64 * rhs.y,
            z: self as f64 * rhs.z,
        }
    }
}
impl Mul<Vector3> for f64 {
    type Output = Vector3;

    fn mul(self, rhs: Vector3) -> Vector3 {
        Vector3 {
            x: self * rhs.x,
            y: self * rhs.y,
            z: self * rhs.z,
        }
    }
}
impl Mul<&Vector3> for f64 {
    type Output = Vector3;

    fn mul(self, rhs: &Vector3) -> Vector3 {
        Vector3 {
            x: self * rhs.x,
            y: self * rhs.y,
            z: self * rhs.z,
        }
    }
}

impl Div<f64> for Vector3 {
    type Output = Self;

    fn div(self, rhs: f64) -> Self {
        Self {
            x: self.x / rhs,
            y: self.y / rhs,
            z: self.z / rhs,
        }
    }
}
impl Div<f64> for &Vector3 {
    type Output = Vector3;
    fn div(self, rhs: f64) -> <Self as Div<f64>>::Output {
        Vector3 {
            x: self.x / rhs,
            y: self.y / rhs,
            z: self.z / rhs,
        }
    }
}

impl fmt::Display for Vector3 {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "({}, {}, {})", self.x, self.y, self.z)
    }
}