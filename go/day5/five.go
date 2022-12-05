package day5

import (
	_ "embed"
	"fmt"
	"strings"

	"github.com/eli-rich/aocutils"
	"golang.org/x/exp/slices"
)

//go:embed input.txt
var input string

// Step represents a single step in the challenge
type Step struct {
	from     int
	to       int
	quantity int
}

// A stack is just an alias for a slice of strings
type Stack = []string

func Execute() (string, string) {
	lines := strings.Split(input, "\n")
	// Get the steps, stacks, and stackSize
	// Stacks, however, are initially in rows instead of columns
	steps, stacks, stackSize := parseStepStacks(lines)
	// Transpose stacks from rows to columns
	stacks = transposeStacks(stacks, stackSize)
	// Clone the stacks so we can do both parts
	stacks2 := slices.Clone(stacks)
	for _, step := range steps {
		stacks = doOne(stacks, step)
		stacks2 = do(stacks2, step)
	}
	part1 := getTop(stacks)
	part2 := getTop(stacks2)
	return part1, part2
}

func getTop(stacks []Stack) string {
	// Get the top crate from each stack
	output := ""
	for _, stack := range stacks {
		output += stack[0]
	}
	return output
}

func do(stacks []Stack, step Step) []Stack {
	to := step.to
	from := step.from
	quantity := step.quantity
	/*
		In bulk, move the top quantity crates from stacks[from] to stacks[to]
		We must clone the removed slice to avoid modifying the original
	*/
	removed := stacks[from][0:quantity]
	stacks[to] = append(slices.Clone(removed), stacks[to]...)
	stacks[from] = stacks[from][quantity:]

	return stacks
}

func doOne(stacks []Stack, step Step) []Stack {
	to := step.to
	from := step.from
	quantity := step.quantity
	/*
		One by one, move the top crate from stacks[from] to stacks[to]
		We do this by creating a new slice with the top crate removed from stacks[from]
		And then appending the rest of the crates from stacks[to] to the end of the new slice
	*/
	for i := 0; i < quantity; i++ {
		stacks[to] = append([]string{stacks[from][0]}, stacks[to]...)
		stacks[from] = stacks[from][1:]
	}
	return stacks
}

func transposeStacks(stacks []Stack, stackSize int) []Stack {
	// Transpose stack from rows to cols
	transposed := make([]Stack, stackSize+1)
	for _, stack := range stacks {
		for j, crate := range stack {
			if crate == "-" {
				/*
					Skip blank crates.
					Though they need to be here in order to get the correct column alignment.
				*/
				continue
			}
			transposed[j] = append(transposed[j], crate)
		}
	}
	transposed = aocutils.ArrayFilter(transposed, func(s Stack) bool {
		// Honestly, I don't understand why this is needed.
		// For the actual input, it gets the correct size without this.
		// But for the test input, it doesn't.
		return len(s) > 0
	})
	return transposed
}

func parseStepStacks(lines []string) ([]Step, []Stack, int) {
	// We don't want to start parsing steps until we have parsed the stacks.
	shouldParseSteps := false
	shouldParseStacks := true
	// Initialize variables
	var steps []Step
	var stacks []Stack
	var stackSize int
	for i, line := range lines {
		if line == "" {
			// We can start parsing steps.
			shouldParseSteps = true
			continue
		} else if !strings.Contains(line, "[") && shouldParseStacks {
			// There is no "[" in the line, so we are done parsing stacks.
			// Stacksize is the length of the lines
			shouldParseStacks = false
			stackSize = i
		}
		if shouldParseSteps {
			var from int
			var to int
			var quantity int
			fmt.Sscanf(line, "move %d from %d to %d", &quantity, &from, &to)
			steps = append(steps, Step{from - 1, to - 1, quantity})
		} else if shouldParseStacks {
			// THANK YOU @Lebster#0617
			// This was otherwise impossible for me to figure out
			crate := strings.ReplaceAll(line, "    ", "-") // Four spaces indicates blank
			crate = strings.ReplaceAll(crate, " ", "")     // Other spaces are separators
			crate = strings.ReplaceAll(crate, "[", "")     // Brackets are decorative
			crate = strings.ReplaceAll(crate, "]", "")
			// Result here will be -D- for example line 1
			stacks = append(stacks, strings.Split(crate, ""))
		}
	}
	return steps, stacks, stackSize
}
