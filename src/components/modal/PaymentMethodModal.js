// PaymentMethodModal.js
import React, { useState } from "react"
import { FaMoneyBill, FaCreditCard } from "react-icons/fa" // Icons for payment methods

const PaymentMethodModal = ({ isOpen, onClose, onPaymentMethodSelect }) => {
    const [selectedPayment, setSelectedPayment] = useState(null)
    const [troco, setTroco] = useState('')

    if (!isOpen) return null

    const handlePaymentSelect = (method) => {
        setSelectedPayment(method)
    }

    const handleConfirmPayment = () => {
        if (selectedPayment) {
            onPaymentMethodSelect({ method: selectedPayment, troco: selectedPayment === 'dinheiro' ? troco : null })
            onClose()
        } else {
            alert("Por favor, selecione uma forma de pagamento.")
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity flex justify-center items-center z-50">
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                <div className="px-4 py-3 bg-gray-50 sm:px-6">
                    <h3 className="text-lg font-medium text-gray-900">
                        Forma de Pagamento
                    </h3>
                </div>
                <div className="px-4 pb-4 pt-2">
                    <ul className="grid grid-cols-2 gap-4">
                        <li>
                            <label className={`flex p-4 border rounded-md cursor-pointer transition-all duration-200 ${selectedPayment === 'dinheiro'
                                    ? 'border-customRed bg-red-50 shadow-md'
                                    : 'border-gray-200 bg-white hover:bg-gray-50'
                                }`}>
                                <input
                                    type="radio"
                                    className="form-radio hidden"
                                    name="paymentMethod"
                                    value="dinheiro"
                                    checked={selectedPayment === 'dinheiro'}
                                    onChange={() => handlePaymentSelect('dinheiro')}
                                />
                                <span className="flex items-center w-full">
                                    <span className={`text-2xl mr-2 ${selectedPayment === 'dinheiro' ? 'text-customRed' : 'text-gray-400'}`}>
                                        <FaMoneyBill />
                                    </span>
                                    <span className={selectedPayment === 'dinheiro' ? 'font-medium text-customRed' : ''}>Dinheiro</span>
                                </span>
                            </label>
                        </li>
                        <li>
                            <label className={`flex p-4 border rounded-md cursor-pointer transition-all duration-200 ${selectedPayment === 'cartao'
                                    ? 'border-customRed bg-red-50 shadow-md'
                                    : 'border-gray-200 bg-white hover:bg-gray-50'
                                }`}>
                                <input
                                    type="radio"
                                    className="form-radio hidden"
                                    name="paymentMethod"
                                    value="cartao"
                                    checked={selectedPayment === 'cartao'}
                                    onChange={() => handlePaymentSelect('cartao')}
                                />
                                <span className="flex items-center w-full">
                                    <span className={`text-2xl mr-2 ${selectedPayment === 'cartao' ? 'text-customRed' : 'text-gray-400'}`}>
                                        <FaCreditCard />
                                    </span>
                                    <span className={selectedPayment === 'cartao' ? 'font-medium text-customRed' : ''}>Cartão</span>
                                </span>
                            </label>
                        </li>
                    </ul>
                    {selectedPayment === 'dinheiro' && (
                        <div className="mt-4">
                            <label htmlFor="troco" className="block text-sm font-medium text-gray-700">Precisa de troco?</label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="troco"
                                    id="troco"
                                    className="shadow-sm focus:ring-customRed focus:border-customRed block w-full sm:text-sm border-gray-300 rounded-md"
                                    placeholder="Valor do troco"
                                    value={troco}
                                    onChange={(e) => setTroco(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-between">
                    <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-customRed border border-transparent rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customRed"
                        onClick={handleConfirmPayment}
                        disabled={!selectedPayment}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PaymentMethodModal