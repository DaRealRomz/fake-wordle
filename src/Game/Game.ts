import RC4 from "./RC4";
import { allWords, commonWords } from "./words";

class Game {
    public readonly wordId: number;
    private _letters: string[][];
    private _row: number;
    private _col: number;
    private _complete: boolean;
    private _seenResults: boolean;
    private _showingResults: boolean;
    public readonly endTime: number;
    public readonly startTime: number;
    private _finishTime?: number;
    private _won: boolean;

    constructor(
        wordId?: number,
        letters = Array.from(Array(6), () => Array(5).fill("")) as string[][],
        row = 0,
        col = 0,
        complete = false,
        endTime?: number,
        seenResults = false,
        showingResults = false,
        startTime = Date.now(),
        finishTime?: number,
        won = false
    ) {
        const now = Date.now();
        this.endTime = endTime || now - (now % 300000) + 300000;
        this.wordId =
            wordId !== undefined ? wordId : Math.floor(new RC4(RC4.getKey(this.endTime)).random() * commonWords.length);
        this._letters = letters;
        this._row = row;
        this._col = col;
        this._complete = complete;
        this._seenResults = seenResults;
        this._showingResults = showingResults;
        this.startTime = startTime;
        this._finishTime = finishTime;
        this._won = won;
    }

    public get word() {
        return commonWords[this.wordId];
    }

    public get letters(): ReadonlyArray<ReadonlyArray<string>> {
        return this._letters;
    }

    public get row() {
        return this._row;
    }

    public get col() {
        return this._col;
    }

    public get complete() {
        return this._complete;
    }

    public get seenResults() {
        return this._seenResults;
    }

    public get showingResults() {
        return this._showingResults;
    }

    public get currentGuess() {
        return this.letters[this.row].join("");
    }

    public get overtime() {
        return Date.now() > this.endTime;
    }

    public get remainingTime() {
        return this.endTime - Date.now();
    }

    public get finishTime() {
        return this._finishTime;
    }

    public get duration() {
        return (this._finishTime || Date.now()) - this.startTime;
    }

    public get won() {
        return this._won;
    }

    public setCol(col: number): Game {
        this._col = col;
        return this.clone();
    }

    public changeCol(offset: number): Game {
        this._col += offset;
        return this.clone();
    }

    public setPos(row: number, col: number): Game {
        this._row = row;
        this._col = col;
        return this.clone();
    }

    public setLetter(letter: string): Game {
        this._letters[this.row][this.col] = letter;
        return this.clone();
    }

    public verifyGuess(): boolean {
        return allWords.includes(this.currentGuess);
    }

    public validateRow(): Game {
        this._won = this.currentGuess === this.word;
        this._complete = this.row === 5 || this.won;
        if (this.complete) {
            this.showResults();
            this._finishTime = Date.now();
        }
        this._row++;
        this._col = 0;
        return this.clone();
    }

    public end(): Game {
        this._complete = true;
        this._seenResults = true;
        this._finishTime = Date.now();
        this.showResults();
        return this.clone();
    }

    public showResults(): Game {
        this._showingResults = true;
        return this.clone();
    }

    public hideResults(): Game {
        this._showingResults = false;
        this._seenResults = true;
        return this.clone();
    }

    public getTileStates(row: number): ReadonlyArray<Game.TileState> {
        if (row < this.row) {
            const states: Game.TileState[] = [];
            const correct = this.letters[row].map((letter, i) => this.word[i] === letter);
            const availableLetters = this.word.split("").filter((_, i) => !correct[i]);
            this.letters[row].forEach((letter, i) => {
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
            return this.letters[row].map((letter) =>
                letter.length === 0 ? Game.TileState.Untouched : Game.TileState.Touched
            );
        }
    }

    public getResults(): ReadonlyArray<Game.TileState> {
        const results = [];
        for (let letter = 0; letter < 5; letter++) {
            results[letter] = Game.TileState.Absent;
            for (let row = 0; row < this.row; row++) {
                if (this.letters[row][letter] === this.word[letter]) {
                    results[letter] = Game.TileState.Correct;
                    break;
                } else if (this.letters[row].includes(this.word[letter])) {
                    results[letter] = Game.TileState.Present;
                }
            }
        }
        return results;
    }

    public getTextResults(): string {
        const states = ["Fake Wordle", `Time: ${Game.getTimer(this.duration)}`];
        for (let row = 0; row < this.row; row++) {
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

    private clone(): Game {
        return new Game(
            this.wordId,
            this._letters,
            this.row,
            this.col,
            this.complete,
            this.endTime,
            this.seenResults,
            this.showingResults,
            this.startTime,
            this.finishTime,
            this.won
        );
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
