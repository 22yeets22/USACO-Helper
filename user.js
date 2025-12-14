// ==UserScript==
// @name         USACO Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Better CSS, persistent language, auto file-lang match, copy code blocks, better title
// @author       Lekang
// @match        *://usaco.org/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.setClipboard
// ==/UserScript==

(async function () {
    'use strict';
    const css = `
/* Base */
body, td, th {
  font-family: "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 15px;
  color: #222;
  line-height: 1.5;
}
body {
  margin: 0;
  background: #f3f5f7;
  color: #222;
}

/* Links */
a:link, .panel a:link { color: #1d4ed8; text-decoration: none; }
a:active, .panel a:active { color: #1d4ed8; text-decoration: underline; }
a:visited, .panel a:visited { color: #6b21a8; }
a:hover, .panel a:hover { color: #2563eb; text-decoration: underline; }

/* Main container */
div.main {
  background: #fff;
  width: 914px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  position: relative;
  z-index: 1;
}

/* Navbar */
.navbar {
  margin: -30px auto 50px 30px;
  z-index: 2;
  position: relative;
}
.navbar ul {
  list-style: none;
  padding: 0;
  margin: 0 0 0 0;
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.navbar li a {
  display: block;
  padding: 8px 14px;
  font-size: 15px;
  border-radius: 6px;
  background: #2563eb;
  color: #fff;
  transition: background 0.2s ease, transform 0.1s ease;
}
.navbar li a:hover {
  background: #1e40af;
  transform: translateY(-2px);
}

/* Panels */
.panel {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 12px 16px;
  margin-bottom: 20px;
  margin-left: 20px;
  font-size: 14px; /* smaller to match box size */
}
.panel h2 {
  font-variant: small-caps;
  font-weight: 600;
  font-size: 1.1em;
  color: #111;
  margin-bottom: 10px;
}

/* Buttons */
button,
input[type="button"],
input[type="submit"],
input[type="reset"],
input[type="file"]::file-selector-button {
  appearance: none;
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
}

/* Primary button */
button,
input[type="submit"] {
  background: #2563eb;
  color: #fff;
}
button:hover,
input[type="submit"]:hover {
  background: #1e40af;
  transform: translateY(-2px);
}

/* Secondary (reset, upload, etc.) */
input[type="reset"],
input[type="button"],
input[type="file"]::file-selector-button {
  background: #e5e7eb;
  color: #111;
}
input[type="reset"]:hover,
input[type="button"]:hover,
input[type="file"]::file-selector-button:hover {
  background: #d1d5db;
  transform: translateY(-2px);
}

/* Shadows */
.shadow1 {
  margin: 20px auto;
  width: 900px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  border-radius: 8px;
}
.shadow1 .content {
  background: #fff;
  border-radius: 8px;
}

/* Forms */
.field label, .field2 label, .forgotpass label {
  font-weight: 600;
  color: #374151;
}
.form_error {
  font-weight: bold;
  color: #dc2626;
  padding-top: 6px;
}

/* Sponsors */
.sponsors a {
  padding: 3px;
  border: 1px solid transparent;
  border-radius: 4px;
  transition: border 0.2s ease;
}
.sponsors a:hover {
  border: 1px solid #d1d5db;
}

/* Problem text */
.problem-text {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 12px 16px;
  margin-bottom: 20px;
  font-size: 15px;
}

/* Status labels */
.status-working { font-weight: bold; color: #555; }
.status-yes { font-weight: bold; color: #16a34a; }
.status-no { font-weight: bold; color: #dc2626; }

/* Trial results */
.trial-result {
  border-radius: 6px;
  padding: 6px;
  font-size: 0.85em;
}
.trial-status-no {
  background: #fee2e2;
  border: 1px solid #ef4444;
  color: #991b1b;
}
.trial-status-partial, .trial-status-yes {
  background: #dcfce7;
  border: 1px solid #22c55e;
  color: #166534;
}
.trial-status-unknown {
  background: #f3f4f6;
  border: 1px solid #9ca3af;
  color: #374151;
}

/* Tooltip */
.tooltip {
  display: none;
  position: absolute;
  border: 1px solid #333;
  background: #111;
  border-radius: 6px;
  padding: 8px;
  color: #fff;
  font-size: 12px;
}

/* Charts */
.bar rect { fill: #2563eb; }
.bar text { fill: #fff; }
.axis path, .axis line { stroke: #111; }

/* Pre container for copy button */
pre {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 12px 16px;
  font-family: "Fira Code", monospace;
  font-size: 14px;
  line-height: 1.4;
}

/* Inline code inside pre */
pre code {
  background: transparent;
  padding: 0;
  font-size: inherit;
}

/* Modern dropdown without glitchy arrow */
select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 14px;
  color: #1e293b;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
}

/* Hover & focus */
select:hover,
select:focus {
  border-color: #2563eb;
  background: #f9fafb;
  outline: none;
}
`
    // Better CSS
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    const oldCss = document.querySelector('link[href="current/usaco.css?v=2.0"]');
    if (oldCss) oldCss.remove();

    if (window.location.href.includes("index.php?page=viewproblem2")) {
        // == Problem year and date in page title ==
        let problemDate = document.querySelector('.panel h2')?.innerText;
        let problemName = document.querySelector('.panel h2:nth-child(2)')?.innerText?.split('. ')[1];

        if (problemDate && problemName) {
            let date = problemDate.match(/USACO (\d{4}) (.*) Contest/);
            if (date) {
                document.title = `USACO - ${problemName} (${date[2].substring(0, 3)} ${date[1]})`;
            }
        }

        // == Persistent language selector ==
        let languageSelector = document.querySelector("select[name='language']");
        if (languageSelector) {
            let lastLang = await GM.getValue('lastLang');
            if (lastLang !== undefined) {
                languageSelector.value = lastLang;
            }

            languageSelector.addEventListener('change', async () => {
                await GM.setValue("lastLang", languageSelector.value);
            });
        }
        const submitButton = document.querySelector("#solution-submit");
        if (submitButton && languageSelector) {
            submitButton.addEventListener("click", async () => {
                // Save the current language (the one selected at submit time)
                let currentLang = languageSelector.value;
                await GM.setValue("lastLang", currentLang);

                // Remember what it was before changing
                let originalLang = languageSelector.value;

                // (Optional: here you could change languageSelector.value = something else)
                // But since you're already on currentLang, we just save it

                // After 500 ms, restore the original language
                setTimeout(() => {
                    languageSelector.value = originalLang;
                }, 500);
            });
        }

        // == File extension to language auto-select ==
        const fileExtensionToLanguage = {
            c: 0, // C
            cpp: 2, // C++17
            java: 3, // Java
            py: 5, // Python 3.6.9
        };

        const fileSelector = document.getElementsByName("sourcefile")[0];
        if (fileSelector && languageSelector) {
            fileSelector.onchange = function () {
                const files = fileSelector.files;
                if (files.length > 0) {
                    const file = files[0];
                    const name = file.name;
                    const extension = name.substr(name.lastIndexOf(".") + 1).toLowerCase();
                    if (extension in fileExtensionToLanguage) {
                        languageSelector.selectedIndex = fileExtensionToLanguage[extension];
                    }
                }
            };
        }

        // == Copy codeblocks to clipboard ==
        document.querySelectorAll('pre').forEach(block => {
            block.style.position = 'relative';

            let copy = document.createElement("button");
            copy.style.position = 'absolute';
            copy.style.top = 0;
            copy.style.right = 0;
            copy.innerText = 'Copy';

            block.appendChild(copy);

            copy.addEventListener('click', () => {
                let text = block.innerText;
                GM.setClipboard(text.substring(0, text.length - 4));
            });
        });
    }
})();
