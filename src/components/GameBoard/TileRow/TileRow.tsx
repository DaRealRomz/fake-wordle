import React from "react";
import Game from "../../../Game";
import Tile from "./Tile";
import "./TileRow.css";

type TileRowProps = {
    row?: number;
    game: Game;
    results?: boolean;
};

export default function TileRow({ row, game }: TileRowProps) {
    const results = row === undefined;
    const states = results ? (game.complete ? game.getResults() : Array(5).fill("untouched")) : game.getTileStates(row);
    return (
        <div className={"row" + (row === game.row ? " active" : "") + (results ? " results" : "")}>
            {states.map((state, i) => (
                <Tile key={i} state={state} pos={i} results={results}>
                    {(results ? game.word : game.letters[row])[i]}
                </Tile>
            ))}
        </div>
    );
}
