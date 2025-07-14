import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

export function SceneCanvas() {
  return (
    <Canvas className="absolute inset-0 z-0">
      <Stars />
    </Canvas>
  );
}
