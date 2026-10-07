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
  // Tampilan LCD karakter 16x2 (kayak HD44780 asli)
  ctx.fillStyle = "#0b2417";
  ctx.fillRect(0, 0, w, h);

  // garis sel karakter
  ctx.strokeStyle = "rgba(0,0,0,0.4)";
  ctx.lineWidth = 2;
  for (let i = 0; i <= 16; i++) {
    const x = (i * w) / 16;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#8ff0b3";
  ctx.shadowColor = "#4ade80";
  ctx.shadowBlur = 14;
  ctx.font = "bold 54px 'Courier New', monospace";

  const row = (i: number, text: string) => {
    ctx.fillText(text.substring(0, 16), w / 2, h / 4 + i * (h / 2));
  };

  if (phase === "idle") {
    row(0, "SCAN KARUNG");
    row(1, "tempel tag RFID");
  } else if (phase === "scanning") {
    row(0, "MEMINDAI...");
    const blocks = Math.round((progress / 100) * 16);
    row(1, "█".repeat(blocks) + "░".repeat(16 - blocks));
  } else if (result) {
    const ok = result.verdict === "asli";
    row(0, ok ? "PUPUK ASLI" : "WASPADA !!");
    ctx.font = "bold 42px 'Courier New', monospace";
    row(1, result.uid);
  }
  ctx.shadowBlur = 0;
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

function useSackTextures() {
  const textures = useMemo(() => {
    // anyaman karung
    const weave = document.createElement("canvas");
    weave.width = weave.height = 256;
    const w = weave.getContext("2d");
    if (w) {
      w.fillStyle = "#f2ecdc";
      w.fillRect(0, 0, 256, 256);
      w.strokeStyle = "rgba(120,110,90,0.16)";
      w.lineWidth = 2;
      for (let i = 0; i <= 256; i += 10) {
        w.beginPath();
        w.moveTo(i, 0);
        w.lineTo(i, 256);
        w.stroke();
        w.beginPath();
        w.moveTo(0, i);
        w.lineTo(256, i);
        w.stroke();
      }
    }
    const weaveTex = new THREE.CanvasTexture(weave);
    weaveTex.colorSpace = THREE.SRGBColorSpace;
    weaveTex.wrapS = weaveTex.wrapT = THREE.RepeatWrapping;

    // label depan karung
    const label = document.createElement("canvas");
    label.width = 512;
    label.height = 640;
    const l = label.getContext("2d");
    if (l) {
      l.fillStyle = "#f2ecdc";
      l.fillRect(0, 0, 512, 640);
      l.fillStyle = "#1c5b3c";
      l.fillRect(0, 0, 512, 130);
      l.fillStyle = "#ffffff";
      l.font = "bold 54px sans-serif";
      l.textAlign = "center";
      l.fillText("TANI SUBUR", 256, 84);
      l.fillStyle = "#1c5b3c";
      l.font = "bold 108px sans-serif";
      l.fillText("UREA", 256, 330);
      l.fillStyle = "#5b5344";
      l.font = "bold 62px sans-serif";
      l.fillText("50 kg", 256, 430);
      l.fillStyle = "#8a8172";
      l.font = "30px sans-serif";
      l.fillText("PUPUK BERSUBSIDI", 256, 560);
    }
    const labelTex = new THREE.CanvasTexture(label);
    labelTex.colorSpace = THREE.SRGBColorSpace;
    return { weaveTex, labelTex };
  }, []);

  useEffect(
    () => () => {
      textures.weaveTex.dispose();
      textures.labelTex.dispose();
    },
    [textures]
  );
  return textures;
}

function Sack({ phase, progress }: { phase: DevicePhase; progress: number }) {
  const ref = useRef<THREE.Group>(null);
  const { weaveTex, labelTex } = useSackTextures();

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
      {/* badan karung */}
      <RoundedBox args={[1.15, 1.5, 0.75]} radius={0.16} smoothness={4}>
        <meshStandardMaterial map={weaveTex} roughness={0.95} />
      </RoundedBox>
      {/* label depan */}
      <mesh position={[0, 0.05, 0.385]}>
        <planeGeometry args={[1.0, 1.25]} />
        <meshStandardMaterial map={labelTex} roughness={0.95} />
      </mesh>
      {/* lipatan atas (diikat) */}
      <mesh position={[0, 0.82, 0]}>
        <boxGeometry args={[0.9, 0.18, 0.55]} />
        <meshStandardMaterial color="#e2d8c0" roughness={0.95} />
      </mesh>
      {/* kartu RFID di karung (proporsi kartu asli 85.6 x 54 mm) */}
      <mesh position={[0.28, -0.38, 0.395]}>
        <planeGeometry args={[0.5, 0.315]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.5} />
      </mesh>
      <mesh position={[0.19, -0.305, 0.4]}>
        <planeGeometry args={[0.13, 0.11]} />
        <meshStandardMaterial color="#c9a227" roughness={0.4} metalness={0.5} />
      </mesh>
    </group>
  );
}

function useRc522Texture() {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 360;
    const x = c.getContext("2d");
    if (x) {
      x.fillStyle = "#1e4fa3";
      x.fillRect(0, 0, 512, 360);
      // pola antena (kayak modul RC522 asli)
      x.strokeStyle = "#ffffff";
      x.lineWidth = 6;
      for (let r = 40; r <= 170; r += 26) {
        x.beginPath();
        x.arc(370, 180, r, 0, Math.PI * 2);
        x.stroke();
      }
      x.fillStyle = "#ffffff";
      x.beginPath();
      x.arc(370, 180, 8, 0, Math.PI * 2);
      x.fill();
      // chip + kristal
      x.fillStyle = "#0d0d0d";
      x.fillRect(56, 150, 76, 76);
      x.fillStyle = "#c8c8c8";
      x.fillRect(56, 92, 64, 30);
      // label
      x.fillStyle = "#ffffff";
      x.font = "bold 30px monospace";
      x.textAlign = "left";
      x.fillText("RC522", 56, 320);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function Device({ phase, progress, result, onScanRequest }: Device3DProps) {
  const [hoverBtn, setHoverBtn] = useState(false);
  const btnRef = useRef<THREE.Mesh>(null);
  const rc522Tex = useRc522Texture();

  useFrame(() => {
    const b = btnRef.current;
    if (b) {
      const s = hoverBtn ? 1.12 : 1;
      b.scale.setScalar(THREE.MathUtils.lerp(b.scale.x, s, 0.2));
    }
  });

  const waves = [0.4, 0.6, 0.8];

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

      {/* modul RC522 (biru, kayak aslinya) */}
      <group position={[0, -1.5, 0.54]}>
        <mesh position={[0, 0, -0.03]}>
          <boxGeometry args={[1.5, 1.05, 0.08]} />
          <meshStandardMaterial color="#1a4488" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.015]}>
          <planeGeometry args={[1.44, 1.0]} />
          <meshBasicMaterial map={rc522Tex} toneMapped={false} />
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
