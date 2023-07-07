import React, { useState, useEffect } from 'react'
import './Clock.scss'
function Clock({ examInfo, handleSubmitExam }) {
    const [countdown, setCountdown] = useState('')

    let handleTimeUp = () => {
        handleSubmitExam('time-out')
    }

    //getTimeFromClock(countdown)

    useEffect(() => {
        const targetDate = new Date()
        //examInfo.valueNum
        targetDate.setMinutes(targetDate.getMinutes() + examInfo.valueNum)
        const intervalId = setInterval(() => {
            const now = new Date().getTime()
            const distance = targetDate - now

            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((distance % (1000 * 60)) / 1000)

            setCountdown(`${minutes}m ${seconds}s`)

            if (distance < 0) {
                if (examInfo.value !== 'T0') {
                    handleTimeUp()
                    setCountdown('Hết thời gian')
                }

                clearInterval(intervalId)
            }
        }, 1000)
        return () => {
            clearInterval(intervalId)
        }
    }, [])

    return (
        <div className="countdown-timer">
            <p>{examInfo.value === 'T0' ? 'Không giới hạn thời gian' : countdown}</p>
        </div>
    )
}

export default Clock
