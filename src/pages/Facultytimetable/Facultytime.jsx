import React from 'react'
import Sidebar from '../../Components/ui/Sidebar'
import Header from '../../Components/ui/Header'
import Tablefaculty from '../../Components/Faculty/tablefaculty'

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