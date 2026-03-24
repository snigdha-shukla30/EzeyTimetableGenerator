import React from 'react'
import Sidebar from '../../components/ui/Sidebar'
import Header from '../../components/ui/Header'
import Tablefaculty from '../../components/Faculty/Tablefaculty'
import Student from '../../components/student/student'

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