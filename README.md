# Boids

This is an implementation of Craig Reynolds flocking algorithm, boids.

This repository accompanies an article I wrote on my blog at https://www.ronandoherty.com/blog/boids.  Version v1.0.0 implements the core rules of cohesion, alignment and separation with an additional drag force to simulate air or fluidfriction.

The boids source and user interface are provided in separate folders.  The boids algorithm is implemented in JavaScript, no libraries necessary.  The GUI is created with SolidJS, TailwindCSS and builds to eith a web app or a web component.  Use the following commands to launch the GUI:

```bash
npm install
npm run dev
```
