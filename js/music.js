console.log("Hello javaScript");

let currentSong = new Audio();
let songs;

//function convert in formated timeupdate
function secondsToMinutesSeconds(seconds){
  if(isNaN(seconds) || seconds <0){
    return "00.00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2,'0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
  let a = await fetch("songs/");
  let response = await a.text();
  // console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  let songs = [];

  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}


const playMusic = (track, pause = false)=>{
   currentSong.src = "/songs/" +track
   if(!pause){
     currentSong.play();
     play.src = "logos/pause.svg";
   }

   document.querySelector(".songinfo").innerHTML = decodeURI(track);
   document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function main() {
  songs = await getSongs();

  playMusic(songs[0],true);


  // Show all the songs in the playslist 
  let songUL = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];

  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
        <img class="invert" src="/logos/music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20", " ") || song.replaceAll("%26", " ")}</div>
            <div>Robin</div>
            </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img src="logos/play.svg" alt="">
                </div>
      </li>`;
  }

  //Attach an event listener to each song

  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element=>{
      console.log(e.querySelector(".info").firstElementChild.textContent);
      playMusic(e.querySelector(".info").firstElementChild.textContent.trim());
    })
    
  });

  //Atach an event listener to play, next and previous

  play.addEventListener("click", ()=>{
    if(currentSong.paused){
      currentSong.play();
      play.src = "logos/pause.svg";
    }
    else{
      currentSong.pause();
      play.src = "logos/play_btn.svg";
    }
  })

  // Listen for timeupdate event
  currentSong.addEventListener("timeupdate", ()=>{
    // console.log(currentSong.currentTime, currentSong.duration);

    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  })

  //Add an Event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", e=>{
    let percent = (e.offsetX / e.target.getBoundingClientRect().width)* 100 ;

    document.querySelector(".circle").style.left = (percent + "%");
    currentSong.currentTime = ((currentSong.duration) * percent) / 100;
  })

  //Add an event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", ()=>{
    document.querySelector(".left").style.left = "0";
  })

  //Add an event listener for close button
  document.querySelector(".close").addEventListener("click", ()=>{
    document.querySelector(".left").style.left = "-100%";
  })

  //Add an event listener for previous
  previous.addEventListener("click", ()=>{
    console.log("Previous Click");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

    if ((index-1) >= 0) {
      playMusic(songs[index-1]);
    }
    
  })
  //Add an event listener for next
  next.addEventListener("click", ()=>{
    currentSong.pause();
    console.log("next Click");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

    if ((index+1) < (songs.length - 1)) {
      playMusic(songs[index+1]);
    }
    // console.log(songs, index);
    
    
  })
}

main();



//Play the first song
  // var audio = new Audio(songs[2]);
  //   audio.play();


  // audio.addEventListener("loadeddata", () => {
  //   console.log(audio.duration, audio.currentSrc, audio.currentTime);
  // });