// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import { OFTAdapter } from "@layerzerolabs/oft-evm/contracts/OFTAdapter.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { Pausable } from "@openzeppelin/contracts/utils/Pausable.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AkashaOFTAdapter is OFTAdapter, AccessControl, Pausable {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");
    
    uint256 public maxTransferAmount;
    uint256 public bridgeFee;
    
    event BridgeFeeUpdated(uint256 newFee);
    event MaxTransferAmountUpdated(uint256 newAmount);
    
    error TransferExceedsMaxAmount(uint256 amount, uint256 maxAmount);
    error AmountBelowBridgeFee(uint256 amount, uint256 bridgeFee);
    
    constructor(
        address _token,
        address _lzEndpoint,
        address _owner
    ) OFTAdapter(_token, _lzEndpoint, _owner) Ownable(_owner) Pausable() {
        _grantRole(DEFAULT_ADMIN_ROLE, _owner);
        _grantRole(OPERATOR_ROLE, _owner);
        _grantRole(EMERGENCY_ROLE, _owner);
        
        maxTransferAmount = 10000000000000 * 10**18;
        bridgeFee = 0;
    }

    function pause() external onlyRole(EMERGENCY_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(EMERGENCY_ROLE) {
        _unpause();
    }

    function setBridgeFee(uint256 _fee) external onlyRole(OPERATOR_ROLE) {
        bridgeFee = _fee;
        emit BridgeFeeUpdated(_fee);
    }

    function setMaxTransferAmount(uint256 _amount) external onlyRole(OPERATOR_ROLE) {
        maxTransferAmount = _amount;
        emit MaxTransferAmountUpdated(_amount);
    }

    function _debitSend(
        address from_,
        uint16 dstChainId_,
        bytes32 toAddress_,
        uint _amount
    ) internal virtual whenNotPaused returns (uint) {
        if (_amount > maxTransferAmount) 
            revert TransferExceedsMaxAmount(_amount, maxTransferAmount);
        if (_amount <= bridgeFee)
            revert AmountBelowBridgeFee(_amount, bridgeFee);
        
        uint256 amountAfterFee = _amount - bridgeFee;
        return amountAfterFee;
    }

    function withdrawFees(address to) external onlyRole(OPERATOR_ROLE) {
        uint256 balance = IERC20(token()).balanceOf(address(this));
        require(balance > 0, "No fees to withdraw");
        IERC20(token()).transfer(to, balance);
    }
} 