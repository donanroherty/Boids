import Boids from "./Boids"

function App() {
  return (
    <div className="absolute w-screen h-screen select-none dark bg-boids_document_bg">
      <div className="flex items-center justify-center">
        <Boids />
      </div>
    </div>
  )
}

export default App
