import React, { useEffect, useState } from "react";
import "./App.css";
import Footer from "./components/Footer";
import GameBoard from "./components/GameBoard";
import Header from "./components/Header";
import Overlay from "./components/Overlay";
import Game from "./Game";

function App() {
    const [game, setGame] = useState(new Game());
    const [shake, setShake] = useState(false);

    useEffect(() => {
        const onKeydown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            if (key === "enter") {
                if (e.altKey) {
                    setGame(new Game(+prompt("Enter word ID:")!));
                } else if (game.complete) {
                    setGame(game.showResults());
                } else {
                    if (game.col === 5 && game.verifyGuess()) {
                        setGame(game.validateRow());
                    } else {
                        setShake(true);
                    }
                }
            } else if (!game.complete) {
                if (key === "backspace" && game.col !== 0) {
                    setGame(game.changeCol(-1).setLetter(""));
                } else if (/^[a-z]$/.test(key) && game.col !== 5) {
                    setGame(game.setLetter(key).changeCol(1));
                }
            }
        };

        document.addEventListener("keydown", onKeydown);
        return () => document.removeEventListener("keydown", onKeydown);
    }, [game]);

    useEffect(() => {
        if (game.overtime) return;
        const timeoutId = setTimeout(() => {
            if (game.seenResults || !game.letters.flat().join("").length) {
                setGame(new Game());
            }
        }, game.remainingTime);
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
                <Footer game={game} endGame={() => setGame(game.end())} />
            </div>
            <Overlay game={game} onClose={() => setGame(game.overtime ? new Game() : game.hideResults())} />
        </>
    );
}

export default App;
