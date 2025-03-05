"use client"

import { useEffect, useState } from "react"

type PersonName = "Alexis" | "Alexandra" | "Robinson"

interface Assignment {
  name: PersonName
  color: string
}

const personColors: Record<PersonName, string> = {
  Alexis: "bg-green-500",
  Alexandra: "bg-yellow-400",
  Robinson: "bg-blue-400",
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [assignments, setAssignments] = useState<Record<string, Assignment>>({})

  // Función para calcular el ciclo continuo de asignaciones
  const getAssignmentForDay = (day: number): Assignment => {
    const cycleDay = day % 9 // Ciclo de 9 días (3 días por trabajador)
    if (cycleDay < 3) {
      return { name: "Alexis", color: personColors["Alexis"] }
    } else if (cycleDay < 6) {
      return { name: "Alexandra", color: personColors["Alexandra"] }
    } else {
      return { name: "Robinson", color: personColors["Robinson"] }
    }
  }

  useEffect(() => {
    const generateAssignments = (year: number, month: number) => {
      const daysInMonth = getDaysInMonth(year, month)
      const sampleAssignments: Record<string, Assignment> = {}

      // Calcular el día inicial del ciclo basado en el mes
      // Marzo es el mes 2 (enero = 0, febrero = 1, marzo = 2, etc.)
      const startMonth = 2 // Marzo
      const startYear = 2025 // Año de inicio
      const monthsSinceStart = (year - startYear) * 12 + (month - startMonth)

      // Calcular el día inicial del ciclo acumulando los días de los meses anteriores
      let startDay = 0
      for (let i = 0; i < monthsSinceStart; i++) {
        const currentMonth = (startMonth + i) % 12
        const currentYear = startYear + Math.floor((startMonth + i) / 12)
        startDay += getDaysInMonth(currentYear, currentMonth)
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
        const cycleDay = startDay + day - 1
        sampleAssignments[dateKey] = getAssignmentForDay(cycleDay)
      }

      setAssignments(sampleAssignments)
    }

    generateAssignments(currentDate.getFullYear(), currentDate.getMonth())
  }, [currentDate])

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth())
  const firstDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]
  const weekdays = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
  const weekdaysShort = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1))
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-0">
      <div className="bg-gray-800 text-white p-3 sm:p-4 rounded-t-lg flex justify-between items-center">
        <button
          onClick={() => changeMonth(-1)}
          className="text-white hover:bg-gray-700 p-1 sm:p-2 rounded text-lg sm:text-xl"
        >
          &lt;
        </button>
        <h2 className="text-base sm:text-xl font-bold text-center truncate">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={() => changeMonth(1)}
          className="text-white hover:bg-gray-700 p-1 sm:p-2 rounded text-lg sm:text-xl"
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 border border-gray-800">
        {weekdays.map((day, index) => (
          <div
            key={day}
            className="bg-gray-800 text-white p-1 sm:p-2 text-center font-semibold border-r border-gray-700 text-sm sm:text-base"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{weekdaysShort[index]}</span>
          </div>
        ))}

        {[...Array(firstDayOfWeek).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)].map(
          (day, index) => {
            if (day === null) return <div key={`empty-${index}`} className="border border-gray-300 h-16 sm:h-24"></div>

            const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            const assignment = assignments[dateKey]

            return (
              <div
                key={`day-${day}`}
                className={`border border-gray-800 p-1 sm:p-2 h-16 sm:h-24 ${assignment?.color || "bg-white"} relative`}
              >
                <div className="absolute top-0 left-1 font-bold text-base sm:text-lg">{day}</div>
                {assignment && (
                  <div className="flex items-center justify-center h-full text-white font-semibold text-sm sm:text-lg pt-3">
                    <span className="sm:inline hidden">{assignment.name}</span>
                    <span className="sm:hidden inline">
                      {assignment.name === "Alexandra" ? "Alex" : assignment.name.substring(0, 3)}
                    </span>
                  </div>
                )}
              </div>
            )
          },
        )}
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2 sm:gap-4 px-2">
        {Object.entries(personColors).map(([name, color]) => (
          <div key={name} className="flex items-center">
            <div className={`w-4 h-4 sm:w-4 sm:h-4 ${color} mr-1 sm:mr-2`}></div>
            <span className="text-sm sm:text-base">{name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}