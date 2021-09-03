import { ComponentType } from 'react'

// === exports =======================================================

export default addComponentMeta

// === types =========================================================

type Props = Record<string, any>

type PropTypesMeta = {
  propTypes: Record<
    string,
    (props: Props, propName: string, componentName: string) => null | Error
  >
}

// === addComponentMeta ==============================================

function addComponentMeta<P>(
  component: ComponentType<P>,

  params: {
    name: string
    validation?: (props: P) => true | false | null | Error
  }
) {
  component.displayName = params.name

  if (params.validation) {
    Object.assign(component, convertValidation(params.validation))
  }
}

// === convertValidation =============================================

function convertValidation<P extends Props = Props>(
  validate?: (props: P) => boolean | null | Error
): PropTypesMeta {
  return {
    propTypes: {
      '*'(props: P, propName: string, componentName: string) {
        const result = validate(props)

        const errorMsg =
          result === false
            ? 'Invalid props'
            : result instanceof Error
            ? result.message
            : null

        return !errorMsg
          ? null
          : new TypeError(
              `Props validation error for component ` +
                `'${componentName}' => ${errorMsg}`
            )
      }
    }
  }
}
