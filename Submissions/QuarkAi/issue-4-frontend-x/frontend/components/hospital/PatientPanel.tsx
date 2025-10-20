"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Activity, 
  User, 
  Calendar, 
  Clock,
  Stethoscope,
  Heart,
  Building2,
  UserCheck,
  Users,
  FileText,
  AlertCircle,
  Sparkles,
  Zap,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

// Response type for Claude AI prediction
interface ClaudeResponse {
  will_readmit_30_days: boolean;
  readmission_probability: number;
  readmission_risk?: string;
  risk_classification: string;
  confidence: number;
  key_risk_factors?: string;
  clinical_reasoning?: string;
  actionable_recommendations?: string;
  ai_analysis: boolean;
  model: string;
  parameters_analyzed?: Record<string, unknown>;
}

// Response type for Flask ML Model prediction
interface FlaskResponse {
  prediction: number;           // 0 = Not readmitted, 1 = Readmitted
  probability: number;          // 0.0 to 1.0 (risk probability)
  risk_level: 'Low' | 'Medium' | 'High';  // Risk level classification
  confidence: number;           // Model confidence (0.0 to 1.0)
}

export interface PatientData {
  id: string;
  discharge_disposition_id: number;
  age_numeric: number;
  age: string;
  time_in_hospital: number;
  gender: string;
  num_procedures: number;
  has_circulatory: number;
  admission_source_id: number;
  admission_type_id: number;
  race: string;
  number_diagnoses: number;
  _orig_index: number;
  diag_3: string;
  total_visits: number;
  total_chronic_conditions: number;
  prediction?: 'readmitted' | 'not_readmitted';
  isAnalyzing?: boolean;
  claudeResponse?: ClaudeResponse;
  flaskResponse?: FlaskResponse;
}

interface PatientPanelProps {
  patient: PatientData;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: Partial<PatientData>) => void;
}

interface ParameterConfig {
  key: keyof PatientData;
  label: string;
  icon: React.ReactNode;
  type: 'number' | 'select';
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string | number; label: string }[];
  description: string;
}

const parameters: ParameterConfig[] = [
  {
    key: 'discharge_disposition_id',
    label: 'Discharge Disposition',
    icon: <Building2 className="h-4 w-4" />,
    type: 'number',
    min: 1,
    max: 29,
    step: 1,
    description: 'Where patient was discharged (1=Home, 2=Transfer, etc.)'
  },
  {
    key: 'age_numeric',
    label: 'Age (Numeric)',
    icon: <Calendar className="h-4 w-4" />,
    type: 'number',
    min: 0,
    max: 100,
    step: 1,
    description: 'Patient age in years'
  },
  {
    key: 'age',
    label: 'Age Range',
    icon: <User className="h-4 w-4" />,
    type: 'select',
    options: [
      { value: '[0-10)', label: '0-10 years' },
      { value: '[10-20)', label: '10-20 years' },
      { value: '[20-30)', label: '20-30 years' },
      { value: '[30-40)', label: '30-40 years' },
      { value: '[40-50)', label: '40-50 years' },
      { value: '[50-60)', label: '50-60 years' },
      { value: '[60-70)', label: '60-70 years' },
      { value: '[70-80)', label: '70-80 years' },
      { value: '[80-90)', label: '80-90 years' },
      { value: '[90-100)', label: '90-100 years' }
    ],
    description: 'Age range category'
  },
  {
    key: 'time_in_hospital',
    label: 'Time in Hospital',
    icon: <Clock className="h-4 w-4" />,
    type: 'number',
    min: 1,
    max: 14,
    step: 1,
    description: 'Days spent in hospital'
  },
  {
    key: 'gender',
    label: 'Gender',
    icon: <Users className="h-4 w-4" />,
    type: 'select',
    options: [
      { value: 'Male', label: 'Male' },
      { value: 'Female', label: 'Female' }
    ],
    description: 'Patient gender'
  },
  {
    key: 'num_procedures',
    label: 'Number of Procedures',
    icon: <Stethoscope className="h-4 w-4" />,
    type: 'number',
    min: 0,
    max: 10,
    step: 1,
    description: 'Number of procedures performed'
  },
  {
    key: 'has_circulatory',
    label: 'Circulatory Disease',
    icon: <Heart className="h-4 w-4" />,
    type: 'select',
    options: [
      { value: 0, label: 'No' },
      { value: 1, label: 'Yes' }
    ],
    description: 'Has circulatory system disease'
  },
  {
    key: 'admission_source_id',
    label: 'Admission Source',
    icon: <Building2 className="h-4 w-4" />,
    type: 'number',
    min: 1,
    max: 25,
    step: 1,
    description: 'Source of admission (1=Physician, 7=Emergency, etc.)'
  },
  {
    key: 'admission_type_id',
    label: 'Admission Type',
    icon: <UserCheck className="h-4 w-4" />,
    type: 'number',
    min: 1,
    max: 8,
    step: 1,
    description: 'Type of admission (1=Emergency, 2=Urgent, 3=Elective)'
  },
  {
    key: 'race',
    label: 'Race',
    icon: <Users className="h-4 w-4" />,
    type: 'select',
    options: [
      { value: 'Caucasian', label: 'Caucasian' },
      { value: 'AfricanAmerican', label: 'African American' },
      { value: 'Hispanic', label: 'Hispanic' },
      { value: 'Asian', label: 'Asian' },
      { value: 'Other', label: 'Other' }
    ],
    description: 'Patient race'
  },
  {
    key: 'number_diagnoses',
    label: 'Number of Diagnoses',
    icon: <FileText className="h-4 w-4" />,
    type: 'number',
    min: 1,
    max: 16,
    step: 1,
    description: 'Number of diagnoses recorded'
  },
  {
    key: '_orig_index',
    label: 'Original Index',
    icon: <FileText className="h-4 w-4" />,
    type: 'number',
    min: 0,
    max: 100000,
    step: 1,
    description: 'Original dataset index'
  },
  {
    key: 'diag_3',
    label: 'Primary Diagnosis',
    icon: <Activity className="h-4 w-4" />,
    type: 'select',
    options: [
      { value: '250', label: 'Diabetes (250)' },
      { value: '428', label: 'Heart Failure (428)' },
      { value: '401', label: 'Hypertension (401)' },
      { value: '486', label: 'Pneumonia (486)' },
      { value: '414', label: 'Coronary Disease (414)' },
      { value: 'Other', label: 'Other' }
    ],
    description: 'Primary diagnosis code'
  },
  {
    key: 'total_visits',
    label: 'Total Visits',
    icon: <Building2 className="h-4 w-4" />,
    type: 'number',
    min: 1,
    max: 50,
    step: 1,
    description: 'Total number of hospital visits'
  },
  {
    key: 'total_chronic_conditions',
    label: 'Chronic Conditions',
    icon: <Heart className="h-4 w-4" />,
    type: 'number',
    min: 0,
    max: 10,
    step: 1,
    description: 'Total chronic conditions'
  }
];

export default function PatientPanel({ patient, isOpen, onClose, onUpdate }: PatientPanelProps) {
  const [formData, setFormData] = useState(patient);

  useEffect(() => {
    setFormData(patient);
  }, [patient]);

  const handleInputChange = (key: keyof PatientData, value: number | string) => {
    const newData = { ...formData, [key]: value };
    setFormData(newData);
    onUpdate({ [key]: value });
  };

  const handleFlaskAnalyze = async () => {
    try {
      onUpdate({ isAnalyzing: true });

      const payload = {
        discharge_disposition_id: formData.discharge_disposition_id,
        age_numeric: formData.age_numeric,
        age: formData.age,
        time_in_hospital: formData.time_in_hospital,
        gender: formData.gender,
        num_procedures: formData.num_procedures,
        has_circulatory: formData.has_circulatory,
        admission_source_id: formData.admission_source_id,
        admission_type_id: formData.admission_type_id,
        race: formData.race,
        number_diagnoses: formData.number_diagnoses,
        _orig_index: formData._orig_index,
        diag_3: formData.diag_3,
        total_visits: formData.total_visits,
        total_chronic_conditions: formData.total_chronic_conditions
      };

      // Use environment variable for Flask API URL
      const flaskApiUrl = process.env.NEXT_PUBLIC_FLASK_API || 'https://ml-backend-1zgp.onrender.com';
      
      const response = await fetch(`${flaskApiUrl}/predict/readmission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: FlaskResponse = await response.json();
      
      // Binary prediction: 0 = not readmitted, 1 = readmitted
      const prediction: 'readmitted' | 'not_readmitted' = 
        result.prediction === 1 ? 'readmitted' : 'not_readmitted';

      onUpdate({ 
        isAnalyzing: false, 
        prediction,
        flaskResponse: result
      });

      const probabilityPercent = Math.round(result.probability * 100);
      toast.success('ML Model Analysis Complete!', {
        description: `${result.risk_level} Risk • ${probabilityPercent}% probability`,
        duration: 5000,
      });

    } catch (error) {
      console.error('Flask analysis failed:', error);
      onUpdate({ isAnalyzing: false });
      toast.error('ML API Error', {
        description: error instanceof Error ? error.message : 'Connection failed',
        duration: 6000,
      });
    }
  };

  const handleClaudeAnalyze = async () => {
    try {
      onUpdate({ isAnalyzing: true });

      const payload = {
        discharge_disposition_id: formData.discharge_disposition_id,
        age_numeric: formData.age_numeric,
        age: formData.age,
        time_in_hospital: formData.time_in_hospital,
        gender: formData.gender,
        num_procedures: formData.num_procedures,
        has_circulatory: formData.has_circulatory,
        admission_source_id: formData.admission_source_id,
        admission_type_id: formData.admission_type_id,
        race: formData.race,
        number_diagnoses: formData.number_diagnoses,
        _orig_index: formData._orig_index,
        diag_3: formData.diag_3,
        total_visits: formData.total_visits,
        total_chronic_conditions: formData.total_chronic_conditions
      };

      const response = await fetch('/api/predict-readmission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Binary classification: will_readmit_30_days true/false
      const prediction: 'readmitted' | 'not_readmitted' = 
        result.will_readmit_30_days ? 'readmitted' : 'not_readmitted';

      onUpdate({ 
        isAnalyzing: false, 
        prediction,
        claudeResponse: result
      });

      const probabilityPercent = Math.round((result.readmission_probability || 0) * 100);
      toast.success('Claude AI Analysis Complete!', {
        description: `${result.risk_classification} • ${probabilityPercent}% probability`,
        duration: 5000,
      });

    } catch (error) {
      console.error('Claude analysis failed:', error);
      onUpdate({ isAnalyzing: false });
      toast.error('Claude AI Error', {
        description: error instanceof Error ? error.message : 'Connection failed',
        duration: 6000,
      });
    }
  };

  const getPredictionBadge = () => {
    if (patient.isAnalyzing) {
      return (
        <Badge variant="outline" className="border-blue-400/50 text-blue-400 bg-blue-400/10 animate-pulse">
          🔄 Analyzing...
        </Badge>
      );
    }

    if (patient.prediction === 'readmitted') {
      return (
        <Badge variant="outline" className="border-red-400/50 text-red-400 bg-red-400/10">
          ⚠️ High Readmission Risk
        </Badge>
      );
    }

    if (patient.prediction === 'not_readmitted') {
      return (
        <Badge variant="outline" className="border-green-400/50 text-green-400 bg-green-400/10">
          ✅ Low Readmission Risk
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="border-gray-400/50 text-gray-400 bg-gray-400/10">
        ⏳ Awaiting Analysis
      </Badge>
    );
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 30,
        opacity: { duration: 0.2 }
      }}
      className="fixed right-0 top-0 h-full w-96 z-50 bg-black/40 backdrop-blur-xl border-l border-gray-700/50 shadow-2xl"
    >
      <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600">
        <Card className="h-full bg-transparent border-0 rounded-none">
          <CardHeader className="relative pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-400/30">
                  <User className="h-5 w-5 text-blue-300" />
                </div>
                <div>
                  <CardTitle className="text-xl text-white font-bold">
                    {patient.id}
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-sm">
                    Hospital Readmission Analysis
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-gray-800/60 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4">
              {getPredictionBadge()}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Parameters */}
            <div className="space-y-4">
              {parameters.map((param, index) => (
                <motion.div
                  key={param.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Label 
                      htmlFor={param.key} 
                      className="text-sm font-medium text-gray-300 flex items-center gap-2"
                    >
                      <span className="text-blue-400">{param.icon}</span>
                      {param.label}
                    </Label>
                    <div className="text-xs text-gray-400 font-mono">
                      {typeof formData[param.key] === 'object' ? '' : String(formData[param.key])}
                    </div>
                  </div>

                  {param.type === 'number' ? (
                    <div className="space-y-2">
                      <Slider
                        value={[formData[param.key] as number]}
                        onValueChange={([value]) => handleInputChange(param.key, value)}
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        className="w-full"
                      />
                      
                      <Input
                        id={param.key}
                        type="number"
                        value={formData[param.key] as number}
                        onChange={(e) => handleInputChange(param.key, parseFloat(e.target.value) || 0)}
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        className="h-8 bg-gray-800/60 border-gray-600/50 text-white text-xs"
                      />
                    </div>
                  ) : (
                    <Select
                      value={String(formData[param.key])}
                      onValueChange={(value) => {
                        const finalValue = param.key === 'has_circulatory' ? Number(value) : value;
                        handleInputChange(param.key, finalValue);
                      }}
                    >
                      <SelectTrigger className="h-8 bg-gray-800/60 border-gray-600/50 text-white text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {param.options?.map((option) => (
                          <SelectItem key={String(option.value)} value={String(option.value)}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  <p className="text-xs text-gray-500 mt-1 leading-tight">
                    {param.description}
                  </p>

                  {index < parameters.length - 1 && (
                    <Separator className="mt-4 bg-gray-700/50" />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Analysis Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleClaudeAnalyze}
                disabled={patient.isAnalyzing}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                  text-white font-medium py-2.5 rounded-lg transition-all duration-200 
                  disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {patient.isAnalyzing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing with Claude AI...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span>Predict with Claude AI</span>
                  </div>
                )}
              </Button>

              <Button
                onClick={handleFlaskAnalyze}
                disabled={patient.isAnalyzing}
                variant="outline"
                className="w-full bg-gray-800/60 hover:bg-gray-700/60 border-blue-500/50 text-blue-300 
                  hover:border-blue-400 font-medium py-2.5 rounded-lg transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {patient.isAnalyzing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-300 rounded-full animate-spin" />
                    <span>Processing with ML Model...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>Predict with ML Model</span>
                  </div>
                )}
              </Button>

              {/* Results Display */}
              {(patient.claudeResponse || patient.flaskResponse) && (
                <div className="mt-4 p-4 bg-gray-800/60 rounded-lg border border-gray-700/50">
                  <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Analysis Results
                  </h4>
                  
                  {patient.claudeResponse && (
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Will Readmit (30d):</span>
                        <span className={`font-medium ${patient.claudeResponse.will_readmit_30_days ? 'text-red-400' : 'text-green-400'}`}>
                          {patient.claudeResponse.will_readmit_30_days ? 'YES - High Risk' : 'NO - Low Risk'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Probability:</span>
                        <span className="text-white font-medium">
                          {Math.round((patient.claudeResponse.readmission_probability || 0) * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Confidence:</span>
                        <span className="text-white font-medium">{patient.claudeResponse.confidence}%</span>
                      </div>
                      {patient.claudeResponse.clinical_reasoning && (
                        <div className="mt-2 p-2 bg-gray-900/50 rounded text-gray-300 text-xs">
                          <div className="font-semibold text-blue-400 mb-1">Clinical Reasoning:</div>
                          {patient.claudeResponse.clinical_reasoning}
                        </div>
                      )}
                      {patient.claudeResponse.key_risk_factors && (
                        <div className="mt-2 p-2 bg-gray-900/50 rounded text-gray-300 text-xs">
                          <div className="font-semibold text-red-400 mb-1">Key Risk Factors:</div>
                          {patient.claudeResponse.key_risk_factors}
                        </div>
                      )}
                      {patient.claudeResponse.actionable_recommendations && (
                        <div className="mt-2 p-2 bg-gray-900/50 rounded text-gray-300 text-xs">
                          <div className="font-semibold text-green-400 mb-1">Recommendations:</div>
                          {patient.claudeResponse.actionable_recommendations}
                        </div>
                      )}
                    </div>
                  )}

                  {patient.flaskResponse && (
                    <div className="space-y-2 text-xs mt-2 pt-2 border-t border-gray-700/50">
                      <div className="font-semibold text-purple-400 mb-2">ML Model Results:</div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Prediction:</span>
                        <span className={`font-medium ${patient.flaskResponse.prediction === 1 ? 'text-red-400' : 'text-green-400'}`}>
                          {patient.flaskResponse.prediction === 1 ? 'Will Readmit' : 'Won\'t Readmit'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Risk Level:</span>
                        <span className={`font-medium ${
                          patient.flaskResponse.risk_level === 'High' ? 'text-red-400' : 
                          patient.flaskResponse.risk_level === 'Medium' ? 'text-yellow-400' : 
                          'text-green-400'
                        }`}>
                          {patient.flaskResponse.risk_level}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Probability:</span>
                        <span className="text-white font-medium">{Math.round(patient.flaskResponse.probability * 100)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Confidence:</span>
                        <span className="text-white font-medium">{Math.round(patient.flaskResponse.confidence * 100)}%</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="text-xs text-gray-500 text-center space-y-1 my-3">
                <p className="flex items-center justify-center gap-1">
                  <AlertCircle className="h-3 w-3"/>
                  AI predictions are for reference only
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
