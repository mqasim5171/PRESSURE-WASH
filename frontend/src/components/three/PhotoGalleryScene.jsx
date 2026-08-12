import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";

/**
 * PhotoGalleryScene
 * -------------------
 * Real photo quality + real 3D camera movement, without trying (and
 * failing) to fake photorealism with primitives.
 *
 * Each of the six renders is mapped onto a large textured panel "hung" in
 * 3D space, arranged along a path that recedes into the distance. A true
 * perspective camera flies from panel to panel: the next panel starts
 * small and far away and grows larger purely through real perspective
 * projection (not a CSS scale trick), while the previous one shrinks
 * away behind. Because each panel is an actual object in space rather
 * than a full-bleed background image, nothing is ever cropped — a panel
 * can only go off-frame the way any 3D object naturally would when you
 * look away from it, not have its content sliced off.
 */

const IMAGES = [
  "/images/drone-sequence/scene-1-front.webp",
  "/images/drone-sequence/scene-2-rising.webp",
  "/images/drone-sequence/scene-3-elevated.webp",
  "/images/drone-sequence/scene-4-isometric.webp",
  "/images/drone-sequence/scene-5-drone.webp",
  "/images/drone-sequence/scene-6-thermal.webp",
];

const N = IMAGES.length;
const SEGMENT = 1 / (N - 1);
// Fraction of each segment spent at full opacity ("arrived"). The rest is
// split between a long fade-in (panel emerging out of the distance) and a
// long fade-out (panel receding behind as the next one takes over) - this
// is what makes the perspective growth/shrink read as continuous flight.
const HOLD_FRACTION = 0.22;

// Gallery path: each panel sits further into the distance (-Z), drifting
// up and gently side to side so the flight isn't a dead-straight line.
const PANEL_POS = [
  [0.0, 2.1, 0],
  [1.0, 2.9, -8],
  [-0.8, 3.7, -16],
  [1.1, 4.5, -24],
  [-0.7, 5.2, -32],
  [0.5, 5.8, -40],
];

// Camera sits offset from each panel (behind + to one side + slightly
// below), so the approach is never perfectly head-on - real perspective
// keystoning on the panel edges sells depth as the camera arrives.
const CAMERA_OFFSET = [1.4, -0.3, 6.5];

const POS_KEYFRAMES = PANEL_POS.map(([x, y, z], i) => {
  const sideFlip = i % 2 === 0 ? 1 : -1;
  return [x + CAMERA_OFFSET[0] * sideFlip, y + CAMERA_OFFSET[1], z + CAMERA_OFFSET[2]];
});
const TARGET_KEYFRAMES = PANEL_POS;

// Exported so the outer <Canvas> can set its initial camera position to
// exactly match the first keyframe - no first-frame jump.
export const CAMERA_INITIAL = POS_KEYFRAMES[0];

function opacityRangeFor(i) {
  const bp = (k) => k * SEGMENT;
  const holdHalf = (SEGMENT * HOLD_FRACTION) / 2;
  if (i === 0) {
    return [[0, bp(0) + holdHalf, bp(1)], [1, 1, 0]];
  }
  if (i === N - 1) {
    return [[bp(i - 1), bp(i) - holdHalf, 1], [0, 1, 1]];
  }
  return [
    [bp(i - 1), bp(i) - holdHalf, bp(i) + holdHalf, bp(i + 1)],
    [0, 1, 1, 0],
  ];
}

function evalPiecewise(p, inputRange, outputRange) {
  if (p <= inputRange[0]) return outputRange[0];
  if (p >= inputRange[inputRange.length - 1]) return outputRange[outputRange.length - 1];
  for (let k = 0; k < inputRange.length - 1; k++) {
    if (p >= inputRange[k] && p <= inputRange[k + 1]) {
      const span = inputRange[k + 1] - inputRange[k] || 1;
      const t = (p - inputRange[k]) / span;
      return THREE.MathUtils.lerp(outputRange[k], outputRange[k + 1], t);
    }
  }
  return outputRange[outputRange.length - 1];
}

function CameraRig({ progressRef }) {
  const { camera } = useThree();
  const posKeys = useMemo(() => POS_KEYFRAMES.map((p) => new THREE.Vector3(...p)), []);
  const targetKeys = useMemo(() => TARGET_KEYFRAMES.map((p) => new THREE.Vector3(...p)), []);
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

    const smooth = 1 - Math.pow(0.001, delta);
    currentPos.current.lerp(scratchPos.current, smooth);
    currentTarget.current.lerp(scratchTarget.current, smooth);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentTarget.current);
  });

  return null;
}

const IMAGE_ASPECT = 1919 / 820;
const PANEL_WIDTH = 8.6;
const PANEL_HEIGHT = PANEL_WIDTH / IMAGE_ASPECT;

function PhotoPanel({ index, url, progressRef }) {
  const texture = useLoader(THREE.TextureLoader, url);
  const matRef = useRef();
  const frameMatRef = useRef();
  const range = useMemo(() => opacityRangeFor(index), [index]);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);

  useFrame(() => {
    const o = evalPiecewise(progressRef.current, range[0], range[1]);
    if (matRef.current) matRef.current.opacity = o;
    if (frameMatRef.current) frameMatRef.current.opacity = o * 0.85;
  });

  const [x, y, z] = PANEL_POS[index];

  return (
    <group position={[x, y, z]}>
      {/* thin backing frame, set back slightly - reads as a floating, mounted photo */}
      <mesh position={[0, 0, -0.06]}>
        <planeGeometry args={[PANEL_WIDTH + 0.28, PANEL_HEIGHT + 0.28]} />
        <meshStandardMaterial ref={frameMatRef} color="#0b0e14" roughness={0.6} transparent opacity={0} />
      </mesh>
      <mesh>
        <planeGeometry args={[PANEL_WIDTH, PANEL_HEIGHT]} />
        <meshBasicMaterial ref={matRef} map={texture} transparent opacity={0} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ---- Sky (same gradient technique as before, just re-used here) --------
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
      topColor: { value: new THREE.Color("#05060f") },
      bottomColor: { value: new THREE.Color("#241a2e") },
      offset: { value: 4 },
      exponent: { value: 0.7 },
    }),
    []
  );
  return (
    <mesh>
      <sphereGeometry args={[120, 32, 16]} />
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

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.4, -20]}>
      <planeGeometry args={[300, 300]} />
      <meshStandardMaterial color="#050710" roughness={0.85} metalness={0.15} />
    </mesh>
  );
}

// ---- Drone accent prop, appears near the thermal panels ----------------
function Drone({ progressRef }) {
  const groupRef = useRef();
  const bodyMatRef = useRef();
  const base = PANEL_POS[4];
  const basePos = [base[0] + 1.9, base[1] + 1.3, base[2] + 2.6];

  const arms = [
    [0.24, 0, 0.24],
    [-0.24, 0, 0.24],
    [0.24, 0, -0.24],
    [-0.24, 0, -0.24],
  ];

  useFrame((state) => {
    if (!groupRef.current) return;
    const p = progressRef.current;
    const appear = THREE.MathUtils.clamp((p - 0.6) / 0.25, 0, 1);
    const t = state.clock.elapsedTime;
    const bob = Math.sin(t * 1.6) * 0.1;
    groupRef.current.position.set(basePos[0], basePos[1] + bob, basePos[2]);
    groupRef.current.rotation.y = t * 0.5;
    groupRef.current.visible = appear > 0.01;
    groupRef.current.scale.setScalar(0.5 + appear * 0.5);
    if (bodyMatRef.current) bodyMatRef.current.opacity = appear;
  });

  return (
    <group ref={groupRef} visible={false}>
      <mesh>
        <sphereGeometry args={[0.13, 10, 10]} />
        <meshStandardMaterial ref={bodyMatRef} color="#e8e8e8" transparent opacity={0} roughness={0.4} metalness={0.3} />
      </mesh>
      {arms.map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.045, 0.045, 0.34]} />
          <meshStandardMaterial color="#2a2a2a" transparent opacity={0.9} />
        </mesh>
      ))}
      <pointLight color="#8ec9ff" intensity={1.2} distance={3} />
    </group>
  );
}

export default function PhotoGalleryScene({ progressRef }) {
  return (
    <>
      <SkyDome />
      <fog attach="fog" args={["#05060f", 18, 58]} />
      <ambientLight intensity={0.85} color="#c7d2f0" />
      <directionalLight position={[6, 10, 8]} intensity={0.5} color="#ffb37a" />
      <Ground />
      {IMAGES.map((url, i) => (
        <PhotoPanel key={url} index={i} url={url} progressRef={progressRef} />
      ))}
      <Drone progressRef={progressRef} />
      <CameraRig progressRef={progressRef} />
    </>
  );
}
