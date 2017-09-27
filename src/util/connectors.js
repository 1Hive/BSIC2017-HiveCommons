import { Connect, SimpleSigner } from 'uport-connect'

export const uport = new Connect('Individuality Attester', {
  clientId: '2otwkJqvG8m5dt9RevQGiHXGh3Nez1i7KDW',
  network: 'rinkeby',
  signer: SimpleSigner('411a0c0a5f8725027ab2691b63e58dff9d9c9eb55ef29bc63c989b1d7d435073')
})

export const web3 = uport.getWeb3()
