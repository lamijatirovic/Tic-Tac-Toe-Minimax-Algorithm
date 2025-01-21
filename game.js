        var c=document.getElementById("canvas");
	    var ctx=c.getContext("2d");

        // Funkcija za crtanje podloge sa 3x3 mrežom
        function podloga() {
	   	   ctx.lineWidth=5;
		   ctx.strokeStyle="rgba(0, 0, 0, 0.8)";
				for(let i=0; i<3; i++){
					for(let j=0; j<3; j++){
						ctx.strokeRect(j*100, i*100, 100, 100);
					}
				}
		}
		podloga();

		function crtajx(x, y){
			ctx.strokeStyle="rgb(249, 111, 108)";
			ctx.beginPath();
			ctx.moveTo(x+20, y+20);
			ctx.lineTo(x+80, y+80, 60, 60);
			ctx.moveTo(x+80, y+20);
			ctx.lineTo(x+20, y+80, 60, 60);
			ctx.stroke();
		}
		function crtajo(x, y){
			ctx.strokeStyle="rgb(72, 226, 244)";
			ctx.beginPath();
			ctx.arc(x+50, y+50, 30, 0, 2 * Math.PI);
			ctx.stroke();
		}

        // Varijable za praćenje stanja igre
        var turnxo = "x"; // Trenutni igrač
        var ai_X_ili_O = ""; // Oznaka AI igrača ("x" ili "o")

        // Nizovi za čuvanje zauzetih polja
        var zauzetiX = [];
        var zauzetiO = [];

        // Funkcija za provjeru pobjede za "X"
		function pobjedaZaX(zauzetix){
		    if((sadrzi2(0, 0, zauzetix) && sadrzi2(100, 0, zauzetix) && sadrzi2(200, 0, zauzetix)) ||
			   (sadrzi2(0, 100, zauzetix) && sadrzi2(100, 100, zauzetix) && sadrzi2(200, 100, zauzetix)) ||
			   (sadrzi2(0, 200, zauzetix) && sadrzi2(100, 200, zauzetix) && sadrzi2(200, 200, zauzetix)) ||
			   (sadrzi2(0, 0, zauzetix) && sadrzi2(0, 100, zauzetix) && sadrzi2(0, 200, zauzetix)) ||
			   (sadrzi2(100, 0, zauzetix) && sadrzi2(100, 100, zauzetix) && sadrzi2(100, 200, zauzetix)) ||
			   (sadrzi2(200, 0, zauzetix) && sadrzi2(200, 100, zauzetix) && sadrzi2(200, 200, zauzetix)) ||
			   (sadrzi2(0, 0, zauzetix) && sadrzi2(100, 100, zauzetix) && sadrzi2(200, 200, zauzetix)) ||
			   (sadrzi2(200, 0, zauzetix) && sadrzi2(100, 100, zauzetix) && sadrzi2(0, 200, zauzetix)) ){
				return true;
			}else{
				return false;
			}
		}

        // Funkcija za provjeru pobjede za "O"
		function pobjedaZaO(zauzetio){
		    if((sadrzi2(0, 0, zauzetio) && sadrzi2(100, 0, zauzetio) && sadrzi2(200, 0, zauzetio)) ||
			   (sadrzi2(0, 100, zauzetio) && sadrzi2(100, 100, zauzetio) && sadrzi2(200, 100, zauzetio)) ||
			   (sadrzi2(0, 200, zauzetio) && sadrzi2(100, 200, zauzetio) && sadrzi2(200, 200, zauzetio)) ||
			   (sadrzi2(0, 0, zauzetio) && sadrzi2(0, 100, zauzetio) && sadrzi2(0, 200, zauzetio)) ||
			   (sadrzi2(100, 0, zauzetio) && sadrzi2(100, 100, zauzetio) && sadrzi2(100, 200, zauzetio)) ||
			   (sadrzi2(200, 0, zauzetio) && sadrzi2(200, 100, zauzetio) && sadrzi2(200, 200, zauzetio)) ||
			   (sadrzi2(0, 0, zauzetio) && sadrzi2(100, 100, zauzetio) && sadrzi2(200, 200, zauzetio)) ||
			   (sadrzi2(200, 0, zauzetio) && sadrzi2(100, 100, zauzetio) && sadrzi2(0, 200, zauzetio)) ){
		    	return true
			}else{
				return false;
			}
		}

        // Funkcija za provjeru izjednačenja
		function izjednaceno(zauzetix, zauzetio){
			if(!pobjedaZaO(zauzetio) && !pobjedaZaX(zauzetix) && zauzetix.length + zauzetio.length>=9){
				return true;
			}else{
				return false;
			}
		}

		function evaluacijaPloce(zauzetix, zauzetio){
			var bodovi = 150;
			var prazno = 9 - zauzetix.length-zauzetio.length;
			if(ai_X_ili_O == "x"){
				if(pobjedaZaX(zauzetix)){
					bodovi += 20 + prazno;
				}else if(pobjedaZaO(zauzetio)){
					bodovi += -20 - prazno;
				}else if(izjednaceno(zauzetix, zauzetio)){
					bodovi += 2;
				}
			}else if(ai_X_ili_O == "o"){
				if(pobjedaZaO(zauzetio)){
					bodovi += 20 + prazno;
				}else if(pobjedaZaX(zauzetix)){
					bodovi += -20 - prazno;
				}else if(izjednaceno(zauzetix, zauzetio)){
					bodovi += 2;
				}
			}
			return bodovi;
		}

        // Implementacija Minimax algoritma za pronalaženje najboljeg poteza
		function minmax(zauzetix, zauzetio, isMax){
			if(evaluacijaPloce(zauzetix, zauzetio)!=150){
				return evaluacijaPloce(zauzetix, zauzetio);
			}
			if(isMax && ai_X_ili_O=="x"){
				let best = -1000;
				for(let i=0; i<300; i=i+100){
					for(let j=0; j<300; j=j+100){
						if(!sadrzi(i, j, zauzetix, zauzetio)){
							let l=[];
							l.push(i);
							l.push(j);
							zauzetix.push(l);
							best = Math.max(best, minmax(zauzetix, zauzetio, !isMax));
							zauzetix.pop();
						}
					}
				}return best;
			}else if(isMax && ai_X_ili_O=="o"){
				let best = -1000;
				for(let i=0; i<300; i=i+100){
					for(let j=0; j<300; j=j+100){
						if(!sadrzi(i, j, zauzetix, zauzetio)){
							let l=[];
							l.push(i);
							l.push(j);
							zauzetio.push(l);
							best = Math.max(best, minmax(zauzetix, zauzetio, !isMax));
							zauzetio.pop();
						}
					}
				}return best;
			}else if(!isMax && ai_X_ili_O=="x"){
				let best = 1000;
				for(let i=0; i<300; i=i+100){
					for(let j=0; j<300; j=j+100){
						if(!sadrzi(i, j, zauzetix, zauzetio)){
							let l=[];
							l.push(i);
							l.push(j);
							zauzetio.push(l);
							best = Math.min(best, minmax(zauzetix, zauzetio, !isMax));
							zauzetio.pop();
						}
					}
				}return best;
			}else if(!isMax && ai_X_ili_O=="o"){
				let best = 1000;
				for(let i=0; i<300; i=i+100){
					for(let j=0; j<300; j=j+100){
						if(!sadrzi(i, j, zauzetix, zauzetio)){
							let l=[];
							l.push(i);
							l.push(j);
							zauzetix.push(l);
							best = Math.min(best, minmax(zauzetix, zauzetio, !isMax));
							zauzetix.pop();
						}
					}
				}return best;				
			}
		}

        // Funkcija za pronalaženje najboljeg poteza AI-a
		function findBestMove(zauzetix, zauzetio){
		    let bestVal = -1000;
		    let bestMove = [];
		    bestMove.push(-1);
		    bestMove.push(-1);

		    for(let i = 0; i < 300; i=i+100){
		        for(let j = 0; j < 300; j=j+100){// Check if cell is empty
		            if (!sadrzi(i, j, zauzetix, zauzetio)){
		                 if(ai_X_ili_O=="x"){
		                 	let l=[];
							l.push(i);
							l.push(j);
							zauzetix.push(l);
							let moveVal = minmax(zauzetix, zauzetio, false);
							zauzetix.pop();
						    if (moveVal > bestVal){
			                    bestMove[0] = i;
			                    bestMove[1] = j;
			                    bestVal = moveVal;
		                    }
		                 }else if(ai_X_ili_O=="o"){
		                 	let l=[];
							l.push(i);
							l.push(j);
							zauzetio.push(l);
							let moveVal = minmax(zauzetix, zauzetio, false);
							zauzetio.pop();
						    if (moveVal > bestVal){
			                    bestMove[0] = i;
			                    bestMove[1] = j;
			                    bestVal = moveVal;
		                    }
		                 }
		            }
		        }
		    }return bestMove;
        }

        function pocetak(){
            var redai = 1;
        	var radios = document.getElementsByName('red');

			if(radios[1].checked){
			    redai = 2;
			}

			if(redai==1){
				ai_X_ili_O="o";
			}else if(redai==2){
				ai_X_ili_O="x";
			}

            $("div.m").fadeOut(800);

			if(ai_X_ili_O=="x" && zauzetiX.length==0){
				randomxy=[[0, 0], [200, 0], [100, 100], [0, 200], [200, 200], [0, 100], [200, 100], [100, 200]];
				var random=Math.floor(Math.random()*8);
				randomx=randomxy[random][0];
				randomy=randomxy[random][1];	
				var timeout = setTimeout(function(){
					crtajx(randomx, randomy);
					turnxo="o";
					let l=[];
					l.push(randomx);
					l.push(randomy);
					zauzetiX.push(l);
				},900);
			}
        }

		 $("#zapocni").on("click", pocetak);

		 $("#canvas").on("click", function(e){

		    elementLeft=c.offsetLeft + c.clientLeft;
		    elementTop=c.offsetTop + c.clientTop;

			var x=e.pageX-elementLeft;
			var y=e.pageY-elementTop;

			xk=x-x%100;
			yk=y-y%100;

		 	if(ai_X_ili_O=="x" && turnxo=="o"){
		 		if(!sadrzi(xk, yk, zauzetiX, zauzetiO)){
		 			crtajo(xk, yk);
					turnxo="x";
					let l=[];
					l.push(xk);
					l.push(yk);
					zauzetiO.push(l);

					if(!pobjedaZaO(zauzetiO)){
						var t=setTimeout(function(){
			 			let trazeno=findBestMove(zauzetiX, zauzetiO);
			 			crtajx(trazeno[0], trazeno[1]);
						turnxo="o";
						let l=[];
						l.push(trazeno[0]);
						l.push(trazeno[1]);
						zauzetiX.push(l);
                        if(pobjedaZaX(zauzetiX)){
                            $("#pobjednik h3").html("Izgubili ste!");
                            $("#kraj_igre").fadeIn(1000);
                        }else if(izjednaceno(zauzetiX, zauzetiO)){
                            $("#pobjednik h3").html("Izjednačeno je!");
                            $("#kraj_igre").fadeIn(1000);
                        }
			 		    },600);
					}else{
                        if(pobjedaZaO(zauzetiO)){
                            $("#pobjednik h3").html("Pobijedili ste!");
                            $("#kraj_igre").fadeIn(1000);
                        }else if(izjednaceno(zauzetiX, zauzetiO)){
                            $("#pobjednik h3").html("Izjednačeno je!");
                            $("#kraj_igre").fadeIn(1000);
                        }
					}
		 	    }
		 	}else if(ai_X_ili_O=="o" && turnxo=="x"){
		 		if(!sadrzi(xk, yk, zauzetiX, zauzetiO)){
		 			crtajx(xk, yk);
					turnxo="o";
					let l=[];
					l.push(xk);
					l.push(yk);
					zauzetiX.push(l);

					if((!pobjedaZaX(zauzetiX) || !izjednaceno(zauzetiX, zauzetiO)) && zauzetiX.length<5){
						var t=setTimeout(function(){
			 			let trazeno=findBestMove(zauzetiX, zauzetiO);
			 			crtajo(trazeno[0], trazeno[1]);
						turnxo="x";
						let l=[];
						l.push(trazeno[0]);
						l.push(trazeno[1]);
						zauzetiO.push(l);
                        if(pobjedaZaO(zauzetiO)){
                            $("#pobjednik h3").html("Izgubili ste!");
                            $("#kraj_igre").fadeIn(1000);
                        }else if(izjednaceno(zauzetiX, zauzetiO)){
                            $("#pobjednik h3").html("Izjednačeno je!");
                            $("#kraj_igre").fadeIn(1000);
                        }	
			 		    },600);
					}else{
                        if(pobjedaZaX(zauzetiX)){
                            $("#pobjednik h3").html("Pobijedili ste!");
                            $("#kraj_igre").fadeIn(1000);
                        }else if(izjednaceno(zauzetiX, zauzetiO)){
                            $("#pobjednik h3").html("Izjednačeno je!");
                            $("#kraj_igre").fadeIn(1000);
                        }
					}
		 	    }
		 	}
		});

		function sadrzi(a, b, niz1, niz2){
			var niz=niz1.concat(niz2);
			var boolean=false;
			for(let i=0; i<niz.length; i++){
				if(niz[i][0]==a && niz[i][1]==b){
					boolean=true;
					return boolean;
				}
			}return boolean;
	    }

	    function sadrzi2(a, b, niz){
			for(let i=0; i<niz.length; i++){
				if(niz[i][0]==a && niz[i][1]==b){
					return true;
				}
			}return false;
	    }

        $("#nova_igra").on("click", function() {
        	ctx.clearRect(0, 0, 300, 300);
        	podloga();
            zauzetiX = []; zauzetiO = [];
            turnxo = "x";

            $("div.m").fadeIn(1000);
            $("#kraj_igre").fadeOut(1000);
        });
