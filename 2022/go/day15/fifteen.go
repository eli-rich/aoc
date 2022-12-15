package day15

import (
	_ "embed"
	"fmt"
	"math"
	"sort"
	"strings"

	"github.com/eli-rich/aocutils"
)

//go:embed input.txt
var input string

type Point struct {
	x int
	y int
}

type Sensor struct {
	point     Point
	beacon    Point
	viewRange int
}

func Execute() (int, int) {
	input = strings.TrimSpace(input)
	sensors := parse(input)
	minX, maxX := minMaxX(sensors)
	initalizeSensorRanges(sensors)
	p1 := checkRow(2_000_000, minX, maxX, sensors)
	onlyFree := calc(sensors)
	p2 := onlyFree.x*4_000_000 + onlyFree.y
	return p1, p2
}

func parse(input string) []Sensor {
	lines := strings.Split(input, "\n")
	sensors := make([]Sensor, len(lines))
	for i, line := range lines {
		var sX, sY, bX, bY int
		fmt.Sscanf(line, "Sensor at x=%d, y=%d: closest beacon is at x=%d, y=%d", &sX, &sY, &bX, &bY)
		sensor := Sensor{Point{sX, sY}, Point{bX, bY}, 0}
		sensors[i] = sensor
	}
	return sensors
}

func minMaxX(sensors []Sensor) (int, int) {
	sensorsX := aocutils.ArrayMap(sensors, func(sensor Sensor) int {
		return sensor.point.x
	})
	beaconsX := aocutils.ArrayMap(sensors, func(sensor Sensor) int {
		return sensor.beacon.x
	})
	minX := 100_000_000
	maxX := -100_000_000
	for _, x := range sensorsX {
		if x < minX {
			minX = x
		}
		if x > maxX {
			maxX = x
		}
	}
	for _, x := range beaconsX {
		if x < minX {
			minX = x
		}
		if x > maxX {
			maxX = x
		}
	}
	return minX, maxX
}
func dist(a Point, b Point) int {
	ax, ay := float64(a.x), float64(a.y)
	bx, by := float64(b.x), float64(b.y)
	return int(math.Abs(ax-bx) + math.Abs(ay-by))
}
func initalizeSensorRanges(sensors []Sensor) {
	for i, sensor := range sensors {
		sensor.viewRange = dist(sensor.point, sensor.beacon)
		sensors[i] = sensor
	}
}

func freePoint(sensors []Sensor, point Point) bool {
	canSee := aocutils.ArraySome(sensors, func(sensor Sensor) bool {
		d := dist(sensor.point, point)
		return d <= sensor.viewRange
	})
	return !canSee
}

func checkRow(y, minX, maxX int, sensors []Sensor) int {
	count := 0
	for x := minX; x <= maxX; x++ {
		point := Point{x, y}
		if freePoint(sensors, point) {
			count++
		}
		for _, sensor := range sensors {
			d := dist(sensor.point, point)
			if d <= sensor.viewRange {
				yAbs := int(math.Abs(float64(sensor.point.y - y)))
				x = sensor.point.x + (sensor.viewRange - yAbs)
				if x > maxX {
					break
				}
				if freePoint(sensors, Point{x, y}) {
					count++
				}
			}
		}
	}
	return maxX - minX - count
}

func calc(sensors []Sensor) Point {
	minBoundX := 0
	maxBoundX := 4_000_000
	minBoundY := 0
	maxBoundY := 4_000_000
	sort.SliceStable(sensors, func(i, j int) bool {
		return sensors[i].point.x < sensors[j].point.x
	})
	for y := minBoundY; y <= maxBoundY; y++ {
		for x := minBoundX; x <= maxBoundX; x++ {
			point := Point{x, y}
			if freePoint(sensors, point) {
				return point
			}
			for _, sensor := range sensors {
				d := dist(sensor.point, point)
				if d <= sensor.viewRange {
					yAbs := int(math.Abs(float64(sensor.point.y - y)))
					x = sensor.point.x + (sensor.viewRange - yAbs)
					if x > maxBoundX {
						break
					}
					if freePoint(sensors, Point{x, y}) {
						return Point{x, y}
					}
				}
			}
		}
	}
	return Point{0, 0}
}
