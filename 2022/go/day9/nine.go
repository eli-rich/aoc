package day9

import (
	_ "embed"
	"os"

	"github.com/eli-rich/aocutils"
)

//go:embed test.txt
var input string

type Pos struct {
	x int
	y int
}

func Execute() (int, int) {
	Part1()
	os.Exit(0)
	return 0, 0
}

func isTouching(node, next Pos) bool {
	touches := []Pos{
		{node.x + 1, node.y},
		{node.x - 1, node.y},
		{node.x, node.y + 1},
		{node.x, node.y - 1},
		{node.x + 1, node.y + 1},
		{node.x - 1, node.y - 1},
		{node.x + 1, node.y - 1},
		{node.x - 1, node.y + 1},
	}
	findNext := aocutils.ArrayFindIndex(touches, func(pos Pos) bool {
		return pos == next
	})
	return findNext != -1
}

func updateNode(node, next Pos) {
	if isTouching(node, next) {
		// update node
		if next.x > node.x {
			node.x++
		}
		if next.x < node.x {
			node.x--
		}
		if next.y > node.y {
			node.y++
		}
		if next.y < node.y {
			node.y--
		}
	}
}

func Part1() int {
	return 0
}
