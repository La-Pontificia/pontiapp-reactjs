import { ThemeProvider as PrimitiveThemeProvider } from 'next-themes'
export default function ThemeProvider({
  children
}: Readonly<{
  children?: React.ReactNode
}>) {
  return <PrimitiveThemeProvider>{children}</PrimitiveThemeProvider>
}
