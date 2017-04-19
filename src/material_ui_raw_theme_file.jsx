import * as Colors from 'material-ui/styles/colors'
import { spacing, getMuiTheme } from 'material-ui/styles'

const rawBaseTheme = {
  ...spacing,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: '#3095b4',
    primary2Color: '#5c7f92',
    primary3Color: '#8b8178',
    accent1Color: '#8e258d',
    accent2Color: '#a0d200',
    accent3Color: '#f0ab00',
    textColor: '#35322E',
    alternateTextColor: Colors.white,
    canvasColor: Colors.white,
    borderColor: '#a59d95',
    disabledColor: '#b7b1a9'
  }
}

// Theme must be wrapped in funciton getMuiTheme
export default getMuiTheme(rawBaseTheme)
