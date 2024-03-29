const socket = io("/");
const height = $(window).height();
const width = $(window).width();

const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;
let myVideoStream;
var myPeer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "443",
});
// var count = 1;

navigator.mediaDevices
  .getUserMedia({ audio: true, video: true })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    myPeer.on("call", (call) => {
      d();
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });
    socket.on("user-connected", (userId) => {
      socket.on("no-of-users", (num) => {
        d(num);
      });
      setTimeout(connectToNewUser, 1000, userId, stream);
    });
    // socket.emit("update-others", USER_NAME);

    var user = [];
    $(".get-user").click(function () {
      var clients = [USER_NAME];
      socket.on("update members", (users) => {
        user = users;
        console.log(users);
      });
      alert(user.length != 0 ? windows.user : clients + " connected");
    });

    let text = $("input");
    // let name = $("#txt_name").val();
    $("html").keydown((e) => {
      if (e.which == 13 && text.val().length !== 0) {
        if (USER_NAME !== "") {
          $("ul").append(
            `<li class="message" style="text-align:right; padding-right:1.875rem; color:green"><b>${USER_NAME}</b><br/>${text.val()}</li>`
          );
          socket.emit("message", text.val(), USER_NAME);
          text.val("");
        } else {
          $("#myModal").show();
          text.val("");
        }
      }
    });
    $(".cancel").click(function () {
      $("#myModal").hide();
    });
    $(".confirm").click(function () {
      // name = $("#txt_name").val();
      $("#myModal").hide();
    });

    socket.on("createMessage", (message, name) => {
      $("ul").append(
        `<li class="message"style="color:yellow"><b>${name}</b><br/>${message}</li>`
      );
      scrollToBottom();
    });

    socket.on("disconnectUser", (name, userId) => {
      if (myPeer[userId]) myPeer[userId].close();
      $("ul").append(
        `<li class="message" style="text-align:center; color:red">${name} Left</li>`
      );
      scrollToBottom();
    });
  });

myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id, USER_NAME);
});
const connectToNewUser = (userId, stream) => {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};
const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};

const scrollToBottom = () => {
  let d = $(".main__chat_window");
  d.scrollTop(d.prop("scrollHeight"));
};

const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

const setMuteButton = () => {
  const html = `
  <i class="fas fa-microphone"></i>
  <span>Mute</span>`;
  document.querySelector(".main__mute_button").innerHTML = html;
};
const setUnmuteButton = () => {
  const html = `
  <i class="unmute fas fa-microphone-slash"></i>
  <span>Unmute</span>`;
  document.querySelector(".main__mute_button").innerHTML = html;
};

const playStop = () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayButton();
  } else {
    setStopButton();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

const setStopButton = () => {
  const html = `
  <i class="fas fa-video"></i>
  <span>Stop</span>`;
  document.querySelector(".main__video_button").innerHTML = html;
};
const setPlayButton = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
  <span>Play</span>`;
  document.querySelector(".main__video_button").innerHTML = html;
};

const leave = () => {
  document.getElementById("myForm").submit();
};

function a() {
  $(".main__left").css("flex", "1");
  $(".main__right").css("display", "none");
  $("#video-grid").css("width", "100%");
}
function b() {
  $(".main__left").css("flex", "0.8");
  // $("#video-grid").css("width", "80%");
  $(".main__right").css("display", "flex");
}

$(".js-click").click(function () {
  return (this.tog = !this.tog) ? a() : b();
});

$(document).ready(function () {
  window.history.pushState(null, "", window.location.href);

  window.onpopstate = function () {
    window.history.pushState(null, "", window.location.href);
  };
});

const shareData = {
  title: "WhatsApp",
  text: ROOM_ID,
  // url: `https://wa.me/?text=${ROOM_ID}`,
};

const btn = document.getElementById("add");
const resultPara = document.querySelector(".result");

// Share must be triggered by "user activation"
btn.addEventListener("click", async () => {
  try {
    await navigator.share(shareData);
    // resultPara.textContent = "MDN shared successfully";
  } catch (err) {
    resultPara.textContent = `Error: ${err}`;
  }
});

$(".main").css("height", `${height}px`);

$(".hidden-click").click(function () {
  return (this.togg = !this.togg) ? c() : d();
});

const c = () => {
  $("#video-grid").css("display", "flex");
  // $("#video-grid").css("height", `${height - 70.78}px`);
  $("#video-grid").css("width", `100%`);
  $("video").css("width", `100%`);
  $("video").css("height", `${height - 70.78}px`);
};
const d = (num) => {
  console.log(num);
  if (width < 500) {
    $("#video-grid").css("flex-direction", `column`);
    $("#video-grid").css("width", `100%`);
    $("#video-grid").css("height", `-webkit-fill-available`);
    $(".main").css("height", `-webkit-fill-available`);
    $("video").css("height", `${(height - 70.78) / 2}px`);
    $("video").css("width", `100%`);
  }
  if (width > 500) {
    $("#video-grid").css("display", "grid");
    $("#video-grid").css("grid-template-columns", "1fr 1fr");
    $("#video-grid").css("height", `-webkit-fill-available`);
    $("#video-grid").css("width", `100% !important`);
    $("video").css("width", `100%`);
    $("video").css("height", `-webkit-fill-available`);
    if (num > 2) {
      $("#video-grid").css(
        "grid-template-rows",
        `${(height - 70.78) / 2}px ${(height - 70.78) / 2}px`
      );
    }
  }
};
