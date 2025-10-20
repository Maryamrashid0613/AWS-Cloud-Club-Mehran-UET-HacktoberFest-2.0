import { NextRequest, NextResponse } from 'next/server';
import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || process.env.NEXT_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.NEXT_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.NEXT_AWS_SECRET_ACCESS_KEY || '',
  },
});

function validateAWSCredentials(): boolean {
  return !!(
    (process.env.AWS_ACCESS_KEY_ID || process.env.NEXT_AWS_ACCESS_KEY_ID) && 
    (process.env.AWS_SECRET_ACCESS_KEY || process.env.NEXT_AWS_SECRET_ACCESS_KEY) && 
    (process.env.AWS_REGION || process.env.NEXT_AWS_REGION)
  );
}

const modelId = "us.anthropic.claude-3-5-sonnet-20241022-v2:0";

export async function POST(request: NextRequest) {
  console.log("Starting Hospital Readmission Risk Analysis with Claude AI");
  try {
    const data = await request.json();
    
    if (!validateAWSCredentials()) {
      console.log('AWS credentials not configured');
      return NextResponse.json(
        { 
          error: 'AWS credentials not configured. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION environment variables.',
          success: false 
        },
        { status: 500 }
      );
    }
    
    const {
      discharge_disposition_id,
      age_numeric,
      age,
      time_in_hospital,
      gender,
      num_procedures,
      has_circulatory,
      admission_source_id,
      admission_type_id,
      race,
      number_diagnoses,
      _orig_index,
      diag_3,
      total_visits,
      total_chronic_conditions
    } = data;

    const prompt = `You are an expert healthcare data scientist specializing in hospital readmission prediction using the Diabetes 130-US Hospitals dataset (1999-2008).

CLINICAL SCENARIO:
Hospitals face challenges with patients being readmitted within 30 days after discharge, leading to increased costs and care quality concerns. Your task is to predict whether this patient will be READMITTED WITHIN 30 DAYS based on their clinical profile.

BINARY CLASSIFICATION TARGET:
- Readmitted within 30 days (<30) → 1 (HIGH RISK - Patient will return to hospital)
- Not readmitted (NO or >30 days) → 0 (LOW RISK - Patient stays healthy)

PATIENT CLINICAL PROFILE:
Demographics:
- Age Range: ${age} (${age_numeric} years)
- Gender: ${gender}
- Race: ${race}

Admission Details:
- Admission Type ID: ${admission_type_id} (1=Emergency, 2=Urgent, 3=Elective, 4=Newborn, 5+=Trauma/Other)
- Admission Source ID: ${admission_source_id} (1=Physician, 7=Emergency, 9=Court/Law, etc.)
- Discharge Disposition ID: ${discharge_disposition_id} (1=Home, 2=Transfer, 3=SNF, 6=Home Health, 11=Expired)

Clinical Indicators:
- Time in Hospital: ${time_in_hospital} days
- Number of Procedures: ${num_procedures}
- Number of Diagnoses: ${number_diagnoses}
- Primary Diagnosis (ICD-9): ${diag_3} (250=Diabetes, 428=Heart Failure, 401=Hypertension, 486=Pneumonia, 414=CAD)
- Has Circulatory Disease: ${has_circulatory === 1 ? 'YES - High cardiovascular risk' : 'NO'}

Historical Patterns:
- Total Hospital Visits: ${total_visits} (indication of healthcare utilization)
- Total Chronic Conditions: ${total_chronic_conditions}
- Dataset Index: ${_orig_index}

EVIDENCE-BASED RISK FACTORS FOR 30-DAY READMISSION:

**HIGH RISK INDICATORS** (Strong predictors of readmission <30 days):
1. Discharge disposition to SNF/Rehab (IDs 3,5,6) vs home (ID 1)
2. Multiple chronic conditions (≥3) - polypharmacy concerns
3. Recent frequent hospitalizations (≥3 visits) - "revolving door" pattern
4. Diabetes complications (diag_3=250.xx variants)
5. Heart failure diagnosis (428) - known high readmission rate
6. Long hospital stay (>7 days) indicating complexity
7. Emergency admission (type_id=1) vs elective (type_id=3)
8. Advanced age (>70) with comorbidities
9. High diagnosis count (≥10) - complex multimorbidity

**MODERATE RISK INDICATORS**:
1. 1-2 chronic conditions
2. 2-3 hospital visits in recent period
3. Hospital stay 4-7 days
4. Urgent admission (type_id=2)
5. Age 60-70 with some comorbidities
6. Circulatory disease present
7. 5-9 diagnoses

**LOW RISK INDICATORS** (Lower probability of 30-day readmission):
1. Discharged home (disposition_id=1)
2. No chronic conditions or only 1
3. First or second hospital visit
4. Short stay (≤3 days)
5. Elective admission (type_id=3)
6. Younger age (<50)
7. Few diagnoses (≤4)
8. No circulatory disease

DIABETES-SPECIFIC CONSIDERATIONS:
- Poorly controlled diabetes (250.xx codes) → high readmission
- Uncontrolled hyperglycemia leads to complications
- Medication non-adherence post-discharge is common
- Comorbid conditions (CVD, kidney disease) increase risk

REQUIRED OUTPUT FORMAT (respond with EXACTLY this JSON structure):
{
  "will_readmit_30_days": true | false,
  "readmission_probability": [number between 0.0 and 1.0, e.g., 0.75 = 75% chance],
  "risk_classification": "HIGH RISK - Likely Readmission" | "MODERATE RISK - Monitor Closely" | "LOW RISK - Stable Discharge",
  "confidence_score": [integer 0-100],
  "key_risk_factors": "[bullet list of top 3-5 factors driving this prediction]",
  "clinical_reasoning": "[2-3 sentence explanation connecting patient features to readmission risk]",
  "actionable_recommendations": "[specific interventions to prevent readmission: e.g., home health referral, medication reconciliation, follow-up timing]"
}

IMPORTANT NOTES:
- False negatives (missing high-risk patients) are costly - prioritize RECALL
- Consider interaction effects (e.g., age + comorbidities + discharge location)
- Base prediction on dataset patterns from 130 US hospitals over 10 years
- Focus on CONTROLLABLE factors clinicians can address

Analyze this patient and predict 30-day readmission risk.`;

    console.log('Sending patient data to Claude for readmission analysis...');

    const command = new ConverseCommand({
      modelId: modelId,
      messages: [{ role: "user", content: [{ text: prompt }] }],
      inferenceConfig: {
        maxTokens: 1500,
        temperature: 0.1, 
      },
    });

    const response = await client.send(command);
    const responseText = response.output?.message?.content?.[0]?.text;
    
    if (!responseText) {
      throw new Error('No response from Claude');
    }

    console.log('Claude AI Readmission Analysis:', responseText);

    try {
      const analysisResult = JSON.parse(responseText);
      
      if (analysisResult.will_readmit_30_days === undefined || !analysisResult.risk_classification) {
        throw new Error('Invalid response format from Claude');
      }

      // Validate and normalize probability
      const probability = Math.max(0, Math.min(1, analysisResult.readmission_probability || 0.5));
      const confidenceScore = Math.max(0, Math.min(100, analysisResult.confidence_score || 50));

      // Determine simple risk level for UI
      const readmissionRisk = analysisResult.will_readmit_30_days ? 'High' : 'Low';

      return NextResponse.json({
        will_readmit_30_days: analysisResult.will_readmit_30_days,
        readmission_probability: probability,
        readmission_risk: readmissionRisk,
        risk_classification: analysisResult.risk_classification,
        confidence: confidenceScore,
        key_risk_factors: analysisResult.key_risk_factors || 'Not specified',
        clinical_reasoning: analysisResult.clinical_reasoning || analysisResult.reasoning || 'Analysis complete',
        actionable_recommendations: analysisResult.actionable_recommendations || analysisResult.recommendations || 'Standard follow-up care recommended',
        ai_analysis: true,
        model: 'Claude AI - AWS Bedrock',
        parameters_analyzed: {
          discharge_disposition_id,
          age_numeric,
          age,
          time_in_hospital,
          gender,
          num_procedures,
          has_circulatory,
          admission_source_id,
          admission_type_id,
          race,
          number_diagnoses,
          _orig_index,
          diag_3,
          total_visits,
          total_chronic_conditions
        }
      });

    } catch (parseError) {
      console.error('Error parsing Claude response:', parseError);
      console.log('Raw Claude response:', responseText);
      
      // Fallback parsing
      const willReadmit = responseText.toLowerCase().includes('will_readmit_30_days') && 
                         responseText.toLowerCase().includes('true');
      const riskLevel = responseText.toLowerCase().includes('high') ? 'High' : 'Low';
      
      return NextResponse.json({
        will_readmit_30_days: willReadmit,
        readmission_probability: willReadmit ? 0.7 : 0.3,
        readmission_risk: riskLevel,
        risk_classification: willReadmit ? 'HIGH RISK - Likely Readmission' : 'LOW RISK - Stable Discharge',
        confidence: 50,
        clinical_reasoning: responseText,
        ai_analysis: true,
        parse_error: true,
        model: 'Claude AI - AWS Bedrock (Fallback)',
        parameters_analyzed: {
          discharge_disposition_id,
          age_numeric,
          age,
          time_in_hospital,
          gender,
          num_procedures,
          has_circulatory,
          admission_source_id,
          admission_type_id,
          race,
          number_diagnoses,
          _orig_index,
          diag_3,
          total_visits,
          total_chronic_conditions
        }
      });
    }

  } catch (error) {
    console.error('Error in readmission prediction API:', error);
    
    if (error instanceof Error && error.message.includes('credential')) {
      return NextResponse.json(
        { 
          error: 'AWS credentials error. Please check your AWS configuration.',
          success: false 
        },
        { status: 401 }
      );
    }
    
    if (error instanceof Error && error.message.includes('access')) {
      return NextResponse.json(
        { 
          error: 'Claude model access denied. Please check your AWS Bedrock permissions.',
          success: false 
        },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to get readmission prediction from Claude AI',
        success: false 
      },
      { status: 500 }
    );
  }
}
