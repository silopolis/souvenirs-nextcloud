import Album from './components/album'

__webpack_nonce__ = btoa(OC.requestToken)
__webpack_public_path__ = OC.linkTo('souvenirs', 'js/')

// boot up vue album
import { createApp } from 'vue'

createApp(Album,{
  path: $('#album-parent-frame').data().path,
  token: ("token" in $('#album-parent-frame').data()) ? $('#album-parent-frame').data().token : "",
}).mount('#album-parent-frame')
