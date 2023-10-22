$('.LoadItem').click(function handleClick(event) {
    event.preventDefault();
    loadInfo("LOAD", event.target.href);
    // var v = $(this);
    // console.log("LOAD");
    // console.log (v.outerHTML());
});

$('.UnloadItem').click(function handleClick(event) {
    loadInfo("UNLOAD", event.target.href);
    //console.log(event.target.href);
    //event.target.classList.add('bg-yellow');
});


//     function(){
//     var v = $(this);
//     console.log("UNLOAD");
//     console.log(origin.href);
//     console.log (v);
// });

function loadInfo(act, url) {

    bI = document.getElementById('Intro');
    bP = document.getElementById('Projects');
    bS = document.getElementById('selProject');

    if (act === "LOAD") {
        bI.className = "col d-none";
        bP.className = "col d-none";
        bS.className = "col d-block";

        fetch(url)
            .then(response => response.text())
            .then(html => {
                // Initialize the DOM parser
                var parser = new DOMParser();
                var doc = parser.parseFromString(html, "text/html");
                // You can now even select part of that html as you would in the regular DOM
                // Example:
                // var docArticle = doc.querySelector('article').innerHTML;
                //console.log(doc);
                console.log("PROCESS");
                console.log(doc.getElementsByTagName("title").text);
                document.getElementById('selTitle').innerHTML = url;
                document.getElementById('selContents').innerHTML = html;
            })
            .catch(error => {
                document.getElementById('selContents').innerHTML = "ERROR, see log";
                console.log(error);
            });
        //preventdefault
        //return false;
    } else {
        bI.className = "col d-block";
        bP.className = "col d-block";
        bS.className = "col d-none";
    }
    //console.log(b1.className);
    //console.log(url);
    //'selProject','selProject selTitle' selContents
    //class="col d-none" -> d-
}

//-texa nikon
//-roofing service
//-dordrecht dakservice
//

// document.addEventListener(`click`, e => {
//     const origin = e.target.closest(`a`);
//     if (origin) {
//         const href = origin.href;
//
//
//
//
//
//
//         console.log(href);
//     }
// });
//
// function loadInfo(url) {
//
//     bI = document.getElementById('Intro');
//     bP = document.getElementById('Projects');
//     bS = document.getElementById('selProject');
//
//     if (url !== "") {
//         bI.className = "col d-none";
//         bP.className = "col d-none";
//         bS.className = "col d-block";
//
//         document.getElementById('selTitle').innerHTML = url;
//         fetch(url)
//             .then(response => response.text())
//             .then(html => {
//                 document.getElementById('selContents').innerHTML = html;
//             })
//             .catch(error => {
//                 document.getElementById('selContents').innerHTML = "ERROR, see log";
//                 console.log(error);
//             });
//     } else {
//         bI.className = "col d-block";
//         bP.className = "col d-block";
//         bS.className = "col d-none";
//     }
//     //console.log(b1.className);
//     //console.log(url);
//     //'selProject','selProject selTitle' selContents
//     //class="col d-none" -> d-
// }
//
//

// document.addEventListener("DOMContentLoaded", () => {
//     const place = document.getElementById("section-example");
//     const subTitle = document.querySelector("h2");
//     const nav = document.querySelector(".all-examples");
//
//     async function fetchData(url, type) {
//         try {
//             const response = await fetch(url);
//             const data =
//                 type === "text" ? await response.text() : await response.json();
//             return data;
//         } catch (err) {
//             console.error(err);
//         }
//     }
//
//     fetchData("./menu.json", "json").then((data) => {
//         data.forEach(({ link, text, info }, index) => {
//             const element = document.createElement("a");
//             element.className = "item";
//             if (index == 0) {
//                 element.classList.add("active-menu");
//             }
//             element.href = `#${link}`;
//             element.setAttribute("data-iframe", link);
//             if (info) {
//                 element.setAttribute("data-info", info);
//             }
//             element.textContent = text;
//             nav.appendChild(element);
//         });
//
//         const examples = document.querySelectorAll(".item");
//         examples.forEach((example) => {
//             example.addEventListener("click", (event) => {
//                 renderIframe(example);
//             });
//         });
//
//         const hash = location.hash;
//         if (hash) {
//             renderIframe(hash.replace("#", ""));
//         } else {
//             renderIframe("01.simple-map");
//         }
//     });
//
//     function renderIframe(example) {
//         // check if object or stirng
//         const check = typeof example === "object";
//
//         const activeMenu = document.querySelector(".active-menu");
//         activeMenu.classList.remove("active-menu");
//
//         const css = check
//             ? example
//             : document.querySelector(`a[data-iframe="${example}"`);
//         css.classList.add("active-menu");
//
//         const dataIframe = check ? example.getAttribute("data-iframe") : example;
//
//         // h2 title
//         const title = document.createElement("h2");
//         title.className = "title";
//         title.id = dataIframe;
//         const createText = document.createTextNode(
//             check
//                 ? example.textContent
//                 : document.querySelector(`a[data-iframe="${example}"`).textContent
//         );
//
//         // adding text to h2
//         title.appendChild(createText);
//
//         // create iframe
//         const iframe = document.createElement("iframe");
//         iframe.src = `./${dataIframe}/index.html`;
//         iframe.className = "iframe-wrapper";
//         if (dataIframe === "25.fitBounds-with-padding") {
//             iframe.classList.add("resize-h");
//         }
//         iframe.border = 0;
//         iframe.width = "100%";
//         iframe.height = "550px";
//
//         // get data-info
//         const dataInfo = check
//             ? example.getAttribute("data-info")
//             : document
//                 .querySelector(`a[data-iframe="${example}"`)
//                 .getAttribute("data-info");
//
//         const dataInfoTeamplte = dataInfo
//             ? `<div class="small">${dataInfo}</div>`
//             : "";
//
//         const flex = document.createElement("div");
//         flex.className = "flex";
//
//         const file = `${dataIframe}/script.js`;
//         const template = `<div class="small open-source"><a href="${detectUrl(
//             file
//         )}" target="_blank">→ open source</a></div>${dataInfoTeamplte}`;
//
//         flex.innerHTML = template;
//
//         place.innerHTML = "";
//         subTitle.innerHTML = "";
//         place.insertAdjacentElement("afterbegin", title);
//         place.insertAdjacentElement("beforeend", iframe);
//         iframe.insertAdjacentElement("afterend", flex);
//
//         const details = document.createElement("details");
//         const summary = document.createElement("summary");
//         summary.textContent = "show code";
//         details.appendChild(summary);
//         const pre = document.createElement("pre");
//         const code = document.createElement("code");
//         const codePlace = flex.cloneNode();
//         details.insertAdjacentElement("beforeend", pre);
//         codePlace.className = "code-place";
//         pre.appendChild(code);
//         codePlace.appendChild(details);
//         flex.insertAdjacentElement("afterend", codePlace);
//
//         fetchData(detectUrl(`${file}`), "text")
//             .then((data) => {
//                 code.className = "language-js";
//                 code.textContent = data;
//             })
//             .then(() => {
//                 document.querySelectorAll("pre code").forEach((el) => {
//                     hljs.highlightElement(el);
//                 });
//             });
//     }
//
//     function detectUrl(file) {
//         let url =
//             location.hostname === "localhost" || location.hostname === "127.0.0.1"
//                 ? file
//                 : `https://raw.githubusercontent.com/tomik23/leaflet-examples/master/${file}`;
//         return url;
//     }
// });