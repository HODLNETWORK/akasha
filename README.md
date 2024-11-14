![alt text](image.png)

# Akasha Cross-Chain Bridge Implementation

## Overview
Technical implementation of the Akasha token bridge between Base and BSC using LayerZero's OFT (Omnichain Fungible Token) standard.

## Architecture

### Components
- `AkashaOFT`: Native OFT implementation on BSC
- `AkashaOFTAdapter`: Adapter contract on Base that wraps existing Akasha token
- LayerZero Endpoints:
  - Base: `0x1a44076050125825900e736c501f859c50fE728c`
  - BSC: `0x1a44076050125825900e736c501f859c50fE728c`

### Deployed Contracts
- BSC OFT: `0xca7A227b771F0B16AA844f0972BF371B209B8D44`
- Base Adapter: `0xfED6a7d8C083c5403Ac785196900eb9a721f6E8a`

## Development Setup

```bash
npm install
cp .env.example .env
# Add your private keys and API keys to .env
```

### Deployment Scripts
- `deploy-base.js`: Deploys adapter on Base
- `deploy-bsc-oft.js`: Deploys OFT on BSC
- `verify-bsc.js`: Verifies BSC contract
- `verify.js`: Verifies Base contract

### Testing Cross-Chain Functionality
```bash
npx hardhat run scripts/test-crosschain.js --network bsc
npx hardhat run scripts/test-crosschain.js --network base
```

## Security Considerations
1. LayerZero endpoint verification
2. Gas limits for cross-chain messages
3. Adapter access controls
4. Token approval flows

## Gas Optimization
- Enforced options for 60k gas on cross-chain messages
- Optimized contract deployment parameters
- Efficient token wrapping mechanism

## Monitoring & Maintenance
1. LayerZero Explorer for cross-chain message tracking
2. BSCScan and BaseScan contract verification
3. Gas price monitoring for optimal cross-chain fees

## Emergency Procedures
1. Admin controls for pausing bridge
2. Recovery mechanisms for stuck tokens
3. Upgrade paths for contract improvements

# AKASHA Cross-Chain Bridge

Cross-chain implementation of AKASHA token using LayerZero's OFT standard, bridging Base and BSC networks.

## Deployed Contracts
- Base Adapter: `0xfED6a7d8C083c5403Ac785196900eb9a721f6E8a`
- BSC OFT: `0xca7A227b771F0B16AA844f0972BF371B209B8D44`

## Development
bash
npm install
cp .env.example .env

Fill in environment variables:
- `PRIVATE_KEY`
- `BASESCAN_API_KEY`
- `BSCSCAN_API_KEY`

## Scripts
- Deploy: `npx hardhat run scripts/deploy-[network].js --network [network]`
- Verify: `npx hardhat run scripts/verify-[network].js --network [network]`
- Test: `npx hardhat test`