import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { specialityData } from '../assets/assets_frontend/assets'

const DoctorPage = () => {
  const { Specialty } = useParams()
  const navigate = useNavigate()

  const { doctors } = useContext(AppContext)
  const [filterDoc, setFilterDoc] = useState([])

  const [showFilter, setShowFilter] = useState(false)

  const applyFilter = () => {
    const doctorsList = doctors || []
    if (Specialty) {
      setFilterDoc(doctorsList.filter(doc => doc.speciality === Specialty))
    } else {
      setFilterDoc(doctorsList)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, Specialty])

  return (
    <div>
      <p className='text-gray-600'>Browse through the doctor specialists.</p>

      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? 'bg-primary text-white' : ''
          }`}
          onClick={() => setShowFilter(prev => !prev)}
        >
          Filters
        </button>

        <div className={` flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          {specialityData.map((item) => (
            <p
              key={item.speciality}
              onClick={() =>
                Specialty === item.speciality
                  ? navigate('/doctors')
                  : navigate(`/doctors/${item.speciality}`)
              }
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                Specialty === item.speciality ? 'bg-indigo-100 text-black' : ''
              }`}
            >
              {item.speciality}
            </p>
          ))}
        </div>

        <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 gap-y-6'>
          {filterDoc.map(item => (
            <div
              key={item._id}
              onClick={() => navigate(`/appointment/${item._id}`)}
              className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
            >
              <img className='bg-blue-50' src={item.image} alt={item.name} />

              <div className='p-4'>
                <div className='flex items-center gap-2 text-sm text-green-500'>
                  <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                  <p>Available</p>
                </div>

                <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                <p className='text-gray-600 text-sm'>{item.specialty}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DoctorPage
