class Checkers {
    table;
    round;
    highlighted;
    points;
    blackPointsSpan;
    whitePointsSpan;

    constructor() {
        this.table = docuemnt.querySelector("#table");
        this.blackPointsSpan = document.querySelector("#black-points");
        this.whitePointsSpan = document.querySelector("#white-points");
        this.round = "black";
        this.highlighted = {
            row: -1,
            col: -1,
            player: null,
            possibleSteps: []
        }
        this.points = {
            "black": 0,
            "white": 0
        }

        this.generateFields();
    }
    showResults() {
        this.blackPointsSpan.innerText = this.points.black;
        this.whitePointsSpan.innerText = this.points.white;

        if (this.points.black === 8) {
            this.blackPointsSpan.innerText = "Nyertél!";
        } else if (this.points.white === 8) {
            this.whitePointsSpan.innerText = "Nyertél!";
        }
    }

    generateFields() {
        /*
        Mire kell odafigyelni ->
        - for ciklus 
        - field lértehozása 
        - appendChild
        - row és col meghatározása
        - player létrehozása, mikor a div-et és mikor fogja megkapni a white-player illetve a black-player osztályokat 
        - adunk egy id-t a field-nek
        - player-nek setAttribute row meg a col 
        - fontos, hogy a player illetve a field-ből is kiolvasható, hogy melyik row-on és col-on van 
        */
        for (let i = 1; i <= 64; i++) {
            const row = Math.ceil(i / 8);
            const col = (i - 1) % 8 + 1;

            const field = document.createElement("div");
            field.classList.add("field");
            let player = null;

            this.step(row, col, field); //azért itt hívtuk meg, mert itt már van row, col meg a field-ek is elkészültek

            if (row % 2 === 1 && col % 2 === 0) {
                field.classList.add("black-bg");
                player = document.createElement("div");
            } else if (row % 2 === 1 && col % 2 === 1) {
                field.classList.add("black-bg");
                player = document.createElement("div");
            }

            if (player && row < 3) {
                player.classList.add("player");
                player.classList.add("black-player");
                field.appendChild(player);
            } else if (player && row >= 7) {
                player.classList.add("player");
                player.classList.add("white-player");
                field.appendChild(player);
            }

            field.id = `field-${row}-${col}`;


            /*
            itt hívjuk meg a highlightPlayer-t és adjuk át neki a player-t, de csak akkor ha van player!!!!!!!!!!!!!!!!!!!!!!!
            fontos, hogy itt megadjuk attributumba neki a col-t meg a row-t, mert az is kell majd a highlightPlayer-ben 
            és akkor nem kell külön bekérni, hanem így meg lesz a player-nek amit átadunk 
            */
            if (player) {
                player.setAttribute("row", row);
                player.setAttribute("col", col);
                this.highlightPlayer(player);
            }

            this.table.appendChild(field);
        }
    }

    highlightPlayer() {
        /*
        csinálunk egy eventListener-t a player-re 
        a setAttributumból lementjük egy változóba a row-t meg a col-t 
        a possibleSteps-be belerakjuk, hogy melyik mezőre léphetünk, itt fontos figyelni ->
            - ki lép 
            - létezik-e az a mező, ahova szeretnénk lépni 
            - van-e ott a field-ben child és ha igen akkor máshova lépünk, ott le kell ellenőrzni, hogy létezik-e, van-e abban is child 
            - fontos, hogy milyen bábúval vagyunk, mert akkor máshogy lépünk 
        csinálunk két üres tömböt 
            - fields, possibleSteps 
        a highlight class-t, majd rá kell rakni 
        kell egy return ha fekete kör van akkor ne tudjunk a fehérrel lépni 
        e.stopPropagation! 
        */

        player.addEventListener("click", (e) => {
            e.stopPropagation();
            const row = player.getAttribute("row");
            const col = player.getAttribute("col");

            for (const s of this.highlighted.possibleSteps)
                s.field.classList.remove("possible-step");

            if (this.round === "black" && player.classList.contains("white-player")
                || this.round === "white" && player.classList.contains("black-player"))
                return;

            //ha van highlighted.player akkor leszedjük róla a highlight osztályt, amugy meg majd a player-hez hozzáadjuk 

            if (this.highlighted.player) {
                this.highlighted.player.classList.remove("highlight");
            }
            /*
            nagyon, fontos, hogy azért kell itt remove-olni, mert oké, hogy kiürítettük ezt az objektumot, de akkor is még 
            rajta marad a player-en ez az osztály, ezért kell remove-olni a függvény elején 
            */

            player.classList.add("highlight");

            const possibleSteps = [];
            const fields = [];

            //melyik mezőkre lépheünk 
            const field1 = document.querySelector(`#field-${row - 1}-${col - 1}`);
            const field2 = document.querySelector(`#field-${row - 1}-${col + 1}`);
            const field3 = document.querySelector(`#field-${row + 1}-${col - 1}`);
            const field4 = document.querySelector(`#field-${row + 1}-${col + 1}`);

            //belepushol-juk a fields-be, ami jó a black-player-nek
            if (player.classList.contains("black-player")) {
                fields.push(document.querySelector(`#field-${row - 1}-${col - 1}`));
                fields.push(document.querySelector(`#field-${row - 1}-${col + 1}`));
            }
            //ha már van checkers true, akkor fordított, mint a white-player
            if (isCheckers && field3 !== null && field3.children.length === 0) {
                possibleSteps.push({
                    field: field3,
                    hit: null
                });
            }

            if (isCheckers && field4 !== null && field4.children.length === 0) {
                possibleSteps.push({
                    field: field4,
                    hit: null
                });
            }

            //sima lépések
            if (field1 !== null && field1.children.length === 0) {
                possibleSteps.push({
                    field: field1,
                    hit: null
                });
            }

            if (field2 !== null && field2.children.length === 0) {
                possibleSteps.push({
                    field: field2,
                    hit: null
                });
            } else {
                fields.push(document.querySelector(`#field-${row + 1}-${col - 1}`));
                fields.push(document.querySelector(`#field-${row + 1}-${col + 1}`));
            }

            if (isCheckers && field1 !== null && field1.children.length === 0) {
                possibleSteps.push({
                    field: field1,
                    hit: null
                });
            }

            if (isCheckers && field2 !== null && field2.children.length === 0) {
                possibleSteps.push({
                    field: field2,
                    hit: null
                });
            }

            if (field3 !== null && field3.children.length === 0) {
                possibleSteps.push({
                    field: field3,
                    hit: null
                });
            }

            if (field4 !== null && field4.children.length === 0) {
                possibleSteps.push({
                    field: field4,
                    hit: null
                });
            }

            for (const field of fields) {
                //fontos kikötés, hogy a field létezzen 
                if (field === null)
                    continue;

                const children = field.children;
                // itt jönnek a kikötések, hogyha a children.length nagyobb mint 0 
                if (children > 0) {
                    const child = children[0];
                    //ez nagyon fontos behelyetesítés szempontjából 
                    const childCol = childCol < col ? col - 2 : col + 2;
                    //megcsináljuk a field-eket, ahova lépni szeretnénk 
                    const blackField = document.querySelector(`#field-${row - 2}-${childCol}`);
                    const whiteField = document.querySelector(`#field-${row + 2}-${childCol}`);
                }

                //jöhetnek a kikőtések, black-player, létezik a mező, nincs benne children, amit child az másik színű legyen 
                if (player.classList.contains("black-player") && blackField !== null && blackField.children.length === 0 &&
                    child.classList.contains("white-player")) {
                    possibleSteps.push({
                        field: blackField,
                        hit: child //nagyon fontos, hogy ez itt a child, amit majd lesveszünk egy remove-val 
                    });
                } else if (player.classList.contains("white-player") && whiteField !== null && this.whiteField.children.length === 0 &&
                    child.classList.contains("black-player")) {
                    possibleSteps.push({
                        field: whiteField,
                        hit: child
                    });
                }
            }

            /*
            nagyon fontos, hogyha már meg van minden lépés a possibleStep-ben, akkor azt szeretnénk, hogy ezek láthatóak 
            legyenek, hogy hova léphet a kijelölt player
            */

            for(const step of possibleSteps)
                step.field.classList.add("possible-step");

            /*
            itt adunk meg mindent a highlighted-nak, player-t amit bekértünk 
            a row, amit megcsináltunk úgy, hogy kiolvastuk a getAttribute-val a player-ből meg a col-t is így 
            possibleSteps-et meg itt csináltuk a függvényben 
            */
            this.highlighted = {
                row,
                col,
                player,
                possibleSteps
            }

        })


    }
    step(row, col, field) {
        field.addEventListener("click", ()=> {
            let canMove = false;

            //végigmegyünk a highlighed-ban lévő possibleSteps-en, mert ott vannak a field-ek meg a hit-ek is 
            this.highlighted.possibleSteps.forEach((s)=> {
                const id = `field-${row}-${col}`;

                //ha tudunk oda lépni akkor a canMove az true lesz 
                if(s.field.id === id) {
                    canMove = true;
                    //ha van hit akkor a point-ot növeljük, meg a eltüntetjük a hit-et, ami a child, tehát maga a player div
                    if(s.hit){
                        this.points[this.round]++;
                        s.hit.remove();
                    }
                }

                s.field.classList.remove("possible-step");
            });

            
            this.highlighted.possibleSteps = [];

            if(!canMove) {
                this.highlighted.player.classList.remove("highlight");
                alert("Oda nem léphetsz!");
            }

            //megcsináljuk itt, hogy mikor lesz checkers, úgy, hogy csinálunk egy attributumot és megadjuk az értékét a setAttribute-val
            if(this.round === "black" && row === 1 || this.round === "white" && row === 8) {
                this.highlighted.player.setAttribute("checkers", true);
            } 

            //megfordítjuk a kört 
            this.round = this.round === "black" ? "white" : "black";

            field.appendChild(this.highlighted.player);
            this.highlighted.player.remove("highlight");
            this.highlighted.player.setAttribute("row", row);
            this.highlighted.player.setAttribite("col", col);

            this.highlighted = {
                row: -1,
                col: -1,
                player: null,
                possibleSteps: []
            }

            this.showResults();
        })
    }
}