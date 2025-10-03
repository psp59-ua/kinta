const player = document.getElementById('player');
const playBtn = document.getElementById('play');
const pauseBtn = document.getElementById('pause');


playBtn.addEventListener("click",()=>{


    player.play();
});

pauseBtn.addEventListener("click",()=>{

    player.pause();
});