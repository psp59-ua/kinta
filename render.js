const player = document.getElementById('player');
const playBtn = document.getElementById('play');



playBtn.addEventListener("click",()=>{

    if(player.paused){
        player.play();
        playBtn.textContent = "Play";
    }else{
        player.pause();
        playBtn.textContent = "Pause";
    }
    
});