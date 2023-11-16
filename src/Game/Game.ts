import RC4 from "./RC4";
import { allWords, commonWords } from "./words";

export type GameState = {
    wordId: number;
    letters: string[][];
    row: number;
    col: number;
    complete: boolean;
    seenResults: boolean;
    showingResults: boolean;
    startTime: number;
    finishTime?: number;
    expireTime: number;
    won: boolean;
};

class Game {
    private state: GameState;

    constructor(state?: GameState | number) {
        if (!state || typeof(state) === 'number') {
            const now = Date.now();
            const expireTime = now - (now % 60000) + 60000;
            state = {
                wordId: state || Math.floor(new RC4(RC4.getKey(expireTime)).random() * commonWords.length),
                letters: Array.from(Array(6), () => Array(5).fill("")) as string[][],
                row: 0,
                col: 0,
                complete: false,
                expireTime,
                seenResults: false,
                showingResults: false,
                startTime: Date.now(),
                won: false,
            }
        }
        this.state = state;
    }

    // constructor(
    //     wordId?: number,
    //     letters = Array.from(Array(6), () => Array(5).fill("")) as string[][],
    //     row = 0,
    //     col = 0,
    //     complete = false,
    //     endTime?: number,
    //     seenResults = false,
    //     showingResults = false,
    //     startTime = Date.now(),
    //     finishTime?: number,
    //     won = false
    // ) {
    //     const now = Date.now();
    //     this.endTime = endTime || now - (now % 300000) + 300000;
    //     this.wordId =
    //         wordId !== undefined ? wordId : Math.floor(new RC4(RC4.getKey(this.endTime)).random() * commonWords.length);
    //     this._letters = letters;
    //     this._row = row;
    //     this._col = col;
    //     this._complete = complete;
    //     this._seenResults = seenResults;
    //     this._showingResults = showingResults;
    //     this.startTime = startTime;
    //     this._finishTime = finishTime;
    //     this._won = won;
    // }

    public get word() {
        return commonWords[this.state.wordId];
    }

    private get currentGuess() {
        return this.state.letters[this.state.row].join("");
    }

    public get overtime() {
        return Date.now() > this.state.expireTime;
    }

    public get remainingTime() {
        return this.state.expireTime - Date.now();
    }

    public get duration() {
        return (this.state.finishTime || Date.now()) - this.state.startTime;
    }

    public setCol(col: number): Game {
        this.state.col = col;
        return this;
    }

    public changeCol(offset: number): Game {
        this.state.col += offset;
        return this;
    }

    public setPos(row: number, col: number): Game {
        this.state.row = row;
        this.state.col = col;
        return this;
    }

    public setLetter(letter: string): Game {
        this.state.letters[this.state.row][this.state.col] = letter;
        return this;
    }

    public verifyGuess(): boolean {
        return allWords.includes(this.currentGuess);
    }

    public validateRow(): Game {
        this.state.won = this.currentGuess === this.word;
        this.state.complete = this.state.row === 5 || this.state.won;
        if (this.state.complete) {
            this.showResults();
            this.state.finishTime = Date.now();
        }
        this.state.row++;
        this.state.col = 0;
        return this;
    }

    public end(): Game {
        this.state.complete = true;
        this.state.seenResults = true;
        this.state.finishTime = Date.now();
        this.showResults();
        return this;
    }

    public showResults(): Game {
        this.state.showingResults = true;
        return this;
    }

    public hideResults(): Game {
        this.state.showingResults = false;
        this.state.seenResults = true;
        return this;
    }

    public getTileStates(row: number): ReadonlyArray<Game.TileState> {
        if (row < this.state.row) {
            const states: Game.TileState[] = [];
            const correct = this.state.letters[row].map((letter, i) => this.word[i] === letter);
            const availableLetters = this.word.split("").filter((_, i) => !correct[i]);
            this.state.letters[row].forEach((letter, i) => {
                if (correct[i]) {
                    states[i] = Game.TileState.Correct;
                } else {
                    const pos = availableLetters.indexOf(letter);
                    if (pos === -1) {
                        states[i] = Game.TileState.Absent;
                    } else {
                        states[i] = Game.TileState.Present;
                        availableLetters.splice(pos, 1);
                    }
                }
            });
            return states;
        } else {
            return this.state.letters[row].map((letter) =>
                letter.length === 0 ? Game.TileState.Untouched : Game.TileState.Touched
            );
        }
    }

    public get results(): ReadonlyArray<Game.TileState> {
        const results = [];
        for (let letter = 0; letter < 5; letter++) {
            results[letter] = Game.TileState.Absent;
            for (let row = 0; row < this.state.row; row++) {
                if (this.state.letters[row][letter] === this.word[letter]) {
                    results[letter] = Game.TileState.Correct;
                    break;
                } else if (this.state.letters[row].includes(this.word[letter])) {
                    results[letter] = Game.TileState.Present;
                }
            }
        }
        return results;
    }

    public get textResults(): string {
        const states = ["Fake Wordle", `Time: ${Game.getTimer(this.duration)}`];
        for (let row = 0; row < this.state.row; row++) {
            states.push(this.getTileStates(row).map(Game.mapTileStateToEmote).join(""));
        }
        return states.join(navigator.userAgent.includes("Windows") ? "\r\n" : "\n");
    }

    private static mapTileStateToEmote(state: Game.TileState): string {
        switch (state) {
            case Game.TileState.Present:
                return "🟨";
            case Game.TileState.Correct:
                return "🟩";
            default:
                return "⬛";
        }
    }

    public export(): GameState {
        return { ...this.state };
    }

    public static getTimer(time: number): string {
        const t = Math.round(Math.abs(time) / 1000);
        let timer = "";
        if (t < 0) timer += "+";
        timer += Math.floor(t / 60) + ":";
        timer += Math.floor((t % 60) / 10);
        timer += (t % 60) % 10;
        return timer;
    }
}

namespace Game {
    export enum TileState {
        Untouched = "untouched",
        Touched = "touched",
        Absent = "absent",
        Present = "present",
        Correct = "correct",
    }
}

export default Game;
