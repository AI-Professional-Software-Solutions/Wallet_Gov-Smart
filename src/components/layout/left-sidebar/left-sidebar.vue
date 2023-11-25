<template>

  <!-- <div> -->
    <nav class="navbar navbar-light navbar-vertical navbar-expand-xl">
    <div class="d-flex align-items-center">
      <router-link to="/" class="navbar-brand">
        <div class="d-flex align-items-center py-3">
          <img class="me-2 logo" :src="require(`src/assets/${$store.state.settings.dark ?'white':'black'}/logo-inline.png`).default" :alt="name">
        </div>
      </router-link>
    </div>
    <div :class="`navbar-collapse collapse ${this.$store.state.page.leftSidebarShow ? 'show' : ''}`">
      <div class="navbar-vertical-content scrollbar">
        <ul class="navbar-nav flex-column mt-3 mb-3">
          <li class="nav-item">
            <router-link to="/wallet" :class="`${route === '/wallet' ? 'active' : ''} nav-link`" @click.native="disableNavbarMenu">
              <div class="d-flex align-items-center">
                <i class="fas fa-wallet"></i>
                <span class="nav-link-text ps-1">Wallet</span>
              </div>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/" :class="`${route === '/'  || route === '/login' ? 'active' : ''} nav-link`" @click.native="disableNavbarMenu">
              <div class="d-flex align-items-center">
                <i class="fas fa-money-bill-alt"></i>
                <span class="nav-link-text ps-1">Current Account</span>
              </div>
            </router-link>
          </li>
          <li class="nav-item">
            <div class="d-flex align-items-center">
              <router-link :disabled="!isWalletLogged" to="/txs/private/send" :class="`${ route === '/txs/private/send' ? 'active' : ''} nav-link`" @click.native="disableNavbarMenu">
                <i class="fas fa-money-check-alt"></i>
                <span class="nav-link-text ps-1">Private Transfer</span>
              </router-link>
            </div>
          </li>
          <li class="nav-item">
            <div class="d-flex align-items-center">
              <span :class="`nav-link cursor-pointer ${route.indexOf('/explorer') === 0 ? 'active' : ''}`" @click.native="e => toggleNavElement( e,'explorer')">
                <i class="fas fa-cubes"></i>
                <span class="nav-link-text px-1">Blockchain Explorer</span>
                <i :class="`nav-chevron fas fa-chevron-${navElementsShown['explorer'] ? 'up' : 'down' }`"></i>
              </span>
            </div>
            <ul :class="`nav collapse ${navElementsShown['explorer'] ? 'show':''}`">
              <li class="nav-item">
                <router-link :class="`nav-link ${route === '/explorer' ? 'active' : ''}`" to="/explorer" @click.native="disableNavbarMenu">
                  <div class="d-flex align-items-center">
                    <i class="fas fa-cube"></i>
                    <span class="nav-link-text ps-1">Explore Blocks</span>
                  </div>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link :class="`nav-link ${route.indexOf('/explorer/mempool') === 0 ? 'active' : ''}`" to="/explorer/mempool" @click.native="disableNavbarMenu">
                  <div class="d-flex align-items-center">
                    <i class="fas fa-list-ol"></i>
                    <span class="nav-link-text ps-1">Pending Transactions</span>
                  </div>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link :class="`nav-link ${route.indexOf('/explorer/assets') === 0 ? 'active' : ''} nav-link`" to="/explorer/assets" @click.native="disableNavbarMenu">
                  <div class="d-flex align-items-center">
                    <i class="fas fa-file-invoice-dollar"></i>
                    <span class="nav-link-text ps-1">Chain Assets</span>
                  </div>
                </router-link>
              </li>
            </ul>
          </li>
          <!-- <li class="nav-item">
            <div class="d-flex align-items-center">
              <span :class="`nav-link cursor-pointer ${route.indexOf('/advanced') === 0 ? 'active' : ''}`" @click.native="e => toggleNavElement(e,'advanced')">
                <i class="fas fa-money-check"></i>
                <span class="nav-link-text px-1">Advanced Transfers</span>
                <i :class="`nav-chevron fas fa-chevron-${navElementsShown['advanced'] ? 'up' : 'down' }`"></i>
              </span>
            </div>
            <ul :class="`nav collapse ${navElementsShown['advanced'] ? 'show':''}`">
              <li class="nav-item" v-if="$store.state.settings.expert">
                <router-link :disabled="!isWalletLogged" :class="`nav-link ${ route.indexOf( '/advanced/private/conditional-payment' ) === 0 ? 'active' : ''} nav-link`" to="/advanced/private/conditional-payment" @click.native="disableNavbarMenu">
                  <div class="d-flex align-items-center">
                    <i class="fas fa-balance-scale"></i>
                    <span class="nav-link-text ps-1">Conditional Payment</span>
                  </div>
                </router-link>
              </li>
              <li class="nav-item" v-if="$store.state.settings.expert">
                <router-link :class="`nav-link ${ route.indexOf( '/advanced/sign-resolution-conditional-payment' ) === 0 ? 'active' : ''} nav-link`" to="/advanced/sign-resolution-conditional-payment" @click.native="disableNavbarMenu">
                  <div class="d-flex align-items-center">
                    <i class="fas fa-signature"></i>
                    <span class="nav-link-text ps-1">Sign Resolution</span>
                  </div>
                </router-link>
              </li>
              <li class="nav-item" v-if="$store.state.settings.expert">
                <router-link :disabled="!isWalletLogged" :class="`nav-link ${ route.indexOf('/advanced/public/resolution-conditional-payment') === 0 ? 'active' : ''} nav-link`" to="/advanced/public/resolution-conditional-payment" @click.native="disableNavbarMenu">
                  <div class="d-flex align-items-center">
                    <i class="fas fa-gavel"></i>
                    <span class="nav-link-text ps-1">Conditional Resolution</span>
                  </div>
                </router-link>
              </li>
              <li class="nav-item" v-if="$store.state.settings.expert">
                <router-link :disabled="!isWalletLogged" :class="`nav-link ${ route.indexOf('/advanced/import-link') === 0 ? 'active' : ''} nav-link`" to="/advanced/import-link" @click.native="disableNavbarMenu">
                  <div class="d-flex align-items-center">
                    <i class="fa fa-terminal"></i>
                    <span class="nav-link-text ps-1">Import Transfer Link</span>
                  </div>
                </router-link>
              </li>
            </ul>
          </li> -->
          <li class="nav-item" v-if="$store.state.settings.expert">
            <router-link :class="`nav-link ${route.indexOf('/settings') === 0 ? 'active' : ''} nav-link`" to="/settings" @click.native="disableNavbarMenu">
              <div class="d-flex align-items-center">
                <i class="fas fa-wrench"></i>
                <span class="nav-link-text ps-1">Settings</span>
              </div>
            </router-link>
          </li>
          <div class="mt-3 mb-3" style="height: 1px; background-color: #748194; width: 100%;"></div>
          <li class="nav-item">
            <div class="g-0 justify-content-between fs--1 mb-3 text-600">
              <div class="row pb-0 mb-0">
                <div class="col-12 col-auto text-center d-flex flex-column justify-content-start align-items-start">
                  <span class="pe-1">Consensus: <span class="text-success">{{ blockchainStatus }}</span></span>
                  <span class="pe-1">Block Height: <span v-if="blockHeight" class="text-success">#{{ blockHeight }}</span></span>
                  <span class="pe-1">WEB: {{ version }}</span>
                  <span class="pe-1">WASM: {{ buildVersion }}</span>
                  <!-- <span class="pe-1">2019 - 2022 <a :href="website" target="_blank">{{ entity }}</a> </span> -->
                  <div class="mt-3 mb-3" style="height: 1px; background-color: #748194; width: 100%;"></div>
                  <span class="pe-1">Open Source</span>
                  <a class="pe-1" href="https://github.com/AI-Professional-Software-Solutions/Blockchain_Gov-Smart">Blockchain</a>
                  <a class="pe-1" href="https://github.com/AI-Professional-Software-Solutions/Wallet_Gov-Smart" >Wallet & Explorer</a>
                  <!-- <div class="mt-3 mb-3" style="height: 1px; background-color: #748194; width: 100%;"></div> -->
                  <a href="portal.gov-smart.com" target="_blank" class="mt-3">
                    <span>Go to Portal</span>
                  </a>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    </nav>
    

  <!-- </div> -->

</template>

<script>
import consts from "consts/consts"

export default {

  data() {
    return {
      toggle: false,
      navElementsShown: {
        explorer: true,
        advanced: true,
      },
    }
  },

  computed: {

    name() {
      return consts.name
    },

    route() {
      return this.$route.fullPath || '';
    },

    walletAddress() {
      return this.$store.state.wallet.addresses[this.$store.state.wallet.mainPublicKey];
    },

    isWalletLogged() {
      return !(this.$store.state.wallet.initialized && !this.$store.state.wallet.loaded)
    },

    entity() {
      return consts.entity;
    },
    website() {
      return consts.website
    },

    blockHeight() {
      return this.$store.state.blockchain.end;
    },

    blockchainStatus() {

      const status = this.$store.state.blockchain.status;

      if (status === 'sync') return 'Established';
      if (status === 'syncing') return 'Syncing';
      if (status === 'offline') return 'Offline';
      if (status === 'online') return 'Connected';

      return 'na';
    },

    version() {
      return COMMITHASH.slice(0, 10)
    },

    buildVersion() {
      return PandoraPay.config.BUILD_VERSION
    }

  },

  methods: {

    toggleNavElement(e, key) {
      if (!this.navElementsShown[key]) this.navElementsShown[key] = true
      else this.navElementsShown[key] = false
    },
    disableNavbarMenu(e) {
      this.$store.commit('setLeftSidebarShow', false)
    },
    handleShowTestnetFaucet() {
      this.$store.state.page.testnetFaucetModal.showModal()
    },
  },


}
</script>

<style scoped>
@media (min-width: 1200px) {
  .navbar-vertical {
    z-index: auto;
  }
}

.logo {
  height: 42px;
}

.fixed-button {
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 0 20px 20px 20px;;
}

.rounded-fixed-btn {
  height: 50px;
  width: 50px;
  line-height: 50px;
  font-size: 1.5em;
  border-radius: 50%;
  text-align: center;
  cursor: pointer;
}
</style>
