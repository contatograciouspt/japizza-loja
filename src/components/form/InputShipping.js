// InputShipping.js
import React from "react";
import { FiTruck } from "react-icons/fi";

const InputShipping = ({
  register,
  value,
  time,
  cost,
  currency,
  description,
  checked,
  handleShippingCost,
  onOpenModal
}) => {

  return (
    <div>
      <div className="p-3 card border border-gray-200 bg-white rounded-md">
        <label className="cursor-pointer label">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl mr-3 text-gray-400">
                <FiTruck />
              </span>
              <div>
                <h6 className="font-serif font-medium text-sm text-gray-600">
                  {value}
                </h6>
                <p className="text-xs text-gray-500 font-medium">
                  {description}
                  <span className="font-medium text-gray-600">
                    {currency}
                    {parseFloat(cost).toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
            <input
              {...register("shippingOption")}
              onClick={() => handleShippingCost(value, cost)} // changed 'Frete' to value
              name="shippingOption"
              type="radio"
              value={value}
              checked={checked}
              className="form-radio outline-none focus:ring-0 text-customRed"
            />
          </div>
        </label>
      </div>
      {checked && value === 'Frete' && (
        <button
          type="button"
          onClick={() => {
            console.log('Button Selecionar Região de Entrega clicked - onOpenModal:', onOpenModal); // Debug log
            onOpenModal();
          }}
          className="mt-2 w-full py-2.5 px-4 rounded border font-semibold text-gray-700 bg-white hover:bg-gray-100"
        >
          Selecionar Região de Entrega
        </button>
      )}
    </div>
  );
};

export default InputShipping;