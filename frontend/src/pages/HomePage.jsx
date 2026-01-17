import React from 'react'
import Headers from '../components/Headers'
import Specialty from '../components/Specialty'
import TopDctoros from '../components/TopDctoros'
import Banner from '../components/Banner'

const HomePage = () => {
  return (
    <div>
        <Headers/>
        <Specialty/>
        <TopDctoros/>
        <Banner/>
    </div>
  )
}

export default HomePage