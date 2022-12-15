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

const minBeaconX = Math.min(...beacons.map((b) => b.x));
const maxBeaconX = Math.max(...beacons.map((b) => b.x));

const minX = Math.min(minSensorX, minBeaconX);
const maxX = Math.max(maxSensorX, maxBeaconX);

const dist = (a: Point, b: Point) => {
  const { x: ax, y: ay } = a;
  const { x: bx, y: by } = b;
  return Math.abs(ax - bx) + Math.abs(ay - by);
};

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

const checkRow = (y: number) => {
  let count = 0;
  for (let x = minX; x <= maxX; x++) {
    const point = { x, y };
    if (freePoint(point)) count++;
    for (const s of sensors) {
      const d = dist(s, point);
      const range = dist(s, s.beacon);
      if (d <= range) {
        x = s.x + (range - Math.abs(s.y - y)) + 1;
        if (x > maxX) break;
        if (freePoint({ x, y })) count++;
      }
    }
  }
  return maxX - minX - count;
};

const minBoundX = 0;
const maxBoundX = 4_000_000;
const minBoundY = 0;
const maxBoundY = 4_000_000;

let part1 = 0;

let onlyFree: Point | undefined;
sensors.sort((a, b) => a.x - b.x);
const calc = () => {
  for (let y = minBoundY; y <= maxBoundY; y++) {
    if (y === 2_000_000) {
      part1 = checkRow(y);
    }
    for (let x = minBoundX; x <= maxBoundX; x++) {
      if (freePoint({ x, y })) {
        onlyFree = { x, y };
        return;
      }
      for (const s of sensors) {
        const d = dist(s, { x, y });
        const range = dist(s, s.beacon);
        if (d <= range) {
          x = s.x + (range - Math.abs(s.y - y)) + 1;
          if (x > maxBoundX) break;
          if (freePoint({ x, y })) {
            onlyFree = { x, y };
            return;
          }
        }
      }
    }
  }
};
calc();
console.log(onlyFree);
if (onlyFree === undefined) throw new Error('No free point found');
let part2 = onlyFree.x * 4_000_000 + onlyFree.y;

const answer = {
  part1,
  part2,
  day: 15,
};

console.log(answer);

export default answer;
