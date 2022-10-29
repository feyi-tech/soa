
import { extendTheme } from "@chakra-ui/react"
// Extend the theme to include custom colors, fonts, etc
export const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
}
// Add your color mode config
const config = {
  initialColorMode: "light",
  useSystemColorMode: true,
}
// extend the theme
const theme = extendTheme({ colors, config })
export default theme