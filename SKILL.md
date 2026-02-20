---
name: uniswap-live-swap-monitor
description: Real-time Ethereum swap monitoring skill using Uniswap V2 pair events. Provides live ETH price tracking, 24H volume aggregation, and recent swap feed via Socket.io streaming.
version: 1.0.0
---

# 🔥 Uniswap Live Swap Monitor — Skill Specification

## Overview

This skill enables real-time monitoring of Ethereum swap activity from a Uniswap V2 liquidity pool.  
It listens to on-chain Swap events and streams structured data to connected clients.

Designed for:

- Autonomous monitoring agents
- Real-time dashboards
- Trading signal systems
- Blockchain analytics pipelines
- Event-driven backend architectures

---

## 🎯 Core Capabilities

### 1️⃣ Live Swap Detection
- Monitors Swap events from a Uniswap V2 pair contract
- Extracts:
  - ETH amount
  - USDC amount
  - Effective price
  - Timestamp

### 2️⃣ Real-Time Data Streaming
- Emits structured swap payloads via Socket.io
- Supports multiple concurrent frontend clients
- Event name: `swap`

### 3️⃣ Volume Aggregation
- Maintains in-memory rolling 24H ETH volume counter
- Updates on each detected swap

### 4️⃣ Price Visualization Feed
- Streams time-series price data
- Enables frontend chart rendering (Chart.js / Candlestick engine)

---

## 🧱 Architecture

Ethereum Mainnet │ ▼ Alchemy RPC (HTTPS) │ ▼ Node.js Polling Engine │ ▼ Swap Event Parser │ ▼ Socket.io Broadcaster │ ▼ Frontend Dashboard


---

## 📡 Data Source

Network: Ethereum Mainnet  
Protocol: Uniswap V2  
Pair: ETH / USDC  

Pair Address:
0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc

Event Signature:

Swap( address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to )


---

## 📦 Emitted Event Schema

Event: `swap`

```json
{
  "ethAmount": "0.5321",
  "price": "3254.22",
  "volume24h": "152.43",
  "time": "12:03:45"
}


⚙️ Execution Mode

This skill runs in Polling Mode:

•Interval: 3 seconds
•Method: queryFilter() on Swap events
•Block range: last processed block → latest block


Polling chosen for:

•RPC stability
•Compatibility with free-tier providers
•Better reliability in mobile / Termux environments


📈 Extension Points

•This skill can be extended with:
•Whale detection logic
•Multi-pair monitoring
•Real rolling 24H window
•Database persistence (PostgreSQL / MongoDB)
•Redis pub/sub scaling
•REST API endpoints
•Webhook triggers
•Telegram / Discord alerts
•Docker deployment


