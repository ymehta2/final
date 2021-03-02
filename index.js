firebase.auth().onAuthStateChanged(async function(user) {
  if (user) {
    // Signed in
    console.log('signed in')
  } else {
    // Signed out
    console.log('signed out')

    // Initializes FirebaseUI Auth
    let ui = new firebaseui.auth.AuthUI(firebase.auth())

    // FirebaseUI configuration
    let authUIConfig = {
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      signInSuccessUrl: 'index.html'
    }

    // Starts FirebaseUI Auth
    ui.start('.sign-in-or-sign-out', authUIConfig)
  }

  let stocks = new Stocks('CF0SLZCQGPR7G3PA')
  let result = await stocks.timeSeries({
    symbol: 'TSLA',
    interval: '1min',
    amount: 1
   });
  
  // document.querySelector('.stockSearch').insertAdjacentElement('beforeend', `
  //  <h1>Stock ticker ${result.symbol}</h1>
  // `)
  
  document.querySelector('.stockSearch').insertAdjacentHTML('beforeend', `
  <div class="w-1/5 p-4">
    ${result[0].close}
  </div>
`)
console.log(result)
  
})
