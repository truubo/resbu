// ==UserScript==
// @name         Luobu
// @namespace    http://tampermonkey.net/
// @version      2024-02-25
// @description  Join Luobu servers on Roblox
// @author       trubo
// @match        https://www.roblox.com/games/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        GM.xmlHttpRequest
// @grant        GM_cookie
// @grant        GM.cookie
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

(function() {
    'use strict';
    const luobu_button = document.createElement("button")
    const luobu_text = document.createTextNode("玩")
    let roblosecurity;
    var clicked = false;
    luobu_button.className = "btn-common-play-game-lg btn-primary-md btn-full-width"
    luobu_button.style = "margin-left: 5px; margin-right: 5px;";
    luobu_button.appendChild(luobu_text);
    document.getElementById("game-details-play-button-container").appendChild(luobu_button)
    luobu_button.onclick = function() {
        const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("data-token");
        if (GM_getValue("rs") == null) {
            roblosecurity = prompt("What is your ROBLOSECURITY? I can't get it automatically due to obvious security reasons");
            GM_setValue("rs", roblosecurity);
        } else {
             roblosecurity = GM_getValue("rs");
        }
        var ticket = ""; //JAVASCRIPT IS SO RETARDED
        const placeid = document.location.href.split("/games/")[1].split("/")[0]
        const uuid = "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
        GM.xmlHttpRequest({
            method: "POST",
            url: "https://auth.s.robloxdev.cn/v1/authentication-ticket",
            body: null,
            headers: {
                "X-CSRF-Token": csrf,
                "Cookie": ".ROBLOSECURITY=" + roblosecurity,
                "Origin": "https://www.roblox.com",
                "Referer": "https://www.roblox.com"
            },
            onload: function(response) {
                //alert(JSON.stringify(response.responseHeaders.split("rbx-authentication-ticket: ")[1].split("\n")[0])) //Stupid fucking headers being returned as a string
                try {
                    ticket = response.responseHeaders.split("rbx-authentication-ticket: ")[1].split("\n")[0].replace("\r", "");
                    document.location.href = "roblox-player:1+launchmode:play+gameinfo:" + ticket + "+launchtime:1626753000000+placelauncherurl:https%3A%2F%2Fassetgame.s.robloxdev.cn%2Fgame%2FPlaceLauncher.ashx%3Frequest%3DRequestGame%26browserTrackerId%3D189146708336%26placeId%3D" + placeid + "+%26isPlayTogetherGame%3Dfalse%26joinAttemptId%3D" + uuid + "%26joinAttemptOrigin%3DPlayButton+browsertrackerid:189146708336+robloxLocale:en_us+gameLocale:en_us+channel:zflag+LaunchExp:InApp";
                    alert("Client launched!")
                } catch (e) {
                    if (clicked == false) {
                        alert("Failed to start game. Try refreshing the page. Clicking the join button again will prompt you to enter your ROBLOSECURITY again.")
                        clicked = true
                    } else {
                        roblosecurity = prompt("What is your ROBLOSECURITY? I can't get it automatically due to obvious security reasons");
                        GM_setValue("rs", roblosecurity);
                        alert("ROBLOSECURITY updated. Please click play again.")
                    }
                }
            }
        })
    }
})();
