use crate::hittable::*;
use crate::material::*;
use crate::point::Point;
use crate::quad::*;
use crate::vector3::*;
use std::rc::Rc;

pub struct Block {
    pub a: Point,
    pub b: Point,
    pub material: Rc<dyn Material>,
    pub rotate: Vector3,
}

impl Block {
    pub fn new(a: Point, b: Point, material: Rc<dyn Material>) -> Self {
        Self {
            a,
            b,
            material,
            rotate: Vector3::new(0.0, 0.0, 0.0),
        }
    }

    pub fn get_hittable_list(&self) -> HittableList {
        let mut sides = HittableList::new();
        // Construct the two opposite vertices with the minimum and maximum coordinates.
        let min = Point::new(
            f64::min(self.a.x, self.b.x),
            f64::min(self.a.y, self.b.y),
            f64::min(self.a.z, self.b.z),
        );
        let max = Point::new(
            f64::max(self.a.x, self.b.x),
            f64::max(self.a.y, self.b.y),
            f64::max(self.a.z, self.b.z),
        );

        let dx = Vector3::new(max.x - min.x, 0.0, 0.0);
        let dy = Vector3::new(0.0, max.y - min.y, 0.0);
        let dz = Vector3::new(0.0, 0.0, max.z - min.z);

        let transform_vector = (&self.a + &self.b) * 0.5;

        let mut side = Quad::new(
            Point::new(min.x, min.y, max.z),
            dx.clone(),
            dy.clone(),
            self.material.clone(),
        );
        self.transform_side(&transform_vector, &mut side);
        sides.add(side); // front

        let mut side = Quad::new(
            Point::new(max.x, min.y, max.z),
            -1.0 * dz.clone(),
            dy.clone(),
            self.material.clone(),
        );
        self.transform_side(&transform_vector, &mut side);
        sides.add(side); // right

        let mut side = Quad::new(
            Point::new(max.x, min.y, min.z),
            -1.0 * dx.clone(),
            dy.clone(),
            self.material.clone(),
        );
        self.transform_side(&transform_vector, &mut side);
        sides.add(side); // back

        let mut side = Quad::new(
            Point::new(min.x, min.y, min.z),
            dz.clone(),
            dy,
            self.material.clone(),
        );
        self.transform_side(&transform_vector, &mut side);
        sides.add(side); // left

        let mut side = Quad::new(
            Point::new(min.x, max.y, max.z),
            dx.clone(),
            -1.0 * dz.clone(),
            self.material.clone(),
        );
        self.transform_side(&transform_vector, &mut side);
        sides.add(side); // top

        let mut side = Quad::new(
            Point::new(min.x, min.y, min.z),
            dx,
            dz,
            self.material.clone(),
        );
        self.transform_side(&transform_vector, &mut side);
        sides.add(side); // bottom
        return sides;
    }

    pub fn transform_side(&self, transform_vector: &Vector3, side: &mut Quad) {
        side.q = &side.q - transform_vector;
        side.q = side.q.rotate(&self.rotate);
        side.u = side.u.rotate(&self.rotate);
        side.v = side.v.rotate(&self.rotate);
        side.q = &side.q + transform_vector;
    }
}
