import React from 'react'
import Sidebar from '../../components/ui/Sidebar'
import Header from '../../components/ui/Header'
import Tablefaculty from '../../components/Faculty/Tablefaculty'

const Facultytime = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Header />
        <Tablefaculty />
      </div>
    </div>
  )
}

export default Facultytime