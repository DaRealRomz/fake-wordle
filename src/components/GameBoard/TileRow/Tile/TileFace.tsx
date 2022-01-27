import React from "react";

type TileFaceProps = {
    children: string;
    face: string;
};

export default function TileFace({ children, face }: TileFaceProps) {
    return (
        <div className={"tile-face tile-face-" + face}>
            <span className="center">{children}</span>
        </div>
    );
}
