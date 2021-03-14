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

  document.querySelector('.submitButton').addEventListener('click', async function(event){
    event.preventDefault()
    document.querySelector('.stockSearch').innerHTML = ``
    
    let stockTicker = document.getElementById("stock-ticker-input").value
    let stockQuantity = document.getElementById("stock-quantity-input").value
    
    let stocks = new Stocks('CF0SLZCQGPR7G3PA')
    let result = await stocks.timeSeries({
      symbol: stockTicker,
      interval: '1min',
      amount: 1
    });
    
    let orderCost = result[0].close * stockQuantity
    console.log(orderCost)

    document.querySelector('.stockSearch').insertAdjacentHTML('beforeend', `
    <div class="w-full p-4">
    The stock price of ${stockTicker} as of ${result[0].date} was
    </div>

    <div class="w-full p-4 text-purple-500 font-bold text-2xl text-center">
    $${result[0].close}
    </div>

    <div class="w-full p-4 text-purple-500 font-bold text-2xl text-center">
    For ${stockQuantity} shares, it would cost ${orderCost}.
    </div>

    `)

  console.log(result)
})

})
