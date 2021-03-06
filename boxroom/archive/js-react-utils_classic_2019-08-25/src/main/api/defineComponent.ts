import validateComponentConfig
  from '../internal/validation/validateComponentConfig'

import determineDefaultProps from '../internal/helper/determineDefaultProps'
import determinePropTypes from '../internal/helper/determinePropTypes'

import Props from '../internal/types/Props'
import Methods from '../internal/types/Methods'
import ComponentType from '../internal/types/ComponentType'
import ComponentConfigStd from '../internal/types/ComponentConfigStd'
import ComponentConfigAlt from '../internal/types/ComponentConfigAlt'
import AdditionalAttributes from '../internal/types/AdditionalAttributes'

import React, { ReactElement, ReactNode } from 'react'

type ComponentConfig<P extends Props, M extends Methods> =
  ComponentConfigStd<P, M> & ComponentConfigAlt<P, M>

type Extras<P extends Props> = {
  create(props?: P, ...children: ReactNode[]): ReactElement<P>
}

function defineComponent<
  P extends Props = {},
  M extends Methods = {}
>(config: ComponentConfigStd<P, M>): ComponentType<P & AdditionalAttributes<M>> & Extras<P>

function defineComponent<
  P extends Props = {},
  M extends Methods = {}
>(config: ComponentConfigAlt<P, M>): ComponentType<P & AdditionalAttributes<M>> & Extras<P>

function defineComponent<P extends Props, M extends Methods>(config: ComponentConfig<P, M>): ComponentType<P> {
  if (process.env.NODE_ENV === 'development' as any) {
    const error = validateComponentConfig(config)

    if (error) {
      throw new Error(
        `[defineComponent] ${error.message}`)
    }
  }

  const
    render: any = config.render,
    needsForwardRef = render.length > 1 || config.methods && config.methods.length > 0

  let ret = render.bind()

  Object.defineProperty(ret, 'displayName', { value: config.displayName })

  let propTypes = null

  if (process.env.NODE_ENV === 'development' as any) {
    propTypes =
      config.propTypes
        ? { ...config.propTypes } 
        : determinePropTypes(
          config.properties,
          config.validate,
         !!config.variableProps,
         config.displayName,
         false)
  }
  
  if (needsForwardRef) {
    ret = React.forwardRef(ret)
  }

  Object.defineProperty(ret, 'propTypes', { value: propTypes })
  
  Object.defineProperty(ret, 'defaultProps', {
    value: 
      config.hasOwnProperty('properties')
        ? determineDefaultProps(config.properties)
        : config.defaultProps || null
  }) 

  const createComponentElement = React.createElement.bind(null, ret)

  ret.create = function (/* arguments */) {
    return createComponentElement.apply(null, arguments)
  }

  return ret
}

export default defineComponent
