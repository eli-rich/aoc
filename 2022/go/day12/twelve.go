package day12

import (
	_ "embed"
	"strings"

	"github.com/eli-rich/aocutils"
)

//go:embed input.txt
var input string

type Node struct {
	x     int
	y     int
	steps int
}

type Pos struct {
	x int
	y int
}

type Grid = [][]int

const ALPHABET string = "abcdefghijklmnopqrstuvwxyzE"

func Execute() (int, int) {
	lines := strings.Split(strings.TrimSpace(input), "\n")
	grid := aocutils.ArrayMap(lines, func(line string) []int {
		splitLine := strings.Split(line, "")
		return aocutils.ArrayMap(splitLine, func(c string) int {
			return strings.Index(ALPHABET, c)
		})
	})
	// find start position (item in grid with value -1) (S)
	// and end position (item in grid with value 26) (E)
	var start Pos
	var end Pos
	for i, row := range grid {
		for j, item := range row {
			if item == -1 {
				start = Pos{x: i, y: j}
			} else if item == 26 {
				end = Pos{x: i, y: j}
			}
		}
	}
	target := 0
	p1 := part1(grid, start, end)
	p2 := part2(grid, end, target)
	return p1, p2
}

func getNeighbors(grid Grid, x, y int) []Pos {
	var neighbors []Pos
	if x > 0 {
		neighbors = append(neighbors, Pos{x: x - 1, y: y})
	}
	if x < len(grid)-1 {
		neighbors = append(neighbors, Pos{x: x + 1, y: y})
	}
	if y > 0 {
		neighbors = append(neighbors, Pos{x: x, y: y - 1})
	}
	if y < len(grid[0])-1 {
		neighbors = append(neighbors, Pos{x: x, y: y + 1})
	}
	return neighbors
}

func canVisit(grid Grid, from, to Pos, reverse bool) bool {
	fromValue := grid[from.x][from.y]
	toValue := grid[to.x][to.y]
	if reverse {
		return fromValue-toValue < 2
	} else {
		return toValue-fromValue < 2
	}
}

func part1(grid Grid, start, target Pos) int {
	// climb the hill
	var queue []Node = []Node{{x: start.x, y: start.y, steps: 0}}
	visited := make(map[Pos]bool)
	for len(queue) > 0 {
		node := queue[0]
		queue = queue[1:]
		if node.x == target.x && node.y == target.y {
			return node.steps
		}
		if visited[Pos{x: node.x, y: node.y}] {
			continue
		}
		visited[Pos{x: node.x, y: node.y}] = true
		for _, neighbor := range getNeighbors(grid, node.x, node.y) {
			if !visited[neighbor] && canVisit(grid, Pos{x: node.x, y: node.y}, neighbor, false) {
				queue = append(queue, Node{x: neighbor.x, y: neighbor.y, steps: node.steps + 1})
			}
		}
	}
	return -1
}

func part2(grid Grid, start Pos, target int) int {
	// climb the hill
	var queue []Node = []Node{{x: start.x, y: start.y, steps: 0}}
	visited := make(map[Pos]bool)
	for len(queue) > 0 {
		node := queue[0]
		queue = queue[1:]
		if grid[node.x][node.y] == target {
			return node.steps
		}
		if visited[Pos{x: node.x, y: node.y}] {
			continue
		}
		visited[Pos{x: node.x, y: node.y}] = true
		for _, neighbor := range getNeighbors(grid, node.x, node.y) {
			if !visited[neighbor] && canVisit(grid, Pos{x: node.x, y: node.y}, neighbor, true) {
				queue = append(queue, Node{x: neighbor.x, y: neighbor.y, steps: node.steps + 1})
			}
		}
	}
	return -1
}
