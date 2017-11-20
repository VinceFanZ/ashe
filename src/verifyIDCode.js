function verify (card) {
  const codeMaps = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
  let sum = 0
  for (let i = 17; i > 0; i--) {
    const s = Math.pow(2, i) % 11
    sum += s * card[17 - i]
  }
  console.log(codeMaps[sum % 11])
}

verify('420683199208246118')
