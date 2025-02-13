import { generateMetadata as baseGenerateMetadata } from '../metadata'

export async function generateMetadata({ params }) {
  return baseGenerateMetadata({ params, page: 'home' })
}
