import useCheckoutSubmit from "@hooks/useCheckoutSubmit"
import React from "react"

const InputDelivery = ({
    register,
    value,
    checked,
    onChange,
    type = 'checkbox',
    name,
    Icon,
    disabled = false,
    warningMessage,
    isRegionSelected,
    handleOpenPaymentModal,
    setDeliveryWarningMessage
}) => {

    const handleChange = (e) => {
        onChange(e)
        if (e.target.checked) {
            if (!isRegionSelected) {
                setDeliveryWarningMessage("Selecione o valor do frete em Delivery")
            }
            handleOpenPaymentModal() // Add this to open payment modal
        } else {
            setDeliveryWarningMessage("")
        }
    }

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
                            onChange={handleChange}
                            className="form-checkbox outline-none focus:ring-0 text-customRed"
                            disabled={disabled}
                            value={value}
                            isRegionSelected={isRegionSelected}
                            setDeliveryWarningMessage={setDeliveryWarningMessage}
                            handleOpenPaymentModal={handleOpenPaymentModal}
                        />
                    </div>
                </label>
            </div>
            {warningMessage && (
                <p className="mt-2 text-sm text-red-500">{warningMessage}</p>
            )}
        </div>
    )
}

export default InputDelivery