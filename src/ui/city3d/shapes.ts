/** Cached geometries. Rounded boxes give everything the soft, chunky look. */
import * as THREE from 'three';

const cache = new Map<string, THREE.BufferGeometry>();

/** A box with rounded vertical edges and bevelled top/bottom, centred on the origin. */
export function roundedBox(w: number, h: number, d: number, r = 0.18): THREE.BufferGeometry {
  const key = `rb:${w.toFixed(2)}:${h.toFixed(2)}:${d.toFixed(2)}:${r}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const radius = Math.min(r, w / 2 - 0.01, d / 2 - 0.01);
  const bevel = Math.min(r * 0.6, h / 4);
  const shape = new THREE.Shape();
  const x = -w / 2 + bevel;
  const y = -d / 2 + bevel;
  const iw = w - bevel * 2;
  const id = d - bevel * 2;
  const rr = Math.max(0.01, radius - bevel);
  shape.moveTo(x + rr, y);
  shape.lineTo(x + iw - rr, y);
  shape.quadraticCurveTo(x + iw, y, x + iw, y + rr);
  shape.lineTo(x + iw, y + id - rr);
  shape.quadraticCurveTo(x + iw, y + id, x + iw - rr, y + id);
  shape.lineTo(x + rr, y + id);
  shape.quadraticCurveTo(x, y + id, x, y + id - rr);
  shape.lineTo(x, y + rr);
  shape.quadraticCurveTo(x, y, x + rr, y);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.01, h - bevel * 2),
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 4,
  });
  // Extrusion runs along +z; turn it so height runs along +y, then centre it.
  geo.rotateX(-Math.PI / 2);
  geo.computeBoundingBox();
  const box = geo.boundingBox!;
  geo.translate(-(box.min.x + box.max.x) / 2, -(box.min.y + box.max.y) / 2, -(box.min.z + box.max.z) / 2);
  geo.computeVertexNormals();
  cache.set(key, geo);
  return geo;
}

/** Triangular gable roof: width along x, depth along z, apex height h. Base at y = 0. */
export function gableRoof(w: number, h: number, d: number): THREE.BufferGeometry {
  const key = `gr:${w.toFixed(2)}:${h.toFixed(2)}:${d.toFixed(2)}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2, 0);
  shape.lineTo(w / 2, 0);
  shape.lineTo(0, h);
  shape.lineTo(-w / 2, 0);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false });
  geo.translate(0, 0, -d / 2);
  geo.computeVertexNormals();
  cache.set(key, geo);
  return geo;
}
