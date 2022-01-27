import React from "react";
import Game from "../../Game";
import TileRow from "../GameBoard/TileRow";
import "./Overlay.css";

type OverlayProps = {
    game: Game;
    onClose: () => void;
};

export default function Overlay({ game, onClose }: OverlayProps) {
    const share = () => {
        navigator.clipboard.writeText(game.getTextResults());
        alert("Copied results to clipboard");
    };

    return (
        <div className={"overlay" + (game.showingResults ? " visible" : "") + (!game.seenResults ? " wait" : "")}>
            <div className="overlay-contents text-center">
                <h1 className={"title " + (game.won ? "won" : "lost")}>{game.won ? "Congratulations!" : "Fail!"}</h1>
                <p>Completed in {Game.getTimer(game.duration)}</p>
                <div className="results-wrapper">
                    <div className="results center">
                        <TileRow game={game} results />
                    </div>
                </div>
                <div className="buttons flex">
                    <button className="btn btn-close" onClick={() => onClose()}>
                        Close
                    </button>
                    <hr />
                    <button className="btn btn-share" onClick={() => share()}>
                        Share
                    </button>
                </div>
            </div>
        </div>
    );
}
