import React, { useState } from 'react';
import { ChevronDown, RefreshCw, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const uniformVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    filter: 'blur(2px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const CustomSelect = ({ value, onChange, options, placeholder, name, hasError }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(name, option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 text-left bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between ${
          hasError ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <span className={!value || value === placeholder ? 'text-gray-400' : 'text-gray-900'}>
          {value || placeholder}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(option)}
              className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            >
              {option}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default function AddProductForm() {
  const [formData, setFormData] = useState({
  
    productName: '',
    SKU: '',
    category: '',
    productPrice: 0,
    quantity: 0,
   
  });

  const categoryOptions = ['Electronics', 'Clothing', 'Food', 'Books'];
 

  const [errors, setErrors] = useState({});

  const requiredFields = [
    'productName',
    'SKU',
    'category',
    'productPrice',
    'quantity'
  ];

  const validateForm = () => {
    let newErrors = {};
    requiredFields.forEach((field) => {
      const value = formData[field];
      if (
        !value ||
        (typeof value === 'string' && value.trim() === '') ||
        value === 0
      ) {
        newErrors[field] = 'This field is required.';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {};
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== '') {
        if (typeof formData[key] === 'object' && !Array.isArray(formData[key])) {
          payload[key] = formData[key];
        } else if (Array.isArray(formData[key])) {
          payload[key] = formData[key];
        } else {
          payload[key] = formData[key];
        }
      }
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('API Error:', errorData);
        throw new Error('Network response was not ok');
      }

      const data = await res.json();
      console.log('Success:', data);

      setFormData({
        productName: '',
        SKU: '',
        category: '',
        productPrice: 0,
        quantity: '',

      });
      setErrors({});
      alert('Form submitted successfully!');
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to submit form. Please try again.');
    }
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (requiredFields.includes(name) && (!value || value.toString().trim() === '' || value === 'Nothing selected')) {
      setErrors((prev) => ({ ...prev, [name]: 'This field is required.' }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <motion.div
      className="p-7"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <form onSubmit={handleSubmit}>
        <motion.div
          className="mx-auto p-6 bg-white rounded-lg shadow-sm"
          variants={uniformVariants}
        >
          <motion.h1
            className="text-2xl font-semibold text-gray-900 mb-6"
            variants={uniformVariants}
          >
            Add Product
          </motion.h1>
          <motion.p
            className="text-sm text-gray-500 mb-6"
            variants={uniformVariants}
          >
            The field labels marked with <span className="text-red-500">*</span> are required input
            fields.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            variants={gridVariants}
          >
            {/* Input fields with no individual motion */}
          

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.productName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={formData.SKU}
                  onChange={(e) => handleInputChange('SKU', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.productCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
             
              </div>
              {errors.SKU && <p className="text-red-500 text-sm mt-1">{errors.SKU}</p>}
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                value={formData.category}
                onChange={handleInputChange}
                options={categoryOptions}
                placeholder="Select Category..."
                name="category"
                hasError={!!errors.category}
              />
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>



            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.productPrice}
                onChange={(e) => handleInputChange('productPrice', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.productPrice ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.productPrice && <p className="text-red-500 text-sm mt-1">{errors.productPrice}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2"> Quantity</label>
              <input
                type="number"
                value={formData.alertQuantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

          </motion.div>


          <motion.div className="mt-4" variants={uniformVariants}>
            <motion.button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit
            </motion.button>
          </motion.div>
        </motion.div>
      </form>
    </motion.div>
  );
}