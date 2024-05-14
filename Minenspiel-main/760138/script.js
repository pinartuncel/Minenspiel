window.addEventListener("load", function (){
  atom.start();
});

const atom = {
  
  start() {
  // Reset concatenated atom guess array
  document.getElementById("HiddenAtomsGuessHelpFlag").value = 'false';
  
    this.button();
    atom.boardBuild();
  },

  button() {
    const spiel = document.getElementById("spiel");
    const loesen = document.getElementById("lösen"); 

    spiel.addEventListener("click", () => {
  
  const board = document.querySelector(".game");
    let gewonnen = document.querySelector("#gewonnen");
    gewonnen.innerHTML = "";	
  
  // NEW CODE Start ********************************************************************************************************
  
  // Get difficulty of the game by the selection type
  let difficultyValue = document.getElementById("difficultySelection").value;		
      
  // 1. Client Request on Server (Fetch call) -> "New Game"
  // Hint: An asynchronous fetch call is implemented in order to wait for the promise response accordingly
  (async () => {
    
  // Reset concatenated atom guess array	  
  document.getElementById("HiddenAtomsGuessHelpFlag").value = 'false';	  
    
  // Disable interaction elements during server interaction	  
  document.getElementById("lösen").disabled = true;
  document.getElementById("difficultySelection").disabled = true;
    document.getElementById("HiddenServerRequestRunning").value = true;	  
  
    let baseURL = "https://www2.hs-esslingen.de/~melcher/atoms/?request=newgame&";
  let response = await fetch(baseURL + new URLSearchParams({
  difficulty: difficultyValue}));
  let serverResponse = await response.json();
  
  // Enable interaction elements after server interaction
  document.getElementById("lösen").disabled = false;
  document.getElementById("difficultySelection").disabled = false;
    document.getElementById("HiddenServerRequestRunning").value = false;	  
  
  // Get and save gameID across the session	  
  let gameID = serverResponse.gameid;
  document.getElementById("HiddenGameID").value = gameID;
  
  // Get further Server Response values
  let serverResponseStatus = serverResponse.status;
  let playgroundWidth = serverResponse.width;
  let playgroundHeight = serverResponse.height;
  let smallestPlaygroundWidth = false;
  
  // Save server dependent playground dimension over session
  let widthNumberPixel = playgroundWidth*50+100;
  let widthStringPixel = widthNumberPixel.toString().concat("px");
  document.getElementById("HiddenWidth").value = playgroundWidth;
          
  // Check whether Client Request was OK -> For a successful request, the playground is arranged dependent on the difficulty selected	   
  if(serverResponseStatus === 'ok'){
      
  alert('NewGame Server Response Status: ' + serverResponseStatus + '\nGame ID: ' + gameID + '\nServer Playground Height: ' + playgroundHeight + '\nPlayground Width: ' + playgroundWidth);

  // Playground width anf height as well as inner HTML text
  board.style.width = widthStringPixel;
  board.style.height = widthStringPixel;
  board.innerHTML = ""; 
  
    // Same function call as beforehand
  atom.boardBuild();  
  }
  // For a not successful request, the client will be informed accordingly
  else{
  alert('NewGame Server Response Status: ' + serverResponseStatus);
  }
  
  })();
  
  // NEW CODE End **********************************************************************************************************

    });

    loesen.addEventListener("click", () => { 

  // NEW CODE Start ********************************************************************************************************
  
  // Get actual gameID
  let gameID = document.getElementById("HiddenGameID").value;
  //let gameID = 'AAAA'; //(for testing whether gameID must be really correct for server communication)
  
    // Get array of arrays containing atom guess and convert it into JSON object
  let atomsGuess = document.getElementById("HiddenAtomsGuess").value; 	  
  let atomsGuessJson = JSON.parse(atomsGuess);
  
  // 3. Client Request on Server (Fetch call) -> "Solve"
  // Hint: An asynchronous fetch call is implemented in order to wait for the promise response accordingly		
    (async () => {

  // Disable interaction elements during server interaction
  document.getElementById("spiel").disabled = true;
  document.getElementById("difficultySelection").disabled = true;
    document.getElementById("HiddenServerRequestRunning").value = true;	  
    
  let baseURL = "https://www2.hs-esslingen.de/~melcher/atoms/?request=solve&";	  
  let response = await fetch(baseURL + new URLSearchParams({
  gameid:gameID,atoms:atomsGuessJson}));
  let serverResponse = await response.json();
  
  // Enable interaction elements after server interaction
  document.getElementById("spiel").disabled = false;
  document.getElementById("difficultySelection").disabled = false;
  document.getElementById("HiddenServerRequestRunning").value = false;
  
  // Get Server Response values
  let serverResponseStatus = serverResponse.status;
  let serverResponseCorrect = serverResponse.correct;
  let serverResponseAtoms = serverResponse.atoms;
  let serverResponseColution = serverResponse.colution;

  // Inform client about Server Response values				
  if(serverResponseStatus === 'ok'){
   alert('Solve Server Response Status: ' + serverResponseStatus + '\nCorrect?: ' + serverResponseCorrect + '\nReturned Atoms: ' + serverResponseAtoms + '\nColution: ' + serverResponseColution);
  }
  else{
     alert('Solve Server Response Status: ' + serverResponseStatus + '.\nGameID ' + gameID + ' used for server communication!!!');
  }	  
  
  })();

  // NEW CODE End **********************************************************************************************************
    
      let atom = document.getElementsByClassName("positiv");
      let set = document.getElementsByClassName("atome");
      let treffer = 0;
      for (let i = 0; i < set.length; i++) {
       set[i].style.backgroundColor = "red";
      }
      for (let i = 0; i < atom.length; i++) {
        if (atom[i].classList.contains("atome")) {
          atom[i].style.backgroundColor = "green";
          treffer++;
        } else {
          atom[i].style.backgroundColor = "red";
        }
      }
      if (treffer == atom.length && set.length === atom.length) {
        let container = document.querySelector("#gewonnen");
        let gewonnen = document.createElement("div");
        gewonnen.classList.add("gewonnen");
        gewonnen.innerHTML = "Du hast gewonnen, super :)";
        container.appendChild(gewonnen);
      } else {
        let container = document.querySelector("#gewonnen");
        let verloren = document.createElement("div");
        verloren.classList.add("verloren");
        verloren.innerHTML = "Du hast verloren :(";
        container.appendChild(verloren);
      }
    });
  },

  boardBuild() {
    let width = 7;
    const board = document.querySelector(".game");
  
  // Adjusted CODE Start ********************************************************************************************************
  
    if (board.style.width == "300px") width = 6;
    if (board.style.width == "350px") width = 7;
    if (board.style.width == "400px") width = 8;
    if (board.style.width == "450px") width = 9;
  if (board.style.width == "500px") width = 10;
  if (board.style.width == "550px") width = 11;
  
  // Adjusted CODE End ********************************************************************************************************

    for (let i = 0; i < width * width; i++) {
      let zelle = document.createElement("div");
      zelle.setAttribute("id", i);
      zelle.setAttribute("class", "cell");

      if ((i % width === 0 && i != 0 && i != width * width - width) || (i > 0 && i < width - 1) || (i > width * width - width && i < width * width - 1) || ((i + 1) % width === 0 && i != width - 1 && i != width * width - 1)) {
        zelle.classList.add("zelle");
      } else {
        zelle.classList.add("atomicfield");
      }

      if (i === 0 || i === width - 1 || i === width * width - width || i === width * width - 1)
      zelle.setAttribute("class", "cell");
      board.appendChild(zelle);
      zelle.addEventListener("click", (event) => this.onClick(event));
    }

    let atomicfield = document.querySelectorAll(".atomicfield");
    const min = 1;
    let max = 0;
    let maxcells = 0;
  
  // NEW CODE Start ********************************************************************************************************
  
  if (atomicfield.length % 16 === 0) { 
      maxcells = 4;
      max = 2;
      let randomfieldArray = [15,16,21,22];
      randomfieldArray.forEach((element) => {
        let randomfield = document
          .getElementById(element)
          .classList.add("randomfield");
      });
    } 
    if (atomicfield.length % 25 === 0) {
      maxcells = 9;
      max = 2;
      let randomfieldArray = [16, 17, 18, 23, 24, 25, 30, 31, 32];
      randomfieldArray.forEach((element) => {
        let randomfield = document
          .getElementById(element)
          .classList.add("randomfield");
      });
    }
    if (atomicfield.length % 36 === 0) {
      maxcells = 16;
      max = 3;
      let randomfieldArray = [18,19, 20,21,26,27,28,29,34,35,36,37,42,43,44,45,];
      randomfieldArray.forEach((element) => {
        let randomfield = document
          .getElementById(element)
          .classList.add("randomfield");
      });
    }
    if (atomicfield.length % 49 === 0) { 
      maxcells = 25;
      max = 3;
      let randomfieldArray = [20,21,22,23,24,29,30,31,32,33,38,39,40,41,42,47,48,49,50,51,56,57,58,59,60,];
      randomfieldArray.forEach((element) => {
        let randomfield = document
          .getElementById(element)
          .classList.add("randomfield");
      });
    } 
  if (atomicfield.length % 64 === 0) {
      maxcells = 36;
      max = 3;
      let randomfieldArray = [23,24,25,26,27,28,33,34,35,36,37,38,43,44,45,46,47,48,53,54,55,56,57,58,63,64,65,66,67,68,73,74,75,76,77,78,];
      randomfieldArray.forEach((element) => {
        let randomfield = document
          .getElementById(element)
          .classList.add("randomfield");
      });
    }
  if (atomicfield.length % 81 === 0) {
      maxcells = 49;
      max = 3;
      let randomfieldArray = [25,26,27,28,29,30,31,35,36,37,38,39,40,41,45,46,47,48,49,50,51,55,56,57,58,59,60,61,65,66,67,68,69,70,71,75,76,77,78,79,80,81,85,86,87,88,89,90,91,];
      randomfieldArray.forEach((element) => {
        let randomfield = document
          .getElementById(element)
          .classList.add("randomfield");
      });
    }
  
  // NEW CODE End ********************************************************************************************************
  
    let maxatoms = Math.floor(Math.random() * (max - min + 1)) + min;
    let atomArray = Array(maxatoms).fill("positiv");
    let emptyArray = Array(maxcells - maxatoms).fill("leer");
    let gameArray = emptyArray.concat(atomArray);
    let shuffledArray = gameArray.sort(() => Math.random() - 0.5);
    let randomfield = document.getElementsByClassName("randomfield");

    for (let i = 0; i < maxcells; i++)
      randomfield[i].classList.add(shuffledArray[i]);
  },

  onClick(event) {
  
  let isServerRequestRunning = (document.getElementById("HiddenServerRequestRunning").value == 'true');
  
  if(isServerRequestRunning === false){	
  
    let width = 7;
    const board = document.querySelector(".game");

  // Adjusted CODE Start ********************************************************************************************************

    if (board.style.width == "300px") width = 6;
    if (board.style.width == "350px") width = 7;
    if (board.style.width == "400px") width = 8;
    if (board.style.width == "450px") width = 9;
  if (board.style.width == "500px") width = 10;
  if (board.style.width == "550px") width = 11;
  
  // Adjusted CODE End ********************************************************************************************************

    const clickedField = event.target;
    let idAkt = clickedField.getAttribute("id");
    let ZelleAkt = document.getElementById(parseInt(idAkt));
    const b = document.querySelector(".zelle");
    let cell = document.querySelectorAll(".cell");

    for (let i = 0; i < cell.length; i++) {
      if (i != idAkt) {
        let pfeile = document.getElementById(i);
        pfeile.classList.remove("doppel");
        pfeile.classList.remove("doppel2");
        pfeile.classList.remove("prechts");
        pfeile.classList.remove("pUnten");
        pfeile.classList.remove("pOben");
        pfeile.classList.remove("pLinks");
      }
    }

    let feld = document.getElementById(parseInt(idAkt));
    let feldSec = document.getElementById(parseInt(idAkt));
    let feld3 = document.getElementById(parseInt(idAkt));
    let counter = 0;
    let links = idAkt % width === 0;
    let rechts = (parseInt(idAkt) + 1) % width === 0;
    let oben = idAkt > 0 && idAkt < width;
    let unten = idAkt > width * width - width && idAkt < width * width - 1;	

  // NEW CODE Start ********************************************************************************************************
  
  // Determine "Shoot" field index as well as corresponding orientation {left,right,top,bottom}
  let orientationInserted;
  if(links){
    let idAktTemp = idAkt / width - 1;
    pos = parseInt(idAktTemp);
    orientationInserted = 'left';
  }
  if(rechts){
    let idAktTemp = (parseInt(idAkt) + 1) / width - 2;
    pos = parseInt(idAktTemp);
    orientationInserted = 'right';
  }
  if(oben){
    let idAktTemp = idAkt - 1;
    pos = parseInt(idAktTemp);
    orientationInserted = 'top';
  }
  if(unten){
    let idAktTemp = idAkt % width - 1;
    pos = parseInt(idAktTemp);
    orientationInserted = 'bottom';
  }
  
  // Get actual gameID
  let gameID = document.getElementById("HiddenGameID").value;
  //let gameID = 'AAAA'; //(for testing whether gameID must be really correct for server communication)
  
  // Only in case "Shoot" fiels are selected ...
  if(links || rechts || oben || unten){

  // 2. Client Request on Server (Fetch call) -> "Shoot"
  // Hint: An asynchronous fetch call is implemented in order to wait for the promise response accordingly	  
    (async () => {
  
    // Disable interaction elements during server interaction
        document.getElementById("spiel").disabled = true;
    document.getElementById("lösen").disabled = true;
      document.getElementById("difficultySelection").disabled = true;
        
    let baseURL = "https://www2.hs-esslingen.de/~melcher/atoms/?request=shoot&";	  
    let response = await fetch(baseURL + new URLSearchParams({
    gameid:gameID,side:orientationInserted,position:pos}));
    let serverResponse = await response.json();
    
    // Enable interaction elements after server interaction
    document.getElementById("spiel").disabled = false;
    document.getElementById("lösen").disabled = false;
      document.getElementById("difficultySelection").disabled = false;


    // Get Server Response values
    let serverResponseStatus = serverResponse.status;
    let serverResponseSide = serverResponse.side;
    let serverResponsePosition = serverResponse.position;

    // Inform client about Server Response values				
    if(serverResponseStatus === 'ok'){
      alert('Shoot Server Response Status: ' + serverResponseStatus + '\nExit Side: ' + serverResponseSide + '\nExit Position: ' + serverResponsePosition);
    }
    else{
     alert('Shoot Server Response Status: ' + serverResponseStatus + '.\nGameID ' + gameID + ' used for server communication!!!');
    }
    
    })();
  }

  // NEW CODE End **********************************************************************************************************


    if (clickedField.getAttribute("class") === b.getAttribute("class")) {
      if (links) {
        while (feld.classList.contains("positiv") == false && feldSec.classList.contains("positiv") == false) {
          feld = document.getElementById(parseInt(idAkt) + 1);
          if (feld.classList.contains("positiv")) {
            clickedField.classList.add("doppel");
            setTimeout(() => {
              clickedField.classList.remove("doppel");
            }, atom.ms);
            break;
          }
          
          if (idAkt >= width * 2){
            feld = document.getElementById(parseInt(idAkt) - (width - 1));
            if (feld.classList.contains("positiv")) {
              counter++;
            }
          }
          if (idAkt < width * width - width * 2 - 2) {
            feldSec = document.getElementById(parseInt(idAkt) + (width + 1));
            if (feldSec.classList.contains("positiv")) {
              counter += 2;
            }
          }

          if (counter === 1) {
            clickedField.classList.add("prechts");
            while (ZelleAkt.classList.contains("zelle") == false) {
              feld3 = document.getElementById(idAkt + width + 1);
              if (feld3.classList.contains("positiv")) {
                while (ZelleAkt.classList.contains("zelle") == false) {
                  idAkt--;
                  ZelleAkt = document.getElementById(idAkt);
                }
              } else {
                idAkt = idAkt + width;
                ZelleAkt = document.getElementById(idAkt);
                console.log(idAkt);
              }
            }

            idAkt % width === 0
              ? ZelleAkt.classList.add("pLinks")
              : ZelleAkt.classList.add("pUnten");

            setTimeout(() => {
              clickedField.classList.remove("prechts");
              ZelleAkt.classList.remove("pUnten");
              ZelleAkt.classList.remove("pLinks");
            }, atom.ms);
            break;
          }

          if (counter === 2) {
            clickedField.classList.add("prechts");
            while (ZelleAkt.classList.contains("zelle") == false) {
              feld3 = document.getElementById(idAkt - (width - 1));
              if (feld3.classList.contains("positiv")) {
                while (ZelleAkt.classList.contains("zelle") == false) {
                  idAkt--;
                  ZelleAkt = document.getElementById(idAkt);
                }
              } else {
                idAkt = idAkt - width;
                ZelleAkt = document.getElementById(idAkt);
              }
            }
            idAkt % width === 0
              ? ZelleAkt.classList.add("pLinks")
              : ZelleAkt.classList.add("pOben");

            setTimeout(() => {
              clickedField.classList.remove("prechts");
              ZelleAkt.classList.remove("pOben");
              ZelleAkt.classList.remove("pLinks");
            }, atom.ms);
            break;
          }
          if (counter === 3) {
            clickedField.classList.add("doppel");

            setTimeout(() => {
              clickedField.classList.remove("doppel");
            }, atom.ms);
            break;
          }

          idAkt = parseInt(idAkt) + 1;
          ZelleAkt = document.getElementById(idAkt);

          if (ZelleAkt.classList.contains("zelle")) {
            clickedField.classList.add("prechts");
            ZelleAkt.classList.add("prechts");
            setTimeout(() => {
              clickedField.classList.remove("prechts");
              ZelleAkt.classList.remove("prechts");
            }, atom.ms);
            return;
          }
        }
      }
      if (rechts) {
        while (feld.classList.contains("positiv") == false && feldSec.classList.contains("positiv") == false) {
          feld = document.getElementById(parseInt(idAkt) - 1);
          if (feld.classList.contains("positiv")) {
            clickedField.classList.add("doppel");
            setTimeout(() => {
              clickedField.classList.remove("doppel");
            }, atom.ms);
            break;
          }
         
          if (idAkt > width + width + 1) {
            feld = document.getElementById(parseInt(idAkt) - (width + 1));
            if (feld.classList.contains("positiv")) {
              counter++;
            }
          }
         
          if (idAkt < width * width - width * 2) {
            feldSec = document.getElementById(parseInt(idAkt) + (width - 1));
            if (feldSec.classList.contains("positiv")) {
              counter += 2;
            }
          }

          if (counter === 1) {
            clickedField.classList.add("pLinks");
            while (ZelleAkt.classList.contains("zelle") == false) {
              feld3 = document.getElementById(idAkt + (width - 1));
              if (feld3.classList.contains("positiv")) {
                while (ZelleAkt.classList.contains("zelle") == false) {
                  idAkt++;
                  ZelleAkt = document.getElementById(idAkt);
                }
              } else {
                idAkt = idAkt + width;
                ZelleAkt = document.getElementById(idAkt);
              }
            }
            (idAkt + 1) % width === 0
              ? ZelleAkt.classList.add("prechts")
              : ZelleAkt.classList.add("pUnten");

            setTimeout(() => {
              ZelleAkt.classList.remove("pUnten");
              clickedField.classList.remove("pLinks");
              ZelleAkt.classList.remove("prechts");
            }, atom.ms);
            break;
          }
          if (counter === 2) {
            clickedField.classList.add("pLinks");
            while (ZelleAkt.classList.contains("zelle") == false) {
              feld3 = document.getElementById(idAkt - (width + 1));
              if (feld3.classList.contains("positiv")) {
                while (ZelleAkt.classList.contains("zelle") == false) {
                  idAkt++;
                  ZelleAkt = document.getElementById(idAkt);
                }
              } else {
                idAkt = idAkt - width;
                ZelleAkt = document.getElementById(idAkt);
              }
            }
            (idAkt + 1) % width === 0
              ? ZelleAkt.classList.add("prechts")
              : ZelleAkt.classList.add("pOben");

            setTimeout(() => {
              clickedField.classList.remove("pLinks");
              ZelleAkt.classList.remove("pOben");
              ZelleAkt.classList.remove("prechts");
            }, atom.ms);
            break;
          }
          if (counter === 3) {
            clickedField.classList.add("doppel");
            setTimeout(() => {
              clickedField.classList.remove("doppel");
            }, atom.ms);
            break;
          }

          idAkt = parseInt(idAkt) - 1;
          ZelleAkt = document.getElementById(idAkt);

          if (ZelleAkt.classList.contains("zelle")) {
            clickedField.classList.add("pLinks");
            ZelleAkt.classList.add("pLinks");
            setTimeout(() => {
              clickedField.classList.remove("pLinks");
              ZelleAkt.classList.remove("pLinks");
            }, atom.ms);
            return;
          }
        }
      }
      if (oben) {
        while (
          feld.classList.contains("positiv") == false && feldSec.classList.contains("positiv") == false) {
          feld = document.getElementById(parseInt(idAkt) + width);
          if (feld.classList.contains("positiv")) {
            clickedField.classList.add("doppel2");
            setTimeout(() => {
              clickedField.classList.remove("doppel2");
              ZelleAkt.classList.remove("pUnten");
            }, atom.ms);
            break;
          }
        
          if (idAkt < width * width - width * 2 - 1) {
            feld = document.getElementById(parseInt(idAkt) + (width - 1));
            if (feld.classList.contains("positiv")) {
              counter++;
            }
          }
          if (idAkt < width * width - width * 2 - 2) {
            feldSec = document.getElementById(parseInt(idAkt) + (width + 1));
            if (feldSec.classList.contains("positiv")) {
              counter += 2;
            }
          }

          if (counter === 1) {
            clickedField.classList.add("pUnten");
            while (ZelleAkt.classList.contains("zelle") == false) {
              feld3 = document.getElementById(idAkt + (width + 1));
              if (feld3.classList.contains("positiv")) {
                while (ZelleAkt.classList.contains("zelle") == false) {
                  idAkt = idAkt - width;
                  ZelleAkt = document.getElementById(idAkt);
                }
              } else {
                idAkt++;
                ZelleAkt = document.getElementById(idAkt);
              }
            }
            if (idAkt > 0 && idAkt < width) {
              ZelleAkt.classList.add("pOben");
            } else {
              ZelleAkt.classList.add("prechts");
            }

            setTimeout(() => {
              clickedField.classList.remove("pUnten");
              ZelleAkt.classList.remove("prechts");
              ZelleAkt.classList.remove("pOben");
            }, atom.ms);
            break;
          }
          if (counter === 2) {
            clickedField.classList.add("pUnten");
            while (ZelleAkt.classList.contains("zelle") == false) {
              feld3 = document.getElementById(idAkt + (width - 1));
              if (feld3.classList.contains("positiv")) {
                while (ZelleAkt.classList.contains("zelle") == false) {
                  idAkt = idAkt - width;
                  ZelleAkt = document.getElementById(idAkt);
                }
              } else {
                idAkt--;
                ZelleAkt = document.getElementById(idAkt);
              }
            }

            if (idAkt > 0 && idAkt < width) {
              ZelleAkt.classList.add("pOben");
            } else {
              ZelleAkt.classList.add("pLinks");
            }
            setTimeout(() => {
              clickedField.classList.remove("pUnten");
              ZelleAkt.classList.remove("pLinks");
              ZelleAkt.classList.remove("pOben");
            }, atom.ms);
            break;
          }
          if (counter === 3) {
            clickedField.classList.add("doppel2");

            setTimeout(() => {
              clickedField.classList.remove("doppel2");
            }, atom.ms);
            break;
          }

          idAkt = parseInt(idAkt) + width;
          ZelleAkt = document.getElementById(idAkt);

          if (ZelleAkt.classList.contains("zelle")) {
            clickedField.classList.add("pUnten");
            ZelleAkt.classList.add("pUnten");
            setTimeout(() => {
              clickedField.classList.remove("pUnten");
              ZelleAkt.classList.remove("pUnten");
            }, atom.ms);
            return;
          }
        }
      }
      if (unten) {
        while (feld.classList.contains("positiv") == false && feldSec.classList.contains("positiv") == false) {
          feld = document.getElementById(parseInt(idAkt) - width);
          if (feld.classList.contains("positiv")) {
            clickedField.classList.add("doppel2");
            setTimeout(() => {
              clickedField.classList.remove("doppel2");
            }, atom.ms);
            break;
          }
          if (idAkt > width + width) {
            feld = document.getElementById(parseInt(idAkt) - (width - 1));
            if (feld.classList.contains("positiv")) {
              counter++;
            }
          }
          if (idAkt > width + width + 1) {
            feldSec = document.getElementById(parseInt(idAkt) - (width + 1));
            if (feldSec.classList.contains("positiv")) {
              counter += 2;
            }
          }

          if (counter === 1) {
            clickedField.classList.add("pOben");
            while (ZelleAkt.classList.contains("zelle") == false) {
              feld3 = document.getElementById(idAkt - (width + 1));
              if (feld3.classList.contains("positiv")) {
                while (ZelleAkt.classList.contains("zelle") == false) {
                  idAkt = idAkt + width;
                  ZelleAkt = document.getElementById(idAkt);
                }
              } else {
                idAkt--;
                ZelleAkt = document.getElementById(idAkt);
              }
            }
            if (idAkt > width * width - width && idAkt < width * width - 1) {
              ZelleAkt.classList.add("pUnten");
            } else {
              ZelleAkt.classList.add("pLinks");
            }
            setTimeout(() => {
              clickedField.classList.remove("pOben");
              ZelleAkt.classList.remove("pLinks");
              ZelleAkt.classList.remove("pUnten");
            }, atom.ms);
            break;
          }
          if (counter === 2) {
            clickedField.classList.add("pOben");
            while (ZelleAkt.classList.contains("zelle") == false) {
              feld3 = document.getElementById(idAkt - (width - 1));
              if (feld3.classList.contains("positiv")) {
                while (ZelleAkt.classList.contains("zelle") == false) {
                  idAkt = idAkt + width;
                  ZelleAkt = document.getElementById(idAkt);
                }
              } else {
                idAkt++;
                ZelleAkt = document.getElementById(idAkt);
              }
            }
            if (idAkt > width * width - width && idAkt < width * width - 1) {
              ZelleAkt.classList.add("pUnten");
            } else {
              ZelleAkt.classList.add("prechts");
            }
            setTimeout(() => {
              clickedField.classList.remove("pOben");
              ZelleAkt.classList.remove("prechts");
              ZelleAkt.classList.remove("pUnten");
            }, atom.ms);
            break;
          }
          if (counter === 3) {
            clickedField.classList.add("doppel2");

            setTimeout(() => {
              clickedField.classList.remove("doppel2");
            }, atom.ms);
            break;
          }

          idAkt = parseInt(idAkt) - width;
          ZelleAkt = document.getElementById(idAkt);
    

          if (ZelleAkt.classList.contains("zelle")) {
            clickedField.classList.add("pOben");
            ZelleAkt.classList.add("pOben");
            setTimeout(() => {
              clickedField.classList.remove("pOben");
              ZelleAkt.classList.remove("pOben");
            }, atom.ms);
            return;
          }
        }
      }
    } else {
    
  // NEW CODE Start ********************************************************************************************************
  
  // Determine "in field" index in x and y coordinates
  y = parseInt(idAkt / width);
  x = parseInt(idAkt - y*width);
  
  // Save x and y into array
  item = [x,y];
  
  // Determine array of arrays containing atom guesses 
  let isTrueSet = (document.getElementById("HiddenAtomsGuessHelpFlag").value == 'false');
  if( isTrueSet === true){
    document.getElementById("HiddenAtomsGuessHelpFlag").value = 'true';
    let items = [];
    items.push(item);
    document.getElementById("HiddenAtomsGuess").value = items;
    let temp = document.getElementById("HiddenAtomsGuess").value;
    let json = JSON.parse("[[" + temp + "]]");
    document.getElementById("HiddenAtomsGuess").value = JSON.stringify(json);
  }
  else{
    let temp = document.getElementById("HiddenAtomsGuess").value;
    let json = JSON.parse(temp);
    json.push(item);
    document.getElementById("HiddenAtomsGuess").value = JSON.stringify(json);
  }
  //alert('Atom Guess (actual): ' + document.getElementById("HiddenAtomsGuess").value);
    alert(document.getElementById("HiddenAtomsGuess").value);

  // NEW CODE End **********************************************************************************************************
  
      ZelleAkt.classList.contains("atome") == false
        ? ZelleAkt.classList.add("atome")
        : ZelleAkt.classList.remove("atome");
    }
  }
  },
  width: 7,
  ms: 1500,
};