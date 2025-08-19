module.exports = {
  plugins: [
    require('postcss-simple-vars')({
      variables: require('./src/styles/vars'),
      onVariables(variables) {
        console.log('CSS Variables')
        console.log(JSON.stringify(variables, null, 2))
      },
    }),
  ],
}
