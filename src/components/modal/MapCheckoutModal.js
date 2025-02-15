// MapCheckoutModal.js
import React, { useState } from 'react';

// Define as regiões e custos com nomes simples
const deliveryRegions = [
    { id: 1, name: 'Região 1', cost: 1.00 },
    { id: 2, name: 'Região 2', cost: 2.00 },
    { id: 3, name: 'Região 3', cost: 3.00 },
    { id: 4, name: 'Região 4', cost: 5.00 },
    { id: 5, name: 'Região 5', cost: 6.00 },
    // Adicione mais regiões aqui conforme necessário
];

export default function MapCheckoutModal({ isOpen, onClose, onSelectRegion }) {
    const [selectedRegionCost, setSelectedRegionCost] = useState(null);

    if (!isOpen) return null;

    const handleRegionSelect = (region) => {
        setSelectedRegionCost(region.cost);
    };

    const handleConfirm = () => {
        if (selectedRegionCost !== null) {
            onSelectRegion(selectedRegionCost);
            onClose();
        } else {
            alert("Por favor, selecione uma região de entrega.");
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity flex justify-center items-center z-50">
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                <div className="px-4 py-3 bg-gray-50 sm:px-6">
                    <h3 className="text-lg font-medium text-gray-900">
                        Selecione a Região de Entrega
                    </h3>
                </div>
                <div className="px-4 pb-4">
                    <ul>
                        {deliveryRegions.map(region => (
                            <li key={region.id} className="py-2 border-b last:border-b-0">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="font-semibold">{region.name}</span>
                                    </div>
                                    <div>
                                        <span>€{region.cost.toFixed(2)}</span>
                                        <button
                                            onClick={() => handleRegionSelect(region)}
                                            className="ml-4 px-3 py-2 bg-customRed hover:bg-red-500 text-white rounded-md text-sm"
                                        >
                                            Selecionar
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {selectedRegionCost !== null && (
                        <p className="mt-2 text-sm text-gray-700">
                            Custo de entrega selecionado: <span className="font-semibold">€{selectedRegionCost.toFixed(2)}</span>
                        </p>
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
                        onClick={handleConfirm}
                        disabled={selectedRegionCost === null}
                    >
                        Confirmar Região
                    </button>
                </div>
            </div>
        </div>
    );
}