import Vue from 'vue'
import Album from './components/album'

__webpack_nonce__ = btoa(OC.requestToken)
__webpack_public_path__ = OC.linkTo('souvenirs', 'js/')

// boot up vue album
new Vue({
  el: 'album',
  render(h) {
    return h(Album, {
      props: {
        path: this.$el.attributes.path.value,
        token: ("token" in this.$el.attributes) ? this.$el.attributes.token.value : "",
      }
    })
  },
});