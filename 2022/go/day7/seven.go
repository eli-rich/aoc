package day7

import (
	_ "embed"
	"strconv"
	"strings"

	"github.com/eli-rich/aocutils"
)

//go:embed input.txt
var input string

type Command = []string
type Path = string
type Listing = []string
type Size = int

const (
	MAX_FS_SIZE = 70000000
	NEED_UNUSED = 30000000
)

func Execute() (int, int) {
	// parse input
	commands := parseInput(input)
	files := executeShellCommand(commands)
	sizes := make(map[Path]Size)
	for path := range files {
		sizes[path] = sumDir(files, path)
	}
	sizeArray := aocutils.MapValues(sizes)
	sizeArray = aocutils.ArrayFilter(sizeArray, func(size Size) bool {
		return size <= 100000
	})
	result1 := aocutils.ArrayReduce(sizeArray, func(sum Size, size Size) Size {
		return sum + size
	}, 0)

	diff := MAX_FS_SIZE - sizes["/"]
	needed := NEED_UNUSED - diff

	// get dir with smallest size that is over "needed"
	result2 := 0
	smallest := MAX_FS_SIZE
	for path, size := range sizes {
		if size < smallest && size > needed {
			smallest = size
			result2 = sizes[path]
		}
	}
	return result1, result2
}

func sumDir(files map[Path]Listing, currentDir string) Size {
	sum := 0
	filesInCurrentDir := files[currentDir]
	for _, file := range filesInCurrentDir {
		if file[:3] == "dir" {
			subDir := strings.Split(file, " ")[1]
			switch currentDir {
			case "/":
				subDir = "/" + subDir
			default:
				subDir = currentDir + "/" + subDir
			}
			sum += sumDir(files, subDir)
		} else {
			size, _ := strconv.Atoi(strings.Split(file, " ")[0])
			sum += size
		}
	}
	return sum
}

func executeShellCommand(commands []Command) map[Path]Listing {
	files := make(map[Path]Listing)
	currentDir := ""
	for _, command := range commands {
		if command[0][:2] == "cd" {
			path := strings.Split(command[0], " ")[1]
			if path == ".." {
				pathArr := strings.Split(currentDir, "/")
				currentDir = strings.Join(pathArr[:len(pathArr)-1], "/")
			} else {
				currentDir += "/" + path
			}
		}
		if command[0][:2] == "ls" {
			files[currentDir] = command[1:]
		}
	}
	files["/"] = files[""]
	delete(files, "")
	return files
}

func parseInput(str string) []Command {
	str = strings.TrimSpace(str)
	lines := strings.Split(str, "$")
	lines = aocutils.ArrayFilter(lines, func(line string) bool {
		return len(line) > 0
	})
	splitLines := aocutils.ArrayMap(lines, func(line string) []string {
		line = strings.TrimSpace(line)
		return strings.Split(line, "\n")
	})
	return splitLines[1:]
}
