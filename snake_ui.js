$(function() {
	var game = new Game();

	var across = game.across;
	var down = game.down;
	var renderCounter = 0;
	var isPaused = false;
	var timerId = null;
	//var downIsDown = false;

	function directionCodeForKey(keyCode) {
		switch (keyCode) {
			case 37: return 'l';
			case 38: return 'u';
			case 39: return 'r';
			case 40: return 'd';
 		}
	}

	function createGrid() {
		for (var j = 0; j < down; j++) {
			$('.master').append($('<div class="row" id="row' + j + '">'));
			for (var i = 0; i < across; i++) {
				$('#row' + j).append($('<div class="space" id="space' + i + "_" + j + '">'));
			}
		}
		for (var j = 0; j < down; j++) {
			$('#row' + j).data('j', j);
			for (var i = 0; i < across; i++) {
				var space_id = '#space' + i + '_' + j;
				$(space_id).data('i', i);
				$(space_id).data('j', i);
				// $(space_id).on('mouseover',function() {
// 					if (downIsDown) {
// 					  $(this).addClass('greenClass');
// 					}
// 				})
			}
		}
	}
	createGrid();

	// $(document).on('keydown', function(event) {
// 		var keyCode = event.keyCode || event.which
// 		//console.log(keyCode);
// 		if (keyCode >= 37 && keyCode <= 40) {
// 			event.preventDefault();
// 			game.turn(directionCodeForKey(keyCode));
// 		}
// 	});

	$(document).on('keydown', function(event) {
		var keyCode = event.keyCode || event.which
		//console.log(keyCode);
		if (keyCode >= 37 && keyCode <= 40) {
			//event.preventDefault();
			game.turn(directionCodeForKey(keyCode));
			return false; //prevents default actuon
		} else if (keyCode === 32) {
			console.log("Spacebar Detected")
			if (isPaused) {
				isPaused = false;
				$('.messages').text("_");
				start();
			} else {
				isPaused = true;
				$('.messages').text("PAUSED");
				window.clearInterval(timerId);
			}
		}
	});

	var bodyLastPass = [];
	var miceLastPass = [];
	var tongue_id = null;

	function tongueText() {
		switch(game.direction()) {
			case 'r': return "<";
			case 'l': return ">";
			case 'd': return "/\\";
			case 'u': return "\\/";
		}
	}

	function renderGrid() {
		for (var i = 0; i < bodyLastPass.length; i++) {
			$(bodyLastPass[i]).removeClass('snake');
		}
		for (var i = 0; i < miceLastPass.length; i++) {
			$(miceLastPass[i]).removeClass('mouse');
		}
		if (tongue_id !== null) {
			//console.log("Removing from " + tongue_id)
			$(tongue_id).removeClass('tongue');
			$(tongue_id).text("");
			tongue_id = null;
		}


		bodyLastPass = [];
		miceLastPass = [];
		for (var i = 0; i < game.body.length; i++) {
			var space_id = '#space' + game.body[i][0] + '_' + game.body[i][1];
			$(space_id).addClass('snake');
			bodyLastPass.push(space_id);
		}

		for (var i = 0; i < game.mice.length; i++) {
			var space_id = '#space' + game.mice[i][0] + '_' + game.mice[i][1];
			$(space_id).addClass('mouse');
			miceLastPass.push(space_id);
		}

		if (renderCounter >= 25) {
			if (renderCounter !== 28) {
				tongue_id = '#space' + game.tongue()[0] + '_' + game.tongue()[1];
				$(tongue_id).text(tongueText());
				$(tongue_id).addClass('tongue');
			}
			if (renderCounter >= 32) {
				renderCounter = 0;
			}
		}
		$('.score').text("Score: " + game.score);
	}

	function start() {
		//console.log(game.mice);

	 	timerId = window.setInterval(function() {
	 		game.step();
			renderGrid();
			renderCounter++;
			if (game.isOver()) {
				$('.messages').text("Game over");
				//console.log("Game over");
				window.clearInterval(timerId);
			} else {
				;//console.log("Game running");
			}
	 	}, 1000/15);
	};
	start();


});