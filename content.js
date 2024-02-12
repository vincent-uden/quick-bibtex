// content.js
// Author: Vincent Udén
// Author Github URI: https://www.github.com/vincent-uden
// License: MIT

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(_ => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

const articleUrl = new URL(window.location.href);
const articleId = articleUrl.pathname.split("/").reverse()[0];

let hasRan = false;

window.addEventListener("load", async () => {
    waitForElm(".banner-options").then(elm => {
        setTimeout(async () => {
            if (hasRan) return;
            hasRan = true;


            const exportDiv = document.getElementsByClassName("banner-options")[0];
            const myBtn = document.createElement("div");
            const myBtnInside = document.createElement("span");
            const myBtnText = document.createTextNode("Cite as BibTex");
            myBtnInside.appendChild(myBtnText);
            myBtn.appendChild(myBtnInside);
            myBtn.id = "bibtex-direct";
            myBtn.style.display = "inline-block";
            myBtn.style.lineHeight = "var(--sd-ui-line-height)";
            myBtn.style.marginLeft = "16px";
            myBtn.style.cursor = "pointer";
            myBtn.style.borderBottomWidth = "2px";
            myBtn.style.borderBottomStyle = "solid";
            myBtn.style.transform = "translateY(-2.7px)";
            myBtnInside.style.display = "inline-block";
            myBtnInside.style.transform = "translateY(4px)";

            const css = "#bibtex-direct:hover { border-color: #eb6500 } #bibtex-direct { border-color: transparent; transition: border-color .3s ease; }";
            const style = document.createElement("style");
            if (style.styleSheet) {
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
            document.head.appendChild(style);

            myBtn.addEventListener("click", async () => {
                const bibtex = await fetch(`https://www.sciencedirect.com/sdfe/arp/cite?pii=${articleId}&format=text%2Fx-bibtex&withabstract=true`, {
                  "headers": {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                    "sec-ch-ua": "\"Chromium\";v=\"121\", \"Not A(Brand\";v=\"99\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Linux\"",
                    "sec-fetch-dest": "document",
                    "sec-fetch-mode": "navigate",
                    "sec-fetch-site": "same-origin",
                    "sec-fetch-user": "?1",
                    "upgrade-insecure-requests": "1"
                  },
                  "referrer": `https://www.sciencedirect.com/science/article/pii/${articleId}?via=ihub`,
                  "referrerPolicy": "strict-origin-when-cross-origin",
                  "body": null,
                  "method": "GET",
                  "mode": "cors",
                  "credentials": "include"
                });
                const blob = await bibtex.blob();
                const text = await blob.text();
                console.log(text);

                await navigator.clipboard.writeText(text);
            });

            exportDiv.appendChild(myBtn);
        }, 200);
    });
}, false);
