// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HalalFoodSupplyChain {
    enum Role { None, Farmer, Distributor, Consumer }

    struct Product {
        string productId;
        string halalCert;
        string slaughterDate;
        string farmLocation;
        address addedBy;
    }

    struct Shipment {
        string productId;
        string temperature;
        string humidity;
        string timestamp;
        string location;
        string handlingNotes;
        address addedBy;
    }

    mapping(address => Role) public userRoles;
    mapping(string => Product) public productRecords;
    mapping(string => Shipment[]) public shipmentLogs;

    modifier onlyRole(Role r) {
        require(userRoles[msg.sender] == r, "Not authorized");
        _;
    }

    function assignRole(address user, Role role) public {
        userRoles[user] = role;
    }

    function addProduct(
        string memory _productId,
        string memory _halalCert,
        string memory _slaughterDate,
        string memory _farmLocation
    ) public onlyRole(Role.Farmer) {
        productRecords[_productId] = Product(
            _productId,
            _halalCert,
            _slaughterDate,
            _farmLocation,
            msg.sender
        );
    }

    function addShipment(
        string memory _productId,
        string memory _temperature,
        string memory _humidity,
        string memory _timestamp,
        string memory _location,
        string memory _handlingNotes
    ) public onlyRole(Role.Distributor) {
        shipmentLogs[_productId].push(Shipment(
            _productId,
            _temperature,
            _humidity,
            _timestamp,
            _location,
            _handlingNotes,
            msg.sender
        ));
    }

    function getProductData(string memory _productId)
        public
        view
        onlyRole(Role.Consumer)
        returns (
            string memory,
            string memory,
            string memory,
            string memory
        )
    {
        Product memory p = productRecords[_productId];
        return (p.productId, p.halalCert, p.slaughterDate, p.farmLocation);
    }

    function getShipmentData(string memory _productId)
        public
        view
        onlyRole(Role.Consumer)
        returns (Shipment[] memory)
    {
        return shipmentLogs[_productId];
    }
}
