import type { LinksFunction, MetaFunction } from '@remix-run/node'
import React, { useContext, useEffect } from 'react'
import { withEmotionCache } from '@emotion/react'
import { ChakraProvider } from '@chakra-ui/react'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { ServerStyleContext, ClientStyleContext } from './context'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1'
})

export let links: LinksFunction = () => {
  return [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,3000,4000,5000,6000,7000,8001,3001,4001,5001,6001,7001,800&display=swap'
    },
  ]
}

interface DocumentProps {
  children: React.ReactNode
}

const Document = withEmotionCache(
  ({ children }: DocumentProps, emotionCache) => {
    const serverStyleData = useContext(ServerStyleContext)
    const clientStyleData = useContext(ClientStyleContext)

    // Only executed on client
    useEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head
      // re-inject tags
      const tags = emotionCache.sheet.tags
      emotionCache.sheet.flush()
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag)
      })
      // reset cache to reapply global styles
      clientStyleData?.reset()
    }, [])

    return (
      <html lang='en'>
      <head>
        <Meta />
        <Links />
        {serverStyleData?.map(({ key, ids, css }) => (
          <style
            key={key}
            data-emotion={`${key} ${ids.join(' ')}`}
            dangerouslySetInnerHTML={{ __html: css }}
          />
        ))}
      </head>
      <body>
      {children}
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
      </body>
      </html>
    )
  }
)

export default function App() {
  return (
    <Document>
      <ChakraProvider>
        <Outlet />
      </ChakraProvider>
    </Document>
  )
}

export function ErrorBoundary({error}: { error: any }) {
  console.error(error)
  return (
    <html>
    <head>
      <title>Oh no!</title>
      <Meta />
      <Links />
    </head>
    <body>
    <Scripts />
    {error.status}
    </body>
    </html>
  )
}
