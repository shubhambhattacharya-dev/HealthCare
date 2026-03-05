"use client"

import { useParams } from "next/navigation"
import React from "react"

const Speciality = () => {

  const { speciality } = useParams()

  return (
    <div>speciality : {speciality}</div>
  )
}

export default Speciality