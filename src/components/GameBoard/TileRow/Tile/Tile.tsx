import React from "react";
import Game from "../../../../Game";
import "./Tile.css";
import "./TileAnimationDelays.css";
import TileFace from "./TileFace";

type TileProps = {
    children: string;
    state: Game.TileState;
    pos: number;
    results: boolean;
};

export default function Tile({ children, state, pos, results }: TileProps) {
    return (
        <div className={`tile tile-${pos} ${state}`}>
            <div className="tile-contents">
                <TileFace face="front">{results ? "" : children}</TileFace>
                <TileFace face="back">{children}</TileFace>
            </div>
        </div>
    );
}
