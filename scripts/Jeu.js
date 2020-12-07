import {Joueurs} from "./Joueurs.js";

export class Jeu {

  constructor() {

    // Référence au canevas dans le DOM
    this.canvas = document.querySelector("canvas");

    // Propriétés définies dans cet objet
    this.chargeur = null;

    this.stage = null;
    this.bg = null;
    this.ui = null;
    this.visualQueue = null;
    this.title = null;
    this.vicScreen = null;
    this.musique = null;

    this.state = null;
    this.readInputs = false;
    this.joueur1NomDisplay = null;
    this.joueur2NomDisplay = null;
    this.joueur1Nom = null;
    this.joueur2Nom = null;
    this.scoreJoueur1 = 0;
    this.scoreJoueur2 = 0;
    this.joueurs = null;
    this.timer = null;
    this.rounds = 0;
    this.fonctionDebut = null;
    this.fonctionRestart = null;
    this.ecouteur


    // Paramètres modifiable du jeu
    this.params = {
      cadence: 60,
      formatPolice: "48px 'FightingSpirit2",
      manifeste: "ressources/manifest.json"
    };

    this.initialiser();
    this.charger(this.titleScreen.bind(this));

  }

  initialiser() {
    this.canvas.width = 1280;
    this.canvas.height = 800;

    this.stage = new createjs.StageGL(this.canvas);

    createjs.Ticker.addEventListener("tick", e => this.stage.update(e));
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.framerate = this.params.cadence;


  }

  charger(fonction) {
    this.chargeur = new createjs.LoadQueue();
    this.chargeur.installPlugin(createjs.Sound);
    this.chargeur.addEventListener("complete", fonction);
    this.chargeur.addEventListener('error', this.abandonner.bind(this));
    this.chargeur.loadManifest(this.params.manifeste);
  }

  abandonner(e) {
    alert("L'élément suivant n'a pu être chargé: " + e.src);
  }

  titleScreen(){
    this.bg = new createjs.Bitmap(this.chargeur.getResult("bg"));
    this.bg.scale = 4;
    this.stage.addChild(this.bg);

    this.title = new createjs.Bitmap(this.chargeur.getResult("titleScreen"));
    this.stage.addChild(this.title);

    this.fonctionDebut = this.debuter.bind(this);
    window.addEventListener('keydown', this.fonctionDebut);
  }

  debuter() {
    window.removeEventListener('keydown', this.fonctionDebut);

    this.title.visible = false;
    let fenetre = document.getElementById("fenetre");
    fenetre.style.display = "block";

    document.querySelector("#j1").focus();

    this.ecouteur = e => {
      e.stopPropagation();
      if (e.key === "Enter") bouton.click();
    };

    let bouton = document.querySelector("#fenetre button");
    bouton.addEventListener("click", this.saveName.bind(this));

    let musique = createjs.Sound.play("bgm", {loop: -1, volume: 0.5});  
    this.visualQueue = new createjs.Bitmap(this.chargeur.getResult("queue"));
    this.visualQueue.scale = 2;
    this.visualQueue.x = this.canvas.width/2 - this.visualQueue.getBounds().width;
    this.visualQueue.y = this.canvas.height/2 - this.visualQueue.getBounds().height;
    this.visualQueue.visible = false;
    this.stage.addChild(this.visualQueue);

    this.joueurs = new Joueurs(this.chargeur.getResult("players"), this);
    this.joueurs.scale = 2;
    this.joueurs.y = -50;
    this.stage.addChild(this.joueurs);

    this.ui = new createjs.Container();
    this.stage.addChild(this.ui);

    this.joueur1NomDisplay = new createjs.Text("J1 : Points", this.params.formatPolice,  '#2e1203');
    this.joueur1NomDisplay.x = 100;
    this.joueur1NomDisplay.y = 20;
    this.joueur1NomDisplay.cache(0, 0, this.joueur1NomDisplay.getBounds().width, 50);
    this.stage.addChild(this.joueur1NomDisplay);

    this.joueur2NomDisplay = new createjs.Text("J2 : Points", this.params.formatPolice,  '#2e1203');
    this.joueur2NomDisplay.x = this.canvas.width - this.joueur2NomDisplay.getBounds().width - 100;
    this.joueur2NomDisplay.y = 20
    this.joueur2NomDisplay.cache(0, 0, this.joueur2NomDisplay.getBounds().width, 50);
    this.stage.addChild(this.joueur2NomDisplay);

    for (let i = 0; i<3; i++){
      let signe = new createjs.Sprite(this.chargeur.getResult("ui"));
      signe.x = signe.getBounds().width*i*2.5;
      signe.scale = 2;
      this.ui.addChild(signe);
    }

    this.ui.x = this.canvas.width/2 - this.ui.getBounds().width/2;
    this.ui.y = 20;

    this.vicScreen = new createjs.Sprite(this.chargeur.getResult("vicScreen"));
    this.vicScreen.visible = false;
    this.vicScreen.scale = 4;
    this.stage.addChild(this.vicScreen);
  }

  saveName(){
    let fenetre = document.getElementById("fenetre");
    let j1 = document.getElementById("j1");
    let j2 = document.getElementById("j2");

    if (j1.value.length < 1 || j2.value.length < 1) {
      return;
    }

    fenetre.style.display = "none";

    this.startRound();

    this.joueur1Nom = j1.value;
    this.joueur2Nom = j2.value;

    j1.removeEventListener("keydown", this.ecouteur);
    j2.removeEventListener("keydown", this.ecouteur);
  }

  startRound(){
    clearTimeout(this.timer);
    this.readInputs = true;
    let timer = Math.random() * 5000 + 5000;
    this.timer = setTimeout(this.queue.bind(this), timer);
    let sfx = createjs.Sound.play("ambiance", {loop: 0, volume: 0.5});
  }

  queue(){
    this.readInputs = true;
    this.visualQueue.visible = true;
    let sfx = createjs.Sound.play("alert", {loop: 0, volume: 1});
  }

  nextRound(){
    this.joueurs.gotoAndStop("Start");
    this.startRound();
    this.visualQueue.visible = false;
  }

  

  fin(){
    let sfx = createjs.Sound.play("fin", {loop: 0, volume: 1});
    clearTimeout(this.timer);
    this.vicScreen.visible = true;
    if(this.scoreJoueur1 > this.scoreJoueur2){
      this.vicScreen.gotoAndPlay("VicP1")
    } else {
      this.vicScreen.gotoAndPlay("VicP2")
    }

    this.fonctionRestart = this.restart.bind(this);

    setTimeout(this.fonctionRestart, 6000)

  }

  restart(){

    let records = {
        j1: {
          nom: this.joueur1Nom,
          pointage: parseInt(this.scoreJoueur1)
        },
        j2: {
          nom: this.joueur2Nom,
          pointage: parseInt(this.scoreJoueur2)
        },
      };

    localStorage.setItem('records', JSON.stringify(records));

    this.rounds = 0;
    this.scoreJoueur1 = 0;
    this.scoreJoueur2 = 0;

    for (let i = 0; i<3; i++){
        this.ui.children[i].gotoAndStop("none")
    }

    this.visualQueue.visible = false;
    this.vicScreen.visible = false;
    this.joueurs.gotoAndStop("Start");

    this.startRound();
  }

}