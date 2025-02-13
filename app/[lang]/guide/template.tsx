import React from 'react'
import { generateMetadata } from './metadata'

export { generateMetadata }

export default function GuideTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
