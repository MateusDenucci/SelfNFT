const SelfNFT = artifacts.require('./SelfNFT.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('SelfNFT', ([deployer, author, tipper]) => {
  let selfNFT

  before(async () => {
    selfNFT = await SelfNFT.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await selfNFT.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await selfNFT.name()
      assert.equal(name, 'SelfNFT')
    })
  })

  describe('images', async () => {
    let result, imageCount
    const hash = 'QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb'

    before(async () => {
      result = await selfNFT.uploadImage(hash, 'Image description', { from: author })
      imageCount = await selfNFT.imageCount()
    })

    //check event
    it('creates images', async () => {
      // SUCESS
      assert.equal(imageCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
      assert.equal(event.hash, hash, 'Hash is correct')
      assert.equal(event.description, 'Image description', 'description is correct')
      assert.equal(event.tipAmount, '0', 'tip amount is correct')
      assert.equal(event.author, author, 'author is correct')

    })


    //check from Struct
    it('lists images', async () => {
      const image = await selfNFT.images(imageCount)
      assert.equal(image.id.toNumber(), imageCount.toNumber(), 'id is correct')
      assert.equal(image.hash, hash, 'Hash is correct')
      assert.equal(image.description, 'Image description', 'description is correct')
      assert.equal(image.tipAmount, '0', 'tip amount is correct')
      assert.equal(image.author, author, 'author is correct')
    })

  })
})