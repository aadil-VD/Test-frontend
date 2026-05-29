import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import './HeroScene.css'

/**
 * Animated Three.js background for the hero section.
 * Renders a glowing wireframe icosahedron orbited by a field of particles.
 * Reacts subtly to mouse movement and is fully cleaned up on unmount.
 */
function HeroScene() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let width = mount.clientWidth
    let height = mount.clientHeight

    // --- Scene / camera / renderer ---
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
    camera.position.z = 6

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false,
      })
    } catch (err) {
      // WebGL unavailable / blocked — skip the 3D background gracefully.
      console.warn('HeroScene: WebGL unavailable, skipping 3D background.', err)
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    mount.appendChild(renderer.domElement)

    // --- Central wireframe icosahedron ---
    const geometry = new THREE.IcosahedronGeometry(1.8, 1)
    const material = new THREE.MeshBasicMaterial({
      color: 0x667eea,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Solid inner core
    const coreGeo = new THREE.IcosahedronGeometry(1.2, 0)
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x764ba2,
      transparent: true,
      opacity: 0.18,
    })
    const core = new THREE.Mesh(coreGeo, coreMat)
    scene.add(core)

    // --- Particle field ---
    const PARTICLE_COUNT = 700
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = 4 + Math.random() * 6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
    }
    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0x764ba2,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // --- Mouse parallax ---
    const target = { x: 0, y: 0 }
    const handleMouse = (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 0.6
      target.y = (e.clientY / window.innerHeight - 0.5) * 0.6
    }
    window.addEventListener('mousemove', handleMouse)

    // --- Resize ---
    const handleResize = () => {
      width = mount.clientWidth
      height = mount.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    // --- Animation loop ---
    const clock = new THREE.Clock()
    let frameId
    const animate = () => {
      const t = clock.getElapsedTime()

      mesh.rotation.x = t * 0.15
      mesh.rotation.y = t * 0.2
      core.rotation.x = -t * 0.1
      core.rotation.y = -t * 0.15
      particles.rotation.y = t * 0.03

      // ease camera toward mouse target
      camera.position.x += (target.x * 2 - camera.position.x) * 0.05
      camera.position.y += (-target.y * 2 - camera.position.y) * 0.05
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }
    animate()

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('mousemove', handleMouse)
      window.removeEventListener('resize', handleResize)
      geometry.dispose()
      material.dispose()
      coreGeo.dispose()
      coreMat.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement)
      }
      // Release the GL context immediately so rapid StrictMode
      // unmount/remount doesn't exhaust the browser's context pool.
      renderer.forceContextLoss()
      renderer.dispose()
    }
  }, [])

  return <div className="hero-scene" ref={mountRef} aria-hidden="true" />
}

export default HeroScene
