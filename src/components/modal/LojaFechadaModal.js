import { useRouter } from "next/router"
import React from "react"
import { FaStore, FaCalendarAlt } from "react-icons/fa"

export default function LojaFechadaModal({ isOpen, onClose }) {
    if (!isOpen) return null
    const router = useRouter()

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity flex justify-center items-center z-50">
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-md sm:w-full text-center p-6">
                <div className="mb-4">
                    <FaStore className="mx-auto text-red-500 text-5xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Estamos fechados agora!
                </h3>
                <p className="text-gray-600 mb-6">
                    Agende seu pedido
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-customRed text-white rounded-md hover:bg-red-600 transition-colors inline-flex items-center"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    )
}