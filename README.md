# js-react-utils

A bundle of opinionated utility functions for React.
Currently the main purpose is to provide an alternative way to validate component props.

## Usage example

```tsx
import React, { useCallback, useState } from 'react'
import { addComponentMeta } from 'js-react-utils'
import * as Spec from 'js-spec/validators' // 3rd-party validation library

type CounterProps = {
  initialValue?: number
  label?: string
}

export default function Counter({
  initialValue = 0,
  label = 'Counter'
}: CounterProps) {
  const [counter, setCounter] = useState(initialValue)
  const onClick = useCallback(() => setCounter((it) => it + 1), [])

  return (
    <button onClick={onClick}>
      {label}: {count}
    </button>
  )
}

// This will allow a run-time props validation that's
// useful when the Counter component is used in JavaScript
// instead of TypeScript.
const validateCounterProps = Spec.checkProps({
  optional: {
    initialValue: Spec.number,
    label: Spec.string
  }
})

addComponentMeta(Counter, {
  name: 'Counter',
  validation:
    process.env.NODE_ENV === ('development' as string) && validateCounterProps
})
```

## Features

- Support for framework agnostic props validation.
  No need to use 'prop-types' library: As component props can be validated in a more general way, js-react-utils is not depending on a React specific or other specific props validation library.
  Instead a general and more sophisticated validation library like for example [js-spec](https://github.com/js-works/js-spec) can be used.

- Some additional useful helper functions.

## Project status

This project is in alpha state.
