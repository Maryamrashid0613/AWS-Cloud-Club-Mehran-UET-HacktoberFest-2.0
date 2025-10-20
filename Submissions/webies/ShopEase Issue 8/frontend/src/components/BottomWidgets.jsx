import React from 'react';

const BottomWidgets = () => {
  return (
    <div className="flex w-full items-stretch gap-5 p-5 flex-col md:flex-row">
      {/* Left Box - Best Seller (Qty) */}
      <div className="bg-white w-full md:w-1/2 rounded-xl shadow-md flex flex-col justify-between p-5">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Best Seller 2025 <span className="text-sm text-gray-500">(Qty)</span>
            </h2>
            <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-md">
              Top 5
            </span>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-3 text-sm font-medium text-gray-500 pb-2">
            <div>SL No</div>
            <div>Product Details</div>
            <div className="text-right">Qty</div>
          </div>

          {/* Table Row */}
          <div className="grid grid-cols-3 text-sm text-gray-800 py-3 border-t border-gray-200">
            <div>1</div>
            <div>
              <div>Dell 3330</div>
              <div className="text-xs text-gray-500">[78024129]</div>
            </div>
            <div className="text-right">1</div>
          </div>
        </div>
      </div>

      {/* Right Box - Best Seller (Price) */}
      <div className="bg-white w-full md:w-1/2 rounded-xl shadow-md flex flex-col justify-between p-5">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Best Seller 2025 <span className="text-sm text-gray-500">(Price)</span>
            </h2>
            <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-md">
              Top 5
            </span>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-3 text-sm font-medium text-gray-500 pb-2">
            <div>SL No</div>
            <div>Product Details</div>
            <div className="text-right">Grand Total</div>
          </div>

          {/* Table Row */}
          <div className="grid grid-cols-3 text-sm text-gray-800 py-3 border-t border-gray-200">
            <div>1</div>
            <div>
              <div>Dell 3330</div>
              <div className="text-xs text-gray-500">[78024129]</div>
            </div>
            <div className="text-right">22000.00</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomWidgets;
