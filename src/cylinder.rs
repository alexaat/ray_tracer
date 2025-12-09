use crate::hittable::*;
use crate::material::*;
use crate::point::*;
use std::rc::Rc;
use crate::tube::*;
use crate::disk::*;

pub struct Cylinder {
    pub top: Point,
    pub bottom: Point,
    pub radius: f64,
    pub material: Rc<dyn Material>,
}

impl Cylinder {
    pub fn new(top: Point, bottom: Point, radius: f64, material: Rc<dyn Material>) -> Self {
        Self {
            top,
            bottom,
            radius,
            material,
        }
    }

    pub fn get_hittable_list(&self) -> HittableList{
        let mut elements = HittableList::new();
        let tube = Tube::new(self.top.clone(), self.bottom.clone(), self.radius, self.material.clone());
        elements.add(tube);
        let top = Disk::new(self.top.clone(), (&self.top-&self.bottom).normalize(), self.radius, self.material.clone());
        elements.add(top);
        let bottom = Disk::new(self.bottom.clone(), (&self.bottom-&self.top).normalize(), self.radius, self.material.clone());
        elements.add(bottom);
        return elements;
    }
}