// components/form/InputShipping.js
import React from "react";
import { FiTruck } from "react-icons/fi";
import { FaStoreAlt } from "react-icons/fa";

const InputShipping = ({
  register,
  value,
  time,
  cost,
  currency,
  description,
  checked,
  handleShippingCost,
  type = 'radio',
  name = "shippingOption",
  Icon = FiTruck,
}) => {

  return (
    <div>
      <div className="p-3 card border border-gray-200 bg-white rounded-md">
        <label className="cursor-pointer label">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl mr-3 text-gray-400">
                <Icon />
              </span>
              <div>
                <h6 className="font-serif font-medium text-sm text-gray-600">
                  {value}
                </h6>
                {description && (
                  <p className="text-xs text-gray-500 font-medium">
                    {description}
                    <span className="font-medium text-gray-600">
                      {currency}
                      {parseFloat(cost).toFixed(2)}
                    </span>
                  </p>
                )}
              </div>
            </div>
            <input
              {...register(name)}
              onClick={() => handleShippingCost(value, cost)}
              name={name}
              type={type}
              value={value}
              checked={checked}
              className="form-radio outline-none focus:ring-0 text-customRed"
            />
          </div>
        </label>
      </div>
    </div>
  );
};

export default InputShipping;