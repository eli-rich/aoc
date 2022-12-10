use std::str::Lines;

const INPUT: &str = include_str!("input.txt");

#[derive(PartialEq, Clone)]
struct Pos {
    x: isize,
    y: isize,
}


pub fn execute() -> [u32; 2] {
    let lines = INPUT.trim().lines();
    let p1 = part1(lines.clone());
    let p2 = part2(lines.clone());
    return [p1 as u32, p2 as u32];
}

fn get_touching(pos: &Pos) -> Vec<Pos> {
    let mut touching: Vec<Pos> = Vec::new();
    touching.push(Pos { x: pos.x + 1, y: pos.y });
    touching.push(Pos { x: pos.x - 1, y: pos.y });
    touching.push(Pos { x: pos.x, y: pos.y + 1 });
    touching.push(Pos { x: pos.x, y: pos.y - 1 });
    touching.push(Pos { x: pos.x + 1, y: pos.y + 1 });
    touching.push(Pos { x: pos.x - 1, y: pos.y - 1 });
    touching.push(Pos { x: pos.x + 1, y: pos.y - 1 });
    touching.push(Pos { x: pos.x - 1, y: pos.y + 1 });
    return touching;
}

fn move_one(dir: &str, dist: usize, head: &mut Pos, tail: &mut Pos, positions: &mut Vec<Pos>) {
    for _ in 0..dist {
        match dir {
            "U" => head.y += 1,
            "D" => head.y -= 1,
            "L" => head.x -= 1,
            "R" => head.x += 1,
            _ => panic!("Invalid direction"),
        }
        let touching = get_touching(head);
        let mut should_update = true;
        for pos in touching {
            if pos == *tail {
                should_update = false;
            }
        }
        if should_update {
            if head.x > tail.x {
                tail.x += 1;
            }
            if head.x < tail.x {
                tail.x -= 1;
            }
            if head.y > tail.y {
                tail.y += 1;
            }
            if head.y < tail.y {
                tail.y -= 1;
            }
        }
        if !positions.contains(tail) {
            positions.push(Pos { x: tail.x, y: tail.y });
        }
    }
}

fn part1(lines: Lines) -> usize {
    let mut head = Pos { x: 0, y: 0 };
    let mut tail = Pos { x: 0, y: 0 };

    let mut positions: Vec<Pos> = Vec::new();

    for line in lines {
        let split: Vec<_> = line.split(" ").collect();
        let dir = split[0];
        let dist = split[1].parse::<usize>().unwrap();
        move_one(dir, dist, &mut head, &mut tail, &mut positions);
    }
    return positions.len();
}

fn update_node(node: &Pos, next: &mut Pos) {
    let touching = get_touching(node);
    let mut should_update = true;
    for pos in touching {
        if pos == *next {
            should_update = false;
        }
    }
    if should_update {
        if node.x > next.x {
            next.x += 1;
        }
        if node.x < next.x {
            next.x -= 1;
        }
        if node.y > next.y {
            next.y += 1;
        }
        if node.y < next.y {
            next.y -= 1;
        }
    }
}

fn part2(lines: Lines) -> usize {
    let mut nodes: Vec<Pos> = Vec::new();
    for _ in 0..10 {
        nodes.push(Pos { x: 0, y: 0 });
    }
    let mut positions: Vec<Pos> = Vec::new();

    for line in lines {
        let split: Vec<_> = line.split(" ").collect();
        let dir = split[0];
        let dist = split[1].parse::<usize>().unwrap();
        for _i in 0..dist {
            match dir {
                "U" => nodes[0].y += 1,
                "D" => nodes[0].y -= 1,
                "L" => nodes[0].x -= 1,
                "R" => nodes[0].x += 1,
                _ => panic!("Invalid direction"),
            }
            for j in 0..nodes.len() - 1 {
                let nodes_cloned = nodes.clone();
                let node = &nodes_cloned[j];
                let next = &mut nodes[j + 1];
                update_node(node, next);
            }
            let tail = &nodes[nodes.len() - 1];
            if !positions.contains(tail) {
                positions.push(Pos { x: tail.x, y: tail.y });
            }
        }
    }
    return positions.len();
}