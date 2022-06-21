import BoidsComponent from "./components/BoidsComponent"
import { customElement } from "solid-element"

import "tailwindcss/tailwind.css"
import "./index.css"

customElement("boids-element", { width: 640, height: 480 }, BoidsComponent)
