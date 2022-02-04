import React from "react";
import Game from "../../../Game";
import { GameState } from "../../../Game/Game";
import Tile from "./Tile";
import "./TileRow.css";

type TileRowProps = {
    row?: number;
    game: GameState;
    results?: boolean;
};

export default function TileRow({ row, game }: TileRowProps) {
    const results = row === undefined;
    const states = results ? (game.complete ? new Game(game).results : Array(5).fill("untouched")) : new Game(game).getTileStates(row);
    return (
        <div className={"row" + (row === game.row ? " active" : "") + (results ? " results" : "")}>
            {states.map((state, i) => (
                <Tile key={i} state={state} pos={i} results={results}>
                    {(results ? new Game(game).word : game.letters[row])[i]}
                </Tile>
            ))}
        </div>
    );
}
