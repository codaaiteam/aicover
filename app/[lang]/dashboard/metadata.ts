import { Metadata } from 'next'
import { generateMetadata as baseGenerateMetadata } from '../../metadata'

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const metadata = await baseGenerateMetadata({ params, page: 'dashboard' })
  return metadata
}
