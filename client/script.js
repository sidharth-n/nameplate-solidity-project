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
const userInputPrice = document.querySelector("#buy-price").value
const connectMetaMaskButton = document.querySelector("#metamask-connect-button")
const previousOwnersList = document.querySelector("#previous-owners-list")

const contractABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "ownershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "INITIAL_PRICE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MIN_INCREMENT_PERCENTAGE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currentOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currentPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getHistory",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "ownerAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "ownerPrice",
            type: "uint256",
          },
        ],
        internalType: "struct Auction.PreviousOwner[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "previousOwners",
    outputs: [
      {
        internalType: "address",
        name: "ownerAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "ownerPrice",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "updateOwner",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
]

const contractAddress = "0x6398752267A9a706bdca22fa963BA7eC3F24AE06"

buyButton.disabled = true
let web3

if (typeof window.ethereum !== "undefined") {
  web3 = new Web3(window.ethereum)
} else {
  connectMetaMaskButton.innerText = "Please install MetaMask"
  connectMetaMaskButton.disabled = true
}
let contract

contract = await new web3.eth.Contract(contractABI, contractAddress)
console.log("Contract reconnected")

// Demo array of previous owners
const demoPreviousOwners = [
  { address: "0xaBcD...1234", price: "18 ETH" },
  { address: "0xEfGh...5678", price: "15 ETH" },
  { address: "0xiJkL...9012", price: "12 ETH" },
  { address: "0xMnOp...3456", price: "10 ETH" },
  { address: "0xQrSt...7890", price: "8 ETH" },
]
async function updatePreviousOwnersList() {
  try {
    if (!contract) {
      console.error("Contract is not initialized")
      return
    }

    const previousOwners = await contract.methods.getHistory().call()
    previousOwnersList.innerHTML = "" // Clear existing list

    previousOwners.forEach(owner => {
      const li = document.createElement("li")
      const priceEth = web3.utils.fromWei(owner.ownerPrice, "ether")
      li.innerHTML = `
        <span class="owner-address">${owner.ownerAddress.slice(
          0,
          6
        )}...${owner.ownerAddress.slice(-4)}</span>
        <span class="owner-price">${priceEth} ETH</span>
      `
      previousOwnersList.appendChild(li)
    })
  } catch (error) {
    console.error("Error updating previous owners list:", error)
  }
}

/* async function checkContractDeployment() {
  try {
    const code = await web3.eth.getCode(contractAddress)
    if (code === "0x" || code === "0x0") {
      console.error("No contract found at the specified address")
    } else {
      console.log("Contract is deployed at the specified address")
      console.log("Contract bytecode:", code)

      // Try to call a view function
      const currentPrice = await contract.methods.currentPrice().call()
      console.log(
        "Current Price:",
        web3.utils.fromWei(currentPrice, "ether"),
        "ETH"
      )

      const currentOwner = await contract.methods.currentOwner().call()
      console.log("Current Owner:", currentOwner)
    }
  } catch (error) {
    console.error("Error checking contract deployment:", error)
  }
} */

async function connectMetaMask() {
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" })
    buyButton.disabled = false
    connectMetaMaskButton.disabled = true
    connectMetaMaskButton.innerText = "Connected"
  } catch (err) {
    console.error("Error connecting to MetaMask:", err)
  }
}

async function updateUIAfterConnection() {
  try {
    // Fetch current owner
    const currentOwner = await contract.methods.currentOwner().call()
    document.querySelector(".owner-name").textContent = `${currentOwner.slice(
      0,
      6
    )}...${currentOwner.slice(-4)}`

    // Fetch current price
    const currentPrice = await contract.methods.currentPrice().call()
    const currentPriceEth = web3.utils.fromWei(currentPrice, "ether")
    document.querySelector(
      ".current-price"
    ).textContent = `Current Price: ${currentPriceEth} ETH`

    // Fetch and update previous owners list
    await updatePreviousOwnersList()
  } catch (error) {
    console.error("Error updating UI:", error)
  }
}

connectMetaMaskButton.addEventListener("click", connectMetaMask)

buyButton.addEventListener("click", async () => {
  if (!web3 || !contract) {
    alert("Please connect to MetaMask first")
    return
  }

  try {
    const currentPrice = await contract.methods.currentPrice().call()
    const minIncrement = await contract.methods
      .MIN_INCREMENT_PERCENTAGE()
      .call()
    const minPrice = web3.utils
      .toBN(currentPrice)
      .mul(web3.utils.toBN(100 + parseInt(minIncrement)))
      .div(web3.utils.toBN(100))
    const userInputPriceWei = web3.utils.toWei(userInputPrice, "ether")
    if (web3.utils.toBN(userInputPriceWei).lt(minPrice)) {
      alert(
        `Price too low. Minimum price is ${web3.utils.fromWei(
          minPrice,
          "ether"
        )} ETH`
      )
      return
    }
    const accounts = await web3.eth.getAccounts()
    const result = await contract.methods.updateOwner().send({
      from: accounts[0],
      value: userInputPriceWei,
      gas: 300000,
    })
    console.log("transaction successful", result)
    alert(
      "Congrats! you have written succesfuly to the blockchain. check transaction history"
    )
  } catch (e) {
    console.error("Error:", e)
    alert("An error occurred. Please check the console for details.")
  }
})
// Responsive canvas sizing
function resizeCanvas() {
  const width = Math.min(500, canvas.clientWidth)
  renderer.setSize(width, width)
  camera.aspect = 1
  camera.updateProjectionMatrix()
}

window.addEventListener("resize", resizeCanvas)
resizeCanvas()
await updateUIAfterConnection()
await updatePreviousOwnersList()
