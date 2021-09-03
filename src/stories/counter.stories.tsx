import React from 'react'
import * as Spec from 'js-spec/validators'
import { addComponentMeta } from '../main/js-react-utils'

const { useCallback, useEffect, useState } = React

export default {
  title: 'Counters'
}

// === SimpleCounter =================================================

type SimpleCounterProps = {
  initialValue?: number
  label?: string
}

const validateCounterProps = Spec.checkProps({
  optional: {
    initialValue: Spec.number,
    label: Spec.string
  }
})

function Counter({ initialValue = 0, label = 'Counter' }: SimpleCounterProps) {
  const [count, setCount] = useState(initialValue)
  const onIncrement = useCallback(() => setCount((it) => it + 1), [])

  useEffect(() => {
    console.log('Component has been mounted')
  }, [])

  useEffect(() => {
    console.log('Component has been rendered')
  })

  return (
    <div>
      <h3>Simple counter</h3>
      <label>{label}: </label>
      <button onClick={onIncrement}>{count}</button>
    </div>
  )
}

addComponentMeta(Counter, {
  name: 'Counter',
  validation: validateCounterProps
})

export const simpleCounter = () => <Counter initialValue={100} />
