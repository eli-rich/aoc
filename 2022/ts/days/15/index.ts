import getInput from '../../inputManager.js';

type Point = {
  x: number;
  y: number;
};

type Beacon = Point;

type Sensor = {
  x: number;
  y: number;
  beacon: Beacon;
  range?: number;
};

const input = getInput(15).trim();

const lines = input.split('\n');

const beacons: Beacon[] = [];
const sensors: Sensor[] = [];

for (const line of lines) {
  const space = line.split(' ');
  const sensorXY = [space[2], space[3]];
  const sensorX = parseInt(sensorXY[0].split('=')[1]);
  const sensorY = parseInt(sensorXY[1].split('=')[1]);
  const beaconXY = [space[8], space[9]];
  const beaconX = parseInt(beaconXY[0].split('=')[1]);
  const beaconY = parseInt(beaconXY[1].split('=')[1]);
  const beacon = { x: beaconX, y: beaconY };
  const sensor = { x: sensorX, y: sensorY, beacon };
  beacons.push(beacon);
  sensors.push(sensor);
}

const minSensorX = Math.min(...sensors.map((s) => s.x));
const maxSensorX = Math.max(...sensors.map((s) => s.x));
const minSensorY = Math.min(...sensors.map((s) => s.y));
const maxSensorY = Math.max(...sensors.map((s) => s.y));

const minBeaconX = Math.min(...beacons.map((b) => b.x));
const maxBeaconX = Math.max(...beacons.map((b) => b.x));
const minBeaconY = Math.min(...beacons.map((b) => b.y));
const maxBeaconY = Math.max(...beacons.map((b) => b.y));

let minX = Math.min(minSensorX, minBeaconX);
let maxX = Math.max(maxSensorX, maxBeaconX);
let minY = Math.min(minSensorY, minBeaconY);
let maxY = Math.max(maxSensorY, maxBeaconY);

const dist = (a: Point, b: Point) => {
  const { x: ax, y: ay } = a;
  const { x: bx, y: by } = b;
  return Math.abs(ax - bx) + Math.abs(ay - by);
};

const free = (y: number) => {
  let count = 0;

  for (let x = minX; x <= maxX; x++) {
    const hasBeacon = beacons.some((b) => b.x === x && b.y === y);
    if (hasBeacon) continue;

    const canSee = sensors.some((s) => {
      const d = dist(s, { x, y });
      const range = dist(s, s.beacon);
      return d <= range;
    });

    if (canSee) continue;

    count++;
  }
  return maxX - minX - count;
};

const part1 = free(2_000_000);

// part 2

minX = 0;
maxX = 4000000;
minY = 0;
maxY = 4000000;

sensors.sort((a, b) => a.x - b.x);

const freePoint = (point: Point) => {
  const { x, y } = point;
  const hasBeacon = beacons.some((b) => b.x === x && b.y === y);
  if (hasBeacon) return false;

  const canSee = sensors.some((s) => {
    const d = dist(s, { x, y });
    const range = dist(s, s.beacon);
    return d <= range;
  });

  if (canSee) return false;
  return true;
};

const calc = () => {
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const point = { x, y };
      if (freePoint(point)) {
        return point;
      }
      for (const s of sensors) {
        const d = dist(s, point);
        const range = dist(s, s.beacon);
        if (d <= range) {
          x = s.x + (range - Math.abs(s.y - y)) + 1;
          if (x > maxX) break;
          if (freePoint({ x, y })) {
            return { x, y } as Point;
          }
        }
      }
    }
  }
};

const point = calc()!;
const part2 = point.x * 4_000_000 + point.y;

const answer = {
  part1,
  part2,
  day: 15,
};

export default answer;
