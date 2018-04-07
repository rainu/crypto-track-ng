import Vue from 'vue'
import Vuelidate from 'vuelidate'

import Success from '../components/message/Success'
import Warning from '../components/message/Warning'
import Info from '../components/message/Info'
import Error from '../components/message/Error'
import Logout from '../components/Logout'
import CurrencyInput from '../components/form/CurrencyInput'
import CurrencySelect from '../components/form/CurrencySelect'

Vue.use(Vuelidate)
Vue.component('message-success', Success)
Vue.component('message-warning', Warning)
Vue.component('message-info', Info)
Vue.component('message-error', Error)
Vue.component('auth-logout', Logout)
Vue.component('input-currency', CurrencyInput)
Vue.component('select-currency', CurrencySelect)
