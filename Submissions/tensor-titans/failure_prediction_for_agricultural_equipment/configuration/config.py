from sklearn.base import BaseEstimator, TransformerMixin, clone
from sklearn.utils.validation import check_is_fitted
from sklearn.pipeline import Pipeline
import numpy as np

import sys, os
sys.path.append(os.path.dirname(__file__))

def safe_log_transform(x):
    return np.log1p(x)

def safe_exp_transform(x):
    return np.expm1(x)

class TransformXFeatures(BaseEstimator, TransformerMixin):
  def __init__(self):
        pass
  def fit(self, X, y=None):
      self.n_features_in_ = X.shape[1]
      return self
  def transform(self, X):
      check_is_fitted(self)

      assert X.shape[1] == self.n_features_in_

      df = X.copy()

      types = {'H':2, 'M':1, 'L':0}

      df['Type Encoded'] = df['Type'].map(types)

      df['Temp Ratio'] = df['Process temperature [K]'] / df['Air temperature [K]']
      df['Power'] = df['Torque [Nm]'] * df['Rotational speed [rpm]']
      df['Resistance'] =  df['Torque [Nm]'] / df['Rotational speed [rpm]']   


      df.drop(columns=['UDI', 'Product ID', 'Type'], inplace=True)


      return df 
      
      


class TransformYFeatures(BaseEstimator, TransformerMixin):
  def __init__(self):
        pass
  def fit(self, X, y=None):
      self.n_features_in_ = X.shape[1]
      return self
  def transform(self, X):
      check_is_fitted(self)

      assert X.shape[1] == self.n_features_in_

      df = X.copy()


      failure_cols = ['TWF',	'HDF',	'PWF', 'OSF',	'RNF']
      df['failure_type'] = df[failure_cols].idxmax(axis=1).str.replace('fail_type_', '')
      # Step 2: Drop one-hot columns
      df = df.drop(columns=failure_cols)
      types = {'TWF':0,	'HDF':1,	'PWF':2, 'OSF':3,	'RNF':4}
      df['failure_type'] = df['failure_type'].map(types) 


      return df.values
      
      

tyf = TransformYFeatures()

y_pipeline = Pipeline([
    ('tyf', tyf)
])

class XYPipeline(BaseEstimator):
    def __init__(self, X_pipeline, y_pipeline, model):
        self.X_pipeline = X_pipeline
        self.y_pipeline = y_pipeline
        self.model = model

    def fit(self, X, y):
        # Fit and transform both X and y
        X_transformed = self.X_pipeline.fit_transform(X)
        y_transformed = self.y_pipeline.fit_transform(y)
        self.model.fit(X_transformed, y_transformed)
        return self

    def predict(self, X):
        X_transformed = self.X_pipeline.transform(X)
        y_pred = self.model.predict(X_transformed)

        if hasattr(self.y_pipeline, "inverse_transform"):
            try:
                return self.y_pipeline.inverse_transform(y_pred)
            except Exception:
                return y_pred
        else:
            return y_pred

        return self.y_pipeline.inverse_transform(y_pred)