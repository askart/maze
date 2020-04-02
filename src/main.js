import Vue from "vue"
import App from "@/App.vue"
// reset styles
import "normalize.css"

new Vue({
  el: "#app",
  render: h => h(App),
})

if (module.hot) {
  module.hot.accept()
}
