import Boids from "./components/Boids"

function App() {
  return (
    <div className="absolute w-screen h-screen dark bg-boids_document_bg">
      <div className="flex items-center justify-center">
        <Boids />
      </div>
    </div>
  )
}

export default App
