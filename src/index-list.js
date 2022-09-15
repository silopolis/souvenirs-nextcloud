import AlbumItemList from './components/album-item-list'

//for nextcloud vue components
/*Vue.prototype.t = window.t
Vue.prototype.n = window.n
Vue.prototype.OC = window.OC
Vue.prototype.OCA = window.OCA*/

__webpack_nonce__ = btoa(OC.requestToken)
__webpack_public_path__ = OC.linkTo('souvenirs', 'js/')


// boot up vue 
import { createApp } from 'vue'

createApp(AlbumItemList).mount('#album-list-frame')

