import React, { useEffect, useState } from "react";
import Game from "../../Game";
import { GameState } from "../../Game/Game";
import "./Footer.css";

type FooterProps = {
    game: GameState;
    endGame: () => void;
};

const getTimer = (gameState: GameState): string => {
    const game = new Game(gameState);
    if (game.overtime) return "now";
    return "in " + Game.getTimer(game.remainingTime);
};

export default function Footer({ game, endGame }: FooterProps) {
    const [timer, setTimer] = useState("");

    useEffect(() => {
        let timeout: NodeJS.Timeout | null = null;
        const updateTimer = () => {
            setTimer(getTimer(game));
            if (new Game(game).overtime) {
                timeout = null;
                return;
            }
            const now = Date.now();
            timeout = setTimeout(updateTimer, now - (now % 1000) + 1000);
        };
        updateTimer();
        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [game]);

    return (
        <footer>
            <div className="bottombar flex">
                <span className="center">
                    Next word available {timer}.
                    {new Game(game).overtime && (
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
