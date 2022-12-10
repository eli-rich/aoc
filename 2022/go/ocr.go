package main

import (
	"strings"

	"github.com/eli-rich/aocutils"
)

var charMap = map[string]string{
	".##.\n#..#\n#..#\n####\n#..#\n#..#": "A",
	"###.\n#..#\n###.\n#..#\n#..#\n###.": "B",
	".##.\n#..#\n#...\n#...\n#..#\n.##.": "C",
	"####\n#...\n###.\n#...\n#...\n####": "E",
	"####\n#...\n###.\n#...\n#...\n#...": "F",
	".##.\n#..#\n#...\n#.##\n#..#\n.###": "G",
	"#..#\n#..#\n####\n#..#\n#..#\n#..#": "H",
	".###\n..#.\n..#.\n..#.\n..#.\n.###": "I",
	"..##\n...#\n...#\n...#\n#..#\n.##.": "J",
	"#..#\n#.#.\n##..\n#.#.\n#.#.\n#..#": "K",
	"#...\n#...\n#...\n#...\n#...\n####": "L",
	".##.\n#..#\n#..#\n#..#\n#..#\n.##.": "O",
	"###.\n#..#\n#..#\n###.\n#...\n#...": "P",
	"###.\n#..#\n#..#\n###.\n#.#.\n#..#": "R",
	".###\n#...\n#...\n.##.\n...#\n###.": "S",
	"#..#\n#..#\n#..#\n#..#\n#..#\n.##.": "U",
	"#...\n#...\n.#.#\n..#.\n..#.\n..#.": "Y",
	"####\n...#\n..#.\n.#..\n#...\n####": "Z",
}

func read(input string) string {
	lines := strings.Split(strings.TrimSpace(input), "\n")
	blocks := make([]string, 6)
	for i := 0; i < len(lines); i += 6 {
		for j := 0; j < len(lines[i]); j += 5 {
			processed := aocutils.ArrayMap(lines[i:i+6], func(line string) string {
				return line[j : j+4]
			})
			blocks = append(blocks, strings.Join(processed, "\n"))
		}
	}
	blocks = aocutils.ArrayFilter(blocks, func(block string) bool {
		return block != ""
	})
	letters := aocutils.ArrayMap(blocks, func(block string) string {
		return charMap[block]
	})
	return strings.Join(letters, "")
}
