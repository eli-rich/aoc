package day14

import (
	_ "embed"
	"fmt"
	"math"
	"strconv"
	"strings"

	"github.com/eli-rich/aocutils"
)

//go:embed input.txt
var input string

type Point struct {
	x       int
	y       int
	sand    bool
	segment bool
}

type Line struct {
	start Point
	end   Point
}

type Grid = map[string]Point

func Execute() (int, int) {

	segments := parse(input)
	grid, segments, _, _, minY, _ := initalizeGrid(segments)
	drawSegments(grid, segments)
	p1, p2 := simulate(grid, minY)
	// draw(grid, minX, maxX, minY, maxY)
	return p1, p2
}

func parse(input string) []Line {
	lines := strings.Split(strings.TrimSpace(input), "\n")
	var segments []Line
	// 498,4 -> 498,6 -> 496,6
	for _, line := range lines {
		var segs []Line
		pairs := strings.Split(line, "->")
		for i := 0; i < len(pairs)-1; i++ {
			p1 := strings.Split(strings.TrimSpace(pairs[i]), ",")
			p2 := strings.Split(strings.TrimSpace(pairs[i+1]), ",")
			x1, _ := strconv.Atoi(p1[0])
			y1, _ := strconv.Atoi(p1[1])
			x2, _ := strconv.Atoi(p2[0])
			y2, _ := strconv.Atoi(p2[1])
			seg := Line{
				start: Point{x: x1, y: -y1, segment: true, sand: false},
				end:   Point{x: x2, y: -y2, segment: true, sand: false},
			}
			segs = append(segs, seg)
		}
		segments = append(segments, segs...)
	}
	return segments
}

func initalizeGrid(segments []Line) (Grid, []Line, int, int, int, int) {
	minX := aocutils.ArrayReduce(segments, func(min int, line Line) int {
		if line.start.x < min {
			min = line.start.x
		}
		if line.end.x < min {
			min = line.end.x
		}
		return min
	}, 100_000_000) - 154

	maxX := aocutils.ArrayReduce(segments, func(max int, line Line) int {
		if line.start.x > max {
			max = line.start.x
		}
		if line.end.x > max {
			max = line.end.x
		}
		return max
	}, -100_000_000) + 154

	minY := aocutils.ArrayReduce(segments, func(min int, line Line) int {
		if line.start.y < min {
			min = line.start.y
		}
		if line.end.y < min {
			min = line.end.y
		}
		return min
	}, 100_000_000) - 2

	maxY := aocutils.ArrayReduce(segments, func(max int, line Line) int {
		if line.start.y > max {
			max = line.start.y
		}
		if line.end.y > max {
			max = line.end.y
		}
		return max
	}, -100_000_000) + 2

	segments = append(segments, Line{
		start: Point{x: minX, y: minY, sand: false, segment: true},
		end:   Point{x: maxX, y: minY, sand: false, segment: true},
	})

	boundMinX := int(math.Min(float64(minX), 500))
	boundMaxX := int(math.Max(float64(maxX), 500))
	boundMinY := int(math.Min(float64(minY), 0))
	boundMaxY := int(math.Max(float64(maxY), 0))

	// fill grid with empty points
	grid := make(Grid)
	for j := boundMinY; j <= boundMaxY; j++ {
		for i := boundMinX; i <= boundMaxX; i++ {
			key := fmt.Sprintf("%d,%d", i, j)
			grid[key] = Point{x: int(i), y: int(j), sand: false, segment: false}
		}
	}
	return grid, segments, boundMinX, boundMaxX, boundMinY, boundMaxY
}

func drawSegments(grid Grid, segments []Line) {
	for _, segment := range segments {
		start := segment.start
		end := segment.end
		x1 := start.x
		y1 := start.y
		x2 := end.x
		y2 := end.y
		dx := math.Abs(float64(x2 - x1))
		dy := math.Abs(float64(y2 - y1))
		sx := 0
		sy := 0
		if x1 < x2 {
			sx = 1
		} else {
			sx = -1
		}
		if y1 < y2 {
			sy = 1
		} else {
			sy = -1
		}
		err := dx - dy
		for {
			point := grid[fmt.Sprintf("%d,%d", x1, y1)]
			point.segment = true
			grid[fmt.Sprintf("%d,%d", x1, y1)] = point
			if x1 == x2 && y1 == y2 {
				break
			}
			e2 := 2 * err
			if e2 > -dy {
				err -= dy
				x1 += sx
			}
			if e2 < dx {
				err += dx
				y1 += sy
			}
		}
	}
}

func belowOccupied(grid Grid, point Point) bool {
	below := grid[fmt.Sprintf("%d,%d", point.x, point.y-1)]
	bLeft := grid[fmt.Sprintf("%d,%d", point.x-1, point.y-1)]
	bRight := grid[fmt.Sprintf("%d,%d", point.x+1, point.y-1)]
	return (below.sand || below.segment) && (bLeft.sand || bLeft.segment) && (bRight.sand || bRight.segment)
}

func fall(grid Grid, minY int, sand Point, p1Val int, i int) (p1, p2 bool) {
	p1, p2 = false, false
	for {
		if sand.y == minY+1 && p1Val == -1 {
			p1 = true
			return p1, p2
		}
		if sand.x == 500 && sand.y == 0 && belowOccupied(grid, sand) {
			p2 = true
			return p1, p2
		}
		below := grid[fmt.Sprintf("%d,%d", sand.x, sand.y-1)]
		bLeft := grid[fmt.Sprintf("%d,%d", sand.x-1, sand.y-1)]
		bRight := grid[fmt.Sprintf("%d,%d", sand.x+1, sand.y-1)]
		if !below.sand && !below.segment {
			sand.y -= 1
		} else if below.sand || below.segment {
			if !bLeft.sand && !bLeft.segment {
				sand.y -= 1
				sand.x -= 1
			} else if !bRight.sand && !bRight.segment {
				sand.y -= 1
				sand.x += 1
			} else {
				grid[fmt.Sprintf("%d,%d", sand.x, sand.y)] = sand
				break
			}
		}
	}
	return false, false
}

func simulate(grid Grid, minY int) (int, int) {
	p1 := -1
	p2 := -1
	for i := 0; i < 100_000; i++ {
		spawn := Point{x: 500, y: 0, sand: true, segment: false}
		abyss, filled := fall(grid, minY, spawn, p1, i)
		if abyss && p1 == -1 {
			p1 = i
		}
		if filled && p2 == -1 {
			p2 = i
			break
		}
	}
	return p1, p2
}

// func draw(grid Grid, minX, maxX, minY, maxY int) {
// 	str := ""
// 	for j := minY; j <= maxY; j++ {
// 		for i := minX; i <= maxX; i++ {
// 			point := grid[fmt.Sprintf("%d,%d", i, j)]
// 			if point.segment {
// 				str += "#"
// 			} else if point.sand {
// 				str += "o"
// 			} else {
// 				str += "."
// 			}
// 		}
// 		str += "\n"
// 	}
// 	// reverse y axis
// 	split := strings.Split(str, "\n")
// 	for i, j := 0, len(split)-1; i < j; i, j = i+1, j-1 {
// 		split[i], split[j] = split[j], split[i]
// 	}
// 	str = strings.Join(split, "\n")
// 	fmt.Println(str)
// }
