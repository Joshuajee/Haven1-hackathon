// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./proof-of-identity/interfaces/IProofOfIdentity.sol";

contract AirDrop is Ownable {

    enum DeclineReasons {
        unidentified,
        suspended,
        expiredId
    }

    event ValidAirdrop(address indexed distributor, address indexed token, address indexed recipient, uint amount);
    event InValidAirdrop(address indexed distributor, address indexed token, address indexed recipient, uint amount, DeclineReasons reason);

    using SafeERC20 for IERC20;

    IProofOfIdentity public proofOfIdentity;

    constructor (address _proofOfIdentity) {
        proofOfIdentity = IProofOfIdentity(_proofOfIdentity);
    }

    function doAirDrop(address _token, address[] calldata _receipient, uint256 _amount) external {

        uint256 count = _receipient.length;

        for (uint256 i = 0; i < count; ++i) {
            // check if user has proof of identity or is not suppended
            if (hasID(_receipient[i]) && !_isSuspended(_receipient[i])) {
                IERC20(_token).safeTransferFrom(msg.sender, _receipient[i], _amount); 
                emit ValidAirdrop(msg.sender, _token, _receipient[i], _amount);
            } else if (!hasID(_receipient[i])) {
                emit InValidAirdrop(msg.sender, _token, _receipient[i], _amount, DeclineReasons.unidentified);
            } else {
                emit InValidAirdrop(msg.sender, _token, _receipient[i], _amount, DeclineReasons.suspended);
            }
        }

    }

    function doAirDropByCountry(address _token, address[] memory _receipient, uint256 _amount, string memory _countryCode) external {

        uint256 count = _receipient.length;

        for (uint256 i = 0; i < count; ++i) {
            //string memory countryCode = getCountryCode(_receipient[i]);
            // check if user has proof of identity or is not suppended
            if (hasID(_receipient[i]) && !_isSuspended(_receipient[i])) {
                IERC20(_token).safeTransferFrom(msg.sender, _receipient[i], _amount); 
                emit ValidAirdrop(msg.sender, _token, _receipient[i], _amount);
            } else if (!hasID(_receipient[i])) {
                emit InValidAirdrop(msg.sender, _token, _receipient[i], _amount, DeclineReasons.unidentified);
            } else {
                emit InValidAirdrop(msg.sender, _token, _receipient[i], _amount, DeclineReasons.suspended);
            }
        }

    }


    /**
     * @notice Returns whether an account holds a Proof of Identity NFT.
     * @param account The account to check.
     * @return True if the account holds a Proof of Identity NFT, else false.
     */
    function hasID(address account) public view returns (bool) {
        return proofOfIdentity.balanceOf(account) > 0;
    }

    /**
     * @notice Returns whether an account is suspended.
     * @param account The account to check.
     * @return True if the account is suspended, false otherwise.
     */
    function _isSuspended(address account) private view returns (bool) {
        return proofOfIdentity.isSuspended(account);
    }

    function getCountryCode(address account) public view returns (string memory, uint, uint) {
        return proofOfIdentity.getCountryCode(account);
    }


    receive () external payable {}

    fallback () external payable {}

}