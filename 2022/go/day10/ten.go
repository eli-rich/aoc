package day10

import (
	_ "embed"
	"strconv"
	"strings"
)

//go:embed input.txt
var input string

type Instruction struct {
	op    string
	value int
}

type QueueItem struct {
	instruction Instruction
	remaining   int
}

func Execute() (int, string) {
	lines := strings.Split(strings.TrimSpace(input), "\n")
	instructions := make([]Instruction, len(lines))
	for i, line := range lines {
		split := strings.Split(line, " ")
		op := split[0]
		value := 0
		if len(split) > 1 {
			value, _ = strconv.Atoi(split[1])
		}
		instructions[i] = Instruction{op, value}
	}
	values := getCycleVals(instructions)
	p1 := part1(values)
	p2 := part2(instructions)
	return p1, strings.TrimSpace(p2)
}

func exec(instruction Instruction, register int) int {
	switch instruction.op {
	case "noop":
		// do nothing
	case "addx":
		register += instruction.value
	}
	return register
}

func getCycleVals(instructions []Instruction) map[int]int {
	register := 1
	cycle := 1
	values := make(map[int]int)

	queue := make([]QueueItem, len(instructions))

	for i, instruction := range instructions {
		switch instruction.op {
		case "noop":
			queue[i] = QueueItem{instruction, 1}
		case "addx":
			queue[i] = QueueItem{instruction, 2}
		}
	}

	for len(queue) > 0 {
		// shift queue
		next := queue[0]
		queue = queue[1:]
		for next.remaining > 0 {
			values[cycle] = register
			cycle++
			next.remaining--
		}
		register = exec(next.instruction, register)
	}
	return values
}

func shouldDraw(cycle, register int) bool {
	surrounding := []int{register - 1, register, register + 1}
	for _, val := range surrounding {
		if cycle%40 == val {
			return true
		}
	}
	return false
}

func part1(values map[int]int) int {
	sum := 0
	sum += values[20] * 20
	sum += values[60] * 60
	sum += values[100] * 100
	sum += values[140] * 140
	sum += values[180] * 180
	sum += values[220] * 220
	return sum
}

func part2(instructions []Instruction) string {
	register := 1
	cycle := 0

	queue := make([]QueueItem, len(instructions))
	// load queue
	for i, instruction := range instructions {
		switch instruction.op {
		case "noop":
			queue[i] = QueueItem{instruction, 1}
		case "addx":
			queue[i] = QueueItem{instruction, 2}
		}
	}
	result := ""
	for len(queue) > 0 {
		// shift queue
		next := queue[0]
		queue = queue[1:]
		for next.remaining > 0 {
			if cycle%40 == 0 {
				result += "\n"
			}
			if shouldDraw(cycle, register) {
				result += "#"
			} else {
				result += " "
			}
			cycle++
			next.remaining--
		}
		register = exec(next.instruction, register)
	}

	return result
}
