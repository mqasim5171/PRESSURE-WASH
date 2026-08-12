import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * SolarHouseScene
 * ----------------
 * A real Three.js 3D scene: a stylized low-poly solar house, built entirely
 * from primitive geometry (no external models/textures to load), with a
 * camera that actually moves through 3D space as the person scrolls.
 *
 * `progressRef` is a plain mutable ref (NOT React state) holding the raw
 * scroll progress (0 -> 1), updated every scroll tick by the parent
 * component outside the Canvas. Reading it inside useFrame gives buttery,
 * un-throttled per-frame updates without triggering React re-renders 60
 * times a second.
 */

// ---- Camera path -----------------------------------------------------
// One position + look-at target per scene beat. CameraRig lerps smoothly
// between these as progressRef moves from 0 to 1.
const CAMERA_POSITIONS = [
  [0.0, 1.7, 10.5],   // 1. eye-level, front of house
  [0.2, 4.6, 9.0],    // 2. rising
  [1.0, 7.6, 6.2],    // 3. elevated roof view (~65-70 deg down)
  [6.2, 8.4, 6.2],    // 4. 45-degree isometric
  [2.2, 10.8, 2.0],   // 5. hovering above roof, drone joins
  [0.7, 13.0, 0.7],   // 6. near-top-down thermal read (slightly off-axis)
];
const CAMERA_TARGETS = [
  [0, 1.6, 0],
  [0, 2.0, 0],
  [0, 2.2, -0.2],
  [0, 1.8, -0.2],
  [0.2, 2.6, -0.3],
  [0.2, 2.6, -0.3],
];

function CameraRig({ progressRef }) {
  const { camera } = useThree();

  const posKeys = useMemo(() => CAMERA_POSITIONS.map((p) => new THREE.Vector3(...p)), []);
  const targetKeys = useMemo(() => CAMERA_TARGETS.map((p) => new THREE.Vector3(...p)), []);
  const currentPos = useRef(new THREE.Vector3().copy(posKeys[0]));
  const currentTarget = useRef(new THREE.Vector3().copy(targetKeys[0]));
  const scratchPos = useRef(new THREE.Vector3());
  const scratchTarget = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const p = THREE.MathUtils.clamp(progressRef.current, 0, 1);
    const segments = posKeys.length - 1;
    const scaled = p * segments;
    const i = Math.min(segments - 1, Math.floor(scaled));
    const localT = scaled - i;

    scratchPos.current.copy(posKeys[i]).lerp(posKeys[i + 1], localT);
    scratchTarget.current.copy(targetKeys[i]).lerp(targetKeys[i + 1], localT);

    // Frame-rate independent smoothing (exponential decay), so the camera
    // trails the scroll position instead of snapping to it every frame.
    const smooth = 1 - Math.pow(0.001, delta);
    currentPos.current.lerp(scratchPos.current, smooth);
    currentTarget.current.lerp(scratchTarget.current, smooth);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentTarget.current);
  });

  return null;
}

// ---- Sky -------------------------------------------------------------
const SKY_VERTEX = `
  varying vec3 vWorldPosition;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const SKY_FRAGMENT = `
  uniform vec3 topColor;
  uniform vec3 bottomColor;
  uniform float offset;
  uniform float exponent;
  varying vec3 vWorldPosition;
  void main() {
    float h = normalize(vWorldPosition + vec3(0.0, offset, 0.0)).y;
    gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
  }
`;

function SkyDome() {
  const uniforms = useMemo(
    () => ({
      topColor: { value: new THREE.Color("#0a1128") },
      bottomColor: { value: new THREE.Color("#f4793a") },
      offset: { value: 6 },
      exponent: { value: 0.75 },
    }),
    []
  );
  return (
    <mesh>
      <sphereGeometry args={[95, 32, 16]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={SKY_VERTEX}
        fragmentShader={SKY_FRAGMENT}
        side={THREE.BackSide}
        fog={false}
      />
    </mesh>
  );
}

// ---- Ground & distant skyline -----------------------------------------
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
      <planeGeometry args={[220, 220]} />
      <meshStandardMaterial color="#182a17" roughness={1} />
    </mesh>
  );
}

const SKYLINE_BUILDINGS = [
  [-16, 6, 1.4], [-12.5, 9.5, 1.8], [-9, 5, 1.2], [-5, 11.5, 2.2],
  [-1, 7, 1.6], [3, 13.5, 2.4], [7, 8, 1.6], [10.5, 6, 1.3], [14, 10, 2.0],
];

function DistantSkyline() {
  return (
    <group position={[0, 0, -38]}>
      {SKYLINE_BUILDINGS.map(([x, h, w], i) => (
        <mesh key={i} position={[x, h / 2, 0]}>
          <boxGeometry args={[w, h, w]} />
          <meshStandardMaterial color="#14152a" emissive="#3a2c18" emissiveIntensity={0.3} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

// ---- Trees -------------------------------------------------------------
function Trees({ count }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(() => {
    const items = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
      const radius = 9 + Math.random() * 8;
      items.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        scale: 0.7 + Math.random() * 0.9,
      });
    }
    return items;
  }, [count]);

  useEffect(() => {
    if (!meshRef.current) return;
    data.forEach((d, i) => {
      dummy.position.set(d.x, d.scale * 0.9, d.z);
      dummy.scale.setScalar(d.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [data, dummy]);

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <coneGeometry args={[1, 2.6, 6]} />
      <meshStandardMaterial color="#1d3b26" roughness={1} />
    </instancedMesh>
  );
}

// ---- Solar panels (thermal-reactive) -----------------------------------
const PANEL_ROWS = 4;
const PANEL_COLS = 6;
const HOTSPOT_INDICES = [3, 9, 20];

function SolarPanelsGrid({ progressRef }) {
  const meshes = useRef([]);

  const layout = useMemo(() => {
    const items = [];
    const usableW = 5.6;
    const usableD = 3.4;
    const cellW = usableW / PANEL_COLS;
    const cellD = usableD / PANEL_ROWS;
    let id = 0;
    for (let r = 0; r < PANEL_ROWS; r++) {
      for (let c = 0; c < PANEL_COLS; c++) {
        items.push({
          x: -usableW / 2 + cellW * (c + 0.5),
          z: -usableD / 2 + cellD * (r + 0.5),
          id: id++,
        });
      }
    }
    return items;
  }, []);

  const coolColor = useMemo(() => new THREE.Color("#0d1b3d"), []);
  const thermalBase = useMemo(() => new THREE.Color("#241f5e"), []);
  const hotColor = useMemo(() => new THREE.Color("#ff5a1f"), []);
  const scratch = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    const p = progressRef.current;
    const thermalT = THREE.MathUtils.clamp((p - 0.72) / 0.28, 0, 1);
    meshes.current.forEach((mesh, i) => {
      if (!mesh) return;
      const hotSlot = HOTSPOT_INDICES.indexOf(i);
      const isHot = hotSlot !== -1;
      scratch.copy(coolColor).lerp(thermalBase, thermalT);
      if (isHot) {
        const phase = hotSlot * 0.12;
        const localT = THREE.MathUtils.clamp((thermalT - phase) / (1 - phase), 0, 1);
        scratch.lerp(hotColor, localT);
        mesh.material.emissiveIntensity = 0.35 + localT * 2.4;
      } else {
        mesh.material.emissiveIntensity = 0.15 + thermalT * 0.35;
      }
      mesh.material.color.copy(scratch);
      mesh.material.emissive.copy(scratch);
    });
  });

  return (
    <group>
      {layout.map((p, i) => (
        <mesh key={p.id} ref={(el) => (meshes.current[i] = el)} position={[p.x, 0.1, p.z]}>
          <boxGeometry args={[0.82, 0.04, 0.48]} />
          <meshStandardMaterial color="#0d1b3d" emissive="#0d1b3d" emissiveIntensity={0.15} roughness={0.3} metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// ---- House body ----------------------------------------------------
function HouseModel({ progressRef }) {
  const pitch = THREE.MathUtils.degToRad(9);
  const windowX = [-1.9, -0.6, 0.7];

  return (
    <group>
      {/* Walls */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[6, 3, 4]} />
        <meshStandardMaterial color="#efe7d8" roughness={0.85} />
      </mesh>

      {/* Garage door */}
      <mesh position={[1.7, 0.9, 2.01]}>
        <boxGeometry args={[2.1, 1.7, 0.05]} />
        <meshStandardMaterial color="#8a6a45" roughness={0.6} />
      </mesh>

      {/* Entry door */}
      <mesh position={[-2.3, 1.0, 2.01]}>
        <boxGeometry args={[0.75, 1.9, 0.05]} />
        <meshStandardMaterial color="#2b2620" roughness={0.5} />
      </mesh>

      {/* Lit windows, dusk glow */}
      {windowX.map((wx, i) => (
        <mesh key={i} position={[wx, 2.0, 2.01]}>
          <boxGeometry args={[0.55, 0.6, 0.03]} />
          <meshStandardMaterial color="#fff1c2" emissive="#ffcf6e" emissiveIntensity={1.5} />
        </mesh>
      ))}

      {/* Skillion (mono-pitch) roof, tilted so the back edge is the ridge */}
      <group rotation={[-pitch, 0, 0]} position={[0, 3.05, -0.3]}>
        <mesh>
          <boxGeometry args={[6.6, 0.15, 4.8]} />
          <meshStandardMaterial color="#22262e" roughness={0.7} metalness={0.2} />
        </mesh>
        <group position={[0, 0.1, 0]}>
          <SolarPanelsGrid progressRef={progressRef} />
        </group>
      </group>
    </group>
  );
}

// ---- Drone (joins in the last third of the scroll) --------------------
function Drone({ progressRef }) {
  const groupRef = useRef();
  const bodyMatRef = useRef();

  const arms = [
    [0.26, 0, 0.26],
    [-0.26, 0, 0.26],
    [0.26, 0, -0.26],
    [-0.26, 0, -0.26],
  ];

  useFrame((state) => {
    if (!groupRef.current) return;
    const p = progressRef.current;
    const appear = THREE.MathUtils.clamp((p - 0.55) / 0.2, 0, 1);
    const t = state.clock.elapsedTime;
    const bob = Math.sin(t * 1.6) * 0.08;
    groupRef.current.position.set(1.2, 5.6 + bob, 0.5);
    groupRef.current.rotation.y = t * 0.5;
    groupRef.current.visible = appear > 0.01;
    groupRef.current.scale.setScalar(0.5 + appear * 0.5);
    if (bodyMatRef.current) bodyMatRef.current.opacity = appear;
  });

  return (
    <group ref={groupRef} visible={false}>
      <mesh>
        <sphereGeometry args={[0.15, 10, 10]} />
        <meshStandardMaterial ref={bodyMatRef} color="#e8e8e8" transparent opacity={0} roughness={0.4} metalness={0.3} />
      </mesh>
      {arms.map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.05, 0.05, 0.4]} />
          <meshStandardMaterial color="#2a2a2a" transparent opacity={0.9} />
        </mesh>
      ))}
      <pointLight color="#8ec9ff" intensity={1.4} distance={3.5} />
    </group>
  );
}

// ---- Root scene content (everything inside <Canvas>) -------------------
export default function SolarHouseScene({ progressRef, isCompact }) {
  return (
    <>
      <SkyDome />
      <fog attach="fog" args={["#1a1830", 24, 74]} />
      <ambientLight intensity={0.55} color="#8899cc" />
      <directionalLight position={[10, 12, 6]} intensity={1.15} color="#ffb37a" />
      <hemisphereLight args={["#3a4a7a", "#1a1512", 0.5]} />

      <Ground />
      <DistantSkyline />
      <Trees count={isCompact ? 18 : 34} />
      <HouseModel progressRef={progressRef} />
      <Drone progressRef={progressRef} />
      <CameraRig progressRef={progressRef} />
    </>
  );
}
