<template>
  <div class="container">
    <div class="grid">
      <div v-for="(row, y) in maze" :key="y" class="grid__row">
        <div v-for="(cell, x) in row" :key="x" class="grid__cell" :class="cell"/>
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

var cloneDeep = require("lodash.clonedeep")


export default {
  data() {
    return {
      height: 25,
      width: 25,
      delay: 10,
      maze: [],
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
    this.initMaze()
    this.buildMaze()
  },
  methods: {
    initMaze() {
      this.maze = makeGrid(this.height, this.width, 0)
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          this.maze[y][x] = []
          if (x == 0) {
            this.maze[y][x].push("grid__cell--border-left")
          }
          if (y == 0) {
            this.maze[y][x].push("grid__cell--border-top")
          }
        }
      }
    },
    buildMaze() {
      this.mazeBuildStatus = "started"
      this.maze = cloneDeep(this.maze)
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
      this.drawMazeWithDelay(grid)
    },
    drawMazeWithDelay(grid) {
      let maze = cloneDeep(this.maze)
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          this.decorateCell(maze, {x, y, val: grid[y][x]})
        }
      }
      this.maze = maze
      this.$nextTick(() => {
        this.mazeBuildStatus = "finished"
      })
    },
    decorateCell(maze, {x, y, val}) {
      let cellClone = cloneDeep(maze[y][x])

      let index = maze[y][x].findIndex(cellClass => cellClass == "grid__cell--border-bottom")
      if (index != -1) maze[y][x].splice(index, 1)
      index = maze[y][x].findIndex(cellClass => cellClass == "grid__cell--border-right")
      if (index != -1) maze[y][x].splice(index, 1)
      index = maze[y][x].findIndex(cellClass => cellClass == "grid__cell--border-right-to-bottom")
      if (index != -1) maze[y][x].splice(index, 1)
      index = maze[y][x].findIndex(cellClass => cellClass == "grid__cell--border-bottom-to-right")
      if (index != -1) maze[y][x].splice(index, 1)

      if ((val & VALUE["S"]) == 0) {
        maze[y][x].push("grid__cell--border-bottom")
      } else {
        let index = maze[y][x].findIndex(cellClass => cellClass == "grid__cell--border-bottom")
        if (index != -1) maze[y][x].splice(index, 1)
      }
      if ((val & VALUE["E"]) == 0) {
        maze[y][x].push("grid__cell--border-right")
      } else {
        let index = maze[y][x].findIndex(cellClass => cellClass == "grid__cell--border-right")
        if (index != -1) maze[y][x].splice(index, 1)
      }
      let cond1 =
        this.hasClass(cellClone, "grid__cell--border-right")
        && !this.hasClass(cellClone, "grid__cell--border-bottom")
        && this.hasClass(maze[y][x], "grid__cell--border-bottom")
        && !this.hasClass(maze[y][x], "grid__cell--border-right")
      let cond2 =
        this.hasClass(cellClone, "grid__cell--border-bottom")
        && !this.hasClass(cellClone, "grid__cell--border-right")
        && this.hasClass(maze[y][x], "grid__cell--border-right")
        && !this.hasClass(maze[y][x], "grid__cell--border-bottom")
      if (cond1) {
        maze[y][x].push("grid__cell--border-right-to-bottom")
      } else if (cond2) {
        maze[y][x].push("grid__cell--border-bottom-to-right")
      }
    },
    hasClass(arr, className) {
      return arr.findIndex(cellClass => cellClass == className) != -1
    }
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

.grid
  flex 0 1 auto
  background-color lightgray
  &__row
    display flex
  &__cell
    display inline-block
    position relative
    height 30px
    width 30px
    box-sizing border-box
    border 1px solid transparent
    &:before
      content: ""
      position absolute
      left calc((30px - 1px) / 2 - 2px / 2)
      top calc((30px - 1px) / 2 - 2px / 2)
      width 2px
      height 2px
      background-color white
      box-sizing border-box
    &--border-top
      border-top-color black
      transition .5s border ease-out
      box-sizing border-box
    &--border-right
      border-right-color black
      transition .5s border ease-out
      box-sizing border-box
    &--border-right&--border-bottom-to-right
      border-right-color transparent
    &--border-bottom
      border-bottom-color black
      transition .5s border ease-out
      box-sizing border-box
    &--border-bottom&--border-right-to-bottom
      border-bottom-color transparent
    &--border-left
      border-left-color black
      transition .5s border ease-out
      box-sizing border-box
    &--border-right-to-bottom:after
      content ''
      position absolute
      height 100%
      width 100%
      border 1px solid transparent
      border-right 1px solid red
      box-sizing border-box
      transform-origin 100% 100%
      transform rotate(-90deg)
      transition .5s transform ease-out
    &--border-bottom-to-right:after
      content ''
      position absolute
      height 100%
      width 100%
      border 1px solid transparent
      border-bottom 1px solid red
      box-sizing border-box
      transform-origin 100% 100%
      transform rotate(90deg)
      transition .5s transform ease-out

  &:not(:first-child)
    margin-left 10px
</style>
