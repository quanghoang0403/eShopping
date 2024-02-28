import { capitalizeFirstLetterEachWord, capitalizeUpperCaseWord } from 'utils/helpers'
import './index.scss'

export default function PageTitle (props) {
  const { className, content, isNormal, style, icon } = props

  /**
   * return a string with option
   * case true: a string format normal (ex: today -> today)
   * case false: a string format uppercase (ex: today -> TODAY)
   * default: a string format Today (ex: today -> Today)
   */
  const renderTitle = () => {
    switch (isNormal) {
      case true:
        return content
      case false:
        return capitalizeUpperCaseWord(content)
      default:
        return capitalizeFirstLetterEachWord(content)
    }
  }
  return (
    <>
      <h1 className={`fnb-title-header ${className}`} style={style}>
        {renderTitle()}
        {icon && icon}
      </h1>
    </>
  )
}
