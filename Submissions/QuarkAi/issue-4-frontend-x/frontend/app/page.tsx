"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { PatientData } from '@/components/hospital/PatientPanel';
import { Activity, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const HospitalScene = dynamic(() => import('@/components/hospital/HospitalScene'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-slate-950">
      <div className="text-white text-xl">Loading 3D Hospital Environment...</div>
    </div>
  )
});

const PatientPanel = dynamic(() => import('@/components/hospital/PatientPanel'), { 
  ssr: false 
});

// Sample patient data generator
function generateSamplePatients(count: number): PatientData[] {
  const genders = ['Male', 'Female'];
  const races = ['Caucasian', 'AfricanAmerican', 'Hispanic', 'Asian', 'Other'];
  const ageRanges = ['[20-30)', '[30-40)', '[40-50)', '[50-60)', '[60-70)', '[70-80)', '[80-90)'];
  const diagnosisCodes = ['250', '428', '401', '486', '414', 'Other'];

  return Array.from({ length: count }, (_, i) => {
    const ageRange = ageRanges[Math.floor(Math.random() * ageRanges.length)];
    const ageNumeric = parseInt(ageRange.match(/\d+/)?.[0] || '50') + Math.floor(Math.random() * 10);

    return {
      id: `Patient-${String(i + 1).padStart(3, '0')}`,
      discharge_disposition_id: Math.floor(Math.random() * 10) + 1,
      age_numeric: ageNumeric,
      age: ageRange,
      time_in_hospital: Math.floor(Math.random() * 10) + 1,
      gender: genders[Math.floor(Math.random() * genders.length)],
      num_procedures: Math.floor(Math.random() * 6),
      has_circulatory: Math.random() > 0.6 ? 1 : 0,
      admission_source_id: Math.floor(Math.random() * 9) + 1,
      admission_type_id: Math.floor(Math.random() * 3) + 1,
      race: races[Math.floor(Math.random() * races.length)],
      number_diagnoses: Math.floor(Math.random() * 12) + 1,
      _orig_index: i,
      diag_3: diagnosisCodes[Math.floor(Math.random() * diagnosisCodes.length)],
      total_visits: Math.floor(Math.random() * 15) + 1,
      total_chronic_conditions: Math.floor(Math.random() * 6),
    };
  });
}

export default function HospitalReadmissionPage() {
  const [patients, setPatients] = useState<PatientData[]>(() => generateSamplePatients(20));
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handlePatientClick = (patient: PatientData) => {
    setSelectedPatient(patient);
    setIsPanelOpen(true);
  };

  const handlePatientUpdate = (updates: Partial<PatientData>) => {
    if (selectedPatient) {
      const updatedPatient = { ...selectedPatient, ...updates };
      setSelectedPatient(updatedPatient);
      
      setPatients(prev =>
        prev.map(p => p.id === selectedPatient.id ? updatedPatient : p)
      );
    }
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  // Calculate statistics
  const stats = {
    total: patients.length,
    analyzed: patients.filter(p => p.prediction).length,
    highRisk: patients.filter(p => p.prediction === 'readmitted').length,
    lowRisk: patients.filter(p => p.prediction === 'not_readmitted').length,
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950">
      {/* Header */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-slate-950 via-slate-950/95 to-transparent py-6 px-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-400/30">
                <Activity className="h-8 w-8 text-blue-400" />
              </div>
              Predicting Patient Hospital Readmission Risk
            </h1>
            <p className="text-gray-400 text-sm ml-14">
              AI-Powered 3D Hospital Environment • Click on any patient to analyze readmission risk
            </p>
          </div>

          <div className="flex gap-3">
            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-400" />
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.total}</div>
                    <div className="text-xs text-gray-400">Total Patients</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.analyzed}</div>
                    <div className="text-xs text-gray-400">Analyzed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.highRisk}</div>
                    <div className="text-xs text-gray-400">High Risk</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Instructions */}
     

      {/* 3D Scene */}
      <HospitalScene
        patients={patients}
        onPatientClick={handlePatientClick}
        selectedPatientId={selectedPatient?.id || null}
      />

      {/* Patient Panel */}
      <AnimatePresence>
        {isPanelOpen && selectedPatient && (
          <PatientPanel
            patient={selectedPatient}
            isOpen={isPanelOpen}
            onClose={handleClosePanel}
            onUpdate={handlePatientUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}