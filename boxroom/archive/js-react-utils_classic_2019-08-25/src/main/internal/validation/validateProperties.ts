import validateProperty from './validateProperty'
import Props from '../types/Props'
import PropertiesConfig from '../types/PropertiesConfig'


export default function validateProperties<P extends Props>(
  props: P,
  propsConfig: PropertiesConfig<P>,
  propsValidator: (props: P) => null | Error | true | false,
  variableProps: boolean,
  componentName: string,
  isCtxProvider: boolean
) {
  let ret = null

  const
    propNames = propsConfig ? Object.keys(propsConfig) : [],
    messages = []

  if (propsConfig) {
    for (let i = 0; i < propNames.length; ++i) {
      const
        propName = propNames[i],
        propConfig = propsConfig[propName],
        ret = validateProperty(
          props, propConfig, propName, componentName, isCtxProvider)

      if (ret) {
        messages.push(ret.message)
      }
    }
  }

  if (propsConfig && !variableProps) {
    const
      usedPropNames = Object.keys(props),
      invalidPropNames = []

    for (let i = 0; i < usedPropNames.length; ++i) {
      const usedPropName = usedPropNames[i]

      if (!propsConfig || !propsConfig.hasOwnProperty(usedPropName)) {
        if (usedPropName !== 'key' && usedPropName !=='ref') { // TODO: => DIO bug
          invalidPropNames.push(usedPropName)
        }
      }
    }

    if (invalidPropNames.length == 1) {
      messages.push(`Invalid prop key "${invalidPropNames[0]}"`)
    } else if (invalidPropNames.length > 1) {
      messages.push('Invalid prop keys: ' + invalidPropNames.join(', '))
    }
  }

  if (propsValidator) {
    const
      validator = propsValidator && (<any>propsValidator)['js-spec:validate'] || propsValidator,
      error = validator(props)

    if (error === false) {
      messages.push('Invalid value')
    } else if (error) {
      messages.push(error instanceof Error ? error.message : String(error))
    }
  }

  if (messages.length > 0) {
    const errorMsgIntro =
      'Prop validation error for '
        + (isCtxProvider ? 'provider of context ' : 'component ')
        + `"${componentName}"`
        + ' => '

    if (messages.length === 1) {
      ret = new Error(`${errorMsgIntro} ${messages[0]}`)
    } else if (messages.length > 1) {
      ret = new Error(`\n- ${messages.join('\n- ')}`)
    }
  }

  return ret
}
