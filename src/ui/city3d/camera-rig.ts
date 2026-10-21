/**
 * Camera controller for the 3D map, kept outside React: it owns the three.js
 * camera, the drag gesture and the momentum glide, and publishes immutable
 * snapshots that screens read with useSyncExternalStore.
 */
import { PanResponder, type PanResponderInstance } from 'react-native';
import * as THREE from 'three';

import { HALF_W } from './world';

export const FOV = 34;
const PITCH = (54 * Math.PI) / 180;
/** How much of the city should fit across the screen, in metres. */
const VISIBLE_W = HALF_W * 2 + 4;

export type CameraSnapshot = {
  width: number;
  height: number;
  targetZ: number;
  /** projection × view matrix, column-major. */
  viewProjection: readonly number[];
};

export type ScreenPoint = { x: number; y: number; scale: number; visible: boolean };

/** Pure: where a world point lands on screen for a given snapshot. */
export function projectPoint(snap: CameraSnapshot, x: number, y: number, z: number): ScreenPoint {
  const m = snap.viewProjection;
  const clip = (px: number, py: number, pz: number) => {
    const cx = m[0] * px + m[4] * py + m[8] * pz + m[12];
    const cy = m[1] * px + m[5] * py + m[9] * pz + m[13];
    const cz = m[2] * px + m[6] * py + m[10] * pz + m[14];
    const cw = m[3] * px + m[7] * py + m[11] * pz + m[15];
    return { x: cx / cw, y: cy / cw, z: cz / cw, w: cw };
  };
  const a = clip(x, y, z);
  const b = clip(x + 1, y, z);
  const sx = ((a.x + 1) / 2) * snap.width;
  const sy = ((1 - a.y) / 2) * snap.height;
  const scale = Math.abs(((b.x - a.x) / 2) * snap.width);
  const visible =
    a.w > 0 && sx > -140 && sx < snap.width + 140 && sy > -140 && sy < snap.height + 140 && z > snap.targetZ - 75;
  return { x: sx, y: sy, scale, visible };
}

export class CameraRig {
  readonly camera = new THREE.PerspectiveCamera(FOV, 0.5, 1, 400);
  readonly pan: PanResponderInstance;
  private targetZ: number;
  private near = 2;
  private far = -300;
  private width = 0;
  private height = 0;
  private reduced = false;
  private listeners = new Set<() => void>();
  private snapshot: CameraSnapshot;
  private frame: number | null = null;
  private velocity = 0;
  private onDragStart: (() => void) | null = null;

  constructor(startZ: number) {
    this.targetZ = startZ;
    this.camera.userData.target = new THREE.Vector3(0, 0, startZ);
    this.snapshot = { width: 0, height: 0, targetZ: startZ, viewProjection: new Array(16).fill(0) };

    let start = 0;
    let lastY = 0;
    let lastT = 0;
    this.pan = PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6,
      onPanResponderGrant: (_, g) => {
        this.stopGlide();
        start = this.targetZ;
        lastY = g.dy;
        lastT = Date.now();
        this.onDragStart?.();
      },
      onPanResponderMove: (_, g) => {
        const now = Date.now();
        this.velocity = (-(g.dy - lastY) * this.metresPerPx()) / Math.max(1, now - lastT);
        lastY = g.dy;
        lastT = now;
        this.moveTo(start - g.dy * this.metresPerPx());
      },
      onPanResponderRelease: () => {
        if (this.reduced) return;
        let v = this.velocity * 16;
        const step = () => {
          v *= 0.93;
          if (Math.abs(v) < 0.01) {
            this.frame = null;
            return;
          }
          this.moveTo(this.targetZ + v);
          this.frame = requestAnimationFrame(step);
        };
        this.frame = requestAnimationFrame(step);
      },
    });
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = () => this.snapshot;

  setOnDragStart(fn: (() => void) | null) {
    this.onDragStart = fn;
  }

  setReduced(reduced: boolean) {
    this.reduced = reduced;
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.update();
  }

  setLimits(near: number, far: number) {
    this.near = near;
    this.far = far;
    this.moveTo(this.targetZ);
  }

  moveTo(z: number) {
    this.targetZ = Math.max(this.far, Math.min(this.near, z));
    this.update();
  }

  /** Glide to a spot on the route (eased), or jump when motion is reduced. */
  glideTo(z: number) {
    this.stopGlide();
    if (this.reduced) return this.moveTo(z);
    const from = this.targetZ;
    const start = Date.now();
    const step = () => {
      const p = Math.min(1, (Date.now() - start) / 700);
      const e = 1 - Math.pow(1 - p, 3);
      this.moveTo(from + (z - from) * e);
      this.frame = p < 1 ? requestAnimationFrame(step) : null;
    };
    this.frame = requestAnimationFrame(step);
  }

  dispose() {
    this.stopGlide();
    this.listeners.clear();
  }

  private stopGlide() {
    if (this.frame !== null) cancelAnimationFrame(this.frame);
    this.frame = null;
  }

  private distance() {
    const aspect = this.width / Math.max(1, this.height);
    const hfov = 2 * Math.atan(Math.tan((FOV * Math.PI) / 360) * aspect);
    return Math.max(40, VISIBLE_W / 2 / Math.tan(hfov / 2));
  }

  private metresPerPx() {
    if (!this.height) return 0.05;
    return (2 * this.distance() * Math.tan((FOV * Math.PI) / 360)) / this.height / Math.sin(PITCH);
  }

  private update() {
    if (!this.width || !this.height) return;
    const d = this.distance();
    const z = this.targetZ;
    const cam = this.camera;
    cam.aspect = this.width / this.height;
    cam.position.set(0, d * Math.sin(PITCH), z + d * Math.cos(PITCH));
    cam.lookAt(0, 0, z);
    cam.updateProjectionMatrix();
    cam.updateMatrixWorld();
    (cam.userData.target as THREE.Vector3).set(0, 0, z);
    const vp = new THREE.Matrix4().multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse);
    this.snapshot = { width: this.width, height: this.height, targetZ: z, viewProjection: vp.toArray() };
    this.listeners.forEach((l) => l());
  }
}
