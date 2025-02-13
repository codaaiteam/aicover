import { Metadata } from 'next'
import { generateMetadata as baseGenerateMetadata } from '../../metadata'

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  // 直接指定当前页面为 create
  const metadata = await baseGenerateMetadata({ params, page: 'create' })
  return metadata
}
