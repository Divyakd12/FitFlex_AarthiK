import React from 'react'
import '../styles/Hero.css'

const Hero = () => {
  return (
    <div className='hero-container' id='hero'>
      
      <div className="hero-text">
        <span>
          <div className="hero-line" />
          <h5>ADKRS fitness</h5>
        </span>
        <h2>Strength  <b>does not come</b> from the body.  <b>It comes from the will.</b> </h2>
        <h2>Success isn’t always about greatness. <b>It’s about consistency.</b> Consistent hard work leads to success.</h2>
        <a href="#search"><button>View more</button></a>
      </div>
    </div>
  )
}


export default Hero