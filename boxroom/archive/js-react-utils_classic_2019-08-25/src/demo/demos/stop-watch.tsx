import React from 'react'
import {  defineComponent }  from '../../main'

const { useCallback, useEffect, useRef, useState } = React

const StopWatch = defineComponent({
  displayName: 'StopWatch',

  render() {
    const
      timerIdRef = useRef(null),
      [time, setTime] = useState(() => 0),
      [isRunning, setRunning] = useState(() => false),

      onStartStop = useCallback(() => {
        if (isRunning) {
          stopTimer()
        } else {
          startTimer()
        }
      }, null),

      onReset = useCallback(resetTimer, null)

    useEffect(() => {
      return () => stopTimer()
    }, [])
    
    function startTimer() {
      if (!isRunning) {
        const startTime = Date.now() - time

        timerIdRef.current = setInterval(() => {
          setTime(Date.now() - startTime)
        }, 10)

        setRunning(true)
      }
    }

    function stopTimer() {
      if (isRunning) {
        clearInterval(timerIdRef.current)
        timerIdRef.current = null
        setRunning(false)
      }
    }

    function resetTimer() {
      stopTimer()
      setTime(0)
    }

    return (
      <div>
        <div>Time: {time}</div>
        <br/>
        <button onClick={onStartStop}>
          { isRunning ? 'Stop' : 'Start'}
        </button>
        {' '}
        <button onClick={onReset}>
          Reset
        </button>
      </div>
    )
  }
})

export default <StopWatch/>
 
