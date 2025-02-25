import React, { useState } from "react"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"
import { deliveryRegions } from "./Cidades"
import { notifyError } from "@utils/toast"

export default function MapCheckoutModal({ isOpen, onClose, onSelectRegion }) {
    const [selectedRegionCost, setSelectedRegionCost] = useState(null)
    const [expandedRegion, setExpandedRegion] = useState(null)
    const [selectedCity, setSelectedCity] = useState(null)

    if (!isOpen) return null

    const handleRegionSelect = (region) => {
        setSelectedRegionCost(region.cost)
        setSelectedCity(region)
    }

    const handleConfirm = () => {
        if (selectedRegionCost !== null) {
            onSelectRegion(selectedRegionCost)
            onClose()
        } else {
            notifyError("Por favor, selecione uma região de entrega.")
        }
    }

    const toggleRegion = (region) => {
        setExpandedRegion(expandedRegion === region ? null : region)
    }

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity flex justify-center items-center z-50">
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full max-h-[80vh] overflow-y-auto">
                <div className="px-4 py-3 bg-gray-50 sm:px-6 sticky top-0 z-10">
                    <h3 className="text-lg font-medium text-gray-900">
                        Selecione a Região de Entrega
                    </h3>
                </div>
                <div className="px-4 pb-4">
                    {Object.entries(deliveryRegions).map(([region, cities]) => (
                        <div key={region} className="mb-4">
                            <button
                                onClick={() => toggleRegion(region)}
                                className="w-full flex justify-between items-center p-3 bg-gray-100 hover:bg-gray-200 rounded-t-md"
                            >
                                <span className="font-semibold">{region}</span>
                                {expandedRegion === region ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                            {expandedRegion === region && (
                                <div className="border-x border-b rounded-b-md">
                                    {cities.map(city => (
                                        <div
                                            key={city.id}
                                            className={`p-3 border-b last:border-b-0 hover:bg-gray-50 ${selectedCity && selectedCity.id === city.id ? 'bg-gray-100' : ''}`} // Adiciona classe para destacar
                                        >
                                            <div className="flex justify-between items-center">
                                                <span>{city.name}</span>
                                                <div className="flex items-center">
                                                    <span className="mr-4">€{city.cost.toFixed(2)}</span>
                                                    <button
                                                        onClick={() => handleRegionSelect(city)}
                                                        className={`px-3 py-1 text-sm rounded-md ${selectedCity && selectedCity.id === city.id ? 'bg-green-500 hover:bg-green-600' : 'bg-customRed hover:bg-red-500'} text-white`} // Altera a cor do botão
                                                    >
                                                        {selectedCity && selectedCity.id === city.id ? 'Selecionado' : 'Selecionar'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {selectedRegionCost !== null && (
                        <p className="mt-4 text-sm text-gray-700">
                            Custo de entrega selecionado: <span className="font-semibold">€{selectedRegionCost.toFixed(2)}</span>
                        </p>
                    )}
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-between sticky bottom-0">
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
                        onClick={handleConfirm}
                        disabled={selectedRegionCost === null}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    )
}
