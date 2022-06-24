import App from "./components/App"
import { customElement } from "solid-element"

import "tailwindcss/tailwind.css"
import "./index.css"

customElement("boids-element", { width: 640, height: 480 }, App)
