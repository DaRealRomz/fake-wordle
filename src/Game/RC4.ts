export default class RC4 {
    private readonly S: Uint8Array;
    private i: number;
    private j: number;

    constructor(key: Uint8Array) {
        this.S = new Uint8Array(256);
        for (let i = 0; i <= 255; i++) {
            this.S[i] = i;
        }
        this.j = 0;
        for (this.i = 0; this.i <= 255; this.i++) {
            this.j = (this.j + this.S[this.i] + key[this.i % key.length]) % 256;
            this.swap();
        }
        this.i = 0;
        this.j = 0;
    }

    public static getKey(seed: number): Uint8Array {
        const key = new Uint8Array(seed === 0 ? 1 : Math.floor(Math.log2(seed) / 8) + 1);
        seed = Math.abs(Math.floor(seed));
        for (let i = 0; i < key.length; i++) {
            key[i] = seed & 255;
            seed >>= 8;
        }
        return key;
    }

    private swap() {
        const tmp = this.S[this.i];
        this.S[this.i] = this.S[this.j];
        this.S[this.j] = tmp;
    }

    private randomByte(): number {
        this.i = (this.i + 1) % 256;
        this.j = (this.j + this.S[this.i]) % 256;
        this.swap();
        return this.S[(this.S[this.i] + this.S[this.j]) % 256];
    }

    public random(): number {
        let val = 0;
        for (let i = 0; i < 8; i++) {
            val = val * 256 + this.randomByte();
        }
        return val / 2 ** 64;
    }
}
