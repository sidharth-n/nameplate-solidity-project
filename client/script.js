import * as THREE from "/node_modules/three/src/Three.js"

const scene = new THREE.Scene()
const canvas = document.querySelector("#canvas")
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: "red" })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)
camera.position.set(0, 0.2, 5)
scene.add(camera)

const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(ambientLight)

const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setSize(500, 500)

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  mesh.rotation.y += 0.01
}

animate()

const buyButton = document.querySelector("#buy-button")
const connectMetaMaskButton = document.querySelector("#metamask-connect-button")

buyButton.disabled = true
let web3

if (typeof window.ethereum !== "undefined") {
  web3 = new Web3(window.ethereum)
} else {
  connectMetaMaskButton.innerText = "Please install Metamask to continue..."
  connectMetaMaskButton.disabled = true
}

async function connectMetaMask() {
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" })
    alert("Connected to MetaMask successfully")
    buyButton.disabled = false
    connectMetaMaskButton.disabled = true
    connectMetaMaskButton.innerText = "Connected to MetaMask !!"
  } catch (err) {
    console.log("Error: " + err)
  }
}

connectMetaMaskButton.addEventListener("click", () => connectMetaMask())

buyButton.addEventListener("click", () => {
  alert("buy button is now active")
})
