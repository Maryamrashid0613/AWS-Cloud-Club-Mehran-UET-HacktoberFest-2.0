import streamlit as st
import pickle
import pandas as pd

# Load Model

with open("xgb_readmission_model.pkl", "rb") as f:
    model = pickle.load(f)


feature_names = [
    'total_past_admissions',
    'admission_risk_level',
    'number_emergency',
    'number_diagnoses',
    'time_in_hospital',
    'num_medications',
    'polypharmacy',
    'diabetesMed',
    'num_lab_procedures',
    'number_outpatient',
    'age'
]


# Streamlit UI

st.title("🏥 Hospital Readmission Prediction App")
st.markdown("""
This model predicts the **probability of a patient being readmitted within 30 days**  
based on their demographics, diagnosis history, and treatment data.
""")

st.subheader(" Enter Patient Information:")

# User Inputs
input_data = []
for feature in feature_names:
    value = st.number_input(f"Enter value for **{feature}**:", min_value=0.0, value=0.0)
    input_data.append(value)

# Convert to DataFrame
input_df = pd.DataFrame([input_data], columns=feature_names)


# Prediction

if st.button("🔍 Predict Readmission"):
    prediction = model.predict(input_df)[0]
    probability = model.predict_proba(input_df)[0][1]

    st.write("### 🧾 Input Summary")
    st.dataframe(input_df)

    if prediction == 1:
        st.error(f"⚠️ **High Risk:** Patient likely to be readmitted.\nProbability: {probability:.2f}")
    else:
        st.success(f"✅ **Low Risk:** Patient unlikely to be readmitted.\nProbability: {probability:.2f}")
