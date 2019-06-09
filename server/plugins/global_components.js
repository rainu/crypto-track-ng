import Vue from 'vue'
import Vuelidate from 'vuelidate'

import Success from '../components/message/Success'
import Warning from '../components/message/Warning'
import Info from '../components/message/Info'
import Error from '../components/message/Error'
import ModalGeneral from '../components/modal/General'
import ModalWarning from '../components/modal/Warning'
import ModalReadOnly from '../components/modal/ReadOnly'
import SessionTime from '../components/widget/SessionTime'
import Logout from '../components/Logout'
import InputNumber from '../components/form/InputNumber'
import CurrencyInput from '../components/form/CurrencyInput'
import CurrencySelect from '../components/form/CurrencySelect'
import WalletChooser from '../components/form/WalletChooser'
import CurrencyIcon from '../components/widget/CurrencyIcon'
import CurrencyAmount from '../components/widget/CurrencyAmount'
import WalletIO from '../components/form/WalletIO'
import ExchangeRate from '../components/form/ExchangeRate'
import TransactionList from '../components/widget/transaction/List'
import ProjectVersion from '../components/widget/ProjectVersion'
import ProjectBuildDate from '../components/widget/ProjectBuildDate'
import ReactivePieChart from '../components/chart/ReactivePie'
import ReactiveLineChart from '../components/chart/ReactiveLine'
import BalanceChart from '../components/widget/dashboard/BalanceChart'

Vue.use(Vuelidate)
Vue.component('message-success', Success)
Vue.component('message-warning', Warning)
Vue.component('message-info', Info)
Vue.component('message-error', Error)
Vue.component('modal-general', ModalGeneral)
Vue.component('modal-warning', ModalWarning)
Vue.component('modal-read-only', ModalReadOnly)
Vue.component('auth-logout', Logout)
Vue.component('auth-session-time', SessionTime)
Vue.component('input-number', InputNumber)
Vue.component('input-currency', CurrencyInput)
Vue.component('select-currency', CurrencySelect)
Vue.component('input-wallet', WalletChooser)
Vue.component('transaction-list', TransactionList)
Vue.component('icon-currency', CurrencyIcon)
Vue.component('currency-amount', CurrencyAmount)
Vue.component('wallet-io', WalletIO)
Vue.component('exchange-rate', ExchangeRate)
Vue.component('project-version', ProjectVersion)
Vue.component('project-build-date', ProjectBuildDate)
Vue.component('chart-pie', ReactivePieChart)
Vue.component('chart-line', ReactiveLineChart)
Vue.component('balance-chart', BalanceChart)
