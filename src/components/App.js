import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import SelfNFT from '../abis/SelfNFT.json'
import Navbar from './Navbar'
import UploadForm from './UploadForm'
import NFTGallery from './NFTGallery'


const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class App extends Component {
  async startWeb3() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async componentWillMount() {
    this.startWeb3()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({'account': accounts[0]})

    const networkId = await web3.eth.net.getId()
    const networkData = SelfNFT.networks[networkId]
    if(networkData){
      const selfNFT = new web3.eth.Contract(SelfNFT.abi, networkData.address)
      this.setState({selfNFT})

      let accountBalance = await selfNFT.methods.balanceOf(this.state.account).call()
      console.log(accountBalance);
      for(let i = 0; i < accountBalance; i++){
        let id = await selfNFT.methods.tokenOfOwnerByIndex(accounts[0], i).call()
        let accountSNFT = await selfNFT.methods.tokenURI(id).call()
        console.log(accountSNFT);
        this.setState({'accountSNFTs': [...this.state.accountSNFTs, accountSNFT]})
      }

      this.setState({'loading': false})
    }else{
      alert('Wrong network')
    }
  }

  captureFile = event => {

    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  uploadImage = () => {
    console.log("Submitting file to ipfs...")

    //adding file to the IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      if(error) {
        console.error(error)
        return
      }

      this.setState({ loading: true })
      let img_url = 'https://ipfs.infura.io/ipfs/' + result[0].hash
      this.state.selfNFT.methods.mint(this.state.account, img_url).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
        this.setState({'accountSNFTs': [...this.state.accountSNFTs, img_url]})
      }).catch((e) => {
        if(e.code === 4001){
          alert('Transaction rejected')
        }else{
          alert('Something went wrong')
        }
        this.setState({ loading: false })
      })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      selfNFT: null,
      accountSNFTs: [],
      loading: true
    }

    this.startWeb3 = this.startWeb3.bind(this)
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} startWeb3={this.startWeb3}/>
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <div>
            <UploadForm
              captureFile={this.captureFile}
              uploadImage={this.uploadImage}
            />
            <NFTGallery
              accountSNFTs={this.state.accountSNFTs}
            />
            </div>
        }
      </div>
    );
  }
}

export default App;