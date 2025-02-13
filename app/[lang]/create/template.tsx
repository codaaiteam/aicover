import React from 'react'
import { Metadata } from 'next'

// 导入 metadata 生成函数
import { generateMetadata as generateCreateMetadata } from './metadata'

// 导出 metadata 生成函数
export const generateMetadata = generateCreateMetadata

// 服务器端组件
export default function CreateTemplate({
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
