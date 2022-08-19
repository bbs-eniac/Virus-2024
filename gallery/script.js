{
  // Author: Giovanni Antonio
  // Twitter  @thecalicoder
  // EXPERIMENTAL

  const index = el => [...el.parentElement.children].indexOf(el);
  const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));

  function init() {
    // keep them low-res for demo purposes only
    const assets = [

    "https://media.discordapp.net/attachments/877042586475446272/877042609619603498/c954d623-c0cc-4935-a639-bfb1a85dbe78.png?width=882&height=588",
    "https://media.discordapp.net/attachments/877042586475446272/877042868118769695/6606610f-6798-46db-8be9-c45e43413471.png?width=882&height=588",
    "https://media.discordapp.net/attachments/877042586475446272/877043183861780520/d0d1c6c1-ad5a-409d-bba2-90b87774d12a.png?width=882&height=588",
    "https://media.discordapp.net/attachments/877042586475446272/877043285233913926/f00e4986-2421-4af5-9ce1-37c1964bec38.png?width=882&height=588",
    "https://media.discordapp.net/attachments/877042586475446272/877043381866475580/6facf6ef-2f27-41ab-b8cc-1e32dfbfcf79.png?width=882&height=588",
    "https://media.discordapp.net/attachments/877042586475446272/877043786872651786/754e0049-9296-4601-965e-f598ec4f5e0d.png?width=882&height=588",
    "https://media.discordapp.net/attachments/877042586475446272/877044040707764274/71156726-54f2-4151-a260-805a1c5f26bf.png?width=882&height=588",
    "https://media.discordapp.net/attachments/877042586475446272/877044137738772560/224988fa-dfad-497d-8a9d-a012f85d8944.png?width=882&height=588",
    "https://media.discordapp.net/attachments/877042586475446272/877044303619301396/c2a31331-e916-4871-836b-414957a5dbb9.png?width=882&height=588",
    "https://media.discordapp.net/attachments/877042586475446272/877046659027185674/73a28f61-40ff-4f63-b4c3-5705e61d1e67.png?width=609&height=406",
    "https://media.discordapp.net/attachments/877042586475446272/877046162585174037/e0c83ee6-fbbb-445a-979f-d915bcc4c2ba.png",
    "https://media.discordapp.net/attachments/877042586475446272/877045224390664223/3296500d-5527-41fe-87f5-ae7282962c7d.png?width=609&height=406",
    "https://media.discordapp.net/attachments/877042586475446272/877045007452889089/693c3bb4-778e-4187-b503-ef6aef5b64d5.png?width=609&height=406",
    "https://media.discordapp.net/attachments/877042586475446272/877044689025527838/6ef59e3d-7006-4e9b-a532-f58bd9c22c3c.png?width=609&height=406",
    "https://media.discordapp.net/attachments/877042586475446272/877044451124576316/11e01140-a467-49c0-bcd4-43292cfd069a.png?width=609&height=406",
    "https://media.discordapp.net/attachments/877042586475446272/877044392131698718/27cf59a0-1b7c-458d-b4d3-76f69b21c09f.png?width=609&height=406",
  ];


    const root = document.documentElement;
    const viewport = document.querySelector(".viewport");
    const canvas = document.querySelector(".canvas");
    const map = document.querySelector(".map");
    const focus = document.querySelector(".focus");
    const back = document.querySelector("#back");
    const zoom = document.querySelector("#zoom");
    let item = canvas.querySelector(".selected");
    let id = index(item);

    let coords = {
      x: 0,
      y: 0 };

    const gridSize = getComputedStyle(root).getPropertyValue("--gridSize");

    const translateCanvas = () => {
      canvas.style.setProperty("--x", coords.x);
      canvas.style.setProperty("--y", coords.y);
    };

    const panningTo = i => {
      coords.x = i % gridSize;
      coords.y = Math.floor(i / gridSize);
      translateCanvas();
    };

    const makeSelection = sel => {
      item.classList.remove("selected");
      map.children[index(item)].classList.remove("selected");

      item = canvas.children[sel];

      item.classList.add("selected");
      map.children[sel].classList.add("selected");

      id = index(item);
      panningTo(id);
    };

    const handleSelection = ev => {
      if (ev.target === item) return;
      if (
      ev.target.nodeName === "DIV" &&
      ev.target !== item &&
      ev.target !== canvas &&
      ev.target !== map)
      {
        makeSelection(index(ev.target));
      }
      ev.preventDefault();
    };

    const handleOpenImage = ev => {
      ev.preventDefault();
      root.classList.toggle("open");
    };

    const handleZoom = ev => {
      ev.preventDefault();
      let zoomValue = ev.target.value;
      viewport.style.setProperty("--zoom", zoomValue);
    };

    const handleKeyboard = ev => {
      ev.preventDefault();

      let tempX = coords.x,
      tempY = coords.y,
      tempIndex = id,
      max = gridSize - 1;

      switch (ev.keyCode) {
        case 37: // left
          tempX--;
          break;
        case 39: // right
          tempX++;
          break;
        case 38: // up
          tempY--;
          break;
        case 40: // down
          tempY++;
          break;
        case 13: // enter
          handleOpenImage(ev);
          return;}


      coords.x = clamp(tempX, 0, max);
      coords.y = clamp(tempY, 0, max);

      tempIndex = coords.y * gridSize + coords.x; // get index position from x,y

      makeSelection(tempIndex);
    };

    const handleLoad = () => {
      // selection
      panningTo(id);
      map.children[id].classList.add("selected");

      // Append images may fail!
      [...canvas.querySelectorAll("div")].forEach((v, i) => {
        let img = new Image(),
        container = document.createElement("div");
        v.innerHTML = "";
        container.className = "img";
        img.src = assets[i];
        img.crossOrigin = "";
        img.onload = () => {
          v.appendChild(img);
        };
        img.setAttribute("width", 1280);
        img.setAttribute("height", 800);
        img.alt = "";
      });
    };

    document.addEventListener("keydown", handleKeyboard);
    canvas.addEventListener("click", handleSelection);
    map.addEventListener("click", handleSelection);
    focus.addEventListener("click", handleOpenImage);
    back.addEventListener("click", handleOpenImage);
    zoom.addEventListener("change", handleZoom);

    window.addEventListener("load", handleLoad);
  }

  init();
}