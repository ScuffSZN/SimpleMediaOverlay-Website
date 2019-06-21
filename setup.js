var socks,
    j = {
        "title":"",
        "artist":"",
        "cover":"",
        "duration":"",
        "currentTime":"",
        "state":0
    },
    lastState,
    connect = () => {
        socks = new WebSocket("ws://localhost:8974");

        socks.onopen = function() {
            if(socks.readyState != 1)
                setTimeout(connect, 1000);
        };

        socks.onmessage = function(e) {
            newMessage(e.data)
        };

        socks.onclose = function(e) {
            if(socks.readyState != 1)
                setTimeout(connect, 1000);
        };

        socks.onerror = function(err) {
            socks.close();
            newMessage(JSON.stringify({
                "title": "server",
                "artist": "offline",
                "cover": "https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.helpnetsecurity.com%2Fwp-content%2Fuploads%2F2015%2F12%2Ferror.png&f=1",
                "duration": "0:00",
                "currentTime": "0:00",
                "state": 0
            }))
        };

    }
connect();

var setup = {
  cover:true,
  dark:false
},
    overlayLink = document.querySelector('input[type="text"]');

var title = document.querySelector(".card-body-title"),
      card = document.querySelector(".player"),
      artist = document.querySelector(".card-body-album"),
      time = document.querySelector(".card-body-time span"),
      progress = document.querySelector(".card-body-progressbar-inner"),
      artwork = document.querySelector(".card-images");//hms

function newMessage(data) {
  jsonData = JSON.parse(data);
  title.innerHTML = jsonData.title;
  artist.innerHTML = jsonData.artist;
  setArtwork(jsonData.cover);
  time.innerHTML = jsonData.currentTime+" / "+jsonData.duration;
  progress.style.width = ((hms(jsonData.currentTime)/hms(jsonData.duration))*100) + "%";
  if(jsonData.state == 1) {
    card.classList.remove('hidden');
  } else if(jsonData.state == 0) {
    card.classList.add('hidden');
  }
  if(jsonData.cover.length == 0 || !setup.cover) {
    document.querySelector('.card-body').style.width = '430px';
    artwork.style.width = '0px';
  } else if(setup.cover) {
    document.querySelector('.card-body').style.width = '375px';
    artwork.style.width = '55px';
  }

if(setup.dark) {
  card.classList.add('dark');
} else {
  card.classList.remove('dark');
}
}

function hms(str) {
        var p = str.split(':'),
            s = 0, m = 1;
        while (p.length > 0) {
            s += m * parseInt(p.pop(), 10);
            m *= 60;
        }
        return s;
    }


    function getpar(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    function setArtwork(e) {
      artwork.style.backgroundImage = "url("+e+")"
    }


function updateSettings() {
  setup.cover = document.querySelector('.coverCheck').checked;
  setup.dark = document.querySelector('.darkCheck').checked;
  overlayLink.value = `https://smo.scuffed.dev/overlay?dark=${setup.dark}&cover=${setup.cover}`;
}

updateSettings();