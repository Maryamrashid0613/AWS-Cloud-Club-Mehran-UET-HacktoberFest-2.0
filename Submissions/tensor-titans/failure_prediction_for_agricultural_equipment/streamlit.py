import streamlit as st
import pickle
import numpy as np
import pandas as pd
from configuration.config import XYPipeline, TransformXFeatures, TransformYFeatures, safe_log_transform, safe_exp_transform
import os



# loading trained model
model_path = os.path.join(os.path.dirname(__file__), "final_pipeline.pkl")
with open(model_path, "rb") as f:
    model = pickle.load(f)


type_mapping = {0: 'TWF', 1: 'HDF', 2: 'PWF', 3: 'OSF', 4: 'RNF'}


st.set_page_config(page_title="Machine Failure Predictor", page_icon="⚙️")
st.title("⚙️ Machine Failure Prediction App")
st.write("Provide machine parameters to predict if a failure occurs and its type.")


col1, col2 = st.columns(2)
with col1:
    air_temp = st.number_input("Air temperature [K]", min_value=250.0, max_value=500.0, value=300.0)
    torque = st.number_input("Torque [Nm]", min_value=0.0, max_value=100.0, value=40.0)
    tool_wear = st.number_input("Tool wear [min]", min_value=0.0, max_value=300.0, value=50.0)

with col2:
    process_temp = st.number_input("Process temperature [K]", min_value=250.0, max_value=500.0, value=350.0)
    rotational_speed = st.number_input("Rotational speed [rpm]", min_value=0.0, max_value=3000.0, value=1500.0)
    type_encoded = st.selectbox("Machine Type", options=[('Low (L)', 0), ('Medium (M)', 1), ('High (H)', 2)], format_func=lambda x: x[0])[1]


input_data = pd.DataFrame([{
    'UDI': 0,  # you can provide real value or dummy
    'Product ID': 0,  # real value or dummy
    'Type': st.selectbox("Machine Type", options=['L', 'M', 'H']),
    'Air temperature [K]': air_temp,
    'Process temperature [K]': process_temp,
    'Rotational speed [rpm]': rotational_speed,
    'Torque [Nm]': torque,
    'Tool wear [min]': tool_wear
}])


if st.button("🔍 Predict"):
    preds = model.predict(input_data)

    # Expecting output shape (1, 2)
    fault_flag, fault_type_code = preds[0]

    if fault_flag == 0:
        st.success("✅ No machine failure detected.")
    else:
        fault_type = type_mapping.get(fault_type_code, "Unknown")
        st.error(f"⚠️ Machine failure detected! Type: **{fault_type}**")


st.markdown("---")
st.caption("Built with  using Streamlit and your trained ML pipeline.")

