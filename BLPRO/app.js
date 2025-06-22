let web3;
let contract;

const contractAddress = "";//ContractAdress from RemixIDE

const abi = [
//ABI
];

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    web3 = new Web3(window.ethereum);
    await ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    document.getElementById("wallet").innerText = "Connected!";
    contract = new web3.eth.Contract(abi, contractAddress);
  } else {
    alert("MetaMask not detected. Please install MetaMask.");
  }
}

async function assignRole() {
  const role = document.getElementById("role").value;
  if (!role) {
    alert("Please select a role.");
    return;
  }
  const accounts = await web3.eth.getAccounts();
  await contract.methods.assignRole(accounts[0], role).send({ from: accounts[0] });
  alert("Role assigned.");
  showRoleSection(role);
}

function showRoleSection(role) {
  document.getElementById("farmerSection").classList.add("hidden");
  document.getElementById("distributorSection").classList.add("hidden");
  document.getElementById("consumerSection").classList.add("hidden");

  if (role === "1") {
    document.getElementById("farmerSection").classList.remove("hidden");
  } else if (role === "2") {
    document.getElementById("distributorSection").classList.remove("hidden");
  } else if (role === "3") {
    document.getElementById("consumerSection").classList.remove("hidden");
  }
}

async function addMeat() {
  const meatId = document.getElementById("meatId").value.trim();
  const halalCert = document.getElementById("halalCert").value.trim();
  const slaughterDate = document.getElementById("slaughterDate").value.trim();
  const farmLocation = document.getElementById("farmLocation").value.trim();

  if (!meatId || !halalCert || !slaughterDate || !farmLocation) {
    alert("Fill all fields.");
    return;
  }

  const accounts = await web3.eth.getAccounts();
  await contract.methods.addProduct(meatId, halalCert, slaughterDate, farmLocation).send({ from: accounts[0] });
  alert("Meat product added.");
}

async function addShipment() {
  const meatId = document.getElementById("shipMeatId").value.trim();
  const temp = document.getElementById("temp").value.trim();
  const humidity = document.getElementById("humidity").value.trim();
  const timestamp = document.getElementById("timestamp").value.trim();
  const location = document.getElementById("location").value.trim();
  const notes = document.getElementById("notes").value.trim();

  if (!meatId || !temp || !humidity || !timestamp || !location || !notes) {
    alert("Fill all shipment fields.");
    return;
  }

  if (parseFloat(temp) > 4) {
    alert("ALERT: Temperature exceeded 4°C! Halal violation.");
    return;
  }

  const accounts = await web3.eth.getAccounts();
  await contract.methods.addShipment(meatId, temp, humidity, timestamp, location, notes).send({ from: accounts[0] });
  alert("Shipment data added.");
}

async function viewMeat() {
  const meatId = document.getElementById("viewId").value.trim();
  if (!meatId) {
    alert("Enter Meat ID.");
    return;
  }

  const accounts = await web3.eth.getAccounts();
  try {
    const data = await contract.methods.getProductData(meatId).call({ from: accounts[0] });
    const shipments = await contract.methods.getShipmentData(meatId).call({ from: accounts[0] });

    let html = `Meat ID: ${data[0]}\nHalal Cert: ${data[1]}\nSlaughter Date: ${data[2]}\nFarm Location: ${data[3]}\n\nShipments:\n`;
    shipments.forEach((s, i) => {
      html += `[${i + 1}] Temp: ${s.temperature}°C, Humidity: ${s.humidity}%\nTimestamp: ${s.timestamp}, Location: ${s.location}\nNotes: ${s.handlingNotes}\n\n`;
    });

    document.getElementById("meatInfo").innerText = html;
  } catch (err) {
    alert("Failed to retrieve meat info.");
    console.error(err);
  }
}
