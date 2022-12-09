package day9

import (
	_ "embed"
	"fmt"
	"strconv"
	"strings"

	"github.com/eli-rich/aocutils"
)

//go:embed input.txt
var input string

type Pos struct {
	x int
	y int
}

func (p Pos) String() string {
	return fmt.Sprintf("%d,%d", p.x, p.y)
}

func Execute() (int, int) {
	lines := strings.Split(strings.TrimSpace(input), "\n")

	p1 := Part1(lines)
	p2 := Part2(lines)
	return p1, p2
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

func updateNode(node, next Pos) (Pos, Pos) {
	if !isTouching(node, next) {
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
	return node, next
}

func moveOne(dir string, dist int, head, tail Pos, uniques map[Pos]bool) (Pos, Pos) {
	for i := 0; i < dist; i++ {
		switch dir {
		case "U":
			head.y++
		case "D":
			head.y--
		case "L":
			head.x--
		case "R":
			head.x++
		}
		if !isTouching(head, tail) {
			if head.x > tail.x {
				tail.x++
			}
			if head.x < tail.x {
				tail.x--
			}
			if head.y > tail.y {
				tail.y++
			}
			if head.y < tail.y {
				tail.y--
			}
		}
		uniques[tail] = true
	}
	return head, tail
}

func Part1(lines []string) int {
	head := Pos{0, 0}
	tail := Pos{0, 0}
	uniquePositions := make(map[Pos]bool)
	for _, line := range lines {
		split := strings.Split(line, " ")
		dir := split[0]
		dist, _ := strconv.Atoi(split[1])
		head, tail = moveOne(dir, dist, head, tail, uniquePositions)
	}
	return len(uniquePositions)
}

func Part2(lines []string) int {
	nodes := make([]Pos, 10)
	uniquePositions := make(map[string]bool)
	for _, line := range lines {
		split := strings.Split(line, " ")
		dir := split[0]
		dist, _ := strconv.Atoi(split[1])
		for i := 0; i < dist; i++ {
			switch dir {
			case "U":
				nodes[0].y++
			case "D":
				nodes[0].y--
			case "L":
				nodes[0].x--
			case "R":
				nodes[0].x++
			}
			for j := 0; j < len(nodes)-1; j++ {
				nodes[j+1], nodes[j] = updateNode(nodes[j+1], nodes[j])
			}
			uniquePositions[nodes[len(nodes)-1].String()] = true
		}
	}
	return len(uniquePositions)
}
