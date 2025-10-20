import React, { useState, useEffect, useContext } from 'react';
import { ChevronDown, RefreshCw, HelpCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

// Define the animation variants for the outer container.
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

// Define animation variants for the inner content.
const uniformVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    filter: "blur(2px)"
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};


export default function EditProduct() {
  const [formData, setFormData] = useState({
    productName: '',
    SKU: '',
    category: '',
    productPrice: '',
    quantity: '',
  });

  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,{
        headers:{
          'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(data => setFormData(data))
        .catch(err => console.error("Error fetching product:", err));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      setFormData(data)
      console.log(formData)
    } catch (err) {
      console.error('Error:', err);
    }

    const requiredFields = [
      'productName',
      'SKU',
      'category',
      'quantity',
      'productPrice',
    ];

    let newErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        newErrors[field] = 'This field is required.';
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== '') {
        formDataToSend.append(key, formData[key]);
      }
    }
    navigate('/product/list')

    setErrors({});
    alert('Form submitted!');


  };


  const validateField = (name, value) => {
    const requiredFields = ['productName', 'SKU', 'category','quantity', 'productPrice'];
    if (requiredFields.includes(name) && (!value || value.trim() === '')) {
      setErrors(prev => ({ ...prev, [name]: 'This field is required.' }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const CustomSelect = ({ value, onChange, options, placeholder, name, required = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasError = errors[name];


    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-3 py-2 text-left bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between ${hasError ? 'border-red-500' : 'border-gray-300'
            }`}
        >
          <span className={value === placeholder || !value ? 'text-gray-400' : 'text-gray-900'}>
            {value || placeholder}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            {options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  onChange(name, option);
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    // Apply the container variants to the outermost div
    <motion.div 
      className='p-7 '
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <form onSubmit={handleSubmit}>
        {/* Apply the uniform variants to the main content div */}
        <motion.div 
          className="mx-auto p-6 bg-white rounded-lg shadow-sm"
          variants={uniformVariants}
        >
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Product</h1>

          <p className="text-sm text-gray-500 mb-6">
            The field labels marked with <span className="text-red-500">*</span> are required input fields.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.productName ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.productName && (
                <p className="text-red-500 text-sm mt-1">{errors.productName}</p>
              )}
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
                  className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.productCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                <button
                  type="button"
                  className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 focus:outline-none"
                >
                  <RefreshCw className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              {errors.productCode && (
                <p className="text-red-500 text-sm mt-1">{errors.SKU}</p>
              )}
            </div>

        

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                value={formData.category}
                onChange={handleInputChange}
                options={['Electronics', 'Clothing', 'Food', 'Books']}
                placeholder="Select Category..."
                name="category"
                required
              />
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

        

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.productPrice}
                onChange={(e) => handleInputChange('productPrice', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.productPrice ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.productPrice && (
                <p className="text-red-500 text-sm mt-1">{errors.productPrice}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2"> Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

           
          </div>

          <div className='mt-4'>
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-200"
            >
              Submit
            </button>
          </div>
        </motion.div>


      </form>
    </motion.div>
  );
}