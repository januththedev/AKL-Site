/**
 * Generates branded placeholder .glb models (glTF 2.0 binary) for the
 * interactive story block. Pure Node — no 3D dependencies. Geometry is
 * generated parametrically (lat/long sphere like the AKL logo globe,
 * armillary rings, and a map pin), then packed as JSON + BIN chunks.
 *
 * Usage: node scripts/generate-glb.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public', 'models');
fs.mkdirSync(outDir, { recursive: true });

/* ---------------------------------------------------------------- geometry */

function uvSphere(r = 1, widthSegs = 36, heightSegs = 24, offsetY = 0) {
  const positions = [];
  const normals = [];
  for (let iy = 0; iy <= heightSegs; iy++) {
    const theta = (iy / heightSegs) * Math.PI;
    const y = r * Math.cos(theta) + offsetY;
    const ringR = r * Math.sin(theta);
    for (let ix = 0; ix <= widthSegs; ix++) {
      const phi = (ix / widthSegs) * Math.PI * 2;
      const x = ringR * Math.cos(phi);
      const z = ringR * Math.sin(phi);
      positions.push(x, y, z);
      const len = Math.hypot(x, y - offsetY, z) || 1;
      normals.push(x / len, (y - offsetY) / len, z / len);
    }
  }
  const indices = [];
  for (let iy = 0; iy < heightSegs; iy++) {
    for (let ix = 0; ix < widthSegs; ix++) {
      const a = iy * (widthSegs + 1) + ix;
      const b = a + widthSegs + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  return { positions, normals, indices };
}

function torus({ R = 1.3, r = 0.05, radialSegs = 72, tubularSegs = 24 }) {
  const positions = [];
  const normals = [];
  for (let j = 0; j <= radialSegs; j++) {
    const theta = (j / radialSegs) * Math.PI * 2;
    const cx = Math.cos(theta);
    const cz = Math.sin(theta);
    for (let i = 0; i <= tubularSegs; i++) {
      const phi = (i / tubularSegs) * Math.PI * 2;
      const cp = Math.cos(phi);
      positions.push((R + r * cp) * cx, r * Math.sin(phi), (R + r * cp) * cz);
      normals.push(cp * cx, Math.sin(phi), cp * cz);
    }
  }
  const indices = [];
  for (let j = 0; j < radialSegs; j++) {
    for (let i = 0; i < tubularSegs; i++) {
      const a = j * (tubularSegs + 1) + i;
      const b = a + tubularSegs + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  return { positions, normals, indices };
}

/** Cone pointing down (map-pin body): base ring at yBase, tip at yTip. */
function coneDown({ yBase = 0.5, yTip = -1.15, R = 0.56, radialSegs = 40 }) {
  const positions = [];
  const normals = [];
  const slope = R / (yBase - yTip); // outward normal tilts up toward the tip
  for (let i = 0; i <= radialSegs; i++) {
    const theta = (i / radialSegs) * Math.PI * 2;
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    positions.push(R * c, yBase, R * s);
    normals.push(c, slope, s);
    positions.push(0.001 * c, yTip, 0.001 * s);
    normals.push(c, slope, s);
  }
  const indices = [];
  for (let i = 0; i < radialSegs; i++) {
    const a = i * 2;
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  // bottom cap
  const capStart = positions.length / 3;
  positions.push(0, yBase, 0);
  normals.push(0, -1, 0);
  for (let i = 0; i <= radialSegs; i++) {
    const theta = (i / radialSegs) * Math.PI * 2;
    positions.push(R * Math.cos(theta), yBase, R * Math.sin(theta));
    normals.push(0, -1, 0);
  }
  for (let i = 0; i < radialSegs; i++) {
    indices.push(capStart, capStart + 1 + i, capStart + 2 + i);
  }
  return { positions, normals, indices };
}

function translateGeometry(g, [tx, ty, tz]) {
  const positions = g.positions.slice();
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] += tx;
    positions[i + 1] += ty;
    positions[i + 2] += tz;
  }
  return { ...g, positions };
}

/* ------------------------------------------------------------- glB packing */

const GLB_MAGIC = 0x46546c67; // 'glTF'
const CHUNK_JSON = 0x4e4f534a; // 'JSON'
const CHUNK_BIN = 0x004e4942; // 'BIN'

function normalizeNormals(g) {
  const normals = g.normals.slice();
  for (let i = 0; i < normals.length; i += 3) {
    const len = Math.hypot(normals[i], normals[i + 1], normals[i + 2]) || 1;
    normals[i] /= len;
    normals[i + 1] /= len;
    normals[i + 2] /= len;
  }
  return { ...g, normals };
}

/**
 * meshes: [{ name, primitives: [{ geometry, material }] }]
 * materials: [{ baseColorFactor, metallicFactor, roughnessFactor }]
 * nodes: [{ mesh, rotation? }]
 */
function buildGLB({ meshes, materials, nodes, name }) {
  const binChunks = [];
  let byteLength = 0;
  const accessors = [];
  const bufferViews = [];

  const pushView = (typedArray, target) => {
    const pad = (4 - (byteLength % 4)) % 4;
    if (pad) {
      binChunks.push(new Uint8Array(pad));
      byteLength += pad;
    }
    bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: typedArray.byteLength, target });
    binChunks.push(new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength));
    byteLength += typedArray.byteLength;
    return bufferViews.length - 1;
  };

  const jsonMeshes = meshes.map((mesh) => ({
    name: mesh.name,
    primitives: mesh.primitives.map(({ geometry, material }) => {
      const g = normalizeNormals(geometry);
      const posArray = g.positions;
      const posCount = posArray.length / 3;
      const min = [
        Math.min(...posArray.filter((_, i) => i % 3 === 0)),
        Math.min(...posArray.filter((_, i) => i % 3 === 1)),
        Math.min(...posArray.filter((_, i) => i % 3 === 2)),
      ];
      const max = [
        Math.max(...posArray.filter((_, i) => i % 3 === 0)),
        Math.max(...posArray.filter((_, i) => i % 3 === 1)),
        Math.max(...posArray.filter((_, i) => i % 3 === 2)),
      ];

      const posView = pushView(new Float32Array(posArray), 34962);
      accessors.push({ bufferView: posView, componentType: 5126, count: posCount, type: 'VEC3', min, max });
      const posIndex = accessors.length - 1;

      const normView = pushView(new Float32Array(g.normals), 34962);
      accessors.push({ bufferView: normView, componentType: 5126, count: posCount, type: 'VEC3' });
      const normIndex = accessors.length - 1;

      const idxView = pushView(new Uint16Array(g.indices), 34963);
      accessors.push({ bufferView: idxView, componentType: 5123, count: g.indices.length, type: 'SCALAR' });
      const idxIndex = accessors.length - 1;

      return { attributes: { POSITION: posIndex, NORMAL: normIndex }, indices: idxIndex, material };
    }),
  }));

  const json = {
    asset: { version: '2.0', generator: 'AKL placeholder generator' },
    scene: 0,
    scenes: [{ name, nodes: nodes.map((_, i) => i) }],
    nodes,
    meshes: jsonMeshes,
    materials: materials.map((m) => ({
      pbrMetallicRoughness: {
        baseColorFactor: m.baseColorFactor,
        metallicFactor: m.metallicFactor,
        roughnessFactor: m.roughnessFactor,
      },
      doubleSided: true,
    })),
    accessors,
    bufferViews,
    buffers: [{ byteLength }],
  };

  const jsonBytes = new TextEncoder().encode(JSON.stringify(json));
  const jsonPad = (4 - (jsonBytes.length % 4)) % 4;
  const jsonChunk = Buffer.concat([Buffer.from(jsonBytes), Buffer.alloc(jsonPad, 0x20)]);
  const binPad = (4 - (byteLength % 4)) % 4;
  const binChunk = Buffer.concat([...binChunks.map((c) => Buffer.from(c)), Buffer.alloc(binPad)]);

  const total = 12 + 8 + jsonChunk.length + 8 + binChunk.length;
  const header = Buffer.alloc(12);
  header.writeUInt32LE(GLB_MAGIC, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(total, 8);
  const jsonHeader = Buffer.alloc(8);
  jsonHeader.writeUInt32LE(jsonChunk.length, 0);
  jsonHeader.writeUInt32LE(CHUNK_JSON, 4);
  const binHeader = Buffer.alloc(8);
  binHeader.writeUInt32LE(binChunk.length, 0);
  binHeader.writeUInt32LE(CHUNK_BIN, 4);

  return Buffer.concat([header, jsonHeader, jsonChunk, binHeader, binChunk]);
}

/* ------------------------------------------------------------------- files */

const GREEN = [0.184, 0.639, 0.381, 1];
const STEEL = [0.78, 0.81, 0.83, 1];
const OFFWHITE = [0.93, 0.95, 0.96, 1];

// Model 1 — armillary globe (echoes the AKL logo mark)
const globe = buildGLB({
  name: 'AKL Globe',
  materials: [
    { baseColorFactor: GREEN, metallicFactor: 0.15, roughnessFactor: 0.28 },
    { baseColorFactor: STEEL, metallicFactor: 0.85, roughnessFactor: 0.26 },
  ],
  meshes: [
    {
      name: 'Globe',
      primitives: [{ geometry: uvSphere(1, 48, 30), material: 0 }],
    },
    {
      name: 'RingHorizontal',
      primitives: [{ geometry: torus({ R: 1.34, r: 0.04 }), material: 1 }],
    },
    {
      name: 'RingVertical',
      primitives: [{ geometry: torus({ R: 1.46, r: 0.03 }), material: 1 }],
    },
  ],
  // quaternions: X,Y,Z,W
  nodes: [{ mesh: 0 }, { mesh: 1, rotation: [Math.sin((68 / 2) * (Math.PI / 180)), 0, 0, Math.cos((68 / 2) * (Math.PI / 180))] }, { mesh: 2, rotation: [Math.SQRT1_2, 0, 0, Math.SQRT1_2] }],
});
fs.writeFileSync(path.join(outDir, 'akl-globe.glb'), globe);

// Model 2 — location pin ("placed worldwide")
const head = uvSphere(0.55, 40, 26, 0.42);
const dot = translateGeometry(uvSphere(0.17, 24, 16), [0, 0.42, 0.46]);
const pin = buildGLB({
  name: 'AKL Pin',
  materials: [
    { baseColorFactor: GREEN, metallicFactor: 0.1, roughnessFactor: 0.3 },
    { baseColorFactor: OFFWHITE, metallicFactor: 0.05, roughnessFactor: 0.45 },
  ],
  meshes: [
    {
      name: 'PinHead',
      primitives: [{ geometry: head, material: 0 }],
    },
    {
      name: 'PinBody',
      primitives: [{ geometry: coneDown({}), material: 0 }],
    },
    {
      name: 'PinDot',
      primitives: [{ geometry: dot, material: 1 }],
    },
  ],
  nodes: [{ mesh: 0 }, { mesh: 1 }, { mesh: 2 }],
});
fs.writeFileSync(path.join(outDir, 'akl-pin.glb'), pin);

for (const f of ['akl-globe.glb', 'akl-pin.glb']) {
  const stat = fs.statSync(path.join(outDir, f));
  console.log(`${f}: ${stat.size} bytes`);
}
