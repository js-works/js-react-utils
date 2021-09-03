// external imports
import React from 'react'

// internal imports
import setJsSpecValidator from '../internal/helpers/setJsSpecValidator'

// === exports =======================================================

export default isNode

// === constants =====================================================

const SYMBOL_ITERATOR =
  typeof Symbol === 'function' && Symbol.iterator
    ? Symbol.iterator
    : '@@iterator'

// === isNode ========================================================

function isNode(it: any) {
  const type = typeof it

  return (
    it === undefined ||
    it === null ||
    (type !== 'object' && type !== 'symbol') ||
    typeof it[SYMBOL_ITERATOR] === 'function' ||
    React.isValidElement(it)
  )
}

setJsSpecValidator(isNode, (it: any) =>
  isNode(it) ? null : new Error('Must be a React node')
)
