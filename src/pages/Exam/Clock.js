import React, { useState, useEffect } from 'react'
import './Clock.scss'
function Clock({ examInfo, handleSubmitExam, getTimeFromClock }) {
    const [countdown, setCountdown] = useState('')

    let handleTimeUp = () => {
        handleSubmitExam('time-out')
    }
    if (examInfo === null) {
        console.log(examInfo)
        setCountdown('Không giới hạn thời gian')
    }

    //getTimeFromClock(countdown)

    useEffect(() => {
        const targetDate = new Date()
        targetDate.setMinutes(targetDate.getMinutes() + examInfo.valueNum)
        const intervalId = setInterval(() => {
            const now = new Date().getTime()
            const distance = targetDate - now

            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((distance % (1000 * 60)) / 1000)

            setCountdown(`${minutes}m ${seconds}s`)

            if (distance < 0) {
                clearInterval(intervalId)
                setCountdown('Hết thời gian')
                handleTimeUp()
            }
        }, 1000)
        return () => {
            clearInterval(intervalId)
        }
    }, [])

    return (
        <div className="countdown-timer">
            <p>{countdown}</p>
        </div>
    )
}

export default Clock
