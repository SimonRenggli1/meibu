import { useColorScheme } from 'react-native'
import {
  TamaguiProvider,
  type TamaguiProviderProps,
  config,
} from '@my/ui'

export function Provider({
  children,
  defaultTheme = 'light',
  ...rest
}: Omit<TamaguiProviderProps, 'config'> & { defaultTheme?: string }) {
  const colorScheme = useColorScheme()
  const theme = defaultTheme || (colorScheme === 'dark' ? 'dark' : 'light')

  return (
    <TamaguiProvider config={config} defaultTheme={theme} {...rest}>
        {children}
    </TamaguiProvider>
  )
}
