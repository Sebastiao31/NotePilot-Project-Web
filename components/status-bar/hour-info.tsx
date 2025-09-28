import React, { useState, useEffect } from 'react'

const HourInfo = () => {
  const [currentTime, setCurrentTime] = useState<string>('')
  
  useEffect(() => {
    // Function to format the time as h:mm AM/PM
    const formatTime = () => {
      const now = new Date()
      return now.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }
    
    // Set initial time
    setCurrentTime(formatTime())
    
    // Update time every minute
    const intervalId = setInterval(() => {
      setCurrentTime(formatTime())
    }, 60000)
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [])
  
  return (
    <div className="text-md font-semibold text-muted-foreground/80">
      {currentTime}
    </div>
  )
}

export default HourInfo