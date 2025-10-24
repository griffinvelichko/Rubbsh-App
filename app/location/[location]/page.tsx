import CameraView from '@/components/CameraView'

interface LocationPageProps {
  params: Promise<{
    location: string
  }>
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { location } = await params

  return (
    <main className="camera-page">
      <CameraView location={decodeURIComponent(location)} />
    </main>
  )
}
