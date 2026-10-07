"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

export type DevicePhase = "idle" | "scanning" | "done";

export interface DeviceScanResult {
  verdict: "asli" | "palsu";
  uid: string;
}

interface Device3DProps {
  phase: DevicePhase;
  progress: number;
  result: DeviceScanResult | null;
  onScanRequest: () => void;
}

function drawLcd(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  phase: DevicePhase,
  progress: number,
  result: DeviceScanResult | null
) {
  ctx.fillStyle = "#0a1f14";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "rgba(0,0,0,0.28)";
  for (let y = 0; y < h; y += 6) ctx.fillRect(0, y, w, 2);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if (phase === "idle") {
    ctx.fillStyle = "#7ddba3";
    ctx.font = "bold 46px monospace";
    ctx.fillText("SCAN KARUNG", w / 2, h / 2 - 28);
    ctx.fillStyle = "#4a7a5c";
    ctx.font = "28px monospace";
    ctx.fillText("tempelkan tag RFID", w / 2, h / 2 + 30);
  } else if (phase === "scanning") {
    ctx.fillStyle = "#d9a441";
    ctx.font = "bold 40px monospace";
    ctx.fillText("MEMINDAI...", w / 2, h / 2 - 40);
    ctx.font = "bold 64px monospace";
    ctx.fillText(`${progress}%`, w / 2, h / 2 + 28);
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(56, h - 44, w - 112, 14);
    ctx.fillStyle = "#d9a441";
    ctx.fillRect(56, h - 44, ((w - 112) * progress) / 100, 14);
  } else if (result) {
    const ok = result.verdict === "asli";
    ctx.fillStyle = ok ? "#4ade80" : "#f87171";
    ctx.font = "bold 52px monospace";
    ctx.fillText(ok ? "PUPUK ASLI" : "WASPADA", w / 2, h / 2 - 30);
    ctx.fillStyle = "#d9a441";
    ctx.font = "32px monospace";
    ctx.fillText(result.uid, w / 2, h / 2 + 38);
  }
}

function LcdScreen({
  phase,
  progress,
  result,
}: {
  phase: DevicePhase;
  progress: number;
  result: DeviceScanResult | null;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useEffect(() => {
    const canvas = texture.image as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawLcd(ctx, canvas.width, canvas.height, phase, progress, result);
    texture.needsUpdate = true;
  }, [texture, phase, progress, result]);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh position={[0, 1.15, 0.58]}>
      <planeGeometry args={[1.8, 0.9]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function Sack({ phase, progress }: { phase: DevicePhase; progress: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    g.visible = phase !== "idle";
    if (!g.visible) return;
    const t = phase === "scanning" ? progress / 100 : 1;
    const e = 1 - Math.pow(1 - Math.min(t, 1), 3);
    g.position.set(
      THREE.MathUtils.lerp(1.1, 0.85, e),
      THREE.MathUtils.lerp(0.4, -1.35, e),
      THREE.MathUtils.lerp(4.6, 1.7, e)
    );
    g.rotation.y = THREE.MathUtils.lerp(0.5, -0.15, e);
  });

  return (
    <group ref={ref} visible={false}>
      <RoundedBox args={[1.1, 1.4, 0.7]} radius={0.14} smoothness={4}>
        <meshStandardMaterial color="#e8dcc3" roughness={0.95} />
      </RoundedBox>
      <mesh position={[0, 0.28, 0.36]}>
        <planeGeometry args={[1.02, 0.32]} />
        <meshStandardMaterial color="#1c5b3c" roughness={0.9} />
      </mesh>
      <mesh position={[0.22, -0.12, 0.36]}>
        <planeGeometry args={[0.34, 0.22]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>
      <mesh position={[0.22, -0.12, 0.37]}>
        <planeGeometry args={[0.2, 0.1]} />
        <meshBasicMaterial color="#1c5b3c" toneMapped={false} />
      </mesh>
    </group>
  );
}

function Device({ phase, progress, result, onScanRequest }: Device3DProps) {
  const [hoverBtn, setHoverBtn] = useState(false);
  const btnRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const b = btnRef.current;
    if (!b) return;
    const s = hoverBtn ? 1.12 : 1;
    b.scale.setScalar(THREE.MathUtils.lerp(b.scale.x, s, 0.2));
    void state;
  });

  const waves = [0.34, 0.52, 0.7];

  return (
    <group rotation={[0.12, -0.4, 0]} position={[0, -0.15, 0]}>
      {/* bodi alat */}
      <RoundedBox args={[2.4, 4.2, 1.05]} radius={0.3} smoothness={6}>
        <meshStandardMaterial color="#14532d" roughness={0.5} metalness={0.2} />
      </RoundedBox>
      {/* bezel LCD */}
      <RoundedBox args={[2.05, 1.3, 0.14]} radius={0.07} smoothness={4} position={[0, 1.15, 0.5]}>
        <meshStandardMaterial color="#070b09" roughness={0.35} metalness={0.3} />
      </RoundedBox>
      <LcdScreen phase={phase} progress={progress} result={result} />

      {/* tombol pindai */}
      <mesh
        ref={btnRef}
        position={[0, -0.1, 0.56]}
        rotation={[Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onScanRequest();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoverBtn(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHoverBtn(false);
          document.body.style.cursor = "auto";
        }}
      >
        <cylinderGeometry args={[0.42, 0.47, 0.24, 40]} />
        <meshStandardMaterial color="#d9a441" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0, -0.1, 0.69]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.02, 40]} />
        <meshStandardMaterial color="#8a6420" roughness={0.5} />
      </mesh>

      {/* zona baca RFID */}
      <group position={[0, -1.5, 0.54]}>
        {waves.map((r, i) => (
          <mesh key={r}>
            <torusGeometry args={[r, 0.032, 10, 40, Math.PI]} />
            <meshBasicMaterial
              color="#d9a441"
              toneMapped={false}
              transparent
              opacity={0.95 - i * 0.25}
            />
          </mesh>
        ))}
        <mesh position={[0, -0.06, 0]}>
          <circleGeometry args={[0.085, 24]} />
          <meshBasicMaterial color="#d9a441" toneMapped={false} />
        </mesh>
      </group>

      {/* lubang buzzer */}
      {[-0.14, 0, 0.14].map((x) =>
        [-1.95, -2.08].map((y) => (
          <mesh key={`${x}${y}`} position={[x, y, 0.53]}>
            <circleGeometry args={[0.045, 16]} />
            <meshBasicMaterial color="#0a0f0c" toneMapped={false} />
          </mesh>
        ))
      )}

      <Sack phase={phase} progress={progress} />
    </group>
  );
}

function Scene(props: Device3DProps) {
  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} />
      <directionalLight position={[-4, 2, -4]} intensity={0.5} color="#9fd8b4" />
      <Device {...props} />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={5}
        maxDistance={11}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 1.6}
        autoRotate
        autoRotateSpeed={0.9}
      />
    </>
  );
}

export function Device3D(props: Device3DProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.7, 7.6], fov: 38 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <Scene {...props} />
      </Suspense>
    </Canvas>
  );
}
