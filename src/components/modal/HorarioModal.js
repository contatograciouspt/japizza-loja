// HorarioModal.js
import React from "react"

const HorarioModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null

    const diasDeFuncionamento = [
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado",
        "Domingo",
    ]

    const getHorarioDia = (index) => {
        if (index === 0) return "Fechado"
        if (index === 6 || index === 1 || index === 2) return "17:30 - 22:00"
        return "17:00 - 22:00"
    }

    const now = new Date().toLocaleString("pt-PT", { timeZone: "Europe/Lisbon" })
    const portugaltime = new Date(now)
    const diaSemanaAtual = portugaltime.getDay()
    const horaAtual = portugaltime.getHours()
    const minutosAtual = portugaltime.getMinutes()
    const tempoAtualEmMinutos = horaAtual * 60 + minutosAtual

    const getHorarioAbertura = (dia) => {
        if (dia === 0 || dia === 2 || dia === 3) {
            return 17 * 60 + 30 // 17:30
        }
        return 17 * 60 // 17:00
    }

    const horarioFechamento = 22 * 60 // 22:00
    const horarioAbertura = getHorarioAbertura(diaSemanaAtual)

    // Nova lógica para verificar se está dentro do horário de funcionamento
    const isDentroHorario = tempoAtualEmMinutos >= horarioAbertura && tempoAtualEmMinutos < horarioFechamento;

    // Verifica se é um dia de funcionamento E se está dentro do horário
    const isDiaAberto = diaSemanaAtual >= 2 && diaSemanaAtual <= 6 && isDentroHorario;

    const getDiaIndex = (dia) => {
        return dia === 0 ? 6 : dia - 1
    }

    const diaAtualIndex = getDiaIndex(diaSemanaAtual)

    return (
        <>
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity flex justify-center items-center z-50">
                <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                    <div className="px-4 py-3 bg-gray-50 sm:px-6 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                            Horário de Funcionamento
                        </h3>
                        <button
                            onClick={onClose}
                            type="button"
                            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-customRed"
                        >
                            <span className="sr-only">Fechar</span>
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="px-6 pb-4 pt-2">
                        <div className="flex items-center mb-4">
                            <span className={`block relative w-4 h-4 rounded-full mr-2 ${isDiaAberto ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                            <p className={`font-semibold ${isDiaAberto ? 'text-green-600' : 'text-red-600'}`}>
                                {isDiaAberto ? "Aberto agora" : "Fechado"}
                            </p>
                        </div>
                        <ul className="divide-y divide-gray-200">
                            {diasDeFuncionamento.map((dia, index) => (
                                <li
                                    key={index}
                                    className={`py-2 flex justify-between ${index === diaAtualIndex
                                        ? 'bg-green-50 border-l-4 border-green-500 pl-2 rounded-md shadow-sm'
                                        : ''
                                        }`}
                                >
                                    <span className={`font-medium ${index === diaAtualIndex
                                        ? 'text-green-700'
                                        : 'text-gray-700'
                                        }`}>
                                        {dia}
                                    </span>
                                    <span className={`${index === diaAtualIndex
                                        ? 'text-green-600 font-medium'
                                        : 'text-gray-500'
                                        }`}>
                                        {getHorarioDia(index)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-4 text-sm text-gray-500">
                            Terça à {diasDeFuncionamento[6]}
                        </p>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                        <button
                            type="button"
                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={onClose}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HorarioModal