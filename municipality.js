const SimpleSigner = window.uportconnect.SimpleSigner
const Connect = window.uportconnect.Connect
const appName = 'UportTutorial'

const connect = new Connect('WIGO4IT IDENTITY', {
  clientId: '2op3XWF4dpPYuyvFw5UpoQviVRs8wihzHZj',
  network: 'rinkeby',
  signer: SimpleSigner('a0e388225b15ea1fbb0a86547971abc7556049b6d22dc073b7744403e7058e39')
})
const web3 = connect.getWeb3()

// Setup the simple Status contract - allows you to set and read a status string
const abi = [{"constant":false,"inputs":[{"name":"status","type":"string"}],"name":"updateStatus","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"getStatus","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"}]

const StatusContract = web3.eth.contract(abi);
const statusInstance = StatusContract.at('0x70A804cCE17149deB6030039798701a38667ca3B')
var cred;
// uPort connect
const uportConnect = function () {
  connect.requestCredentials({
    requested: ['name', 'phone', 'country'],
    notifications: true // We want this if we want to recieve credentials
  })
  .then((credentials) => {
  // Do something
    cred = credentials;
    console.log("Credenials:", credentials);
    globalState.uportId = credentials.address;
    globalState.uportName = credentials.name;
    globalState.uportCountry = credentials.country;
    globalState.uportPhone = credentials.phone;
    render();
    }, (err) => {
        console.log("Error:", err);
    })
}

// Send ether
const sendEther = () => {
  const value = parseFloat(globalState.sendToVal) * 1.0e18

  web3.eth.sendTransaction(
    {
      to: globalState.sendToAddr,
      value: value
    },
    (error, txHash) => {
      if (error) { throw error }
      globalState.txHashSentEth = txHash
      render()
    }
  )
}

// Set Status
const setStatus = () => {
  const newStatusMessage = globalState.statusInput
  statusInstance.updateStatus(newStatusMessage,
    (error, txHash) => {
      if (error) { throw error }
      globalState.txHashSetStatus = txHash
      render()
      })
}

// attest User
const attest = () => {
  let PROPERTY_VALUE = "yes"
  console.log(connect);
  connect.attestCredentials({
    sub: globalState.uportId,
    claim: { 'isolderthaneighteen': PROPERTY_VALUE }
  });
}

const verify = () => {
    connect.requestCredentials({
        verified: ['isolderthaneighteen'],
    }).then((userProfile) => {
        console.log(userProfile);
        $('#isolderthaneighteen').innerText = userProfile.verified[0].claim.isolderthaneighteen;
        //registry.get.call(userProfile.publicKey, userProfile.verified[0].iss, userProfile.verified[0].sub).then((value) => {
        //    console.log(value);
        //})
        // Do something after they have disclosed credentials
        //alert(cred.verified[0].sub);
    })
}