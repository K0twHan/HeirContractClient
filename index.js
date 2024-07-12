//import edilen kütüphaneler
const readline = require('readline');


const { Wallet, parseUnits } = require('ethers');
const {ethers} = require('ethers');
const {parseEther} = require("ethers");
const {heirabi} = require("./heirabi.json");
const {tokenabi} = require("./tokenabi.json");
const { sign } = require('crypto');
//

//
// input alabilmek için readline kullanıldı
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });


//input almak için fonksiyon
  function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
  }


//tanımlamalar

const provider = new ethers.JsonRpcProvider("https://sepolia-rollup.arbitrum.io/rpc")
const heirContractAddress = "0x85c1421F4a8e0ac44457976605a1c9Acbdd23426"
const tokenContractAddress = "0xaD3c6360B988e9716bbae9687f48b230F4F6e66A"
//

//USDC İÇİN TOKEN CONTRACT ADRESİ
const usdcContractAddress =  "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"
const usdtheirAddress=       "0x9f0aeb9b3bc5dac9157fcb4bd3406b2c831bea25"
const usdcabi = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "spender",
                "type": "address"
            },
            {
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "success",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "owner",
                "type": "address"
            },
            {
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
]
//usdc için contratla iletişime geçecek olan fonksiyon
async function getUSDCContract(private_Key,public_key,amount){

    const wallet = new Wallet(private_Key, provider)
    const signer = wallet.connect(provider)
    const usdctokenContract = new ethers.Contract(usdcContractAddress, usdcabi, signer);
    const usdcheirContract = new ethers.Contract(usdtheirAddress, heirabi, signer);
    await usdcTokenOperations(signer,usdcheirContract,usdctokenContract,amount,public_key);

}
//usdc tokeni ile işlem yapan fonksiyon
async function usdcTokenOperations(signer,usdcheirContract,usdctokenContract,amount,public_key){
   
    //await tokenContract.approve(heirContractAddress,"5000000").then((allowance) => {console.log(allowance)})
   
   await usdctokenContract.approve(usdtheirAddress, amount+"000000").then((tx) => {console.log(tx)})
    await usdctokenContract.allowance(signer,usdcContractAddress).then((allowance) => {console.log(allowance)})
   
   //await  tokenContract.balanceOf(signer.address).then((balance) => {console.log(balance)})
   await  usdcheirContract.inheritances(signer.address).then((balance) => {console.log(balance)})  
    
   await  usdcheirContract.setHeir(public_key,amount+"000000").then((tx) => {console.log(tx)})
   
   //await heirContract.setHeir(public_key,"5000000").then((tx) => {console.log(tx)})
}

//usdc tokeni ile miras almak için fonksiyon
async function getUSDCHeirContract(private_Key,public_key,amount){
    const wallet = new Wallet(private_Key, provider)
    const signer = wallet.connect(provider)
    const usdcheirContract = new ethers.Contract(usdtheirAddress, heirabi, signer);
    await usdcclaimInheritance(public_key,usdcheirContract,amount);

}
//test tokeni ile miras almak için fonksiyon
async function getHeirContract(private_Key,public_key,amount){
const wallet = new Wallet(private_Key, provider)
const signer = wallet.connect(provider)
const heirContract = new ethers.Contract(heirContractAddress, heirabi, signer);
await claimInheritance(public_key,heirContract,amount);
}
//test tokeni kontratlarına bağlanma fonksiyonu
async function connectContracts(private_Key,amount,public_key) {
//kontratlara bağlanma
const wallet = new Wallet(private_Key, provider)
const signer = wallet.connect(provider)
const tokenContract = new ethers.Contract(tokenContractAddress, tokenabi, signer);
const heirContract = new ethers.Contract(heirContractAddress, heirabi, signer);
await tokenOperations(signer,heirContract,tokenContract,amount,public_key);
}

//test tokeni ile işlem yapan fonksiyon
async function tokenOperations(signer,heirContract,tokenContract,amount,public_key){
   
   
   await tokenContract.approve(heirContractAddress, parseEther(amount)).then((tx) => {console.log(tx)})
    await tokenContract.allowance(signer,heirContractAddress).then((allowance) => {console.log(allowance)})
   
   await  tokenContract.balanceOf(signer.address).then((balance) => {console.log(balance)})
   await  heirContract.inheritances(signer.address).then((balance) => {console.log(balance)})  
   
   await  heirContract.setHeir(public_key,parseEther(amount)).then((tx) => {console.log(tx)})
   

    
}
//mirası almak için fonksiyon
async function claimInheritance(public_key,heirContract,amount){

await heirContract.claimInheritance(public_key,parseEther(amount)).then((tx) => {console.log(tx)})
}

async function usdcclaimInheritance(public_key,usdcheirContract,amount){

    await usdcheirContract.claimInheritance(public_key,amount+"000000").then((tx) => {console.log(tx)})
    }





async function main() {
const option = await askQuestion("Miras Bırakmak için 1 mirası almak için 2 yazın: ")
//rl.close();
if(option == 1){

    const token = await askQuestion("Hangi tokeni miras bırakmak istersiniz: Test Token için 1 USDT için 2 yazın:");
    if(token == 1){
        const amount = await askQuestion("Kaç Test Token miras bırakmak istersiniz: ")

        const private_key = await askQuestion("Private Keyinizi girin: ")
        const public_key = await askQuestion("Miras Vereceğiniz Hesabın Public Keyini Girin: ")
        
    rl.close();
    await connectContracts(private_key,amount,public_key);
    console.log("Miras Bırakılıyor...\n")
    

}
else if (token == 2){
        const amount = await askQuestion("Kaç USDC miras bırakmak istersiniz: ")

        const private_key = await askQuestion("Private Keyinizi girin: ")
        const public_key = await askQuestion("Miras Vereceğiniz Hesabın Public Keyini Girin: ")    


        rl.close();
        await getUSDCContract(private_key,public_key,amount);
        console.log("Miras Bırakılıyor...\n")
        
    }
    }

    else if(option == 2){
    const token = await askQuestion("Hangi tokeni miras almak istersiniz: Test Token için 1 USDT için 2 yazın:");
    if(token == 1){
        const public_key = await askQuestion("Miras tanımlayan hesabın public keyini girin: ")
        const private_key = await askQuestion("Private Keyinizi girin: ")
        const amount = await askQuestion("Kaç Test Token miras almak istersiniz: ")
        await getHeirContract(private_key,public_key,amount);
        rl.close();

    }
    else if (token == 2){
        const public_key = await askQuestion("Miras tanımlayan hesabın public keyini girin: ")
        const private_key = await askQuestion("Private Keyinizi girin: ")
        const amount = await askQuestion("Kaç USDC miras almak istersiniz: ")
        await getUSDCHeirContract(private_key,public_key,amount);
        rl.close();
    
    
    }
        }
    }
main()