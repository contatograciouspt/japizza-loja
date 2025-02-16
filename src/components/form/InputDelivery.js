// components/form/InputDelivery.js
import React from "react";

const InputDelivery = ({
    register,
    value,
    checked,
    onChange,
    type = 'checkbox',
    name,
    Icon,
    disabled = false,
}) => {
    return (
        <div>
            <div className="p-3 card border border-gray-200 bg-white rounded-md">
                <label className="cursor-pointer label">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            {Icon && (
                                <span className="text-2xl mr-3 text-gray-400">
                                    <Icon />
                                </span>
                            )}
                            <div>
                                <h6 className="font-serif font-medium text-sm text-gray-600">
                                    {name || "Pagamento na Entrega"}
                                </h6>
                            </div>
                        </div>
                        <input
                            {...register(name || "pagamentoNaEntrega")}
                            type={type}
                            name={name || "pagamentoNaEntrega"}
                            checked={checked}
                            onChange={onChange}
                            className="form-checkbox outline-none focus:ring-0 text-customRed"
                            disabled={disabled}
                            value={value}
                        />
                    </div>
                </label>
            </div>
        </div>
    );
};

export default InputDelivery;