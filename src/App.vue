<template>
  <div class="container">
    <div class="grid">
      <div v-for="(row, y) in jointMatrix" :key="y" class="grid__row">
        <div v-for="(joint, x) in row" :key="x" class="grid__joint">
          <div :class="['grid__joint__line--top', {'hidden': !joint.N}]"/>
          <div :class="['grid__joint__line--right', {'hidden': !joint.E}]"/>
          <div :class="['grid__joint__line--bottom', {'hidden': !joint.S}]"/>
          <div :class="['grid__joint__line--left', {'hidden': !joint.W}]"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  makeGrid,
  getDirections,
  VALUE,
  DX, DY,
  OPPOSITE} from "@/utils"

// var cloneDeep = require("lodash.clonedeep")


export default {
  data() {
    return {
      height: 25,
      width: 45,
      delay: 10,
      jointMatrix: [],
      mazeBuildStatus: "",
    }
  },
  watch: {
    mazeBuildStatus: {
      handler: function (val) {
        if (val == "finished") {
          setTimeout(() => {
            this.buildMaze()
          }, 2000)
        }
      },
    },
  },
  created() {
    this.buildMaze()
  },
  methods: {
    buildMaze() {
      this.mazeBuildStatus = "started"
      let [grid] = this.makePath("depth")
      this.drawMaze(grid)
    },
    makePath(type) {
      if (type == "breadth") {
        return this.makePathBreadth()
      } else if (type == "depth") {
        let grid = makeGrid(this.height, this.width, 0)
        return this.makePathDepth(0, 0, grid)
      }
    },
    makePathBreadth() {
      let grid = makeGrid(this.height, this.width, 0)
      let stack = [], n = 0
      stack.push({cx: 0, cy: 0})
      n++
      while (n > 0) {
        let {cx, cy} = stack.pop()
        n--
        let directions = getDirections()
        directions.forEach(dir => {
          let nx = cx + DX[dir], ny = cy + DY[dir]
          if ((ny >= 0 && ny < this.height) && (nx >= 0 && nx < this.width) && grid[ny][nx] == 0) {
            grid[cy][cx] |= VALUE[dir]
            stack.push({cx, cy})
            n++
            grid[ny][nx] |= VALUE[OPPOSITE[dir]]
            stack.push({cx: nx, cy: ny})
            n++
          }
        })
      }
      return [grid]
    },
    makePathDepth(cx, cy, grid) {
      let directions = getDirections()
      directions.forEach(dir => {
        let nx = cx + DX[dir], ny = cy + DY[dir]
        if ((ny >= 0 && ny < this.height) && (nx >= 0 && nx < this.width) && grid[ny][nx] == 0) {
          grid[cy][cx] |= VALUE[dir]
          grid[ny][nx] |= VALUE[OPPOSITE[dir]]
          this.makePathDepth(nx, ny, grid)
        }
      })
      return [grid]
    },
    drawMaze(grid) {
      let jointMatrix = []
      for (let y = 1; y < this.height; y++) {
        jointMatrix[y - 1] = []
        for (let x = 1; x < this.width; x++) {
          let joint = {}

          joint.W = (grid[y - 1][x - 1] & VALUE["S"]) == 0
          joint.N = (grid[y - 1][x - 1] & VALUE["E"]) == 0
          joint.E = (grid[y][x] & VALUE["N"]) == 0
          joint.S = (grid[y][x] & VALUE["W"]) == 0

          jointMatrix[y - 1][x - 1] = joint
        }
      }
      this.jointMatrix = jointMatrix
      this.$nextTick(() => {
        this.mazeBuildStatus = "finished"
      })
    },
  }
}
</script>

<style lang="stylus">
body, html
  height 100%
  width 100%
  font-size 12px

.container
  display flex
  height inherit
  width inherit
  justify-content center
  align-items center

$length = calc(30px - 1px)
$length-neg = calc(-30px + 1px)
$gray-dark = darken(lightgray, 50%)

.grid
  flex 0 1 auto
  position relative
  background-color lightgray
  box-sizing border-box
  border 1px solid $gray-dark
  &:before
    content ""
    position absolute
    top -1px
    left 0
    height 1px
    width $length
    background-color lightgray
  &:after
    content ""
    position absolute
    right 0
    bottom -1px
    height 1px
    width $length
    background-color lightgray
  &__row
    display flex
  &__joint
    display inline-block
    position relative
    height 1px
    width 1px
    background-color black
    margin 0 $length $length 0
    &:first-child
      margin-left $length
    ^[0]__row:first-child > &
      margin-top $length
    &__line--top
      position absolute
      top $length-neg
      left 0
      height $length
      width 1px
      background-color $gray-dark
      transition .5s all ease-out
      &.hidden
        background-color transparent
    &__line--left
      position absolute
      top 0
      left $length-neg
      height 1px
      width $length
      background-color $gray-dark
      transition .5s all ease-out
      &.hidden
        background-color transparent
    &__line--right
      position absolute
      top 0
      left 1px
      height 1px
      width $length
      background-color $gray-dark
      transition .5s all ease-out
      &.hidden
        background-color transparent
    // &--line-right:after&--line-bottom-to-right
    //   background-color transparent
    &__line--bottom
      position absolute
      top 1px
      left 0
      height $length
      width 1px
      background-color $gray-dark
      transition .5s all ease-out
      &.hidden
        background-color transparent
    // &--line-bottom:after&--line-right-to-bottom
    //   background-color transparent
    // &--line-right-to-bottom:after
    //   content ""
    //   position absolute
    //   bottom 0px
    //   right 0px
    //   height 30px
    //   width 1px
    //   background-color red
    //   transform-origin right bottom
    //   transform rotate(-90deg)
    //   transition .5s transform ease-out
    // &--line-bottom-to-right:after
    //   content ""
    //   position absolute
    //   bottom 0px
    //   right 0px
    //   height 1px
    //   width 30px
    //   background-color red
    //   transform-origin right bottom
    //   transform rotate(90deg)
    //   transition .5s transform ease-out
    // &:before
    //   content: ""
    //   position absolute
    //   left calc((30px - 1px) / 2 - 2px / 2)
    //   top calc((30px - 1px) / 2 - 2px / 2)
    //   width 2px
    //   height 2px
    //   background-color white

  &:not(:first-child)
    margin-left 10px
</style>
