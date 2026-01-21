import React from 'react'
import Headers from '../components/Headers'
import Specialty from '../components/Specialty'
import TopDoctors from '../components/TopDctoros'
import Banner from '../components/Banner'

const HomePage = () => {
  return (
    <div>
        <Headers/>
        <Specialty/>
        <TopDoctors/>
        <Banner/>
    </div>
  )
}

export default HomePage