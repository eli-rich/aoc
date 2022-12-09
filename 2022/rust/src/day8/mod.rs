const INPUT: &str = include_str!("input.txt");

pub fn execute() -> [u32; 2] {
    let trees = INPUT
        .lines()
        .map(|line| {
            return line.split("").filter(|ch| ch.len() > 0).collect::<Vec<_>>();
        })
        .map(|line| {
            return line
                .into_iter()
                .map(|ch| ch.parse::<usize>().unwrap())
                .collect::<Vec<_>>();
        })
        .collect::<Vec<_>>();

    let mut visible = 0;
    for i in 0..trees.len() {
        for j in 0..trees[i].len() {
            if check_visible(i, j, trees) {
                visible += 1;
            }
        }
    }
    println!("Visible: {}", visible);
    panic!("");

    return [0, 0];
}

fn check_visible(i: usize, j: usize, trees: Vec<Vec<usize>>) -> bool {
    let mut not_left = false;
    let mut not_right = false;
    let mut not_up = false;
    let mut not_down = false;
    if (i == 0 || i == trees.len() - 1) || (j == 0 || j == trees[i].len() - 1) {
        return false;
    }
    // check left
    for k in 0..j {
        if trees[i][k] >= trees[i][j] {
            not_left = true;
        }
    }
    // check right
    for k in (j+1)..(trees[i].len()) {
        if trees[i][k] >= trees[i][j] {
            not_right = true;
        }
    }
    // check up
    for k in 0..i {
        if trees[k][j] >= trees[i][j] {
            not_up = true;
        }
    }
    // check down
    for k in (i+1)..(trees.len()) {
        if trees[k][j] >= trees[i][j] {
            not_down = true;
        }
    }
    if not_left && not_right && not_up && not_down {
        return true;
    }
    return false;
}