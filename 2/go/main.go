package main

import (
	_ "embed"
	"fmt"
	"strings"
)

//go:embed input.txt
var input string

func main() {
	fmt.Printf("Part 1: %d\n", part1())
	fmt.Printf("Part 2: %d\n", part2())
}

const (
	elfRock     = "A"
	elfPaper    = "B"
	elfScissors = "C"
)

const (
	meRock     = "X"
	mePaper    = "Y"
	meScissors = "Z"
)

func elfWin(elf, me string) bool {
	if elf == elfRock && me == meScissors {
		return true
	}
	if elf == elfPaper && me == meRock {
		return true
	}
	if elf == elfScissors && me == mePaper {
		return true
	}
	return false
}

func elfLose(elf, me string) bool {
	if elf == elfRock && me == mePaper {
		return true
	}
	if elf == elfPaper && me == meScissors {
		return true
	}
	if elf == elfScissors && me == meRock {
		return true
	}
	return false
}

func myScore(me string) int {
	if me == meRock {
		return 1
	}
	if me == mePaper {
		return 2
	}
	if me == meScissors {
		return 3
	}
	return -1
}

func part1() int {
	lines := strings.Split(string(input), "\n")
	score := 0
	for _, line := range lines {
		elf, me := strings.Split(line, " ")[0], strings.Split(line, " ")[1]
		if elfWin(elf, me) {
			score += myScore(me)
		} else if elfLose(elf, me) {
			score += 6 + myScore(me)
		} else {
			score += 3 + myScore(me)
		}
	}
	return score
}

const (
	shouldLose = "X"
	shouldDraw = "Y"
	shouldWin  = "Z"
)

func getMatch(elf, me string, win int) string {
	if elf == elfRock {
		if win == 1 {
			return mePaper
		} else if win == 0 {
			return meScissors
		}
		return meRock
	}
	if elf == elfPaper {
		if win == 1 {
			return meScissors
		} else if win == 0 {
			return meRock
		}
		return mePaper
	}
	if elf == elfScissors {
		if win == 1 {
			return meRock
		} else if win == 0 {
			return mePaper
		}
		return meScissors
	}
	return ""
}

func part2() int {
	lines := strings.Split(string(input), "\n")
	score := 0
	for _, line := range lines {
		elf, me := strings.Split(line, " ")[0], strings.Split(line, " ")[1]
		if me == shouldWin {
			score += 6 + myScore(getMatch(elf, me, 1))
		} else if me == shouldLose {
			score += myScore(getMatch(elf, me, 0))
		} else {
			score += 3 + myScore(getMatch(elf, me, -1))
		}
	}
	return score
}
