// InputShipping.js
import React from "react"
import { FiTruck } from "react-icons/fi"

const InputShipping = ({
  register,
  value,
  time,
  cost,
  currency,
  description,
  checked,
  handleShippingCost,
  type = 'checkbox',
  name = "shippingOption",
  Icon = FiTruck,
  onOpenModal // new prop to handle modal opening
}) => {

  // const handleClick = () => {
  //   if (value === 'Delivery' && onOpenModal) { // Open modal only for 'Delivery'
  //     onOpenModal()
  //   }
  //   handleShippingCost(value, cost)
  // }

  const handleChange = (event) => {
    if (event.target.checked && value === 'Delivery' && onOpenModal) {
      onOpenModal()
    }
    handleShippingCost(value, cost, event.target.checked) // Passa o estado checked
  }

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
              onClick={handleChange}
              name={name}
              type={type}
              value={value}
              checked={checked}
              className="form-checkbox outline-none focus:ring-0 text-customRed"
            />
          </div>
        </label>
      </div>
    </div>
  )
}

export default InputShipping