# 📷 CNN LEGO Image Classification Project

This project provides a complete pipeline to build, train, evaluate, and use a Convolutional Neural Network (CNN) for image classification using TensorFlow and Keras. It includes scripts for training from scratch, evaluating performance with detailed metrics, and making predictions on new, unseen images.

## 🚀 Features

* **Train from Scratch:** Build and train a CNN with 3+ convolutional layers on your custom image dataset.
* **Data Preprocessing:** Automatically resizes, normalizes, and augments training data (flips, rotations, zooms) to improve model robustness.
* **Detailed Evaluation:** Computes overall accuracy, per-class precision, recall, F1-score, and generates a visual confusion matrix to identify misclassifications.
* **Single Image Prediction:** A ready-to-use script to classify a single image using the trained model.
* **Jupyter Notebooks:** Interactive notebooks for visualizing the training process and evaluation results.

---

## 📂 Project Structure

Here is the recommended directory structure for the project:

cnn-image-classification/ │ ├── data/ │ ├── train/ # Training images (subfolders are class names) │ │ ├── class_A/ │ │ └── class_B/ │ ├── test/ # Test images (subfolders are class names) │ │ ├── class_A/ │ │ └── class_B/ │ └── predict/ # Folder for images you want to predict │ └── new_image.jpg │ ├── model.py # Script to build and train the CNN ├── evaluate_model.py # Script to evaluate the model on the test set ├── predict_single_image.py # Script to predict a single image │ ├── cnn_training_and_plotting.ipynb # Notebook for interactive training & plotting ├── evaluation_notebook.ipynb # Notebook for interactive evaluation │ ├── cnn_classifier.keras # Saved model file after training ├── requirements.txt # Project dependencies └── README.md # This file
---

## 🛠️ Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/AWS-Cloud-Club-Mehran-UET/HacktoberFest-2.0.git]
    cd lego_image_classification
    ```

2.  **Create and activate a virtual environment (recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3.  **Install the required dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

---

## 📋 How to Use

Follow these steps to go from training to prediction.

### 1. Prepare Your Data

* Organize your images into `data/train` and `data/test` directories as shown in the project structure.
* Each class of images must be in its own subdirectory within `train` and `test`. The name of the subdirectory will be used as the class label (e.g., `class_A`).

### 2. Train the Model

* Run the `model.py` script from your terminal. It will load data from the `data/train` directory, train the model, and save the result.
* **Command:**
    ```bash
    python model.py
    ```
* **Output:** This will create two files:
    * `cnn_classifier.keras`: The saved, trained model.
    * `training_history.png`: A plot of the training/validation accuracy and loss.
* Alternatively, you can run the `cnn_training_and_plotting.ipynb` notebook for a more interactive experience.

### 3. Evaluate the Model

* Run the `evaluate_model.py` script to see how well your model performs on the test set.
* Make sure your test data is in the `data/test` directory.
* **Command:**
    ```bash
    python evaluate_model.py
    ```
* **Output:**
    * A Classification Report (precision, recall, F1-score) printed to the console.
    * A Confusion Matrix plot saved as `confusion_matrix.png`.
* Alternatively, use the `evaluation_notebook.ipynb` notebook.

### 4. Predict a New Image

* Place an image you want to classify into the `data/predict` folder.
* Open the `predict_single_image.py` script and update the configuration variables at the top:
    * `IMAGE_PATH`: Set the path to your new image (e.g., `'data/predict/new_image.jpg'`).
    * `MODEL_PATH`: Ensure it points to your saved model (`'cnn_classifier.keras'`).
    * `CLASS_NAMES`: Update the list with your exact class names, in alphabetical order.
* **Command:**
    ```bash
    python predict_single_image.py
    ```
* **Output:** The script will print the predicted class and the confidence score to your terminal.

---

## 📦 Dependencies (`requirements.txt`)

```txt
tensorflow
matplotlib
seaborn
scikit-learn
numpy