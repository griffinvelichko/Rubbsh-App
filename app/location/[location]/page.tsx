import CameraView from '@/components/CameraView'

interface LocationPageProps {
  params: Promise<{
    location: string
  }>
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { location } = await params
  const decodedLocation = decodeURIComponent(location)

  console.log('[LocationPage] Raw location param:', location)
  console.log('[LocationPage] Decoded location:', decodedLocation)

  return (
    <main className="camera-page">
      <CameraView location={decodedLocation} />
    </main>
  )
}
