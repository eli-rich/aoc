package day8

import (
	_ "embed"
	"strconv"
	"strings"

	"github.com/eli-rich/aocutils"
)

//go:embed input.txt
var input string

func Execute() (int, int) {
	lines := strings.Split(strings.TrimSpace(input), "\n")
	trees := aocutils.ArrayMap(lines, func(line string) []int {
		return aocutils.ArrayMap(strings.Split(line, ""), func(c string) int {
			val, _ := strconv.Atoi(c)
			return val
		})
	})

	visible := countVisible(trees)
	scenic := countScenic(trees)

	return visible, scenic
}

func countVisible(trees [][]int) int {
	visible := 0
	for i := 0; i < len(trees); i++ {
		for j := 0; j < len(trees[i]); j++ {
			if checkVisible(trees, i, j) {
				visible++
			}
		}
	}
	return visible
}

func checkVisible(trees [][]int, i, j int) bool {
	notLeft := false
	notRight := false
	notUp := false
	notDown := false
	if i == 0 || i == len(trees)-1 || j == 0 || j == len(trees[i])-1 {
		return true
	}
	// check left
	for k := 0; k < j; k++ {
		if trees[i][k] >= trees[i][j] {
			notLeft = true
			break
		}
	}
	// check right
	for k := j + 1; k < len(trees[i]); k++ {
		if trees[i][k] >= trees[i][j] {
			notRight = true
			break
		}
	}
	// check up
	for k := 0; k < i; k++ {
		if trees[k][j] >= trees[i][j] {
			notUp = true
			break
		}
	}
	// check down
	for k := i + 1; k < len(trees); k++ {
		if trees[k][j] >= trees[i][j] {
			notDown = true
			break
		}
	}
	return !(notLeft && notRight && notUp && notDown)
}

func countScenic(trees [][]int) int {
	maxScenic := 0
	for i := 0; i < len(trees); i++ {
		for j := 0; j < len(trees[i]); j++ {
			scenic := checkScenic(trees, i, j)
			if scenic > maxScenic {
				maxScenic = scenic
			}
		}
	}
	return maxScenic
}

func checkScenic(trees [][]int, i, j int) int {
	left := 0
	right := 0
	up := 0
	down := 0

	// check left
	for k := j - 1; k >= 0; k-- {
		if trees[i][k] >= trees[i][j] {
			left++
			break
		}
		left++
	}
	// check right
	for k := j + 1; k < len(trees[i]); k++ {
		if trees[i][k] >= trees[i][j] {
			right++
			break
		}
		right++
	}
	// check up
	for k := i - 1; k >= 0; k-- {
		if trees[k][j] >= trees[i][j] {
			up++
			break
		}
		up++
	}
	// check down
	for k := i + 1; k < len(trees); k++ {
		if trees[k][j] >= trees[i][j] {
			down++
			break
		}
		down++
	}
	return left * right * up * down
}
