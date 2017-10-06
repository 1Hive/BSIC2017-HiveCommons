import { Connect, SimpleSigner } from 'uport-connect'

export const uport = new Connect('Hive Commons', {
  clientId: '2or25VKPtkdhvFMwbh79UKKP6XhN48ffr1Y',
  network: 'rinkeby',
  signer: SimpleSigner('ff0457c59e78c321924f5d86748213daeb7b17622b06e31bfa76585e10f1bbb6')
})

// Attestation uPort app.
// export const uport = new Connect('Hive Commons Individuality Attester', {
//     clientId: '2oghfQT26sXXsgTKPhFccWq3inDVWwH4TUX',
//     network: 'rinkeby',
//     signer: SimpleSigner('c0fee934f5213c571e0014c25a7efab062edda51951e3cc2047495046b91c1ca')
// })


export const web3 = uport.getWeb3()
