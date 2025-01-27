import React from 'react';

const InputPayment = ({ onChange, disabled, checked, register, Icon, name, value, setShowCard }) => {
  return (
    <div className="px-3 py-4 card border border-gray-200 bg-white rounded-md">
      <label className="cursor-pointer label">
        <div className="flex item-center justify-between">
          <div className="flex items-center">
            <span className="text-xl mr-3 text-gray-400">
              <Icon />
            </span>
            <h6 className="font-serif font-medium text-sm text-gray-600">
              {name}
            </h6>
          </div>
          <input
            {...register('paymentMethod')}
            type="radio"
            style={{ width: '20px', height: '20px', marginLeft: '10px' }}
            value={value}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            name="paymentMethod"
            className="form-radio outline-none focus:ring-0 text-emerald-500"
          />
        </div>
      </label>
    </div>
  );
};

export default InputPayment;
