"use client";

import { useRef, memo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Sphere,
  Float,
  Torus,
  Cylinder,
  PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  uniform float uTime;
  uniform float uDistortion;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec3 pos = position;
    float wave = sin(pos.x * 2.0 + uTime) * cos(pos.y * 2.0 + uTime) * 0.2;
    pos += normal * wave * uDistortion;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  uniform float uTime;
  uniform vec3 uColor;
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - dot(normal, viewDir), 2.0);
    vec3 color = mix(uColor * 0.4, vec3(1.0, 0.2, 0.2), fresnel);
    float scan = sin(vUv.y * 50.0 + uTime * 2.0) * 0.01;
    color += scan;
    gl_FragColor = vec4(color, 0.3 + fresnel * 0.3);
  }
`;

// Particle positions — outside component, deterministic
const PARTICLE_COUNT = 80;
const PARTICLE_POSITIONS = (() => {
  const arr = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const s1 = Math.sin(i * 1.1) * 10000;
    const s2 = Math.sin(i * 2.3) * 10000;
    const s3 = Math.sin(i * 3.7) * 10000;
    arr[i * 3] = (s1 - Math.floor(s1) - 0.5) * 14;
    arr[i * 3 + 1] = (s2 - Math.floor(s2) - 0.5) * 14;
    arr[i * 3 + 2] = (s3 - Math.floor(s3) - 0.5) * 6;
  }
  return arr;
})();

// ── Background globe — smaller size ──
function BackgroundGlobe({ scrollProgress }: { scrollProgress: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);

  const uniforms = {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(0x600000) },
    uDistortion: { value: 0.2 },
  };

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = t;
      matRef.current.uniforms.uDistortion.value = 0.2 + scrollProgress * 0.3;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.02;
      groupRef.current.rotation.x = Math.sin(t * 0.08) * 0.04;
    }
  });

  return (
    // Moved to right side — position [2, 0, -3]
    <group ref={groupRef} position={[2, 0, -3]}>
      {/* Reduced from 3.5 to 2.2 */}
      <Sphere args={[2.2, 24, 24]}>
        <shaderMaterial
          ref={matRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          wireframe
          depthWrite={false}
        />
      </Sphere>
    </group>
  );
}

// ── Hex Avatar — properly positioned right side ──
function HexAvatar() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const isMobile = viewport.width < 8;

  // Right side on desktop, center-top on mobile
  const position: [number, number, number] = isMobile
    ? [0, 1.2, 0]
    : [3.5, 0, 0];
  const scale = isMobile ? 0.6 : 0.9;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const { mouse } = state;

    if (groupRef.current) {
      groupRef.current.rotation.y += 0.006;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -mouse.y * 0.2,
        0.04,
      );
    }

    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.15 + Math.sin(t * 2) * 0.1;
    }

    if (orbitRef.current) {
      orbitRef.current.position.x = Math.cos(t * 1.2) * 1.6;
      orbitRef.current.position.z = Math.sin(t * 1.2) * 1.6;
      orbitRef.current.position.y = Math.sin(t * 0.6) * 0.25;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* Hex prism */}
        <Cylinder args={[1, 1, 0.35, 6]} rotation={[Math.PI / 2, 0, 0]}>
          <meshPhongMaterial
            color="#6b0000"
            emissive="#ff2020"
            emissiveIntensity={0.5}
            shininess={140}
            transparent
            opacity={0.95}
          />
        </Cylinder>

        {/* Wireframe overlay */}
        <Cylinder args={[1.01, 1.01, 0.36, 6]} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial
            color="#ff2020"
            wireframe
            transparent
            opacity={0.5}
          />
        </Cylinder>

        {/* Inner glow */}
        <Sphere args={[0.5, 16, 16]}>
          <meshBasicMaterial color="#ff2020" transparent opacity={0.07} />
        </Sphere>

        {/* Single pulsing ring */}
        <Torus
          ref={ringRef}
          args={[1.4, 0.01, 8, 48]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshBasicMaterial color="#ff2020" transparent opacity={0.2} />
        </Torus>
      </Float>

      {/* Orbiting dot */}
      <Sphere ref={orbitRef} args={[0.06, 8, 8]} position={[1.6, 0, 0]}>
        <meshBasicMaterial color="#ff2020" />
      </Sphere>

      {/* Glow light */}
      <pointLight color="#ff2020" intensity={1.2} distance={3.5} />
    </group>
  );
}

// ── Particles ──
function Particles() {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0002;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[PARTICLE_POSITIONS, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#ff2020"
        transparent
        opacity={0.25}
        sizeAttenuation
      />
    </points>
  );
}

// ── Export ──
export const HeroCanvas = memo(function HeroCanvas({
  scrollProgress = 0,
}: {
  scrollProgress: number;
}) {
  return (
    <div
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0, pointerEvents: "none" }}
    >
      <Canvas
        dpr={1}
        gl={{
          antialias: false,
          alpha: false,
          stencil: false,
          depth: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "#000000" }}
      >
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1.0} color="#ff2020" />
        <pointLight position={[-5, -3, 2]} intensity={0.3} color="#660000" />

        <BackgroundGlobe scrollProgress={scrollProgress} />
        <HexAvatar />
        <Particles />

        <PerspectiveCamera
          makeDefault
          position={[0, 0, 8 - scrollProgress * 1.5]}
          fov={50}
        />
      </Canvas>
    </div>
  );
});
