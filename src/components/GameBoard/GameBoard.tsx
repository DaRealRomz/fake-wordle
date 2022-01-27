import React from "react";
import Game from "../../Game";
import TileRow from "./TileRow";
import "./GameBoard.css";

type GameBoardProps = {
    game: Game;
};

export default function GameBoard({ game }: GameBoardProps) {
    const ref = React.createRef<HTMLInputElement>();

    const rows = [];
    for (let i = 0; i < 6; i++) {
        rows.push(<TileRow key={i} row={i} game={game} />);
    }

    return (
        <div className="board" onClick={() => ref.current!.focus()}>
            <input type="text" id="mobileKeyboard" style={{ top: ((game.row + 0.5) / 6) * 100 + "%" }} ref={ref} />
            {rows}
        </div>
    );
}
