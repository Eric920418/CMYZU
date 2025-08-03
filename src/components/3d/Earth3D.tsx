'use client';

import { useRef, useState, useEffect, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// GLB 地球模型組件
function EarthModel() {
  const groupRef = useRef<THREE.Group>(null);

  // 載入 GLB 模型
  const { scene } = useGLTF('/models/Globe.glb');

  // 調試信息
  useEffect(() => {
    console.log('GLB 模型載入狀態:', { scene });
    if (scene) {
      console.log('GLB 場景物件:', scene);
      console.log('場景子物件數量:', scene.children.length);
    }
  }, [scene]);

  // 動畫：地球自轉 - 更逼真的旋轉效果
  useFrame((state) => {
    if (groupRef.current) {
      // 地球自轉 - 24小時一圈，這裡加速展示
      groupRef.current.rotation.y += 0.003;

      // 添加輕微的搖擺效果，模擬地球軸傾斜
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 1;
    }
  });

  // 優化模型材質和縮放
  useEffect(() => {
    if (scene) {
      // 設定適當的縮放比例
      scene.scale.setScalar(1.2);

      // 遍歷場景中的所有網格，優化材質
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // 啟用陰影
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [scene]);

  if (!scene) {
    return (
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshPhongMaterial color="#4080ff" />
      </mesh>
    );
  }

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

// 預載入 GLB 模型
useGLTF.preload('/models/Earth_1_12756.glb');

// 3D 地球組件 - 使用 GLB 3D 模型
export default function Earth3D() {
  const [isClient, setIsClient] = useState(false);

  // 確保只在客戶端執行，避免 SSR 問題
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 載入檢查和錯誤處理 - 在客戶端渲染前顯示簡單球體
  if (!isClient) {
    return (
      <mesh>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial color="#4080ff" wireframe />
      </mesh>
    );
  }

  return (
    <group>
      {/* 主光源 - 模擬太陽光，來自右上方 */}
      <directionalLight
        position={[10, 5, 5]}
        intensity={2.5}
        color="#FFF8DC" // 暖白色太陽光
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* 環境光 - 模擬宇宙中微弱的星光 */}
      <ambientLight intensity={0.6} color="#404080" />

      {/* 反射光 - 模擬地球反射的光線 */}
      <pointLight
        position={[-8, -2, 8]}
        intensity={0.4}
        color="#4a90e2"
        distance={50}
        decay={2}
      />

      {/* rim light - 邊緣光效果 */}
      <pointLight
        position={[0, 0, -10]}
        intensity={0.3}
        color="#87ceeb"
        distance={30}
        decay={1}
      />

      {/* GLB 地球模型 */}
      <Suspense
        fallback={
          <mesh>
            <sphereGeometry args={[1.5, 16, 16]} />
            <meshBasicMaterial color="#00ff00" wireframe />
          </mesh>
        }
      >
        <EarthModel />
      </Suspense>

      {/* 大氣層光暈效果 - 更逼真的大氣散射 */}
      <mesh>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial
          color="#87CEEB"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 外層大氣光暈 */}
      <mesh>
        <sphereGeometry args={[2.4, 16, 16]} />
        <meshBasicMaterial
          color="#4a90e2"
          transparent
          opacity={0.02}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
