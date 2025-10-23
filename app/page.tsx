import GlassButton from '@/components/reactbits/GlassButton'
import GlassSpinner from '@/components/reactbits/GlassSpinner'

export default function HomePage() {
  return (
    <main className="camera-page">
      <div className="camera-container">
        <div className="camera-loading">
          <GlassSpinner size="lg" label="Initializing camera..." />
          <h1 className="text-2xl font-bold text-gray-800 mt-4">
            Rubbish App
          </h1>
          <p className="text-gray-600 mt-2">
            Waste Classification System
          </p>
          <div className="flex gap-4 mt-8">
            <GlassButton variant="primary">
              Start Camera
            </GlassButton>
            <GlassButton variant="secondary">
              Learn More
            </GlassButton>
          </div>
        </div>
      </div>
    </main>
  )
}