import * as THREE from "three";

/**
 * Procedural quartz-like crystal.
 * Hexagonal prism + trigonal termination with slight irregularity.
 * PROVISIONAL — architecture ready to swap for licensed GLB scans.
 */
export function createQuartzGeometry(seed = 1): THREE.BufferGeometry {
  const rand = mulberry(seed);

  const prismRadius = 0.85;
  const prismHeight = 1.9;
  const prism = new THREE.CylinderGeometry(
    prismRadius,
    prismRadius * 0.96,
    prismHeight,
    6,
    4,
    false
  );
  // rotate so a flat face fronts camera
  prism.rotateY(Math.PI / 6);

  const apex = new THREE.ConeGeometry(prismRadius, 1.15, 6, 3, false);
  apex.rotateY(Math.PI / 6);
  apex.translate(0, prismHeight / 2 + 1.15 / 2, 0);

  const base = new THREE.ConeGeometry(prismRadius * 0.96, 0.5, 6, 1, false);
  base.rotateY(Math.PI / 6);
  base.rotateX(Math.PI);
  base.translate(0, -prismHeight / 2 - 0.25, 0);

  const geometries = [prism, apex, base];
  const merged = mergeGeometries(geometries);

  // Irregularity: jitter vertices slightly (except keep silhouette clean)
  const pos = merged.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n = (rand() - 0.5) * 0.055;
    const n2 = (rand() - 0.5) * 0.055;
    // less jitter near apex tip to keep termination crisp
    const damp = THREE.MathUtils.clamp(1.6 - Math.max(0, v.y) * 0.35, 0.45, 1);
    v.x += n * damp;
    v.z += n2 * damp;
    v.y += (rand() - 0.5) * 0.02;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  pos.needsUpdate = true;
  merged.computeVertexNormals();

  // Flat shading preserves crystalline faces
  (merged as THREE.BufferGeometry).computeVertexNormals();
  return merged;
}

function mulberry(seed: number) {
  let a = seed * 1000 + 7;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Minimal merge (avoid BufferGeometryUtils import weight differences)
function mergeGeometries(geos: THREE.BufferGeometry[]): THREE.BufferGeometry {
  let vertexCount = 0;
  let indexCount = 0;
  const nonIndexed = geos.map((g) => g.toNonIndexed());
  for (const g of nonIndexed) {
    vertexCount += g.attributes.position.count;
  }
  const positions = new Float32Array(vertexCount * 3);
  const normals = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);
  let offset = 0;
  for (const g of nonIndexed) {
    const p = g.attributes.position as THREE.BufferAttribute;
    const n = g.attributes.normal as THREE.BufferAttribute;
    const u = g.attributes.uv as THREE.BufferAttribute;
    positions.set(p.array as Float32Array, offset * 3);
    if (n) normals.set(n.array as Float32Array, offset * 3);
    if (u) uvs.set(u.array as Float32Array, offset * 2);
    offset += p.count;
    void indexCount;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  out.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  out.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  return out;
}

/** Procedural stripe texture for agate / tiger's eye / jasper */
export function createStripeTexture(
  colors: string[],
  bands = 24
): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext("2d")!;
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  for (let i = 0; i <= bands; i++) {
    grad.addColorStop(i / bands, colors[i % colors.length]);
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);
  // wavy distortion
  ctx.globalAlpha = 0.25;
  for (let i = 0; i < 40; i++) {
    ctx.strokeStyle = colors[(i * 3) % colors.length];
    ctx.lineWidth = 2 + (i % 5);
    ctx.beginPath();
    for (let x = 0; x <= 512; x += 8) {
      const y = 256 + Math.sin(x * 0.02 + i) * 40 + Math.cos(x * 0.005 + i * 2) * 60;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
