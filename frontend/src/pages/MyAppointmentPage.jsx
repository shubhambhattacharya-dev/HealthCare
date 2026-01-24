import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

// design-system
import Card from '../design-system/components/Card.jsx'
import Button from '../design-system/components/button.jsx'
import Badge from '../design-system/components/Badge.jsx'

const MyAppointmentPage = () => {
  const { doctors } = useContext(AppContext)

  return (
    <div className="mt-12">
      <p className="pb-3 font-medium text-zinc-700 border-b">
        My Appointments
      </p>

      <div className="space-y-6 mt-6">
        {doctors.slice(0, 3).map((item, index) => (
          <Card key={index}>
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Doctor Image */}
              <img
                className="w-28 h-28 object-cover rounded-xl bg-indigo-50"
                src={item.image}
                alt={item.name}
              />

              {/* Details */}
              <div className="flex-1 text-sm text-zinc-600 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-neutral-800 font-semibold text-base">
                    {item.name}
                  </p>

                  <Badge variant="info" size="sm">
                    Upcoming
                  </Badge>
                </div>

                <p>{item.speciality}</p>

                <p className="text-zinc-700 font-medium mt-2">
                  Address:
                </p>
                <p className="text-xs text-zinc-500">
                  {item.address?.line1}
                </p>
                <p className="text-xs text-zinc-500">
                  {item.address?.line2}
                </p>

                <p className="text-sm mt-2">
                  <span className="text-neutral-700 font-medium">
                    Date & Time:
                  </span>{' '}
                  25 July 2025 | 8:30 PM
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 justify-end sm:min-w-48">
                <Button size="sm">
                  Pay Online
                </Button>

                <Button variant="danger" size="sm">
                  Cancel Appointment
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default MyAppointmentPage
