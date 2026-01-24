import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { specialityData } from '../assets/assets_frontend/assets'

// ✅ design-system imports
import Card from '../design-system/components/Card.jsx'
import Button from '../design-system/components/button.jsx'
import Badge from '../design-system/components/Badge.jsx'

const DoctorPage = () => {
  const { Specialty } = useParams()
  const navigate = useNavigate()

  const { doctors } = useContext(AppContext)
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)

  const applyFilter = () => {
    const doctorsList = doctors || []
    if (Specialty) {
      setFilterDoc(doctorsList.filter(doc => doc.specialty === Specialty))
    } else {
      setFilterDoc(doctorsList)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, Specialty])

  return (
    <div>
      <p className="text-gray-600">
        Browse through the doctor specialists.
      </p>

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        {/* Mobile Filter Button */}
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? 'bg-primary-500 text-white' : ''
          }`}
          onClick={() => setShowFilter(prev => !prev)}
        >
          Filters
        </button>

        {/* Filters */}
        <div
          className={`flex-col gap-4 text-sm text-gray-600 ${
            showFilter ? 'flex' : 'hidden sm:flex'
          }`}
        >
          {specialityData.map((item, index) => (
            <p
              key={item.specialty || index}
              onClick={() =>
                Specialty === item.specialty
                  ? navigate('/doctors')
                  : navigate(`/doctors/${item.specialty}`)
              }
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                Specialty === item.specialty
                  ? 'bg-indigo-100 text-black'
                  : ''
              }`}
            >
              {item.specialty}
            </p>
          ))}
        </div>

        {/* Doctors Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 gap-y-6">
          {filterDoc.map(item => (
            <Card
              key={item._id}
              hover
              className="overflow-hidden"
              onClick={() => {
                navigate(`/appointment/${item._id}`)
                scrollTo(0, 0)
              }}
            >
              {/* Image */}
              <div className="bg-blue-50">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-56 object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                <Badge variant="success" dot size="sm">
                  Available
                </Badge>

                <p className="text-lg font-semibold text-gray-900">
                  {item.name}
                </p>

                <p className="text-sm text-gray-600">
                  {item.specialty}
                </p>

                <Button
                  size="sm"
                  className="w-full mt-3"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/appointment/${item._id}`)
                  }}
                >
                  Book Appointment
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DoctorPage
