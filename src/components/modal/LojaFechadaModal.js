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
                    Estamos fechados hoje
                </h3>
                <p className="text-gray-600 mb-6">
                    Agende seu pedido para outro dia da semana
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Fechar
                    </button>
                    <button
                        onClick={() => router.push("/checkout")}
                        className="px-4 py-2 bg-customRed text-white rounded-md hover:bg-red-600 transition-colors inline-flex items-center"
                    >
                        <FaCalendarAlt className="mr-2" />
                        Agendar Pedido
                    </button>
                </div>
            </div>
        </div>
    )
}