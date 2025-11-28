use wasm_bindgen::prelude::*;


pub fn generate_pixel(x: u32, y: u32) -> Point{
    let r = rand::random_range(0..255);
    let g = rand::random_range(0..255);
    let b = rand::random_range(0..255);
    Point { x, y, color: Vector3 { x: r, y: g, z: b } }
}

#[derive(Debug)]
struct Point {
    x: u32,
    y: u32,
    color: Color
}

#[derive(Debug)]
struct Vector3 {
    x: i32, 
    y: i32,
    z: i32,
}

type Color = Vector3;