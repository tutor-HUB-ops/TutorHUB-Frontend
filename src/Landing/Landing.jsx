// import React from 'react'
import Courses from "./Components/Courses"
import Hero from "./Components/Hero"
import Testimonials from "./Components/Testimonials"
import GetStarted from "./Components/GetStarted"
import Footer from "./Components/Footer"
import Schools from "./Components/Schools"
import SlidingImages1 from "./Components/SlidingImages1"

const Landing = () => {
  return (
    <>
      <Hero />
      <SlidingImages1/>
      <Courses />
      <Testimonials />
      <GetStarted />
      <Footer />
    </>
  )
}

export default Landing