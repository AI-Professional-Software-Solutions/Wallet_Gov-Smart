<template>
  <div>

    <main class="main">

      <div class="row flex-center min-vh-100 py-6 text-center">
        <div class="col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
          <div>
            <div>

              <div class="text-center">
                  <div class="scene">
                    <div class="cube-wrapper">
                      <div class="cube">
                        <div class="cube-faces">
                          <div class="cube-face shadow" :style="cubeComputedStyle"></div>
                          <div class="cube-face bottom" :style="cubeComputedStyle"><img :src="require(`src/assets/countries/FR_logo.png`).default" :alt="name"></div>
                          <div class="cube-face top"    :style="cubeComputedStyle"><img :src="require(`src/assets/countries/RO_logo.png`).default" :alt="name"></div>
                          <div class="cube-face left"   :style="cubeComputedStyle"><img :src="require(`src/assets/countries/ES_logo.png`).default" :alt="name"></div>
                          <div class="cube-face right"  :style="cubeComputedStyle"><img :src="require(`src/assets/countries/JP_logo.png`).default" :alt="name"></div>
                          <div class="cube-face back"   :style="cubeComputedStyle"><img :src="require(`src/assets/countries/DE_logo.png`).default" :alt="name"></div>
                          <div class="cube-face front"  :style="cubeComputedStyle"><img :src="require(`src/assets/countries/US_logo.png`).default" :alt="name"></div>
                        </div>
                      </div>
                    </div>
                </div>
              </div>

              <h1 class="text-center" :style="h1ComputedStyle">{{ name.toUpperCase() }}</h1>

              <div class="loading-text-div">
                <div class="container">
                  <div class="progress-bar__container" :style="loadbarContainerComputedStyle">
                    <div class="progress-bar" :style="loadbarComputedStyle"> </div>
                    <span class="progress-bar-text">{{ loadbarPercentage }}%</span>
                  </div>
                </div>

                <alert-box v-if="error" type="error">{{ error }}</alert-box>
                <span v-else class="loading-text">
                <i v-if="isDownloading" class="fas fa-spinner fa-spin"></i>
                {{ progressStatus }}
                </span>

              </div>
            </div>
          </div>
        </div>

      </div>

    </main>

  </div>
</template>

<script>

import consts from "consts/consts"
import AlertBox from "src/components/utils/alert-box"
import WasmWebworkerIntegration from './wasm-webworker-integration'

export default {

  components: {AlertBox},

  data() {
    return {
      progressStatus: "Initialized",
      isDownloading: false,
      error: "",
      dark: false,
      loadedPercent: 0,
    }
  },

  props: {
    options: {default: null},
  },

  computed: {
    name() {
      return consts.name
    },
    loadbarPercentage() { 
      return this.loadedPercent
    },
    cubeComputedStyle() {
      if (this.dark) {
        return {
          background: 'linear-gradient(to bottom right, #273b55, #34133f)',
          border: 'solid 1px rgb(11, 23, 39)'
        }
      }
      return {
        background: 'linear-gradient(to bottom right, #110d31ff, #4a4671)',
        border: 'solid 1px rgb(255, 255, 255)'
      }
    },
    h1ComputedStyle() {
      if (this.dark) {
        return {
          color: '#ffffff'
        }
      }
      return {
        color: '#1677d7'
      }
    },
    loadbarContainerComputedStyle() {
      if (this.dark) {
        return {
          'box-shadow': '0 0 5px #ffffff',
        }
      }
      return {
        'box-shadow': '0 0 5px #1677d7',
      }
    },
    loadbarComputedStyle() {
      if (this.dark) {
        return {
          background: '#ffffff',
          width: this.loadedPercent + '%',
        }
      }
      return {
         background: 'linear-gradient(to right, #B993D6, #1677d7)',
         width: this.loadedPercent + '%',
      }
    }
  },
  
  mounted() {

    if (typeof window === "undefined") return;

    if (typeof localStorage !== "undefined" && !localStorage.getItem('dark'))
      localStorage.setItem('dark', this.options.intro.defaultTheme)

    if (typeof localStorage !== "undefined" && localStorage.getItem('dark') === 'true') {
      document.getElementsByTagName("html")[0].classList.add('dark');
      this.dark = true
    }

    if (this.options.intro.startAutomatically) return this.start()

  },

  methods: {

    async start() {

      try {

        this.isDownloading = true;

        const wasmMainSri = global.SRI_WASM_MAIN || ''
        const wasmMainFileSize = global.SIZE_WASM_MAIN || 0

        const integration = new WasmWebworkerIntegration("PandoraPay", this.options.resPrefix + "wasm/PandoraPay-wallet-main.wasm?" + wasmMainSri, wasmMainSri, wasmMainFileSize, consts.goArgv, this.options.resPrefix + "workers/PandoraPay-webworker-wasm.js", (status) => {
          console.log("Main status:", status)
          this.progressStatus = status
        }, async () => {

          await PandoraPay.helpers.helloPandora()
          this.progressStatus = "WASM is working!"

          if (this.options.intro.loadWasmHelper) {
            let helperPromiseResolved = false
            global.PandoraPayHelperPromise = new Promise((resolver) => {

              //for debugging only
              //return resolver(true)

              global.PandoraPayHelperLoader = async () => {

                if (helperPromiseResolved) return //already resolved
                helperPromiseResolved = true

                const wasmHelperSri = global.SRI_WASM_HELPER || ''
                const wasmHelperFileSize = global.SIZE_WASM_HELPER || 0

                const integrationHelper = new WasmWebworkerIntegration("PandoraPayHelper", this.options.resPrefix + "wasm/PandoraPay-wallet-helper.wasm?" + wasmHelperSri, wasmHelperSri, wasmHelperFileSize, consts.goArgv, this.options.resPrefix + "workers/PandoraPay-webworker-wasm.js", (status) => {
                  console.log("Helper status:", status)
                }, async () => {

                  let promiseDecoderResolve, promiseDecoderReject
                  global.PandoraPayHelper.decoderPromise = new Promise((resolve, reject) => {
                    promiseDecoderResolve = resolve
                    promiseDecoderReject = reject
                  })

                  await PandoraPayHelper.helloPandoraHelper()
                  console.log("Helper WASM is working")

                  resolver(true)

                  const balanceDecryptorTableSize = Number.parseInt(localStorage.getItem('balanceDecryptorTableSize') || '18');

                  const promise = PandoraPayHelper.wallet.initializeBalanceDecryptor(MyTextEncode(JSONStringify({tableSize: 1 << balanceDecryptorTableSize})), status => {
                    if (PandoraPayHelper.balanceDecoderCallback) PandoraPayHelper.balanceDecoderCallback(status)
                  })

                  promise
                      .then(answ => promiseDecoderResolve(answ))
                      .catch(err => promiseDecoderReject(err))

                  await promise
                })


                const data = await integrationHelper.downloadWasm(status => {
                  console.log("helper:", status.message)
                  
                  if (typeof status.downlowded !== "undefined") {
                    this.loadedPercent = Math.ceil(status.downlowded / 5697801 * 100)
                    console.log("Helper loaded:", status.downlowded , wasmHelperFileSize ," mb | loadedPercent:", this.loadedPercent)
                  }
                })

                await integrationHelper.createWorker()
                integrationHelper.initialize(data)
              }

            })


          }

          await PandoraPayWallet.loadApp()

        })

        const data = await integration.downloadWasm(status => {
          this.progressStatus = status.message
          console.log("Status message:", this.progressStatus)

          if (typeof status.downloaded !== "undefined") {
            if (wasmMainFileSize > 0) {
              this.loadedPercent = (status.downloaded / wasmMainFileSize * 100).toFixed(2)
            } else {
              this.loadedPercent = (status.downloaded / 11347404 * 100).toFixed(2)
            }
            console.log("Main loaded:", status.downloaded , wasmMainFileSize ," mb | loadedPercent:", this.loadedPercent)
          }
        })

        this.progressStatus = "Web Worker created"
        await integration.createWorker()

        this.progressStatus = "WASM instantiating..."
        integration.initialize(data)

      } catch (err) {
        this.error = err.toString()
      }

    }
  },

  //based on https://codepen.io/alexrmota/pen/NWqwGyJ

}


</script>

<style scoped>

h1 {
  font-size: 30px;
  padding-top: 20px;
}

.logo {
  max-width: 55px;
  position: absolute;
  margin-top: 100px;
  margin-left: -30px;
}

.dark .logo {
  -webkit-filter: drop-shadow(0px 0px 20px rgba(255, 255, 255, 1));
  filter: drop-shadow(0px 0px 20px rgba(255, 255, 255, 1));
}

.loading-text-div {
  text-align: center;
  margin-top: 20px
}

.loading-text {
  font-family: sans-serif;
  font-size: 12px;
  animation: blink .9s ease-in-out infinite;
}

.dark .loading-text {
  -webkit-filter: drop-shadow(0px 0px 4px rgba(255, 255, 255, 0.5));
  filter: drop-shadow(0px 0px 4px rgba(255, 255, 255, 0.5));
}


/* Cube Loading Animation*/

.scene {
  position: relative;
  z-index: 2;
  height: 440px;
  width: inherit;
  display: grid;
  place-items: center;
}

.cube-wrapper {
  transform-style: preserve-3d;
  animation: bouncing 2.5s infinite;
}

.cube {
  transform-style: preserve-3d;
  transform: rotateX(45deg) rotateZ(45deg);
  animation: rotation 2.5s infinite;
}

.cube-faces {
  transform-style: preserve-3d;
  height: 160px;
  width: 160px;
  position: relative;
  transform-origin: 0 0;
  transform: translateX(0) translateY(0) translateZ(-80px);
}

/* Colors for light theme */
.cube-face {
  position: absolute;
  inset: 0;
  background: rgb(193, 184, 255);
  border: solid 1px rgb(255, 255, 255);
}

.cube-face.shadow {
  transform: translateZ(-160px);
  animation: bouncing-shadow 2.5s infinite;
}
.cube-face.top {
  transform: translateZ(160px) rotate(90deg);
}
.cube-face.front {
  transform-origin: 0 50%;
  transform: rotateY(-90deg) rotateZ(90deg) translateX(-80px) translateY(-80px);
}
.cube-face.back {
  transform-origin: 0 50%;
  transform: rotateY(-90deg) translateZ(-160px) rotateZ(-90deg) rotateX(180deg) translateX(-80px) translateY(-80px);
}
.cube-face.right {
  transform-origin: 50% 0;
  transform: rotateX(-90deg) translateY(-160px) rotateY(180deg);
}
.cube-face.left {
  transform-origin: 50% 0;
  transform: rotateX(-90deg) translateY(-160px) translateZ(160px);
}

@keyframes rotation {
  0% {
    transform: rotateX(45deg) rotateY(0) rotateZ(45deg);
    animation-timing-function: cubic-bezier(0.17, 0.84, 0.44, 1);
  }
  50% {
    transform: rotateX(45deg) rotateY(0) rotateZ(225deg);
    animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
  }
  100% {
    transform: rotateX(45deg) rotateY(0) rotateZ(405deg);
    animation-timing-function: cubic-bezier(0.17, 0.84, 0.44, 1);
  }
}
@keyframes bouncing {
  0% {
    transform: translateY(-80px);
    animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
  }
  45% {
    transform: translateY(80px);
    animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
  }
  100% {
    transform: translateY(-80px);
    animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
  }
}
@keyframes bouncing-shadow {
  0% {
    transform: translateZ(-160px) scale(1.3);
    animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
    opacity: 0.05;
  }
  45% {
    transform: translateZ(0);
    animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
    opacity: 0.3;
  }
  100% {
    transform: translateZ(-160px) scale(1.3);
    animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
    opacity: 0.05;
  }
}


/* Progress Bar Styling */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: inherit;
  width: inherit;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px;
}

.progress-bar__container {
  width: 100%;
  height: 2rem;
  border-radius: 0.1rem;
  position: relative;
  overflow: hidden;
  will-change: transform;
  color: #ffffff;
  text-shadow: 0.5px 0.5px 1.5px rgb(16 23 38);
}

.progress-bar {
  position: absolute;
  height: 100%;
  top:0;
  bottom: 0;
  border-radius: inherit;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: sans-serif;
  transition: width 0.5s ease;
}

.progress-bar-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

</style>
