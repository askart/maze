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
      <div :class="['grid__border--top', {'grid__border--top--animated': gridAnimation}]"/>
      <div :class="['grid__border--right', {'grid__border--right--animated': gridAnimation}]"/>
      <div :class="['grid__border--bottom', {'grid__border--bottom--animated': gridAnimation}]"/>
      <div :class="['grid__border--left', {'grid__border--left--animated': gridAnimation}]"/>
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

export default {
  data() {
    return {
      height: 10,
      width: 15,
      jointMatrix: [],
      gridAnimation: false,
    }
  },
  created() {
    this.initMaze()
  },
  methods: {
    initMaze() {
      let jointMatrix = []
      for (let y = 1; y < this.height; y++) {
        jointMatrix[y - 1] = []
        for (let x = 1; x < this.width; x++) {
          jointMatrix[y - 1][x - 1] = {W: false, N: false, E: false, S: false}
        }
      }
      this.jointMatrix = jointMatrix
      setTimeout(() => {
        this.buildMaze()
        this.gridAnimation = true
      }, 1000)
    },
    buildMaze() {
      let grid = this.makePath()
      this.drawMaze(grid)
      setTimeout(() => {
        this.buildMaze()
      }, 5000)
    },
    makePath() {
      let grid = makeGrid(this.height, this.width, 0)
      return this.makePathDepth(0, 0, grid)
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
      return grid
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

$vertical-cells-count = 10
$horizontal-cells-count = 15
$thickness = 2px
$length = 50px - $thickness
$offset = $thickness
$top-bottom-border-length = ($length * ($horizontal-cells-count - 1)) + ($thickness * ($horizontal-cells-count - 1))
$left-right-border-length = ($length * $vertical-cells-count) + ($thickness * ($vertical-cells-count - 1))
$gray-dark = darken(lightgray, 50%)

.grid
  flex 0 1 auto
  position relative
  background-color white
  &__border
    &--top
      position absolute
      top 0
      right 0
      height $thickness
      width $thickness
      background-color $gray-dark
      transition .5s all ease-in-out
      &--animated
        width $top-bottom-border-length
    &--right
      position absolute
      top 0
      right 0
      height $thickness
      width $thickness
      background-color $gray-dark
      transition .5s all ease-in-out
      &--animated
        height $left-right-border-length
    &--bottom
      position absolute
      bottom 0
      left 0
      height $thickness
      width $thickness
      background-color $gray-dark
      transition .5s all ease-in-out
      &--animated
        width $top-bottom-border-length
    &--left
      position absolute
      bottom 0
      left 0
      height $thickness
      width $thickness
      background-color $gray-dark
      transition .5s all ease-in-out
      &--animated
        height $left-right-border-length
  &__row
    display flex
  &__joint
    display inline-block
    position relative
    height $thickness
    width $thickness
    background-color $gray-dark
    margin 0 $length $length 0
    &:first-child
      margin-left $length
    ^[0]__row:first-child > &
      margin-top $length
    &__line--top
      position absolute
      top 0
      left $offset
      height $length
      width $thickness
      background-color $gray-dark
      transform-origin 0px 0px
      transform rotate(180deg)
      transition .5s all ease-in-out
      &.hidden
        height 0px
    &__line--right
      position absolute
      top 0
      left $offset
      height $thickness
      width $length
      background-color $gray-dark
      transition .5s all ease-in-out
      &.hidden
        width 0px
    &__line--bottom
      position absolute
      top $offset
      left 0
      height $length
      width $thickness
      background-color $gray-dark
      transition .5s all ease-in-out
      &.hidden
        height 0px
    &__line--left
      position absolute
      top $offset
      left 0
      height $thickness
      width $length
      background-color $gray-dark
      transform-origin 0 0
      transform rotate(180deg)
      transition .5s all ease-in-out
      &.hidden
        width 0px
</style>
