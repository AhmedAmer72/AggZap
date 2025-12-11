// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ZapLP
 * @notice LP token minted when users deposit into the MockPool
 * @dev Simple receipt token representing a DeFi position
 */
contract ZapLP is ERC20, Ownable {
    /// @notice The pool that can mint/burn LP tokens
    address public pool;

    error OnlyPool();

    modifier onlyPool() {
        if (msg.sender != pool) revert OnlyPool();
        _;
    }

    constructor() ERC20("AggZap LP Token", "zapLP") Ownable(msg.sender) {}

    function setPool(address _pool) external onlyOwner {
        pool = _pool;
    }

    function mint(address to, uint256 amount) external onlyPool {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyPool {
        _burn(from, amount);
    }
}

/**
 * @title MockPool
 * @author AggZap Team
 * @notice A mock DeFi pool for testing cross-chain deposits
 * @dev Since testnet DeFi pools are often empty, this simulates a real yield vault
 * 
 * This represents what would be:
 * - Aave lending pool
 * - Compound cToken market
 * - Curve/Balancer LP pool
 * - Yearn vault
 * 
 * In production, ZapReceiver would interact with actual DeFi protocols.
 * This mock allows us to demonstrate the full flow on testnet.
 */
contract MockPool is Ownable {
    using SafeERC20 for IERC20;

    // ═══════════════════════════════════════════════════════════════════
    //                              STATE
    // ═══════════════════════════════════════════════════════════════════

    /// @notice The LP token minted to depositors
    ZapLP public lpToken;

    /// @notice Mapping of token => total deposits
    mapping(address => uint256) public totalDeposits;

    /// @notice Mapping of user => token => deposit amount
    mapping(address => mapping(address => uint256)) public userDeposits;

    /// @notice Mock APY in basis points (e.g., 500 = 5%)
    uint256 public mockAPY = 500;

    /// @notice Supported deposit tokens
    mapping(address => bool) public supportedTokens;

    /// @notice Authorized depositors (ZapReceiver contracts)
    mapping(address => bool) public authorizedDepositors;

    // ═══════════════════════════════════════════════════════════════════
    //                              EVENTS
    // ═══════════════════════════════════════════════════════════════════

    event Deposit(
        address indexed user,
        address indexed token,
        uint256 amount,
        uint256 lpMinted
    );

    event Withdraw(
        address indexed user,
        address indexed token,
        uint256 amount,
        uint256 lpBurned
    );

    event TokenSupported(address indexed token, bool supported);
    event DepositorAuthorized(address indexed depositor, bool authorized);

    // ═══════════════════════════════════════════════════════════════════
    //                              ERRORS
    // ═══════════════════════════════════════════════════════════════════

    error UnsupportedToken();
    error InsufficientBalance();
    error UnauthorizedDepositor();
    error InvalidAmount();

    // ═══════════════════════════════════════════════════════════════════
    //                           CONSTRUCTOR
    // ═══════════════════════════════════════════════════════════════════

    constructor() Ownable(msg.sender) {
        lpToken = new ZapLP();
        lpToken.setPool(address(this));
    }

    // ═══════════════════════════════════════════════════════════════════
    //                         CORE FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════

    /**
     * @notice Deposit tokens on behalf of a user
     * @dev This is called by ZapReceiver after a cross-chain bridge
     * 
     * @param user The user to credit with the deposit
     * @param token The token being deposited
     * @param amount The amount being deposited
     */
    function depositFor(
        address user,
        address token,
        uint256 amount
    ) external payable {
        // Allow direct deposits from users or authorized contracts
        if (msg.sender != user && !authorizedDepositors[msg.sender]) {
            revert UnauthorizedDepositor();
        }
        if (amount == 0) revert InvalidAmount();

        uint256 lpToMint;

        if (token == address(0)) {
            // Native ETH deposit
            require(msg.value == amount, "ETH amount mismatch");
            lpToMint = amount; // 1:1 for simplicity
        } else {
            if (!supportedTokens[token]) revert UnsupportedToken();
            // Transfer tokens from caller (ZapReceiver has already received them from bridge)
            IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
            lpToMint = amount; // 1:1 for simplicity (real pools have exchange rates)
        }

        // Update state
        totalDeposits[token] += amount;
        userDeposits[user][token] += amount;

        // Mint LP tokens directly to user
        lpToken.mint(user, lpToMint);

        emit Deposit(user, token, amount, lpToMint);
    }

    /**
     * @notice Direct deposit (user calling directly)
     */
    function deposit(address token, uint256 amount) external payable {
        _deposit(msg.sender, token, amount);
    }

    /**
     * @notice Internal deposit logic
     */
    function _deposit(address user, address token, uint256 amount) internal {
        if (amount == 0) revert InvalidAmount();

        uint256 lpToMint;

        if (token == address(0)) {
            require(msg.value == amount, "ETH amount mismatch");
            lpToMint = amount;
        } else {
            if (!supportedTokens[token]) revert UnsupportedToken();
            IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
            lpToMint = amount;
        }

        totalDeposits[token] += amount;
        userDeposits[user][token] += amount;
        lpToken.mint(user, lpToMint);

        emit Deposit(user, token, amount, lpToMint);
    }

    /**
     * @notice Withdraw tokens by burning LP
     * @param token The token to withdraw
     * @param lpAmount The amount of LP tokens to burn
     */
    function withdraw(address token, uint256 lpAmount) external {
        if (lpAmount == 0) revert InvalidAmount();
        
        uint256 userLpBalance = lpToken.balanceOf(msg.sender);
        if (userLpBalance < lpAmount) revert InsufficientBalance();

        // Calculate tokens to return (1:1 in this mock)
        uint256 tokensToReturn = lpAmount;
        
        if (tokensToReturn > totalDeposits[token]) {
            tokensToReturn = totalDeposits[token];
        }

        // Update state
        totalDeposits[token] -= tokensToReturn;
        userDeposits[msg.sender][token] -= tokensToReturn;

        // Burn LP tokens
        lpToken.burn(msg.sender, lpAmount);

        // Return tokens
        if (token == address(0)) {
            (bool sent, ) = msg.sender.call{value: tokensToReturn}("");
            require(sent, "ETH transfer failed");
        } else {
            IERC20(token).safeTransfer(msg.sender, tokensToReturn);
        }

        emit Withdraw(msg.sender, token, tokensToReturn, lpAmount);
    }

    // ═══════════════════════════════════════════════════════════════════
    //                         ADMIN FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════

    /**
     * @notice Add or remove supported tokens
     */
    function setSupportedToken(address token, bool supported) external onlyOwner {
        supportedTokens[token] = supported;
        emit TokenSupported(token, supported);
    }

    /**
     * @notice Authorize depositors (like ZapReceiver)
     */
    function setAuthorizedDepositor(address depositor, bool authorized) external onlyOwner {
        authorizedDepositors[depositor] = authorized;
        emit DepositorAuthorized(depositor, authorized);
    }

    /**
     * @notice Set mock APY for UI display
     */
    function setMockAPY(uint256 _apy) external onlyOwner {
        mockAPY = _apy;
    }

    // ═══════════════════════════════════════════════════════════════════
    //                         VIEW FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════

    /**
     * @notice Get the LP token address
     */
    // lpToken is already public, so it auto-generates a getter

    /**
     * @notice Get user's deposit amount for a token
     */
    function getUserDeposit(address user, address token) external view returns (uint256) {
        return userDeposits[user][token];
    }

    /**
     * @notice Get total deposits for a token
     */
    function getTotalDeposits(address token) external view returns (uint256) {
        return totalDeposits[token];
    }

    /**
     * @notice Get the mock APY
     */
    function getAPY() external view returns (uint256) {
        return mockAPY;
    }

    /**
     * @notice Estimate LP tokens for a deposit
     */
    function previewDeposit(uint256 amount) external pure returns (uint256) {
        return amount; // 1:1 in mock
    }

    receive() external payable {}
}
