import React from 'react'
import Sidebar from '../../Components/ui/Sidebar'
import Header from '../../Components/ui/Header'
import Tablefaculty from '../../Components/Faculty/tablefaculty'
import Student from '../../Components/Student/student'

const Facultytime = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Header />
        <Student />
      </div>
    </div>
  )
}

export default Facultytime