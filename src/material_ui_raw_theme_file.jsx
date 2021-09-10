import * as Colors from 'material-ui/styles/colors'
import { spacing, getMuiTheme } from 'material-ui/styles'

const rawBaseTheme = {
  ...spacing,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: '#6f55c2',
    primary2Color: '#3a1b9c',
    primary3Color: '#b0bec5',
    accent1Color: '#800d95',
    accent2Color: '#86e653',
    accent3Color: '#d10e38',
    textColor: '#000a12',
    alternateTextColor: Colors.white,
    canvasColor: Colors.white,
    borderColor: '#b0bec5',
    disabledColor: '#78909c'
  }
}

// Theme must be wrapped in funciton getMuiTheme
export default getMuiTheme(rawBaseTheme)
