# 🧑‍💻 Team lowkey-legends

## 👥 Team Members and Roles
- **Hamza Ali** – DevOps  
- **Rida** – AI/ML  
- **Narmeen** – AI/ML  

---

## 🧩 Projects Overview

### 🏥 Task 02 – Predicting Patient Hospital Readmission Risk  
**Done by:** Narmeen  

**Description:**  
Hospitals face challenges when patients are readmitted within 30 days after discharge. This project builds a predictive model that estimates whether a patient will be readmitted within 30 days based on demographics, diagnoses, procedures, and medication history. The aim is to help clinicians reduce avoidable readmissions.

**Technologies Used:**  
- Python (Pandas, NumPy, Scikit-learn, XGBoost)  
- Jupyter/Colab Notebook  
- Matplotlib, Seaborn (for EDA and visualization)  
- SHAP (for model interpretation)  

**Setup Instructions:**  
1. Install dependencies (`pandas`, `numpy`, `scikit-learn`, `xgboost`, `matplotlib`, `seaborn`, `shap`).  
2. Load the dataset and clean missing values.  
3. Run the notebook to perform EDA, feature engineering, model training, and evaluation.  
4. View visualizations, confusion matrix, and SHAP-based feature importance.

---

### 🧱 Task 04 – LEGO® Minifigure Image Classification  
**Done by:** Rida  

**Description:**  
This project designs and trains a custom Convolutional Neural Network (CNN) from scratch to classify LEGO® Minifigure images into their respective categories. The model is built without using any pre-trained architectures, focusing on efficient CNN design, visualization, and interpretability.

**Technologies Used:**  
- Python (TensorFlow / Keras)  
- NumPy, Matplotlib  
- OpenCV or PIL for image handling  
- Grad-CAM for model explainability  

**Setup Instructions:**  
1. Install dependencies (`tensorflow`, `numpy`, `matplotlib`, `opencv-python`).  
2. Load and preprocess the dataset (resize, normalize, augment).  
3. Train the CNN using `model.py` and visualize accuracy/loss curves.  
4. Evaluate the model (accuracy, precision, recall, F1-score).  
5. Visualize results with confusion matrix and Grad-CAM heatmaps.

---

### 🐳 Task 06 – Advanced Dockerization Challenge (Spring Boot + MySQL + Flyway)  
**Done by:** Hamza  

**Description:**  
This project containerizes a Spring Boot REST API with MySQL and Flyway using Docker and Docker Compose. The API exposes an endpoint `/users` that fetches dummy data seeded through Flyway migrations. It demonstrates persistence, container orchestration, and database versioning.

**Technologies Used:**  
- Spring Boot (Spring Web, Data JPA)  
- MySQL  
- Flyway for database migrations  
- Docker & Docker Compose  

**Setup Instructions:**  
1. Clone the repository:  
   ```bash
   git clone https://github.com/Hamza-ali1223/HacktoberFest-2.0.git
   cd submissions/team-lowkeylegends/task06_Advanced_Dockerization_Challenge
Build and run containers:

bash
Copy code
docker compose up --build
Access the app at:

http://localhost:8080/users

Flyway automatically runs SQL migration scripts to populate the database.