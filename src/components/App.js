import React, { Component } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import SelfNFT from '../abis/SelfNFT.json'
import Navbar from './Navbar'
import Main from './Main'


const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
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
      const imagesCount = await selfNFT.methods.imageCount().call()
      this.setState({imagesCount})
      this.setState({'loading': false})

      // Load images
      for (var i = 1; i <= imagesCount; i++) {
        const image = await selfNFT.methods.images(i).call()
        this.setState({
          'images': [...this.state.images, {'id': image.id, 'hash': image.hash, 'description': image.description, 'tipAmount': image.tipAmount, 'author': image.author}]
        })
      }

      // Sort images. Show highest tipped images first
      this.setState({
        images: this.state.images.sort((a,b) => b.tipAmount - a.tipAmount )
      })

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

  uploadImage = description => {
    console.log("Submitting file to ipfs...")

    //adding file to the IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      if(error) {
        console.error(error)
        return
      }

      this.setState({ loading: true })
      this.state.selfNFT.methods.uploadImage(result[0].hash, description).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  tipImageOwner = (id, tipAmount) => {
    this.setState({ loading: true })
    this.state.selfNFT.methods.tipImageOwner(id).send({ from: this.state.account, value: tipAmount }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
      //this.state.selfNFT.events.ImageTipped({fromBlock: 0, toBlock: 'latest'}).on('data', event => window.location.reload())
    })

  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      selfNFT: null,
      images: [],
      loading: true
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              images={this.state.images}
              captureFile={this.captureFile}
              uploadImage={this.uploadImage}
              tipImageOwner={this.tipImageOwner}
            />
          }
        }
      </div>
    );
  }
}

export default App;