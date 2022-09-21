# Boids

<img src="https://github.com/donanroherty/Boids/blob/main/img/screenshot.png?raw=true" width="640">

This is an implementation of Craig Reynolds flocking algorithm, built using Vite, Typescript, React and Tailwind.

Demo: https://ronandoherty.com/projects/boids


```bash
npm run dev # run local dev server

npm run build # build the project as a library to ./dist
```




**Features:**
- Predator boids which hunt smaller boids
- Spatial Hashing for boid and collider lookup
- Quad Tree for boid lookup
- Interactions between flocks
- Obstacle avoidance
- Swept collisions with static geometry
- Field of view controls

