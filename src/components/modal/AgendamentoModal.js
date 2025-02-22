import React from "react"
import DatePicker from "react-datepicker"
import { IoCalendarOutline, IoTimeOutline } from "react-icons/io5"
import "react-datepicker/dist/react-datepicker.css"

export default function AgendamentoModal({ isOpen, onClose, onScheduleSelect }) {
    if (!isOpen) return null

    const [selectedDate, setSelectedDate] = React.useState(null)
    const [selectedTime, setSelectedTime] = React.useState("")

    const filterAvailableDates = (date) => {
        const day = date.getDay()
        return day !== 1
    }

    const getAvailableHours = (date) => {
        if (!date) return []
        const dayOfWeek = date.getDay()
        const openingTime = (dayOfWeek === 0 || dayOfWeek === 2 || dayOfWeek === 3) ? "17:30" : "17:00"
        const closingTime = "22:00"

        const hours = []
        let currentTime = openingTime
        while (currentTime <= closingTime) {
            hours.push(currentTime)
            const [h, m] = currentTime.split(":")
            let newMinutes = parseInt(m) + 30
            let newHours = parseInt(h)
            if (newMinutes >= 60) {
                newMinutes = 0
                newHours++
            }
            currentTime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}`
        }
        return hours
    }

    const handleConfirm = () => {
        if (selectedDate && selectedTime) {
            onScheduleSelect({
                date: selectedDate,
                time: selectedTime
            })
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Agendar Pedido</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <IoCalendarOutline className="inline mr-2" />
                            Selecione a Data
                        </label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={date => setSelectedDate(date)}
                            filterDate={filterAvailableDates}
                            minDate={new Date()}
                            dateFormat="dd/MM/yyyy"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-customRed"
                            placeholderText="Escolha uma data"
                            locale="pt-PT"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <IoTimeOutline className="inline mr-2" />
                            Selecione o Horário
                        </label>
                        <select
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            disabled={!selectedDate}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-customRed"
                        >
                            <option value="">Escolha um horário</option>
                            {getAvailableHours(selectedDate).map((time) => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedDate || !selectedTime}
                        className="w-full bg-customRed text-white py-2 px-4 rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        Confirmar Agendamento
                    </button>
                </div>
            </div>
        </div>
    )
}