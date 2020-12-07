export class Joueurs extends createjs.Sprite {
    constructor(spritesheet, jeu){
        super(spritesheet);
        this.jeu = jeu;
        this.fonctionManageInputs = this.manageInputs.bind(this);
        this.gotoAndStop("Start");
        window.addEventListener("keydown", this.fonctionManageInputs)
    }

    manageInputs(e){
        if (this.jeu.readInputs === true && this.jeu.visualQueue.visible === true) {
            if (e.code === "ArrowLeft" && e.code === "ArrowRight") {
                this.gotoAndPlay("Draw");
                this.jeu.readInputs = false;
                setTimeout(this.jeu.nextRound.bind(this.jeu), 2000);
                let sfx = createjs.Sound.play("hit", {loop: 0, volume: 1});
            }
            else if (e.code === "ArrowLeft") {
                this.endRound("P1Win", "p1");
                this.jeu.scoreJoueur1++
            }
            else if (e.code === "ArrowRight") {
                this.endRound("P2Win", "p2");
                this.jeu.scoreJoueur2++
            }
        }

        else if (this.jeu.readInputs === true && this.jeu.visualQueue.visible === false){
            if(e.code === "ArrowLeft"){
                this.endRound("P2Win", "p2");
                this.jeu.scoreJoueur2++
            } else if (e.code === "ArrowRight"){
                this.endRound("P1Win", "p1");
                this.jeu.scoreJoueur1++
            }
        }
    }

    endRound(anim, ui) {
        this.gotoAndPlay(anim);
        this.jeu.readInputs = false;
        let sfx = createjs.Sound.play("hit", {loop: 0, volume: 1});
        this.jeu.ui.children[this.jeu.rounds].gotoAndStop(ui);
        this.jeu.rounds++;

        if (this.jeu.rounds > 2) {
            setTimeout(this.jeu.fin.bind(this.jeu), 3000);
        } else {
            setTimeout(this.jeu.nextRound.bind(this.jeu), 2000);
        }
    }
}