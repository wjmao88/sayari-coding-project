
//having ThemeKey defined separately 
//lets me restrict component props to only accept theme key
export type ThemeKey = 
  | 'primary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'light'
  | 'dark'
  | 'person'
  | 'company'

export const theme: Record<ThemeKey, string> = {
  //normaly I would calculate a contrast color for theme colors
  //so that e.g. a dark primary colors have a light contrast color and vice versa
  //so I can have a color that is safe (i.e. passes accessibility standards)
  //to use as text on that background
  primary: 'midnightBlue',
  accent: 'teal',
  success: 'forestgreen',
  warning: 'goldenrod',
  danger: 'crimson',
  light: 'lightgray',
  dark: 'darkgray',
  //not really part of a normal color theme
  //but since the data here is just these two types...
  person: 'steelblue',
  company: 'goldenrod',
}