"use strict";

/* =========================================================
   UNISWAP LIVE SWAP MONITOR
   Production-Ready Clean Version
========================================================= */

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { ethers } = require("ethers");

/* =========================================================
   CONFIGURATION
========================================================= */

const CONFIG = {
  PORT: 3000,
  RPC_API_KEY: "PASTE_ALCHEMY_KEY_DISINI",
  RPC_URL: (key) => `https://eth-mainnet.g.alchemy.com/v2/${key}`,
  PAIR_ADDRESS: "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc",
  POLL_INTERVAL: 3000,
  MAX_HISTORY: 20,
  MIN_ETH_FILTER: 0 // set to 1 if want filter < 1 ETH
};

/* =========================================================
   SERVER SETUP
========================================================= */

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

/* =========================================================
   BLOCKCHAIN SETUP
========================================================= */

const provider = new ethers.JsonRpcProvider(
  CONFIG.RPC_URL(CONFIG.RPC_API_KEY)
);

const PAIR_ABI = [
  "event Swap(address indexed sender,uint amount0In,uint amount1In,uint amount0Out,uint amount1Out,address indexed to)"
];

const pair = new ethers.Contract(
  CONFIG.PAIR_ADDRESS,
  PAIR_ABI,
  provider
);

/* =========================================================
   STATE
========================================================= */

let lastBlock = 0;
let volume24h = 0;
let swapHistory = [];

/* =========================================================
   UTILITIES
========================================================= */

function log(message, data = "") {
  console.log(`[${new Date().toISOString()}] ${message}`, data);
}

function formatSwap(logData) {
  const { amount0In, amount1In, amount0Out, amount1Out } = logData;

  const ethIn = parseFloat(ethers.formatEther(amount1In));
  const ethOut = parseFloat(ethers.formatEther(amount1Out));
  const ethAmount = ethIn > 0 ? ethIn : ethOut;

  if (ethAmount <= CONFIG.MIN_ETH_FILTER) return null;

  const usdcIn = parseFloat(ethers.formatUnits(amount0In, 6));
  const usdcOut = parseFloat(ethers.formatUnits(amount0Out, 6));
  const usdcAmount = usdcIn > 0 ? usdcIn : usdcOut;

  const price = usdcAmount / ethAmount;

  volume24h += ethAmount;

  return {
    ethAmount: ethAmount.toFixed(4),
    price: price.toFixed(2),
    volume24h: volume24h.toFixed(2),
    time: new Date().toLocaleTimeString()
  };
}

function addToHistory(swap) {
  swapHistory.unshift(swap);
  if (swapHistory.length > CONFIG.MAX_HISTORY) {
    swapHistory.pop();
  }
}

/* =========================================================
   POLLING ENGINE
========================================================= */

async function pollSwaps() {
  try {
    const currentBlock = await provider.getBlockNumber();

    if (lastBlock === 0) {
      lastBlock = currentBlock - 5;
      log("Initialized block tracking:", lastBlock);
      return;
    }

    const logs = await pair.queryFilter(
      "Swap",
      lastBlock + 1,
      currentBlock
    );

    logs.forEach((logEntry) => {
      const swap = formatSwap(logEntry.args);
      if (!swap) return;

      addToHistory(swap);

      io.emit("swap", swap);

      log("New Swap:", `${swap.ethAmount} ETH @ $${swap.price}`);
    });

    lastBlock = currentBlock;
  } catch (error) {
    log("Polling error:", error.message);
  }
}

/* =========================================================
   SOCKET CONNECTION
========================================================= */

io.on("connection", (socket) => {
  log("Client connected:", socket.id);

  // Send recent history
  socket.emit("history", swapHistory);

  socket.on("disconnect", () => {
    log("Client disconnected:", socket.id);
  });
});

/* =========================================================
   START SYSTEM
========================================================= */

setInterval(pollSwaps, CONFIG.POLL_INTERVAL);

server.listen(CONFIG.PORT, () => {
  log(`Server running at http://localhost:${CONFIG.PORT}`);
});



1️⃣ Rename file jadi:

index.js


2️⃣ Ganti API key:

JavaScript

RPC_API_KEY: "ISI_API_KEY_KAMU"


3️⃣ Jalankan:

node index.js


