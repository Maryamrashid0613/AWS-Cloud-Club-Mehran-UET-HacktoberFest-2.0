"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { PatientData } from './PatientPanel';

interface HospitalSceneProps {
  patients: PatientData[];
  onPatientClick: (patient: PatientData) => void;
  selectedPatientId: string | null;
}

// Simple Text Component using basic mesh
function SimpleText({ 
  text, 
  position, 
  color = "white" 
}: { 
  text: string; 
  position: [number, number, number]; 
  color?: string;
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshBasicMaterial color={color} transparent opacity={0} />
    </mesh>
  );
}

// Patient 3D Model Component (Simple Box-based)
function Patient({ 
  patient, 
  position, 
  onClick, 
  isSelected 
}: { 
  patient: PatientData; 
  position: [number, number, number]; 
  onClick: () => void;
  isSelected: boolean;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = React.useState(false);
  const [movingToHospital, setMovingToHospital] = React.useState(false);
  const targetPosition = useRef<[number, number, number]>(position);

  // Check if patient should move to hospital
  React.useEffect(() => {
    if (patient.prediction === 'readmitted' && !movingToHospital) {
      setMovingToHospital(true);
      // Hospital entrance position
      targetPosition.current = [0, 0, -6];
    }
  }, [patient.prediction]);

  useFrame((state) => {
    if (meshRef.current) {
      if (movingToHospital) {
        // Move patient towards hospital
        const currentPos = meshRef.current.position;
        const target = targetPosition.current;
        const speed = 0.02;

        // Interpolate position
        currentPos.x += (target[0] - currentPos.x) * speed;
        currentPos.z += (target[2] - currentPos.z) * speed;
        currentPos.y = 0.5 + Math.sin(state.clock.elapsedTime * 4) * 0.1; // Faster bounce when moving

        // Check if reached hospital
        const distance = Math.sqrt(
          Math.pow(currentPos.x - target[0], 2) + 
          Math.pow(currentPos.z - target[2], 2)
        );

        if (distance < 0.5) {
          // Fade out or stop at hospital
          currentPos.y = Math.max(0, currentPos.y - 0.02);
        }
      } else {
        // Normal floating animation at queue position
        meshRef.current.position.x = position[0];
        meshRef.current.position.z = position[2];
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.05;
      }
      
      // Rotation on hover or selection
      if (isSelected || hovered) {
        meshRef.current.rotation.y += 0.02;
      }
    }
  });

  const color = patient.prediction === 'readmitted' 
    ? '#ef4444' 
    : patient.prediction === 'not_readmitted' 
    ? '#22c55e' 
    : '#94a3b8';

  return (
    <group 
      ref={meshRef} 
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Body - Box Shape */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.3, 0.8, 0.3]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={isSelected ? 0.5 : 0.2} 
        />
      </mesh>
      
      {/* Head - Sphere/Box Shape */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={isSelected ? 0.5 : 0.2} 
        />
      </mesh>

      {/* Selection Ring */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
          <ringGeometry args={[0.3, 0.35, 32]} />
          <meshBasicMaterial color="#3b82f6" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Status Indicator */}
      {patient.prediction && (
        <mesh position={[0.3, 1.2, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color={color} />
        </mesh>
      )}
    </group>
  );
}

// Hospital Building Component (Simple Box-based)
function HospitalBuilding() {
  return (
    <group position={[0, 0, -8]}>
      {/* Main Building */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[8, 4, 3]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 4.15, 0]}>
        <boxGeometry args={[8.5, 0.3, 3.5]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>

      {/* Windows */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`window-${i}`} position={[-3 + i * 1.2, 2.5, 1.51]}>
          <boxGeometry args={[0.6, 0.8, 0.1]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* Entrance */}
      <mesh position={[0, 1, 1.6]}>
        <boxGeometry args={[1.5, 2, 0.2]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Red Cross Sign */}
      <group position={[0, 3.5, 1.6]}>
        {/* Horizontal bar */}
        <mesh>
          <boxGeometry args={[0.8, 0.2, 0.1]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
        </mesh>
        {/* Vertical bar */}
        <mesh>
          <boxGeometry args={[0.2, 0.8, 0.1]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
        </mesh>
      </group>
    </group>
  );
}

// Ground Plane
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#1e293b" />
    </mesh>
  );
}

// Queue Lines
function QueueLines({ count }: { count: number }) {
  return (
    <group>
      {Array.from({ length: Math.ceil(count / 5) }).map((_, row) => (
        <mesh 
          key={`line-${row}`} 
          position={[-1.5 + row * 1.5, 0.02, 2]}
        >
          <boxGeometry args={[0.1, 0.05, 5]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      ))}
    </group>
  );
}

// Main Scene Component
function Scene({ patients, onPatientClick, selectedPatientId }: HospitalSceneProps) {
  // Arrange patients in a queue formation (multiple rows)
  const patientPositions = useMemo(() => {
    console.log('Calculating positions for', patients.length, 'patients');
    const positions: [number, number, number][] = [];
    const patientsPerRow = 5;
    const rowSpacing = 1.5;
    const colSpacing = 1.0;

    patients.forEach((_, index) => {
      const row = Math.floor(index / patientsPerRow);
      const col = index % patientsPerRow;
      const x = (col - patientsPerRow / 2) * colSpacing;
      const z = 2 + row * rowSpacing;
      positions.push([x, 0, z]);
    });

    console.log('Positions calculated:', positions.length);
    return positions;
  }, [patients]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[0, 5, 0]} intensity={0.5} />

      {/* Hospital Building */}
      <HospitalBuilding />

      {/* Ground */}
      <Ground />

      {/* Queue Lines */}
      <QueueLines count={patients.length} />

      {/* Patients */}
      {patients.map((patient, index) => (
        <Patient
          key={patient.id}
          patient={patient}
          position={patientPositions[index]}
          onClick={() => onPatientClick(patient)}
          isSelected={selectedPatientId === patient.id}
        />
      ))}

      {/* Camera Controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={25}
        maxPolarAngle={Math.PI / 2.2}
      />
    </>
  );
}

// Main HospitalScene Component
export default function HospitalScene({ patients, onPatientClick, selectedPatientId }: HospitalSceneProps) {
  React.useEffect(() => {
    console.log('HospitalScene mounted with', patients.length, 'patients');
  }, [patients]);

  return (
    <div className="w-full h-screen relative">
      {/* Debug Info */}
     

      <Canvas
        camera={{ position: [0, 8, 12], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        onCreated={() => console.log('Canvas created successfully')}
      >
        <color attach="background" args={['#0f172a']} />
        <fog attach="fog" args={['#0f172a', 15, 35]} />
        
        <React.Suspense fallback={null}>
          <Scene 
            patients={patients} 
            onPatientClick={onPatientClick}
            selectedPatientId={selectedPatientId}
          />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
