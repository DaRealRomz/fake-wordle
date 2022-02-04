import React, { useEffect, useState } from "react";
import "./App.css";
import Footer from "./components/Footer";
import GameBoard from "./components/GameBoard";
import Header from "./components/Header";
import Overlay from "./components/Overlay";
import Game from "./Game";
import { GameState } from "./Game/Game";

function App() {
    const [game, setGame] = useState<Readonly<GameState>>(new Game().export());
    const [shake, setShake] = useState(false);

    useEffect(() => {
        const onKeydown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            if (key === "enter") {
                if (e.altKey) {
                    setGame(new Game(+prompt("Enter word ID:")!).export());
                } else if (game.complete) {
                    setGame(new Game(game).showResults().export());
                } else {
                    if (game.col === 5 && new Game(game).verifyGuess()) {
                        setGame(new Game(game).validateRow().export());
                    } else {
                        setShake(true);
                    }
                }
            } else if (!game.complete) {
                if (key === "backspace" && game.col !== 0) {
                    setGame(new Game(game).changeCol(-1).setLetter("").export());
                } else if (/^[a-z]$/.test(key) && game.col !== 5) {
                    setGame(new Game(game).setLetter(key).changeCol(1).export());
                }
            }
        };

        document.addEventListener("keydown", onKeydown);
        return () => document.removeEventListener("keydown", onKeydown);
    }, [game]);

    useEffect(() => {
        if (new Game(game).overtime) return;
        const timeoutId = setTimeout(() => {
            if (game.seenResults || !game.letters.flat().join("").length) {
                setGame(new Game().export());
            }
        }, new Game(game).remainingTime);
        return () => clearTimeout(timeoutId);
    }, [game]);

    const onAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
        if (e.animationName === "shake") {
            setShake(false);
        }
    };

    return (
        <>
            <div className={"main" + (shake ? " shake" : "")} onAnimationEnd={onAnimationEnd}>
                <Header />
                <GameBoard game={game} />
                <Footer game={game} endGame={() => setGame(new Game(game).end().export())} />
            </div>
            <Overlay game={game} onClose={() => setGame(new Game(game).overtime ? new Game().export() : new Game(game).hideResults().export())} />
        </>
    );
}

export default App;
