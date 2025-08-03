'use client';

import { useRef, useState, useEffect, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// LOGO版地球模型組件 - 簡化版，專門用於Header LOGO
function EarthLogoModel() {
  const groupRef = useRef<THREE.Group>(null);

  // 載入 GLB 模型
  const { scene } = useGLTF('/models/Globe.glb');

  // 地球自轉動畫 - 模擬真實地球自轉效果
  useFrame((state) => {
    if (groupRef.current) {
      // 真實地球自轉：從西向東（Y軸正方向）
      // 地球24小時一圈，這裡加速展示但保持真實方向
      groupRef.current.rotation.y += 0.008;

      // 模擬地球軸傾斜（23.5度）造成的輕微搖擺
      // 使用正弦波模擬地球在軌道上的輕微擺動
      groupRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 0.2) * 0.05;

      // 添加極其輕微的章動效果（地球軸的微小擺動）
      groupRef.current.rotation.x =
        0.4 + Math.sin(state.clock.elapsedTime * 0.15) * 0.02;
    }
  });

  // 優化模型材質
  useEffect(() => {
    if (scene) {
      // LOGO尺寸，稍微小一點
      scene.scale.setScalar(1.2);

      // 優化材質以適合小尺寸顯示並增強光照效果
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          // 增強材質以更好地反射光線
          if (child.material instanceof THREE.MeshStandardMaterial) {
            // 降低粗糙度，增加光澤感
            child.material.roughness = 0.4;
            // 適度金屬感，增強反射
            child.material.metalness = 0.2;
            // 增強法線貼圖強度
            child.material.normalScale = new THREE.Vector2(1.5, 1.5);
            // 啟用環境貼圖反射
            child.material.envMapIntensity = 1.2;
          } else if (child.material instanceof THREE.MeshPhongMaterial) {
            // 如果是Phong材質，增強高光效果
            child.material.shininess = 100;
            child.material.specular = new THREE.Color(0x404040);
          }

          // 確保材質需要更新
          if (child.material) {
            child.material.needsUpdate = true;
          }
        }
      });
    }
  }, [scene]);

  if (!scene) {
    return (
      <mesh>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshStandardMaterial color="#4080ff" />
      </mesh>
    );
  }

  return (
    <group
      ref={groupRef}
      rotation={[
        0.41, // X軸傾斜：地球軸傾斜約23.5度（0.41弧度）
        -1.2, // Y軸旋轉：調整地球面向觀眾的角度
        0.0, // Z軸：初始為0，動畫中會模擬軌道擺動
      ]}
    >
      <primitive object={scene} />
    </group>
  );
}

// 預載入模型
useGLTF.preload('/models/Globe.glb');

// LOGO用3D地球組件 - 簡化版，無內置光源
export default function EarthLogo() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <mesh>
        <sphereGeometry args={[1.2, 8, 8]} />
        <meshBasicMaterial color="#4080ff" wireframe />
      </mesh>
    );
  }

  return (
    <Suspense
      fallback={
        <mesh>
          <sphereGeometry args={[1.2, 8, 8]} />
          <meshBasicMaterial color="#4080ff" />
        </mesh>
      }
    >
      <EarthLogoModel />
    </Suspense>
  );
}
