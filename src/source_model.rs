use crate::camera::CameraSetup;
use crate::point::*;
use crate::vector3::Vector3;
use serde::Deserialize;
use std::collections::HashMap;

#[derive(Deserialize, Debug)]
pub struct SourceModel {
    pub camera: CameraSetup,
    pub materials: HashMap<String, MaterialType>,
    pub shapes: Vec<HashMap<String, Shape>>,
}

#[derive(Deserialize, Debug)]
pub struct MaterialType {
    #[serde(rename = "type")]
    pub material_type: String,
    pub color: Option<Vector3>,
    pub fuzz: Option<f64>,
    pub refraction_index: Option<f64>,
}

#[derive(Deserialize, Debug)]
pub struct Shape {
    pub center: Option<Vector3>,
    pub radius: Option<f64>,
    pub material: Option<String>,
    pub a: Option<Point>,
    pub b: Option<Point>,
    pub rotate: Option<Vector3>,
    pub top: Option<Vector3>,
    pub bottom: Option<Vector3>,
    pub normal: Option<Vector3>,
}
