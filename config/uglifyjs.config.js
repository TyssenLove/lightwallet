
// https://www.npmjs.com/package/uglify-js

module.exports = {

  /**
   * mangle: uglify 2's mangle option
   */
	  mangle: {
        reserved: ['Metaverse','BigInteger', 'ECPair', 'Point']
    },

  /**
   * compress: uglify 2's compress option
   */
  compress: {
    toplevel: true,
    pure_getters: true
  }
};
