---
inclusion: always
---

# Kodshala: Design System & Motion

## 3. Design System
- Dark-first with a light-mode toggle. Colors: background #0A0A14, surface #12121F, primary #7C3AED (purple), accent #06B6D4 (cyan), success #84CC16, warning #F59E0B, danger #EF4444
- Fonts: Space Grotesk (headings), Inter (body), JetBrains Mono (code)
- Glassmorphism cards (backdrop-blur, translucent 1px borders, soft inner glow), animated gradient borders on hover, subtle noise overlay, gradient headline text
- rounded-2xl corners, 8px spacing grid, all design tokens as CSS variables
- Custom cursor and magnetic buttons (desktop only)
- Mobile-first and fully responsive (check 375px, 768px, 1440px)

## 4. 3D & Animation (top-notch, but fast)
Landing hero:
- Interactive 3D "Knowledge Core": a glowing crystal planet with orbiting 3D tech logos (Python, JS, C++, Java, React), a mouse-reactive particle field, bloom and subtle chromatic aberration
- Headline revealed word by word (SplitText), with a typewriter code snippet beside it
Scroll storytelling (GSAP ScrollTrigger + Lenis):
- Pinned sections where the 3D camera flies through 4 chapters: Learn → Practice → Compete → Get Hired
- Count-up stats, course cards entering with 3D tilt, horizontal course carousel, infinite marquee of technology logos
More 3D moments:
- Auth page: floating wireframe shapes in the background
- Achievements: 3D badges that rotate on hover
- Contest results: 3D podium for the top 3
- 404 page: an astronaut floating in space (drag to rotate)
- 3D Data Structure Lab: explore trees and graphs in 3D (orbit, zoom, click nodes)
Micro-interactions:
- Page transitions (fade + slide + blur), shimmer skeletons, hover glow, button ripple
- Confetti + badge-unlock animation on "Accepted", animated streak flame, XP bar fill, level-up modal, Lottie empty states
Performance rules:
- Load three.js ONLY on the landing, auth, 404, achievements, contest podium and 3D Lab pages, never on article or problem pages
- Lazy-load every <Canvas>, cap dpr at [1, 2], pause rendering when off-screen, show a static fallback on low-end devices or without WebGL
- Respect prefers-reduced-motion
