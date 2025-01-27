export interface VideoData {
  id: number
  title: string
  description: string
  url: string
}

const videoData: VideoData[] = [
  {
    id: 1,
    title: 'videoTitle1',
    description: 'videoDesc1',
    url: 'https://pub-3626123a908346a7a8be8d9295f3120a.r2.dev/output.mp4'
  },
  {
    id: 2,
    title: 'videoTitle2',
    description: 'videoDesc2',
    url: 'https://pub-3626123a908346a7a8be8d9295f3120a.r2.dev/output.mp4'
  },
  {
    id: 3,
    title: 'videoTitle3',
    description: 'videoDesc3',
    url: 'https://pub-3626123a908346a7a8be8d9295f3120a.r2.dev/output.mp4'
  }
]

export default videoData
