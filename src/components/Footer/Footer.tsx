import React, { useEffect, useState } from "react";
import Game from "../../Game";
import "./Footer.css";

type FooterProps = {
    game: Game;
    endGame: () => void;
};

const getTimer = (game: Game): string => {
    if (game.overtime) return "now";
    return "in " + Game.getTimer(game.remainingTime);
};

export default function Footer({ game, endGame }: FooterProps) {
    const [timer, setTimer] = useState(getTimer(game));

    useEffect(() => {
        const intervalId = setInterval(() => setTimer(getTimer(game)), 1000);
        return () => clearInterval(intervalId);
    }, [game]);

    return (
        <footer>
            <div className="bottombar flex">
                <span className="center">
                    Next word available {timer}.
                    {game.overtime && (
                        <>
                            {" "}
                            <button className="link btn-switch" onClick={() => endGame()}>
                                Switch
                            </button>
                            .
                        </>
                    )}
                </span>
            </div>
        </footer>
    );
}
