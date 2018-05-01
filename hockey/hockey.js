class Player {
    constructor(type, team) {
        this.name = Math.random();
        this.type = type;
        this.team = team;
        this.goals = 0;
        this.sogoals = 0;
        this.assists = 0;
        this.shots = 0;
        this.soshots = 0;

        if (type === "goalie") {
            this.sav = 1 - Math.random() * 0.2;
        }
        else {
            this.sht = Math.random() * 0.15; //shooting percentage
            this.spg = Math.random() * 5; //shots per game
        }
    }

    getGameShots() {
        var shots = Math.floor(this.spg + roll_dice());
        if (shots < 0) {
            shots = 0;
        }
        return shots;
    }

    getGoal(goalie) {
        var goal = Math.random() < this.sht;
        if (goal) {
            this.goals++; //todo: subtract goalie save percentage
        }
        return goal;
    }

    getShootoutGoal(goalie) {
        var goal = Math.random() < this.sht * 6;
        if (goal) {
            this.sogoals++; //todo: subtract goalie save percentage
        }
        return goal;
    }
}

class Team {
    constructor(id) {
        this.id = id;
        this.wins = 0;
        this.losses = 0;
        this.otw = 0;
        this.otl = 0;
        this.sow = 0;
        this.sol = 0;
        this.row = 0;
        this.goals_for = [];
        this.goals_against = [];

        this.players = [];
        for (var i=0; i<4; i++) {
            this.players.push(new Player("center", this));
        }
        for (var i=0; i<4; i++) {
            this.players.push(new Player("left-wing", this));
        }
        for (var i=0; i<4; i++) {
            this.players.push(new Player("right-wing", this));
        }
        for (var i=0; i<4; i++) {
            this.players.push(new Player("left-defense", this));
        }
        for (var i=0; i<4; i++) {
            this.players.push(new Player("right-defense", this));
        }
        for (var i=0; i<2; i++) {
            this.players.push(new Player("goalie", this));
        }

        this.starter = this.players[18];
    }

    getGoalie() {
        return this.players.filter((p) => p.type === "goalie")[0];
    }

    finished_game(goals_for, goals_against) {
        this.goals_for = this.goals_for.concat(goals_for);
        this.goals_against = this.goals_against.concat(goals_against);

        this.points = this.wins * 2 + this.otl + this.sol;
    }

    regulation_win(goals_for, goals_against) {
        this.wins++;
        this.row++;
        this.finished_game(goals_for, goals_against);
    }

    regulation_loss(goals_for, goals_against) {
        this.losses++;
        this.finished_game(goals_for, goals_against);
    }

    overtime_win(goals_for, goals_against) {
        this.wins++;
        this.otw++;
        this.row++;
        this.finished_game(goals_for, goals_against);
    }

    overtime_loss(goals_for, goals_against) {
        this.otl++;
        this.finished_game(goals_for, goals_against);
    }

    shootout_win(shots_for, shots_against) {
        var goals_for = shots_for.map((a) => a.goal);
        var goals_against = shots_against.map((a) => a.goal);
        this.wins++;
        this.sow++;
        this.finished_game(goals_for, goals_against);
    }

    shootout_loss(shots_for, shots_against) {
        var goals_for = shots_for.map((a) => a.goal);
        var goals_against = shots_against.map((a) => a.goal);
        this.sol++;
        this.finished_game(goals_for, goals_against);
    }

    toString() {
        return "Team No. " + this.id + " - Wins: " + this.wins + ", Losses: " + this.losses + ", OTW: " + this.otw + ", OTL: " + this.otl + ", SOW: " + this.sow + ", SOL: " + this.sol + ", Points: " + this.points;
    }
}

class Season {
    constructor(number_of_teams, number_of_games) {
        this.number_of_games = number_of_games;
        this.teams = [];
        for (var i=0; i<number_of_teams; i++) {
            this.teams.push(new Team(i));
        }
        this.games = create_matchups(this.teams, number_of_games);
        this.games.forEach(function(game) {
            game.play();
        }, this);
        this.teams.sort(function(a, b) {
            return b.points - a.points;
        });
        console.log("Finished season with " + this.games.length + " games played.");
    }
}

class Goal {
    constructor(type, shooter, period, assist1, assist2) {
        this.type = type;
        this.shooter = shooter;
        this.period = period;
        this.assist1 = assist1;
        this.assist2 = assist2;
    }
}

class Shot {
    constructor(type, shooter, goalie, period, assist1, assist2) {
        this.type = type;
        this.shooter = shooter;
        this.period = period;
        this.is_goal = Math.random() < shooter.sht;
        this.goal = null;
        if (this.is_goal) {
            this.goal = new Goal(type, shooter, period, assist1, assist2)
        }
    }
}

class Game {
    constructor(game_number, team1, team2) {
        this.game_number = game_number;
        this.home_team = team1;
        this.away_team = team2;
        this.home_goalie = team1.getGoalie();
        this.away_goalie = team2.getGoalie();
        this.shots = [];
        this.home_shots = [];
        this.away_shots = [];
        this.home_goals = [];
        this.away_goals = [];
        this.home_shootout_shots = [];
        this.away_shootout_shots = [];
        this.final_score = "";
    }

    play() {
        var shot_order = [];

        this.home_team.players.filter(function(player) {
            return player.type !== "goalie";
        }).forEach(function(player) {
            var player_shots = player.getGameShots();
            for (var i=0; i<player_shots; i++) {
                shot_order.push(player);
            }
        }, this);

        this.away_team.players.filter(function(player) {
            return player.type !== "goalie";
        }).forEach(function(player) {
            var player_shots = player.getGameShots();
            for (var i=0; i<player_shots; i++) {
                shot_order.push(player);
            }
        });

        shuffle(shot_order);
        var onethird = shot_order.length / 3;

        shot_order.forEach(function(player, i) {
            var period = Math.floor(i/onethird);
            var shot = new Shot("regulation", player, this.away_goalie, period, null, null);
            this.shots.push(shot);

            if (shot.shooter.team.id === this.home_team.id) {
                this.home_shots.push(shot);
                if (shot.is_goal) {
                    this.home_goals.push(shot.goal);
                }
            }
            else {
                this.away_shots.push(shot);
                if (shot.is_goal) {
                    this.away_goals.push(shot.goal);
                }
            }
        }, this);

        this.final_score = "Home: " + this.home_goals.length + ", Away: " + this.away_goals.length;

        if (this.home_goals.length > this.away_goals.length) {
            this.home_team.regulation_win(this.home_goals, this.away_goals);
            this.away_team.regulation_loss(this.away_goals, this.home_goals);
        }
        else if (this.home_goals.length < this.away_goals.length) {
            this.away_team.regulation_win(this.away_goals, this.home_goals);
            this.home_team.regulation_loss(this.home_goals, this.away_goals);
        }
        else {
            this.overtime();
        }
    }

    overtime() {
        var overtime_chances = roll_dice() + 5;

        for (var i=0; i<overtime_chances; i++) {
            var players = this.home_team.players.filter(function(player) {
                return player.type !== "goalie";
            });
            var rand = Math.floor(Math.random() * players.length);
            var shooter = players[rand];
            var shot = new Shot("overtime", shooter, this.away_team.starter, 3, null, null);
            this.home_shots.push(shot);
            if (shot.is_goal) {
                this.home_goals.push(shot.goal);
                this.home_team.overtime_win(shooter);
                this.away_team.overtime_loss();
                break;
            }

            var players = this.away_team.players.filter(function(player) {
                return player.type !== "goalie";
            });
            var rand = Math.floor(Math.random() * players.length);
            var shooter = players[rand];
            var shot = new Shot("overtime", shooter, this.home_team.starter, 3, null, null);
            this.away_shots.push(shot);
            if (shot.is_goal) {
                this.away_goals.push(shot.goal);
                this.home_team.overtime_loss();
                this.away_team.overtime_win(shooter);
                break;
            }
        }

        if (this.home_goals.length === this.away_goals.length) {
            this.shootout();
        }
    }

    shootout() {
        var first_shots = [];
        var second_shots = [];
        var first_goals = 0;
        var second_goals = 0;
        var first_goalie = null;
        var second_goalie = null;
        var first_order = this.getShootoutOrder(this.home_team); //assuming home team goes first
        var second_order = this.getShootoutOrder(this.away_team);
        var first_shooters = [
            first_order.shift(0),
            first_order.shift(0),
            first_order.shift(0)
        ];
        var second_shooters = [
            second_order.shift(0),
            second_order.shift(0),
            second_order.shift(0)
        ];

        var round = 0;
        first_shots.push(new ShootoutShot("first", first_shooters[round], second_goalie));
        second_shots.push(new ShootoutShot("second", second_shooters[round], first_goalie));

        round = 1;
        first_shots.push(new ShootoutShot("first", first_shooters[round], second_goalie));
        second_shots.push(new ShootoutShot("second", second_shooters[round], first_goalie));

        var first_goals = first_shots.reduce((sum, shot) => sum + shot.goal, 0);
        var second_goals = second_shots.reduce((sum, shot) => sum + shot.goal, 0);

        if (Math.abs(first_goals - second_goals) === 2) { //4 shots taken, is someone winning 2-0?
            //shootout over
        }
        else {
            round = 2;
            first_shots.push(new ShootoutShot("first", first_shooters[round], second_goalie));
            var first_goals = first_shots.reduce((sum, shot) => sum + shot.goal, 0);
            if (first_goals - second_goals === 2) { //is first team winning by 2?
                //shootout over
            }
            else if (second_goals > first_goals) { //is second team winning?
                //shootout over
            }
            else {
                second_shots.push(new ShootoutShot("second", second_shooters[round], first_goalie));
                var second_goals = second_shots.reduce((sum, shot) => sum + shot.goal, 0);

                if (second_goals !== first_goals) {
                    //shootout over
                }
                else {
                    while (first_goals === second_goals) {
                        round++;
                        first_shots.push(new ShootoutShot("first", first_order.shift(0), second_goalie));
                        first_goals = first_shots.reduce((sum, shot) => sum + shot.goal, 0);
                        second_shots.push(new ShootoutShot("second", second_order.shift(0), first_goalie));
                        second_goals = second_shots.reduce((sum, shot) => sum + shot.goal, 0);

                        if (first_order.length === 0) {
                            first_order = this.getShootoutOrder(this.home_team);
                        }
                        if (second_order.length === 0) {
                            second_order = this.getShootoutOrder(this.away_team);
                        }
                    }
                }
            }
        }

        if (first_goals > second_goals) {
            this.home_goals.push(new Goal("shootout", null, 4, null, null));
            this.home_team.shootout_win(first_shots, second_shots);
            this.away_team.shootout_loss(second_shots, first_shots);
        }
        else {
            this.away_goals.push(new Goal("shootout", null, 4, null, null));
            this.home_team.shootout_loss(first_shots, second_shots);
            this.away_team.shootout_win(second_shots, first_shots);
        }

        this.home_shootout_shots = first_shots;
        this.away_shootout_shots = second_shots;

        console.log("Shootout ended in round " + (round+1) + " with final score of Home: " + first_goals + ", Away: " + second_goals);
    }

    getShootoutOrder(team) {
        return team.players.filter(function(player) {
            return player.type !== "goalie";
        }).sort(function(a, b) {
            return b.spg - a.spg;
        });
    }

    toString() {
        return this.game_number + " - " + this.final_score;
    }
}

class ShootoutShot {
    constructor(type, shooter, goalie) {
        this.type = type;
        this.shooter = shooter;
        this.goalie = goalie;
        this.goal = shooter.getShootoutGoal(goalie);
    }
}

class ShootoutRound {
    constructor(round, first_shooter, second_shooter, first_goalie, second_goalie) {
        this.round = round;
        this.goalie = goalie;
        this.goals = [];
    }
}

function roll_dice() {
    //two-dice value between -5 and 5
    return Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) - 5;
}

//Knuth-Fisher-Yates shuffle
function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var rand = Math.floor(Math.random() * i) + 1;
        var tmp = arr[rand];
        arr[rand] = arr[i];
        arr[i] = tmp;
    }
}

function create_matchups(teams, number_of_games) {
    var number_of_teams = teams.length;

    var pool = [];
    for (var i=0; i<number_of_teams; i++) {
        for (var j=0; j<number_of_games; j++) {
            pool.push(i);
        }
    }

    var matchups = [];
    var game_number = 0;
    while (pool.length > 0) {
        var rand = Math.floor(Math.random() * pool.length);
        var team1 = pool.splice(rand, 1);
        rand = Math.floor(Math.random() * pool.length);
        var team2 = pool.splice(rand, 1);
        matchups.push(new Game(game_number, teams[team1], teams[team2]));
        game_number++;
    }

    if (matchups.length !== number_of_teams * number_of_games / 2) {
        console.error("Failed to create matchups.");
        matchups = [];
    }

    return matchups;
}