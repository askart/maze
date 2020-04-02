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
      height: 180,
      width: 360,
      delay: 10,
      maze: [],
    }
  },
  created() {
    this.initMaze()
    this.maze = cloneDeep(this.maze)
    let [steps, grid] = this.makePath("breadth")
    this.drawMaze("normal", steps, grid)
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
    makePath(type) {
      if (type == "breadth") {
        return this.makePathBreadth()
      } else if (type == "depth") {
        let grid = makeGrid(this.height, this.width, 0)
        return this.makePathDepth(0, 0, grid, [{x: 0, y: 0, val: 0}])
      }
    },
    makePathBreadth() {
      let grid = makeGrid(this.height, this.width, 0)
      let stack = [], n = 0, steps = []
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
            steps.push({x: cx, y: cy, val: grid[cy][cx]})
            grid[ny][nx] |= VALUE[OPPOSITE[dir]]
            stack.push({cx: nx, cy: ny})
            n++
            steps.push({x: nx, y: ny, val: grid[ny][nx]})
          }
        })
        steps.push({x: cx, y: cy, val: grid[cy][cx]})
      }
      return [steps, grid]
    },
    makePathDepth(cx, cy, grid, steps) {
      let directions = getDirections()
      directions.forEach(dir => {
        let nx = cx + DX[dir], ny = cy + DY[dir]
        if ((ny >= 0 && ny < this.height) && (nx >= 0 && nx < this.width) && grid[ny][nx] == 0) {
          grid[cy][cx] |= VALUE[dir]
          grid[ny][nx] |= VALUE[OPPOSITE[dir]]
          steps.push({x: cx, y: cy, val: grid[cy][cx]})
          steps.push({x: nx, y: ny, val: grid[ny][nx]})
          this.makePathDepth(nx, ny, grid, steps)
          steps.push({x: nx, y: ny, val: grid[ny][nx]})
          steps.push({x: cx, y: cy, val: grid[cy][cx]})
        }
      })
      return [steps, grid]
    },
    drawMaze(type, steps, grid) {
      if (type == "delay") {
        this.drawMazeWithDelay(0, steps)
      } else if (type == "normal") {
        this.drawMazeNormal(grid)
      }
    },
    drawMazeWithDelay(index, steps) {
      if (index < steps.length) {
        let {x, y} = steps[index]
        this.maze[y][x].push("grid__cell--current")
        setTimeout(() => {
          let mIndex = this.maze[y][x].findIndex(cellClass => cellClass == "grid__cell--current")
          if (mIndex != -1) this.maze[y][x].splice(mIndex, 1)
          this.decorateCell(steps[index])
          this.drawMaze(index + 1, steps)
        }, this.delay)
      }
    },
    drawMazeNormal(grid) {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          this.decorateCell({x, y, val: grid[y][x]})
        }
      }
    },
    decorateCell({x, y, val}) {
      if ((val & VALUE["S"]) == 0) {
        this.maze[y][x].push("grid__cell--border-bottom")
      } else {
        let index = this.maze[y][x].findIndex(cellClass => cellClass == "grid__cell--border-bottom")
        if (index != -1) this.maze[y][x].splice(index, 1)
      }
      if ((val & VALUE["E"]) == 0) {
        this.maze[y][x].push("grid__cell--border-right")
      } else {
        let index = this.maze[y][x].findIndex(cellClass => cellClass == "grid__cell--border-right")
        if (index != -1) this.maze[y][x].splice(index, 1)
      }
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

.grid
  flex 0 1 auto
  background-color lightgray
  &__row
    display flex
  &__cell
    display inline-block
    height 5px
    width 5px
    box-sizing border-box
    border-color red
    border-width 0px
    transition 1s all
    &--current
      background-color rgba(255, 0, 0, 1)
    &--border-top
      border-top 1px solid black
      transition 5s border-top
    &--border-right
      border-right 1px solid black
      transition 5s border-right
    &--border-bottom
      border-bottom 1px solid black
      transition 5s border-bottom
    &--border-left
      border-left 1px solid black
      transition 5s border-left
  &:not(:first-child)
    margin-left 10px
</style>
