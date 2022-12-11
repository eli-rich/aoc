package day11

import (
	_ "embed"
	"strconv"
	"strings"

	"github.com/eli-rich/aocutils"
	"golang.org/x/exp/slices"
)

//go:embed input.txt
var input string

const (
	Add = "add"
	Mul = "mul"
	Sqr = "sqr"
)

type Operation struct {
	operation string
	value     int
}

type Test struct {
	number int
	True   int
	False  int
}

type Monkey struct {
	id          int
	inspections int
	items       []int
	operation   Operation
	test        Test
}

func parseMonkey(chunk string, id int) Monkey {
	lines := strings.Split(chunk, "\n")
	var items []int
	potentialItems := strings.Split(lines[1], " ")
	for _, p := range potentialItems {
		n, err := strconv.Atoi(strings.Trim(p, ","))
		if err != nil {
			continue
		}
		items = append(items, int(n))
	}
	opValue := strings.Join(strings.Split(lines[2], " ")[5:8], " ")
	op := Operation{}
	if strings.Contains(opValue, "old * old") {
		op.operation = Sqr
	} else if strings.Contains(opValue, "+") {
		op.operation = Add
		val, _ := strconv.Atoi(strings.Split(opValue, " ")[2])
		op.value = int(val)
	} else if strings.Contains(opValue, "*") {
		op.operation = Mul
		val, _ := strconv.Atoi(strings.Split(opValue, " ")[2])
		op.value = int(val)
	}
	test := Test{}
	potentialDivisors := strings.Split(lines[3], " ")
	for _, p := range potentialDivisors {
		n, err := strconv.Atoi(strings.TrimSpace(p))
		if err != nil {
			continue
		}
		test.number = int(n)
		break
	}
	potentialTrue := strings.Split(lines[4], " ")
	for _, p := range potentialTrue {
		n, err := strconv.Atoi(strings.TrimSpace(p))
		if err != nil {
			continue
		}
		test.True = n
		break
	}
	potentialFalse := strings.Split(lines[5], " ")
	for _, p := range potentialFalse {
		n, err := strconv.Atoi(strings.TrimSpace(p))
		if err != nil {
			continue
		}
		test.False = n
		break
	}
	return Monkey{
		id:          id,
		operation:   op,
		test:        test,
		items:       items,
		inspections: 0,
	}
}

func Execute() (int, int) {
	chunks := strings.Split(input, "\n\n")
	monkeys := make([]Monkey, len(chunks))
	for i, chunk := range chunks {
		monkeys[i] = parseMonkey(chunk, i)
	}
	testCases := aocutils.ArrayMap(monkeys, func(monkey Monkey) int {
		return monkey.test.number
	})
	MOD := aocutils.ArrayReduce(testCases, func(product, n int) int {
		return product * n
	}, 1)

	clonedMonkeys := slices.Clone(monkeys)

	p1 := simulate(monkeys, 20, MOD, true)
	p2 := simulate(clonedMonkeys, 10_000, MOD, false)

	return p1, p2
}

func execExpr(op Operation, worry int) int {
	switch op.operation {
	case Add:
		return worry + op.value
	case Mul:
		return worry * op.value
	case Sqr:
		return worry * worry
	default:
		panic("AOC LIED TO ME")
	}
}

func calculateMonkeyBusiness(monkeys []Monkey) int {
	// get top two monkeys with most inspections
	var topMonkey Monkey
	var secondMonkey Monkey
	for _, monkey := range monkeys {
		if monkey.inspections > topMonkey.inspections {
			secondMonkey = topMonkey
			topMonkey = monkey
		} else if monkey.inspections > secondMonkey.inspections {
			secondMonkey = monkey
		}
	}
	// return the product of their inspections
	return topMonkey.inspections * secondMonkey.inspections
}

func simulate(monkeys []Monkey, rounds int, MOD int, part1 bool) int {
	for i := 0; i < rounds; i++ {
		for j := 0; j < len(monkeys); j++ {
			for len(monkeys[j].items) > 0 {
				worryLevel := execExpr(monkeys[j].operation, monkeys[j].items[0])
				if part1 {
					worryLevel = worryLevel / 3
				}
				var targetID int
				if worryLevel%monkeys[j].test.number == 0 {
					targetID = monkeys[j].test.True
				} else {
					targetID = monkeys[j].test.False
				}
				monkeys[targetID].items = append(monkeys[targetID].items, worryLevel%MOD)
				monkeys[j].items = monkeys[j].items[1:]
				monkeys[j].inspections++
			}
		}
	}
	return calculateMonkeyBusiness(monkeys)
}
