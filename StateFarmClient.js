// ==UserScript==
// @name         StateFarm Client V3
// @namespace    http://github.com/Hydroflame522/StateFarmClient/
// @version      3.3.0
// @license      GPL-3.0
// @description  Only public script with bloom cheats! Best cheats menu for Shell Shockers in 2024. Many modules such as Aimbot, PlayerESP, AmmoESP, Chams, Nametags, Join/Leave messages, Chat Filter Disabling, AntiAFK, FOV Slider, Zooming, Co-ords, Player Stats, Auto Refill and many more whilst having unsurpassed customisation options such as binding to any key, easily editable colour scheme and themes - all on the fly!
// @author       Hydroflame521, onlypuppy7, enbyte and notfood
// @match        *://shellshock.io/*
// @match        *://algebra.best/*
// @match        *://algebra.vip/*
// @match        *://biologyclass.club/*
// @match        *://deadlyegg.com/*
// @match        *://deathegg.world/*
// @match        *://eggboy.club/*
// @match        *://eggboy.xyz/*
// @match        *://eggcombat.com/*
// @match        *://egg.dance/*
// @match        *://eggfacts.fun/*
// @match        *://egghead.institute/*
// @match        *://eggisthenewblack.com/*
// @match        *://eggsarecool.com/*
// @match        *://geometry.best/*
// @match        *://geometry.monster/*
// @match        *://geometry.pw/*
// @match        *://geometry.report/*
// @match        *://hardboiled.life/*
// @match        *://hardshell.life/*
// @match        *://humanorganising.org/*
// @match        *://mathactivity.xyz/*
// @match        *://mathactivity.club/*
// @match        *://mathdrills.info/*
// @match        *://mathdrills.life/*
// @match        *://mathfun.rocks/*
// @match        *://mathgames.world/*
// @match        *://math.international/*
// @match        *://mathlete.fun/*
// @match        *://mathlete.pro/*
// @match        *://overeasy.club/*
// @match        *://scrambled.tech/*
// @match        *://scrambled.today/*
// @match        *://scrambled.us/*
// @match        *://scrambled.world/*
// @match        *://shellshockers.club/*
// @match        *://shellshockers.site/*
// @match        *://shellshockers.us/*
// @match        *://shellshockers.world/*
// @match        *://shellshockers.xyz/*
// @match        *://shellsocks.com/*
// @match        *://softboiled.club/*
// @match        *://urbanegger.com/*
// @match        *://violentegg.club/*
// @match        *://violentegg.fun/*
// @match        *://yolk.best/*
// @match        *://yolk.life/*
// @match        *://yolk.rocks/*
// @match        *://yolk.tech/*
// @match        *://yolk.quest/*
// @match        *://yolk.today/*
// @match        *://zygote.cafe/*
// @icon         https://raw.githubusercontent.com/Hydroflame522/StateFarmClient/main/icons/StateFarmClientLogo384px.png
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js
// @downloadURL  https://github.com/Hydroflame522/StateFarmClient/raw/main/StateFarmClient.js
// @updateURL    https://github.com/Hydroflame522/StateFarmClient/raw/main/StateFarmClient.js
// @run-at       document-start
// ==/UserScript==
(function () {
    //script info
    const name="StateFarmClient";
    const version="3.3.0";
    //startup sequence
    const startUp=function () {
        mainLoop()
        injectScript()
        document.addEventListener("DOMContentLoaded", function () {
            initMenu();
            applyStylesAddElements(); //set font and change menu cass, and other stuff to do with the page
            const intervalId1 = setInterval(everySecond, 1000);
            const intervalId2 = setInterval(updateConfig, 100);
        });
    };
    //INIT VARS
    window.newGame=false
    let binding=false;
    let lastSpamMessage=0;
    let lastAntiAFKMessage=0;
    let lastSentMessage="";
    let yawCache=0;
    let yawDiff=0;
    let pitchCache=0;
    let pitchDiff=0;
    let targetingComplete=false;
    let yourPlayerKills = 0;
    let currentlyTargetingName = "none";
    let username = "";
    const allModules=[];
    const allFolders=[];
    const F=[];
    const functionNames=[];
    const isKeyToggled={};
    let ESPArray=[];
    let onlinePlayersArray=[];
    let bindsArray={};
    const tp={}; // <-- tp = tweakpane
    let ss,msgElement,coordElement,automatedElement,playerinfoElement,playerstatsElement,redCircle,crosshairsPosition,currentlyTargeting,ammo,ranOneTime,lastWeaponBox,lastChatItemLength,config;
    let whitelistPlayers,blacklistPlayers,playerLookingAt,playerNearest,enemyLookingAt,enemyNearest,AUTOMATED,ranEverySecond,currentlyInGame;
    let isLeftButtonDown = false;
    let isRightButtonDown = false;
    let proxyList = [
        'shellshock.io', 'algebra.best', 'algebra.vip', 'biologyclass.club', 'deadlyegg.com', 'deathegg.world', 'eggboy.club', 'eggboy.xyz', 'eggcombat.com', 'egg.dance',
        'eggfacts.fun', 'egghead.institute', 'eggisthenewblack.com', 'eggsarecool.com', 'geometry.best', 'geometry.monster', 'geometry.pw', 'geometry.report', 'hardboiled.life',
        'hardshell.life', 'humanorganising.org', 'mathactivity.xyz', 'mathactivity.club', 'mathdrills.info', 'mathdrills.life', 'mathfun.rocks', 'mathgames.world', 'math.international',
        'mathlete.fun', 'mathlete.pro', 'overeasy.club', 'scrambled.tech', 'scrambled.today', 'scrambled.us', 'scrambled.world', 'shellshockers.club', 'shellshockers.site',
        'shellshockers.us', 'shellshockers.world', 'shellshockers.xyz', 'shellsocks.com', 'softboiled.club', 'urbanegger.com', 'violentegg.club', 'violentegg.fun', 'yolk.best', 'yolk.life',
        'yolk.rocks', 'yolk.tech', 'yolk.quest', 'yolk.today', 'zygote.cafe'
    ];
    proxyList=[...proxyList].sort(() => Math.random() - 0.5);
    let proxyListIndex=0;
    
    //menu interaction functions
    const extract = function (variable,shouldUpdate) {
        if (shouldUpdate) {updateConfig()};
        return config[variable];
    };
    const beginBinding = function (value) {
        if (binding == false) {
            binding=value;
            tp[binding+"BindButton"].title="PRESS KEY";
        };
    };
    const change = function (module,newValue) { //its important to note that every module must have a unique name
        const labels = document.querySelectorAll('.tp-lblv_l');
        const moduleButton=module+"Button";
        const moduleLabel=tp[moduleButton].label;
        for (const label of labels) {
            if (label.textContent.includes(moduleLabel)) {
                const inputContainer = label.nextElementSibling;
                const currentValue=extract(module);
                // check for checkbox
                const checkbox = inputContainer.querySelector('.tp-ckbv_i');
                if (checkbox) {
                    if (newValue==undefined) {
                        newValue=(!currentValue);
                    };
                    if (newValue!=currentValue) {
                        checkbox.click(); // Toggle checkbox
                    };
                    return extract(module,true);
                };
                // check for button
                const button = inputContainer.querySelector('.tp-btnv_b');
                if (button) {
                    button.click(); // Trigger button click
                    return ("NOMSG"); //no change of state, dont show pop up message
                };
                // check for dropdown
                const dropdown = inputContainer.querySelector('.tp-lstv_s');
                if (dropdown) {
                    if (newValue==undefined) { //if youre going to set a list to a certain value, use the int value of the list item
                        newValue=(dropdown.selectedIndex+1) % dropdown.options.length;
                    };
                    dropdown.selectedIndex = newValue;
                    dropdown.dispatchEvent(new Event('change')); // trigger change event for dropdown
                    return extract(module,true);
                };
                // check for dropdown
                const textInput = inputContainer.querySelector('.tp-txtv_i');
                if (textInput) {
                    textInput.value = newValue;
                    textInput.dispatchEvent(new Event('change')); // trigger change event for dropdown
                    return extract(module,true);
                };
            };
        };
    };
    document.addEventListener('mousedown', function (event) {
        if (event.button === 2) {
            isRightButtonDown = true;
        };
        if (event.button === 0) {
            isLeftButtonDown = true;
        };
    });
    document.addEventListener('mouseup', function (event) {
        if (event.button === 2) {
            isRightButtonDown = false;
        };
        if (event.button === 0) {
            isLeftButtonDown = false;
        };
    });
    //menu
    document.addEventListener("keydown", function (event) {
        event=(event.code.substring(3));
        isKeyToggled[event]=true;
    });
    document.addEventListener("keyup", function (event) {
        event=(event.code.replace("Key",""));
        isKeyToggled[event]=false;
        if (document.activeElement&&document.activeElement.tagName==='INPUT' ) {
            return;
        } else if (binding!=false) {
                if (event=="Delete") { event="Set Bind" };
                tp[binding+"BindButton"].title=event;
                bindsArray[binding]=event;
                localStorage.setItem(binding+"Bind",JSON.stringify(event));
                createPopup("Binded "+tp[binding+"Button"].label+" to key: "+event);
                binding=false;
        } else {
            Object.keys(bindsArray).forEach(function (module) {
                if ((bindsArray[module] == event) && module!="zoom") {
                    let state=change(module)
                    let popupText=state
                    if (typeof state === "boolean") {
                        state=(state?"ON":"OFF");
                    };
                    if (state!="NOMSG") {
                        popupText="Set "+module+" to: "+state;
                        if (extract("announcer")) {
                            sendChatMessage("I just set "+module+" to "+state+"!");
                        };
                    } else {
                        switch (module) {
                            case ("hide"):
                                popupText="Toggled GUI"; break;
                            case ("panic"):
                                popupText="Exiting to set URL..."; break;
                        };
                    };
                    createPopup(popupText);
                };
            });
        };
    });
    const initTab = function(tab) {
        tp[tab.storeAs]=tab.location.addTab({
            pages: [
            {title: 'Modules'},
            {title: 'Binds'},
            ],
        });
    };
    const initFolder = function(folder) {
        tp[folder.storeAs]=folder.location.addFolder({
            title: folder.title,
            expanded: JSON.parse(localStorage.getItem(folder.storeAs)) !== null ? JSON.parse(localStorage.getItem(folder.storeAs)) : false
        });
        allFolders.push(folder.storeAs);
    };
    const initModule = function (module) {
        const value={}
        value[module.storeAs]=(JSON.parse(localStorage.getItem(module.storeAs)) || (module.defaultValue !== undefined ? module.defaultValue : false));
        if (!(module.slider&&module.slider.step)) {module.slider={}};
        const config={
            label: module.title,
            options: module.dropdown,
            min: module.slider.min,
            max: module.slider.max,
            step: module.slider.step,
            title: module.button,
        };
        if (!module.button) {
            tp[(module.storeAs+"Button")]=module.location.addInput(value,module.storeAs,config
            ).on("change", (value) => {
                localStorage.setItem(module.storeAs,JSON.stringify(value.value));
                if (module.changeFunction!==undefined) {module.changeFunction(value)};
            });
        } else {
            tp[(module.storeAs+"Button")]=module.location.addButton({
                label: module.title,
                title: module.button,
            }).on("click", (value) => {
                if (module.clickFunction!==undefined) {module.clickFunction(value)};
            });
        };
        allModules.push(name.replace("Button",""));
        if (module.bindLocation) {initBind(module)};
    };
    const initBind = function (module) {
        const theBind=(JSON.parse(localStorage.getItem(module.storeAs+"Bind")) || module.defaultBind || "Set Bind");
        tp[(module.storeAs+"BindButton")]=module.bindLocation.addButton({
            label: module.title,
            title: theBind,
        }).on("click", (value) => {
            beginBinding(module.storeAs);
        });
        bindsArray[module.storeAs]=theBind;
    };
    const initMenu = function () {
        //INIT MENU
        //init tp.pane

        tp.pane = new Tweakpane.Pane();
        tp.pane.title = name + " v" + version;
        //COMBAT MODULES
        initFolder({ location: tp.pane, title: "Combat", storeAs: "combatFolder",});
        initTab({ location: tp.combatFolder, storeAs: "combatTab" })
            initModule({ location: tp.combatTab.pages[0], title: "Aimbot", storeAs: "aimbot", bindLocation: tp.combatTab.pages[1], defaultBind:"V",});
            initFolder({ location: tp.combatTab.pages[0], title: "Aimbot Options", storeAs: "aimbotFolder",});
                initModule({ location: tp.aimbotFolder, title: "Target", storeAs: "aimbotTargeting", bindLocation: tp.combatTab.pages[1], defaultBind:"T", dropdown: [{text: "Pointing At", value: "pointingat"}, {text: "Nearest", value: "nearest"}], defaultValue: "pointingat"});
                initModule({ location: tp.aimbotFolder, title: "ToggleRM", storeAs: "aimbotRightClick", bindLocation: tp.combatTab.pages[1],});
                initModule({ location: tp.aimbotFolder, title: "AntiBloom", storeAs: "antiBloom", bindLocation: tp.combatTab.pages[1],});
                initModule({ location: tp.aimbotFolder, title: "SilentAim", storeAs: "silentAimbot", bindLocation: tp.combatTab.pages[1],});
                initModule({ location: tp.aimbotFolder, title: "AntiSwitch", storeAs: "antiSwitch", bindLocation: tp.combatTab.pages[1],});
                initModule({ location: tp.aimbotFolder, title: "LineOfSight", storeAs: "lineOfSight", bindLocation: tp.combatTab.pages[1],});
                initModule({ location: tp.aimbotFolder, title: "1 Kill", storeAs: "oneKill", bindLocation: tp.combatTab.pages[1],});
                initModule({ location: tp.aimbotFolder, title: "Prediction", storeAs: "prediction", bindLocation: tp.combatTab.pages[1],});
                initModule({ location: tp.aimbotFolder, title: "Antisnap", storeAs: "aimbotAntiSnap", bindLocation: tp.combatTab.pages[1], slider: {min: 0, max: 0.99, step: 0.01}, defaultValue: 0,});
                initModule({ location: tp.aimbotFolder, title: "Antisneak", storeAs: "antiSneak", bindLocation: tp.combatTab.pages[1], slider: {min: 0, max: 5, step: 0.2}, defaultValue: 0,});
                initModule({ location: tp.aimbotFolder, title: "ESPColor", storeAs: "aimbotColor", defaultValue: "#0000ff"});
            initModule({ location: tp.combatTab.pages[0], title: "Auto Refill", storeAs: "autoRefill", bindLocation: tp.combatTab.pages[1],});
            initModule({ location: tp.combatTab.pages[0], title: "TurboFire", storeAs: "holdToFire", bindLocation: tp.combatTab.pages[1],});
            // initModule({ location: tp.combatTab.pages[0], title: "Auto Fire", storeAs: "autoFire", bindLocation: tp.combatTab.pages[1],});
            initModule({ location: tp.combatTab.pages[0], title: "GrenadeMAX", storeAs: "grenadeMax", bindLocation: tp.combatTab.pages[1],});
        //RENDER MODULES
        initFolder({ location: tp.pane, title: "Render", storeAs: "renderFolder",});
        initTab({ location: tp.renderFolder, storeAs: "renderTab" })
            initModule({ location: tp.renderTab.pages[0], title: "PlayerESP", storeAs: "playerESP", bindLocation: tp.renderTab.pages[1],});
            initModule({ location: tp.renderTab.pages[0], title: "Tracers", storeAs: "tracers", bindLocation: tp.renderTab.pages[1],});
            initModule({ location: tp.renderTab.pages[0], title: "Chams", storeAs: "chams", bindLocation: tp.renderTab.pages[1],});
            initModule({ location: tp.renderTab.pages[0], title: "Targets", storeAs: "targets", bindLocation: tp.renderTab.pages[1],});
            initModule({ location: tp.renderTab.pages[0], title: "Nametags", storeAs: "nametags", bindLocation: tp.renderTab.pages[1],});
            initFolder({ location: tp.renderTab.pages[0], title: "Player ESP/Tracers Options", storeAs: "tracersFolder",});
                initModule({ location: tp.tracersFolder, title: "Type", storeAs: "tracersType", bindLocation: tp.renderTab.pages[1], dropdown: [{text: "Static", value: "static"}, {text: "Proximity", value: "proximity"}], defaultValue: "static",});
                initModule({ location: tp.tracersFolder, title: "Color 1", storeAs: "tracersColor1", defaultValue: "#ff0000",});
                initModule({ location: tp.tracersFolder, title: "Dist 1->2", storeAs: "tracersColor1to2", slider: {min: 0, max: 30, step: 0.25}, defaultValue: 5,});
                initModule({ location: tp.tracersFolder, title: "Color 2", storeAs: "tracersColor2", defaultValue: "#00ff00",});
                initModule({ location: tp.tracersFolder, title: "Dist 2->3", storeAs: "tracersColor2to3", slider: {min: 0, max: 30, step: 0.25}, defaultValue: 15,});
                initModule({ location: tp.tracersFolder, title: "Color 3", storeAs: "tracersColor3", defaultValue: "#ffffff",});
            initFolder({ location: tp.renderTab.pages[0], title: "Ammo ESP/Tracers Options", storeAs: "tracersAmmoFolder",});
                initFolder({ location: tp.tracersAmmoFolder, title: "Ammo", storeAs: "ammoFolder",});
                    initModule({ location: tp.ammoFolder, title: "AESP", storeAs: "ammoESP", bindLocation: tp.renderTab.pages[1],});
                    initModule({ location: tp.ammoFolder, title: "ATracers", storeAs: "ammoTracers", bindLocation: tp.renderTab.pages[1],});
                    initModule({ location: tp.ammoFolder, title: "ARegime", storeAs: "ammoESPRegime", bindLocation: tp.renderTab.pages[1], dropdown: [{text: "When Depleted", value: "whendepleted"},{text: "When Low", value: "whenlow"},{text: "Below Max", value: "belowmax"},{text: "Always On", value: "alwayson"},], defaultValue: "whendepleted"});
                    initModule({ location: tp.ammoFolder, title: "AColor", storeAs: "ammoESPColor", defaultValue: "#ffff00",});
                initFolder({ location: tp.tracersAmmoFolder, title: "Grenades", storeAs: "grenadesFolder",});
                    initModule({ location: tp.grenadesFolder, title: "GESP", storeAs: "grenadeESP", bindLocation: tp.renderTab.pages[1],});
                    initModule({ location: tp.grenadesFolder, title: "GTracers", storeAs: "grenadeTracers", bindLocation: tp.renderTab.pages[1],});
                    initModule({ location: tp.grenadesFolder, title: "GRegime", storeAs: "grenadeESPRegime", bindLocation: tp.renderTab.pages[1], dropdown: [{text: "When Depleted", value: "whendepleted"},{text: "When Low", value: "whenlow"},{text: "Below Max", value: "belowmax"},{text: "Always On", value: "alwayson"},], defaultValue: "whendepleted"});
                    initModule({ location: tp.grenadesFolder, title: "GColor", storeAs: "grenadeESPColor", defaultValue: "#00ffff",});
            initModule({ location: tp.renderTab.pages[0], title: "FOV", storeAs: "fov", slider: {min: 0, max: 360, step: 3}, defaultValue: 72,});
            initModule({ location: tp.renderTab.pages[0], title: "Zoom FOV", storeAs: "zoom", slider: {min: 0, max: 72, step: 3}, defaultValue: 15, bindLocation: tp.renderTab.pages[1], defaultBind: "C",});
            initModule({ location: tp.renderTab.pages[0], title: "Show Bloom", storeAs: "revealBloom", bindLocation: tp.renderTab.pages[1],});
            initModule({ location: tp.renderTab.pages[0], title: "Show LOS", storeAs: "showLOS", bindLocation: tp.renderTab.pages[1],});
            initModule({ location: tp.renderTab.pages[0], title: "CamWIP", storeAs: "freecam", bindLocation: tp.renderTab.pages[1],});
            initModule({ location: tp.renderTab.pages[0], title: "Co-ords", storeAs: "showCoordinates", bindLocation: tp.renderTab.pages[1],});
            initModule({ location: tp.renderTab.pages[0], title: "HP Display", storeAs: "playerStats", bindLocation: tp.renderTab.pages[1],});
            initModule({ location: tp.renderTab.pages[0], title: "PlayerInfo", storeAs: "playerInfo", bindLocation: tp.renderTab.pages[1],});
            initModule({ location: tp.renderTab.pages[0], title: "Wireframe", storeAs: "wireframe", bindLocation: tp.renderTab.pages[1],});
            initModule({ location: tp.renderTab.pages[0], title: "Egg Size", storeAs: "eggSize", slider: {min: 0, max: 10, step: 0.25}, defaultValue: 1,});
        //CHAT MODULES
        initFolder({ location: tp.pane, title: "Chat", storeAs: "chatFolder",});
        initTab({ location: tp.chatFolder, storeAs: "chatTab" })
            initModule({ location: tp.chatTab.pages[0], title: "InfiniHistory", storeAs: "chatExtend", bindLocation: tp.chatTab.pages[1],});
            initModule({ location: tp.chatTab.pages[0], title: "Max Ingame", storeAs: "maxChat", slider: {min: 0, max: 30, step: 1}, defaultValue: 5,});
            initModule({ location: tp.chatTab.pages[0], title: "ShowFiltered", storeAs: "disableChatFilter", bindLocation: tp.chatTab.pages[1],});
            initModule({ location: tp.chatTab.pages[0], title: "BypassFilter", storeAs: "chatFilterBypass", bindLocation: tp.chatTab.pages[1],});;
            initModule({ location: tp.chatTab.pages[0], title: "AntiAFK", storeAs: "antiAFK", bindLocation: tp.chatTab.pages[1],});
            initModule({ location: tp.chatTab.pages[0], title: "Tall Chat", storeAs: "tallChat", bindLocation: tp.chatTab.pages[1],});
            initModule({ location: tp.chatTab.pages[0], title: "HighlightTxt", storeAs: "chatHighlight", bindLocation: tp.chatTab.pages[1],});
            initModule({ location: tp.chatTab.pages[0], title: "Spammer", storeAs: "spamChat", bindLocation: tp.chatTab.pages[1],});
            initFolder({ location: tp.chatTab.pages[0], title: "Spammer Options", storeAs: "spammerFolder",});
                initModule({ location: tp.spammerFolder, title: "Delay (ms)", storeAs: "spamChatDelay", slider: {min: 0, max: 60000, step: 10}, defaultValue: 500,});
                initModule({ location: tp.spammerFolder, title: "Spam Text", storeAs: "spamChatText", defaultValue: "StateFarm On Top! ",});
            initFolder({ location: tp.chatTab.pages[0], title: "Trolling", storeAs: "trollingFolder",});
                initModule({ location: tp.trollingFolder, title: "Mock", storeAs: "mockMode", bindLocation: tp.chatTab.pages[1],});
                initModule({ location: tp.trollingFolder, title: "Announcer", storeAs: "announcer", bindLocation: tp.chatTab.pages[1],});
                initModule({ location: tp.trollingFolder, title: "AutoEZ", storeAs: "autoEZ", bindLocation: tp.chatTab.pages[1],});
                initModule({ location: tp.trollingFolder, title: "CheatAccuse", storeAs: "cheatAccuse", bindLocation: tp.chatTab.pages[1],});
            initFolder({ location: tp.chatTab.pages[0], title: "Join/Leave Msgs Options", storeAs: "joinLeaveFolder",});
                initModule({ location: tp.joinLeaveFolder, title: "Join Msgs", storeAs: "joinMessages", bindLocation: tp.chatTab.pages[1],});
                initModule({ location: tp.joinLeaveFolder, title: "Leave Msgs", storeAs: "leaveMessages", bindLocation: tp.chatTab.pages[1],});
                initModule({ location: tp.joinLeaveFolder, title: "Send2Chat", storeAs: "publicBroadcast", bindLocation: tp.chatTab.pages[1],});
                initModule({ location: tp.joinLeaveFolder, title: "Branded", storeAs: "joinLeaveBranding", bindLocation: tp.chatTab.pages[1],});
        //LISTS MODULES
        initFolder({ location: tp.pane, title: "Lists", storeAs: "listsFolder",});
        initTab({ location: tp.listsFolder, storeAs: "listsTab" })
            initModule({ location: tp.listsTab.pages[0], title: "Whitelist", storeAs: "whitelist", defaultValue: "User-1, User-2",});
            initFolder({ location: tp.listsTab.pages[0], title: "Whitelist (Target Only) Options", storeAs: "whitelistFolder",});
                initModule({ location: tp.whitelistFolder, title: "WAimbot", storeAs: "enableWhitelistAimbot", bindLocation: tp.listsTab.pages[1],});
                initModule({ location: tp.whitelistFolder, title: "WESP", storeAs: "enableWhitelistTracers", bindLocation: tp.listsTab.pages[1],});
                initModule({ location: tp.whitelistFolder, title: "WESPType", storeAs: "whitelistESPType", bindLocation: tp.listsTab.pages[1], dropdown: [{text: "Only Include", value: "onlyinclude"},{text: "Highlight", value: "highlight"},], defaultValue: "onlyinclude",});
                initModule({ location: tp.whitelistFolder, title: "WHighlight", storeAs: "whitelistColor", defaultValue: "#e80aac",});
            initModule({ location: tp.listsTab.pages[0], title: "Blacklist", storeAs: "blacklist", defaultValue: "User-1, User-2",});
            initFolder({ location: tp.listsTab.pages[0], title: "Blacklist (Exclude) Options", storeAs: "blacklistFolder",});
                initModule({ location: tp.blacklistFolder, title: "BAimbot", storeAs: "enableBlacklistAimbot", bindLocation: tp.listsTab.pages[1],});
                initModule({ location: tp.blacklistFolder, title: "BESP", storeAs: "enableBlacklistTracers", bindLocation: tp.listsTab.pages[1],});
                initModule({ location: tp.blacklistFolder, title: "BESPType", storeAs: "blacklistESPType", bindLocation: tp.listsTab.pages[1], dropdown: [{text: "Just Exclude", value: "justexclude"},{text: "Highlight", value: "highlight"},], defaultValue: "justexclude",});
                initModule({ location: tp.blacklistFolder, title: "BHighlight", storeAs: "blacklistColor", defaultValue: "#00ff00",});
        //AUTOMATION MODULES
        initFolder({ location: tp.pane, title: "Automation", storeAs: "automationFolder",});
        initTab({ location: tp.automationFolder, storeAs: "automationTab" })
            initFolder({ location: tp.automationTab.pages[0], title: "Auto Join Options", storeAs: "autoJoinFolder",});
                initModule({ location: tp.autoJoinFolder, title: "AutoRespawn", storeAs: "autoRespawn", bindLocation: tp.automationTab.pages[1],});
                initModule({ location: tp.autoJoinFolder, title: "Auto Shoot", storeAs: "autoShoot", bindLocation: tp.automationTab.pages[1],});
                initModule({ location: tp.autoJoinFolder, title: "AutoWeapon", storeAs: "autoWeapon", bindLocation: tp.automationTab.pages[1], dropdown: [{text: "Disabled", value: "disabled"}, {text: "EggK-47", value: "eggk47"}, {text: "Scrambler", value: "scrambler"}, {text: "Free Ranger", value: "freeranger"}, {text: "RPEGG", value: "rpegg"}, {text: "Whipper", value: "whipper"}, {text: "Crackshot", value: "crackshot"}, {text: "Tri-Hard", value: "trihard"}], defaultValue: "pointingat"});
                initModule({ location: tp.autoJoinFolder, title: "Auto Join", storeAs: "autoJoin", bindLocation: tp.automationTab.pages[1],});
                initModule({ location: tp.autoJoinFolder, title: "Join Code", storeAs: "joinCode", defaultValue: "CODE",});
                initModule({ location: tp.autoJoinFolder, title: "Get Code", storeAs: "getCode", button: "Retrieve", clickFunction: function(){change("joinCode",ss.GAMECODE)},});
                initModule({ location: tp.autoJoinFolder, title: "Username", storeAs: "usernameAutoJoin", defaultValue: "StateFarmer",});
                initModule({ location: tp.autoJoinFolder, title: "Copy Name", storeAs: "copyNames", bindLocation: tp.automationTab.pages[1],});
        //BOTTING MODULES
        initFolder({ location: tp.pane, title: "Botting", storeAs: "bottingFolder",});
        initTab({ location: tp.bottingFolder, storeAs: "bottingTab" })
            initModule({ location: tp.bottingTab.pages[0], title: "Bots Amount", storeAs: "numberBots", slider: {min: 1, max: 15, step: 1}, defaultValue: 1,});
            initFolder({ location: tp.bottingTab.pages[0], title: "Parameters", storeAs: "botParamsFolder",});
                initModule({ location: tp.botParamsFolder, title: "Join Game", storeAs: "botAutoJoin", bindLocation: tp.bottingTab.pages[1],});
                initModule({ location: tp.botParamsFolder, title: "Name", storeAs: "botUsername", defaultValue: "StateFarmer",});
                initModule({ location: tp.botParamsFolder, title: "AntiDupe", storeAs: "botAntiDupe", bindLocation: tp.bottingTab.pages[1],});
                initModule({ location: tp.botParamsFolder, title: "CopyNames", storeAs: "botCopyName", bindLocation: tp.bottingTab.pages[1],});
                initModule({ location: tp.botParamsFolder, title: "Game Code", storeAs: "botJoinCode", defaultValue: "CODE",});
                initModule({ location: tp.botParamsFolder, title: "Get Code", storeAs: "getCode", button: "Retrieve", clickFunction: function(){change("botJoinCode",ss.GAMECODE)},});
                initModule({ location: tp.botParamsFolder, title: "EnableMock", storeAs: "botMock", bindLocation: tp.bottingTab.pages[1],});
                initModule({ location: tp.botParamsFolder, title: "EnablePlay", storeAs: "botRespawn", bindLocation: tp.bottingTab.pages[1],});
                initModule({ location: tp.botParamsFolder, title: "DoSeizure", storeAs: "botSeizure", bindLocation: tp.bottingTab.pages[1],});
                initModule({ location: tp.botParamsFolder, title: "DoShoot", storeAs: "botAutoShoot", bindLocation: tp.bottingTab.pages[1],});
                initModule({ location: tp.botParamsFolder, title: "DoAimbot", storeAs: "botAimbot", bindLocation: tp.bottingTab.pages[1],});
            initModule({ location: tp.bottingTab.pages[0], title: "Deploy", storeAs: "deployBots", bindLocation: tp.bottingTab.pages[1], button: "START BOTS!", clickFunction: function(){deployBots()},});

        //MISC MODULES
        initFolder({ location: tp.pane, title: "Misc", storeAs: "miscFolder",});
        initTab({ location: tp.miscFolder, storeAs: "miscTab" })
            initModule({ location: tp.miscTab.pages[0], title: "Unban", storeAs: "unban", button: "UNBAN NOW", clickFunction: function(){
                const userConfirmed=confirm("Unban works by switching to a proxy URL. By proceeding, you will enter another URL for Shell Shockers but your data doesn't get transferred.");
                if (userConfirmed) {
                    window.location.replace("https://"+proxyList[3]);
                };
            },});
            initModule({ location: tp.miscTab.pages[0], title: "Unlock Skins", storeAs: "unlockSkins", bindLocation: tp.miscTab.pages[1],});
            initModule({ location: tp.miscTab.pages[0], title: "ShowStreams", storeAs: "showStreams", bindLocation: tp.miscTab.pages[1],});
            initModule({ location: tp.miscTab.pages[0], title: "SilentRoll", storeAs: "silentRoll", bindLocation: tp.miscTab.pages[1],});
            // initModule({ location: tp.miscTab.pages[0], title: "Upside Down", storeAs: "upsideDown", bindLocation: tp.miscTab.pages[1],});
            initFolder({ location: tp.miscTab.pages[0], title: "Seizure Options", storeAs: "seizureFolder",});
                initModule({ location: tp.seizureFolder, title: "SeizureX", storeAs: "enableSeizureX", bindLocation: tp.miscTab.pages[1],});
                initModule({ location: tp.seizureFolder, title: "X Amount", storeAs: "amountSeizureX", slider: {min: -6.283185307179586, max: 6.283185307179586, step: Math.PI/280}, defaultValue: 2,});
                initModule({ location: tp.seizureFolder, title: "SeizureY", storeAs: "enableSeizureY", bindLocation: tp.miscTab.pages[1],});
                initModule({ location: tp.seizureFolder, title: "Y Amount", storeAs: "amountSeizureY", slider: {min: -6.283185307179586, max: 6.283185307179586, step: Math.PI/280}, defaultValue: 2,});
        //CLIENT MODULES
        initFolder({ location: tp.pane, title: "Client & About", storeAs: "clientFolder",});
        initTab({ location: tp.clientFolder, storeAs: "clientTab" })
            initModule({ location: tp.clientTab.pages[0], title: "Hide GUI", storeAs: "hide", bindLocation: tp.clientTab.pages[1], button: "Hide!", clickFunction: function(){tp.pane.hidden=!tp.pane.hidden}, defaultBind:"H",});
            initModule({ location: tp.clientTab.pages[0], title: "Theme", storeAs: "themeType", bindLocation: tp.clientTab.pages[1], dropdown: [
                {text: "Default", value: "defaultTheme"},
                {text: "Iceberg", value: "icebergTheme"},
                {text: "Jetblack", value: "jetblackTheme"},
                {text: "Light", value: "lightTheme"},
                {text: "Retro", value: "retroTheme"},
                {text: "Translucent", value: "translucentTheme"},
                {text: "Statefarmer", value: "statefarmerTheme"},
                {text: "Blurple", value: "blurpleTheme"}
            ], defaultValue: "defaultTheme", changeFunction: function(value) {
                applyTheme(value.value);
            }});
            initModule({ location: tp.clientTab.pages[0], title: "Pop-ups", storeAs: "popups", bindLocation: tp.clientTab.pages[1], defaultValue: true,});
            initModule({ location: tp.clientTab.pages[0], title: "Panic", storeAs: "panic", bindLocation: tp.clientTab.pages[1], button: "EXIT!", clickFunction: function(){if (extract("enablePanic")) { window.location.replace(extract("panicURL")) }}, defaultBind:"X",});
            initFolder({ location: tp.clientTab.pages[0], title: "Panic Options", storeAs: "panicFolder",});
                initModule({ location: tp.panicFolder, title: "Enable", storeAs: "enablePanic", bindLocation: tp.clientTab.pages[1], defaultValue: true,});
                initModule({ location: tp.panicFolder, title: "Set URL", storeAs: "panicURL", defaultValue: "https://classroom.google.com/",});
            initFolder({ location: tp.clientTab.pages[0], title: "Creator's Links", storeAs: "linksFolder",});
                initModule({ location: tp.linksFolder, title: "Discord", storeAs: "discord", button: "Link", clickFunction: function(){window.open("https://discord.gg/mPa95HB7Q6")},});
                initModule({ location: tp.linksFolder, title: "GitHub", storeAs: "github", button: "Link", clickFunction: function(){window.open("https://github.com/Hydroflame522/StateFarmClient")},});
            initModule({ location: tp.clientTab.pages[0], title: "Reset", storeAs: "clear", button: "DELETE", clickFunction: function(){
                const userConfirmed=confirm("Are you sure you want to continue? This will clear all stored keybinds, but also some of the game's stuff too (username, and other stuff).");
                if (userConfirmed) {
                    localStorage.clear();
                    userConfirmed=alert("Reload to reset to defaults.");
                };
            },});
            initModule({ location: tp.clientTab.pages[0], title: "Debug", storeAs: "debug", bindLocation: tp.clientTab.pages[1],});
        initModule({ location: tp.pane, title: "Guide", storeAs: "documentation", button: "Link", clickFunction: function(){window.open("https://github.com/Hydroflame522/StateFarmClient/tree/main#features")},});

        updateConfig();
    };
    //visual functions
    const createPopup = function (text,type) {
        try {
            if (extract("popups")) {
                const messageContainer = document.getElementById('message-container');
                const messages = messageContainer.getElementsByClassName('msg');
                if (messages.length > 5) {
                    messageContainer.removeChild(messages[0]);
                };
                const clonedMsgElement = msgElement.cloneNode(true);
                clonedMsgElement.innerText = text;
                switch (type) {
                    case ("success"):
                        clonedMsgElement.style.border='2px solid rgba(0, 255, 0, 0.5)'; break;
                    case ("error"):
                        clonedMsgElement.style.border='2px solid rgba(255, 0, 0, 0.5)'; break;
                };
                clonedMsgElement.style.display='none';
                const messageOffset=(messages.length+1)*50;
                clonedMsgElement.style.bottom=messageOffset+"px";
                void clonedMsgElement.offsetWidth;
                clonedMsgElement.style.display='';
                messageContainer.appendChild(clonedMsgElement);
                //reorder such that newest is lowest
                for (let i=messages.length-1;i>=0;i--) {
                    messages[i].style.bottom=(((messages.length-i)*50)-40)+"px";
                };
            };
        } catch (error) {
            // Handle the error and display an error message onscreen
            console.error("An error occurred:", error);
            alert("Bollocks! If you're getting this message, injection probably failed. To solve this, perform CTRL+F5 - this performs a hard reload. If this does not work, contact the moderators.");
        }
    };
    const applyStylesAddElements = function (themeToApply = "null") {
        const head = document.head || document.getElementsByTagName('head').pages[0];
        //menu customisation (apply font, button widths, adjust checkbox right slightly, make menu appear on top, add anim to message)
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            @font-face {
                font-family: "Bahnschrift";
                src: url("https://db.onlinewebfonts.com/t/0a6ee448d1bd65c56f6cf256a7c6f20a.eot");
                src: url("https://db.onlinewebfonts.com/t/0a6ee448d1bd65c56f6cf256a7c6f20a.eot?#iefix")format("embedded-opentype"),
                url("https://db.onlinewebfonts.com/t/0a6ee448d1bd65c56f6cf256a7c6f20a.woff2")format("woff2"),
                url("https://db.onlinewebfonts.com/t/0a6ee448d1bd65c56f6cf256a7c6f20a.woff")format("woff"),
                url("https://db.onlinewebfonts.com/t/0a6ee448d1bd65c56f6cf256a7c6f20a.ttf")format("truetype"),
                url("https://db.onlinewebfonts.com/t/0a6ee448d1bd65c56f6cf256a7c6f20a.svg#Bahnschrift")format("svg");
            }
            .tp-dfwv, .tp-rotv_t, .tp-fldv_t, .tp-ckbv_l, .tp-lblv_l, .tp-tabv_i, .msg, .coords, .playerstats, .playerinfo, .automated {
                font-family: 'Bahnschrift', sans-serif !important;
                font-size: 16px;
            }
            .tp-rotv_m, .tp-fldv_m {
                display: none;
            }
            .tp-lblv_v, .tp-lstv, .tp-btnv_b, .tp-btnv_t {
                font-family: 'Bahnschrift';
                font-size: 12px;
            }
            .tp-lblv_l {
                font-size: 14px;
                letter-spacing: -1px;
            }
            .tp-btnv {
                width: 100px;
                margin-left: 60px !important;
            }
            .tp-ckbv_w {
                margin-left: 4px !important;
            }
            .tp-dfwv, .tp-rotv, .tp-rotv_c, .tp-fldv, .tp-fldv_c, .tp-lblv, .tp-lstv, .tp-btnv, .tp-sldv {
                z-index: 9999 !important;
                white-space: nowrap !important;
            }
            @keyframes msg {
                from {
                    transform: translate(-120%, 0);
                    opacity: 0;
                }
                to {
                    transform: none;
                    opacity: 1;
                }
            }
        `;

        document.head.appendChild(styleElement);
        applyTheme();

        //initiate message div and css and shit
        msgElement = document.createElement('div'); // create the element directly
        msgElement.classList.add('msg');
        msgElement.setAttribute('style', `
            position: absolute;
            left: 10px;
            color: #fff;
            background: rgba(0, 0, 0, 0.7);
            font-weight: normal;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.5);
            animation: msg 0.5s forwards, msg 0.5s reverse forwards 3s;
            z-index: 999999;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        `);
        document.body.appendChild(msgElement);
        msgElement.style.display = 'none';
        const messageContainer = document.createElement('div'); //so it can be cloned. i think.
        messageContainer.id = 'message-container';
        document.body.appendChild(messageContainer);
        //initiate coord div and css and shit
        coordElement = document.createElement('div'); // create the element directly
        coordElement.classList.add('coords');
        coordElement.setAttribute('style', `
            position: fixed;
            top: -2px;
            left: -2px;
            color: #fff;
            background: rgba(0, 0, 0, 0.6);
            font-weight: bolder;
            padding: 2px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.5);
            z-index: 999999;
        `);
        document.body.appendChild(coordElement);
        coordElement.style.display = 'none';
        //initiate automated div and css and shit
        automatedElement = document.createElement('div'); // create the element directly
        automatedElement.classList.add('automated');
        automatedElement.setAttribute('style', `
            position: fixed;
            top: -2px;
            right: -2px;
            color: #fff;
            background: rgba(0, 0, 0, 0.6);
            font-weight: bolder;
            padding: 2px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.5);
            z-index: 999999;
        `);
        document.body.appendChild(automatedElement);
        automatedElement.style.display = 'none';
        automatedElement.innerText = 'AUTOMATED WINDOW, KEEP THIS FOCUSED!';
        //initiate hp div and css and shit
        playerstatsElement = document.createElement('div'); // create the element directly
        playerstatsElement.classList.add('playerstats');
        playerstatsElement.setAttribute('style', `
            position: fixed;
            top: 20px;
            left: 280px;
            color: #fff;
            background: rgba(0, 0, 0, 0.6);
            font-weight: bolder;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.5);
            z-index: 999999;
        `);
        document.body.appendChild(playerstatsElement);
        playerstatsElement.style.display = 'none';
        //initiate hp div and css and shit
        playerinfoElement = document.createElement('div'); // create the element directly
        playerinfoElement.classList.add('playerinfo');
        playerinfoElement.setAttribute('style', `
            position: fixed;
            right: 20px;
            bottom: 180px;
            color: #fff;
            background: rgba(0, 0, 0, 0.6);
            font-weight: bolder;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.5);
            z-index: 999999;
        `);
        document.body.appendChild(playerinfoElement);
        playerinfoElement.style.display = 'none';
        //initiate bloom indicator div and css and shit
        redCircle = document.createElement('div');
        redCircle.style.position = 'fixed';
        redCircle.style.width = '5px';
        redCircle.style.height = '5px';
        redCircle.style.borderRadius = '50%';
        redCircle.style.backgroundColor = 'red';
        redCircle.style.transform = 'translate(-50%, -50%)';
        document.body.appendChild(redCircle);
    };
    const applyTheme = function(setTheme) {
        setTheme = (setTheme||extract("themeType")||"defaultTheme");
        switch (setTheme) {
            case ("defaultTheme"):
            rootTheme = `
--tp-base-background-color: hsla(230, 7%, 17%, 1.00);
--tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
--tp-button-background-color: hsla(230, 7%, 70%, 1.00);
--tp-button-background-color-active: hsla(230, 7%, 85%, 1.00);
--tp-button-background-color-focus: hsla(230, 7%, 80%, 1.00);
--tp-button-background-color-hover: hsla(230, 7%, 75%, 1.00);
--tp-button-foreground-color: hsla(230, 7%, 17%, 1.00);
--tp-container-background-color: hsla(230, 7%, 75%, 0.10);
--tp-container-background-color-active: hsla(230, 7%, 75%, 0.25);
--tp-container-background-color-focus: hsla(230, 7%, 75%, 0.20);
--tp-container-background-color-hover: hsla(230, 7%, 75%, 0.15);
--tp-container-foreground-color: hsla(230, 7%, 75%, 1.00);
--tp-groove-foreground-color: hsla(230, 7%, 75%, 0.10);
--tp-input-background-color: hsla(230, 7%, 75%, 0.10);
--tp-input-background-color-active: hsla(230, 7%, 75%, 0.25);
--tp-input-background-color-focus: hsla(230, 7%, 75%, 0.20);
--tp-input-background-color-hover: hsla(230, 7%, 75%, 0.15);
--tp-input-foreground-color: hsla(230, 7%, 75%, 1.00);
--tp-label-foreground-color: hsla(230, 7%, 75%, 0.70);
--tp-monitor-background-color: hsla(230, 7%, 0%, 0.20);
--tp-monitor-foreground-color: hsla(230, 7%, 75%, 0.70);`; break;
        case ( "icebergTheme" ):
            rootTheme = `
--tp-base-background-color: hsla(230, 20%, 11%, 1.00);
--tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
--tp-button-background-color: hsla(230, 10%, 80%, 1.00);
--tp-button-background-color-active: hsla(230, 10%, 95%, 1.00);
--tp-button-background-color-focus: hsla(230, 10%, 90%, 1.00);
--tp-button-background-color-hover: hsla(230, 10%, 85%, 1.00);
--tp-button-foreground-color: hsla(230, 20%, 11%, 1);
--tp-container-background-color: hsla(230, 25%, 16%, 1.00);
--tp-container-background-color-active: hsla(230, 25%, 31%, 1.00);
--tp-container-background-color-focus: hsla(230, 25%, 26%, 1.00);
--tp-container-background-color-hover: hsla(230, 25%, 21%, 1.00);
--tp-container-foreground-color: hsla(230, 10%, 80%, 1.00);
--tp-groove-foreground-color: hsla(230, 20%, 8%, 1.00);
--tp-input-background-color: hsla(230, 20%, 8%, 1.00);
--tp-input-background-color-active: hsla(230, 28%, 23%, 1.00);
--tp-input-background-color-focus: hsla(230, 28%, 18%, 1.00);
--tp-input-background-color-hover: hsla(230, 20%, 13%, 1.00);
--tp-input-foreground-color: hsla(230, 10%, 80%, 1.00);
--tp-label-foreground-color: hsla(230, 12%, 48%, 1.00);
--tp-monitor-background-color: hsla(230, 20%, 8%, 1.00);
--tp-monitor-foreground-color: hsla(230, 12%, 48%, 1.00);`; break;
        case ( "jetblackTheme" ):
            rootTheme = `
--tp-base-background-color: hsla(0, 0%, 0%, 1.00);
--tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
--tp-button-background-color: hsla(0, 0%, 70%, 1.00);
--tp-button-background-color-active: hsla(0, 0%, 85%, 1);
--tp-button-background-color-focus: hsla(0, 0%, 80%, 1.00);
--tp-button-background-color-hover: hsla(0, 0%, 75%, 1.00);
--tp-button-foreground-color: hsla(0, 0%, 0%, 1.00);
--tp-container-background-color: hsla(0, 0%, 10%, 1.00);
--tp-container-background-color-active: hsla(0, 0%, 25%, 1.00);
--tp-container-background-color-focus: hsla(0, 0%, 20%, 1.00);
--tp-container-background-color-hover: hsla(0, 0%, 15%, 1.00);
--tp-container-foreground-color: hsla(0, 0%, 50%, 1.00);
--tp-groove-foreground-color: hsla(0, 0%, 10%, 1.00);
--tp-input-background-color: hsla(0, 0%, 10%, 1.00);
--tp-input-background-color-active: hsla(0, 0%, 25%, 1.00);
--tp-input-background-color-focus: hsla(0, 0%, 20%, 1.00);
--tp-input-background-color-hover: hsla(0, 0%, 15%, 1.00);
--tp-input-foreground-color: hsla(0, 0%, 70%, 1.00);
--tp-label-foreground-color: hsla(0, 0%, 50%, 1.00);
--tp-monitor-background-color: hsla(0, 0%, 8%, 1.00);
--tp-monitor-foreground-color: hsla(0, 0%, 48%, 1.00);`; break;
        case ( "lightTheme" ):
            rootTheme = `
--tp-base-background-color: hsla(230, 5%, 90%, 1.00);
--tp-base-shadow-color: hsla(0, 0%, 0%, 0.10);
--tp-button-background-color: hsla(230, 7%, 75%, 1.00);
--tp-button-background-color-active: hsla(230, 7%, 60%, 1.00);
--tp-button-background-color-focus: hsla(230, 7%, 65%, 1.00);
--tp-button-background-color-hover: hsla(230, 7%, 70%, 1.00);
--tp-button-foreground-color: hsla(230, 10%, 30%, 1.00);
--tp-container-background-color: hsla(230, 15%, 30%, 0.20);
--tp-container-background-color-active: hsla(230, 15%, 30%, 0.32);
--tp-container-background-color-focus: hsla(230, 15%, 30%, 0.28);
--tp-container-background-color-hover: hsla(230, 15%, 30%, 0.24);
--tp-container-foreground-color: hsla(230, 10%, 30%, 1.00);
--tp-groove-foreground-color: hsla(230, 15%, 30%, 0.10);
--tp-input-background-color: hsla(230, 15%, 30%, 0.10);
--tp-input-background-color-active: hsla(230, 15%, 30%, 0.22);
--tp-input-background-color-focus: hsla(230, 15%, 30%, 0.18);
--tp-input-background-color-hover: hsla(230, 15%, 30%, 0.14);
--tp-input-foreground-color: hsla(230, 10%, 30%, 1.00);
--tp-label-foreground-color: hsla(230, 10%, 30%, 0.70);
--tp-monitor-background-color: hsla(230, 15%, 30%, 0.10);
--tp-monitor-foreground-color: hsla(230, 10%, 30%, 0.50);`; break;
        case ( "retroTheme" ):
            rootTheme = `
--tp-base-background-color: hsla(40, 3%, 90%, 1.00);
--tp-base-shadow-color: hsla(0, 0%, 0%, 0.30);
--tp-button-background-color: hsla(40, 3%, 70%, 1.00);
--tp-button-background-color-active: hsla(40, 3%, 55%, 1.00);
--tp-button-background-color-focus: hsla(40, 3%, 60%, 1.00);
--tp-button-background-color-hover: hsla(40, 3%, 65%, 1.00);
--tp-button-foreground-color: hsla(40, 3%, 20%, 1.00);
--tp-container-background-color: hsla(40, 3%, 70%, 1.00);
--tp-container-background-color-active: hsla(40, 3%, 55%, 1.00);
--tp-container-background-color-focus: hsla(40, 3%, 60%, 1.00);
--tp-container-background-color-hover: hsla(40, 3%, 65%, 1.00);
--tp-container-foreground-color: hsla(40, 3%, 20%, 1.00);
--tp-groove-foreground-color: hsla(40, 3%, 40%, 1.00);
--tp-input-background-color: hsla(120, 3%, 20%, 1.00);
--tp-input-background-color-active: hsla(120, 3%, 35%, 1.00);
--tp-input-background-color-focus: hsla(120, 3%, 30%, 1.00);
--tp-input-background-color-hover: hsla(120, 3%, 25%, 1.00);
--tp-input-foreground-color: hsla(120, 40%, 60%, 1.00);
--tp-label-foreground-color: hsla(40, 3%, 50%, 1.00);
--tp-monitor-background-color: hsla(120, 3%, 20%, 1.00);
--tp-monitor-foreground-color: hsla(120, 40%, 60%, 0.80);`; break;
        case ( "translucentTheme" ):
            rootTheme = `
--tp-base-background-color: hsla(0, 0%, 10%, 0.80);
--tp-base-shadow-color: hsla(0, 0%, 0%, 0.20);
--tp-button-background-color: hsla(0, 0%, 80%, 1.00);
--tp-button-background-color-active: hsla(0, 0%, 100%, 1.00);
--tp-button-background-color-focus: hsla(0, 0%, 95%, 1.00);
--tp-button-background-color-hover: hsla(0, 0%, 85%, 1.00);
--tp-button-foreground-color: hsla(0, 0%, 0%, 0.80);
--tp-container-background-color: hsla(0, 0%, 0%, 0.30);
--tp-container-background-color-active: hsla(0, 0%, 0%, 0.60);
--tp-container-background-color-focus: hsla(0, 0%, 0%, 0.50);
--tp-container-background-color-hover: hsla(0, 0%, 0%, 0.40);
--tp-container-foreground-color: hsla(0, 0%, 100%, 0.50);
--tp-groove-foreground-color: hsla(0, 0%, 0%, 0.20);
--tp-input-background-color: hsla(0, 0%, 0%, 0.30);
--tp-input-background-color-active: hsla(0, 0%, 0%, 0.60);
--tp-input-background-color-focus: hsla(0, 0%, 0%, 0.50);
--tp-input-background-color-hover: hsla(0, 0%, 0%, 0.40);
--tp-input-foreground-color: hsla(0, 0%, 100%, 0.50);
--tp-label-foreground-color: hsla(0, 0%, 100%, 0.50);
--tp-monitor-background-color: hsla(0, 0%, 0%, 0.30);
--tp-monitor-foreground-color: hsla(0, 0%, 100%, 0.30);`; break;
        case ( "statefarmerTheme" ):
            rootTheme = `
--tp-base-background-color: hsla(0, 80%, 40%, 1.00);
--tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
--tp-button-background-color: hsla(0, 0%, 100%, 1.00);
--tp-button-background-color-active: hsla(0, 0%, 85%, 1.00);
--tp-button-background-color-focus: hsla(0, 0%, 90%, 1.00);
--tp-button-background-color-hover: hsla(0, 0%, 95%, 1.00);
--tp-button-foreground-color: hsla(230, 20%, 11%, 1.00);
--tp-container-background-color: hsla(0, 0%, 0%, 0.20);
--tp-container-background-color-active: hsla(0, 0%, 0%, 0.35);
--tp-container-background-color-focus: hsla(0, 0%, 0%, 0.30);
--tp-container-background-color-hover: hsla(0, 0%, 0%, 0.25);
--tp-container-foreground-color: hsla(0, 0%, 100%, 0.90);
--tp-groove-foreground-color: hsla(0, 0%, 0%, 0.50);
--tp-input-background-color: hsla(0, 0%, 0%, 0.50);
--tp-input-background-color-active: hsla(0, 0%, 0%, 0.65);
--tp-input-background-color-focus: hsla(0, 0%, 0%, 0.60);
--tp-input-background-color-hover: hsla(0, 0%, 0%, 0.55);
--tp-input-foreground-color: hsla(0, 0%, 100%, 0.90);
--tp-label-foreground-color: hsla(0, 0%, 100%, 0.90);
--tp-monitor-background-color: hsla(0, 0%, 0%, 0.50);
--tp-monitor-foreground-color: hsla(0, 0%, 100%, 0.50);`; break;
            case ( "blurpleTheme" ):
                rootTheme = `
  --tp-base-background-color: hsla(255, 68%, 39%, 1.00);
  --tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
  --tp-button-background-color: hsla(0, 0%, 100%, 1.00);
  --tp-button-background-color-active: hsla(0, 0%, 85%, 1.00);
  --tp-button-background-color-focus: hsla(0, 0%, 90%, 1.00);
  --tp-button-background-color-hover: hsla(0, 0%, 95%, 1.00);
  --tp-button-foreground-color: hsla(230, 20%, 11%, 1.00);
  --tp-container-background-color: hsla(0, 0%, 0%, 0.20);
  --tp-container-background-color-active: hsla(0, 0%, 0%, 0.35);
  --tp-container-background-color-focus: hsla(0, 0%, 0%, 0.30);
  --tp-container-background-color-hover: hsla(0, 0%, 0%, 0.25);
  --tp-container-foreground-color: hsla(0, 0%, 100%, 0.90);
  --tp-groove-foreground-color: hsla(0, 0%, 0%, 0.50);
  --tp-input-background-color: hsla(0, 0%, 0%, 0.50);
  --tp-input-background-color-active: hsla(0, 0%, 0%, 0.65);
  --tp-input-background-color-focus: hsla(0, 0%, 0%, 0.60);
  --tp-input-background-color-hover: hsla(0, 0%, 0%, 0.55);
  --tp-input-foreground-color: hsla(0, 0%, 100%, 0.90);
  --tp-label-foreground-color: hsla(0, 0%, 100%, 0.90);
  --tp-monitor-background-color: hsla(0, 0%, 0%, 0.50);
  --tp-monitor-foreground-color: hsla(0, 0%, 100%, 0.50);`; break;
        }

        //menu customisation (apply font, button widths, adjust checkbox right slightly, make menu appear on top, add anim to message)
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            :root { ${rootTheme} }
        `;
        document.head.appendChild(styleElement);
    };
    //1337 H4X
    const getSearchParam = function(param) {
        const queryParams = new URLSearchParams(window.location.search);
        return queryParams.get(param);
    }
    const hexToRgb = function (hex) {
        // Remove the hash sign, if present
        hex = hex.replace(/^#/, '');

        // Parse the hexadecimal value into RGB components
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;

        // Normalize the values to the range [0, 1]
        return [r / 255, g / 255, b / 255];
    };
    const fadeBetweenColors = function (color1, color2, progress) {
        const rgb1 = hexToRgb(color1);
        const rgb2 = hexToRgb(color2);
        const resultRgb = [
            rgb1[0] + (rgb2[0] - rgb1[0]) * progress,
            rgb1[1] + (rgb2[1] - rgb1[1]) * progress,
            rgb1[2] + (rgb2[2] - rgb1[2]) * progress
        ];
        return resultRgb;
    };
    const distancePlayers = function (MYPLAYER,player) {
        return ss.BABYLONJS.Vector3.Distance(MYPLAYER,player); //pythagoras' theorem in 3 dimensions. no one owns maths, zert.
    };
    const setPrecision = function (value) { return Math.round(value * 8192) / 8192 }; //required precision
    const calculateYaw = function (pos) {
        return setPrecision(Math.mod(Math.atan2(pos.x,pos.z), Math.PI2));
    };
    const calculatePitch = function (pos) {
        return setPrecision(-Math.atan2(pos.y,Math.hypot(pos.x,pos.z))%1.5);
    };
    const getAngularDifference = function (obj1,obj2) {
        return Math.abs(obj1.yaw-obj2.yaw)+Math.abs(obj1.pitch-obj2.pitch);
    };
    const getDirectionVectorPlayer = function (ss,player) {
        return {
            x: player.actor.mesh.position.x - ss.MYPLAYER.actor.mesh.position.x,
            y: player.actor.mesh.position.y - ss.MYPLAYER.actor.mesh.position.y,
            z: player.actor.mesh.position.z - ss.MYPLAYER.actor.mesh.position.z,
        };
    };
    const reverse_string = function (str) { return str.split("").reverse().join("") };
    const isPartialMatch = function (array, searchString) {
        return array.some(item => searchString.toLowerCase().includes(item.toLowerCase()));
    };
    const radianAngleDiff = function (angle1,angle2) {
        const fullCircle = 2 * Math.PI;
        // Normalize angles to be within [0, 2π)
        angle1 = (angle1 % fullCircle + fullCircle) % fullCircle;
        angle2 = (angle2 % fullCircle + fullCircle) % fullCircle;
        // Find the absolute angular difference
        let diff = Math.abs(angle1 - angle2);
        // Ensure the difference is within [0, π)
        diff = Math.min(diff, fullCircle - diff);
        // Determine the sign of the difference correctly
        if ((angle1 - angle2 + fullCircle) % fullCircle > Math.PI) {
            return -diff;
        } else {
            return diff;
        };
    };
    const getScrambled=function(){return Array.from({length: 10}, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('')}
    const createAnonFunction=function(name,func){
        const funcName=getScrambled();
        window[funcName]=func;
        F[name]=window[funcName];
        functionNames[name]=funcName
    };
    const processChatItem = function (ss,text,playerName,playerTeam,highlightColor) {
        let chatItem = document.createElement("div");
        let playerNameSpan = document.createElement("span");
        let playerInfoContainer = document.createElement("div");
        let serverIcon = document.createElement("i");

        chatItem.classList.add("chat-item");
        playerInfoContainer.style.display = "inline-block";

        playerNameSpan.classList.add("chat-player-name", "ss_marginright_xs");
        playerNameSpan.textContent = playerName + " ";

        playerInfoContainer.style.color = ss.TEAMCOLORS.text[playerTeam];
        playerInfoContainer.appendChild(serverIcon);
        playerInfoContainer.appendChild(playerNameSpan);

        let messageSpan = document.createElement("span");
        messageSpan.innerHTML = text;
        chatItem.style.fontStyle = "italic";
        messageSpan.style.backgroundColor = highlightColor;
        playerInfoContainer.style.backgroundColor = highlightColor;

        chatItem.appendChild(playerInfoContainer);
        chatItem.appendChild(messageSpan);

        document.getElementById("chatOut").appendChild(chatItem);

        if (document.querySelector(".chat-container")) {
            document.querySelector(".chat-container").scrollTop = document.querySelector(".chat-container").scrollHeight;
        };
    };
    const updateOrCreateLinesESP = function (ss,object,type,color) {
        let newPosition,newScene,newParent
        if (type=="playerESP") {
            newPosition = object.actor.mesh.position;
            newScene    = object.actor.scene;
            newParent   = object.actor.mesh;
        } else {
            newPosition = object.position;
            newScene    = object._scene;
            newParent   = object;
        };
        if (!object.generatedESP) {
            //tracers
            const tracerLines = ss.BABYLONJS.MeshBuilder.CreateLines("tracerLines", { points: [newPosition, crosshairsPosition] }, newScene);
            tracerLines.color=new ss.BABYLONJS.Color3(1, 1, 1);
            tracerLines.renderingGroupId=1;
            object.tracerLines = tracerLines;
            //ESP
            //FUCK WIREFRAME BOXES! LIBERTYMUTUAL dictates we making our own MANUALLY bitch! to hell with those diagonal lines
            const boxSize = {
                playerESP: { width: 0.5, height: 0.75, depth: 0.5 },
                ammoESP: { width: 0.25, height: 0.35, depth: 0.25 },
            };
            const boxOffset = {
                playerESP: 0,
                ammoESP: -0.05,
            };
            const vertices = [
                new ss.BABYLONJS.Vector3(-boxSize[type].width / 2, boxOffset[type], -boxSize[type].depth / 2),
                new ss.BABYLONJS.Vector3(boxSize[type].width / 2, boxOffset[type], -boxSize[type].depth / 2),
                new ss.BABYLONJS.Vector3(boxSize[type].width / 2, boxOffset[type] + boxSize[type].height, -boxSize[type].depth / 2),
                new ss.BABYLONJS.Vector3(-boxSize[type].width / 2, boxOffset[type] + boxSize[type].height, -boxSize[type].depth / 2),
                new ss.BABYLONJS.Vector3(-boxSize[type].width / 2, boxOffset[type], boxSize[type].depth / 2),
                new ss.BABYLONJS.Vector3(boxSize[type].width / 2, boxOffset[type], boxSize[type].depth / 2),
                new ss.BABYLONJS.Vector3(boxSize[type].width / 2, boxOffset[type] + boxSize[type].height, boxSize[type].depth / 2),
                new ss.BABYLONJS.Vector3(-boxSize[type].width / 2, boxOffset[type] + boxSize[type].height, boxSize[type].depth / 2),
            ];
            const lines = [];
            for (let i = 0; i < 4; i++) {
                lines.push([vertices[i], vertices[(i + 1) % 4]]);
                lines.push([vertices[i + 4], vertices[(i + 1) % 4 + 4]]);
                lines.push([vertices[i], vertices[i + 4]]);
            };
            const box = ss.BABYLONJS.MeshBuilder.CreateLineSystem('boxLines', { lines }, newScene);
            box.color = new ss.BABYLONJS.Color3(1, 1, 1);
            box.position.y=boxOffset[type];
            box.renderingGroupId = 1;
            box.parent=newParent;
            object.box=box;
            //TARGETS
            let target
            if (type=="playerESP") {
                target = ss.BABYLONJS.MeshBuilder.CreateSphere("sphere", { diameter: 0.05 }, newScene);
                target.material = new ss.BABYLONJS.StandardMaterial("sphereMaterial", newScene);
                target.material.diffuseColor = new ss.BABYLONJS.Color3(1, 0, 0);
                target.material.alpha = 0.5;
                target.position.y = 0.3;
                target.renderingGroupId = 1;
                target.parent=newParent;
                object.target=target;
            };
            //stuff
            object.generatedESP=true;
            ESPArray.push([object,tracerLines,box,target]);
        };
        object.tracerLines.setVerticesData(ss.BABYLONJS.VertexBuffer.PositionKind, [crosshairsPosition.x, crosshairsPosition.y, crosshairsPosition.z, newPosition.x, newPosition.y, newPosition.z]);
        object.tracerLines.color = new ss.BABYLONJS.Color3(...color);
        object.box.color = new ss.BABYLONJS.Color3(...color);
    };
    const everySecond = function () {
        coordElement.style.display = 'none';
        playerstatsElement.style.display = 'none';
        playerinfoElement.style.display = 'none';
        redCircle.style.display = 'none';
        if (!ranEverySecond) {
            detectURLParams();
        };
        if (AUTOMATED) {
            automatedElement.style.display=(automatedElement.style.display=='') ? 'none' : '';
        } else {
            automatedElement.style.display='none';
        };
        allFolders.forEach(function (name) {
            localStorage.setItem(name,JSON.stringify(tp[name].expanded));
        });
        if (currentlyInGame) {
            if (extract("mockMode")) {
                let textAfterLastColon = document.getElementById("chatOut").children[document.getElementById("chatOut").children.length-1].children[1].textContent;
                let chatName = document.getElementById("chatOut").children[document.getElementById("chatOut").children.length-1].children[0].textContent.slice(0,-2);
                // console.log("Chat Name:", chatName);
                if (chatName && chatName!==username && textAfterLastColon!=="joined." && textAfterLastColon!=="left." && !handleChat(textAfterLastColon)) {
                    sendChatMessage(textAfterLastColon);
                }; //mockMode, this will copy and send the chat into message when joining, but doesn't show to other players, so it's fine. solvable with an if statement bool
            };
            if (extract("antiAFK")) {
                if (Date.now()>(lastAntiAFKMessage+270000)) {
                    if (sendChatMessage("Anti AFK Message. Censored Words: DATE, SUCK")) {
                        lastAntiAFKMessage=Date.now();
                    };
                };
            };
            if (extract("autoRespawn")&&(!ss.MYPLAYER.playing)) {
                var button = document.querySelector('.ss_button.btn_big.btn-dark-bevel.btn-respawn.ss_button.btn_green.bevel_green');
                if (button) {
                    button.click();
                };
            };
            addStreamsToInGameUI();
        } else {
            if (extract("autoJoin")) {
                if ((!document.getElementById("progressBar"))) {
                    const playerSlots = document.querySelectorAll('.playerSlot--name');
                    const mapNames = Array.from(playerSlots).map(playerSlot => playerSlot.textContent.trim());
                    //console.log("adsknjf--->"mapNames);
                    vueApp.externPlayObject((extract("joinCode").length===6)?2:0,2,extract("copyNames") ? mapNames[Math.floor(Math.random() * mapNames.length)] : extract("usernameAutoJoin"),-1,extract("joinCode"));
                };
            };
        };
        currentlyInGame = false;
        ranEverySecond=true;
        //block ads kek
        localStorage.timesPlayed = 0;
    };
    const updateConfig = function () {
        config=tp.pane.exportPreset();
    };
    const sendChatMessage = function (text) { //basic method (simulates legit method of sending message)
        try {
            lastSentMessage=text;
            chatThing=document.getElementById('chatIn');
            if (chatThing && extern.startChat) {
                extern.startChat();
                chatThing.value=text;
                chatThing.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true,
                    cancelable: true,
                }));
                return true;
            } else {
                return false;
            };
        } catch (error) {
            return false
        };
    };
    const addStreamsToInGameUI = function () {
        let inGameUIElement = document.getElementById("inGameUI");
        let streams = document.getElementById("stream_scroll").children;
        if ( inGameUIElement && streams.length > 0) {
            for (let i = 0; i < streams.length; i++) {
                let hrefValue = streams[i].querySelector('a').href;
                let nameValue = streams[i].querySelector(".stream_name").textContent;
                const streamElement = inGameUIElement.querySelector('div[data-name="' + nameValue + '"]');
                if (extract("showStreams") && !streamElement) {
                    let containerDiv = document.createElement("div");
                    let nameDiv = document.createElement("div");
                    nameDiv.textContent = nameValue;
                    nameDiv.setAttribute('data-href', hrefValue);
                    nameDiv.style.color = 'white';
                    nameDiv.style.cursor = 'pointer';
                    nameDiv.style.textDecoration = 'none';
                    nameDiv.addEventListener('mouseover', function() { nameDiv.style.textDecoration = 'underline'; nameDiv.style.color = 'blue' });
                    nameDiv.addEventListener('mouseout', function() { nameDiv.style.textDecoration = 'none'; nameDiv.style.color = 'white' });
                    nameDiv.addEventListener('click', function() { window.open(hrefValue, '_blank'); });
                    containerDiv.setAttribute('data-name', nameValue);
                    containerDiv.appendChild(nameDiv);
                    containerDiv.appendChild(nameDiv);
                    inGameUIElement.appendChild(containerDiv);
                } else if (!extract("showStreams") && streamElement) {
                    inGameUIElement.removeChild(streamElement);
                };
            };
        };
    };
    const highlightCurrentlyTargeting = function (ss, currentlyTargeting, aimbot) {
        let playerArray = [];
        ss.PLAYERS.forEach(player=>{
            if (player && (currentlyTargeting!==ss.MYPLAYER) && player.playing && (player.hp>0) && ((!ss.MYPLAYER.team)||( player.team!==ss.MYPLAYER.team))) {
                const uniqueId = player.uniqueId;
                const name = player.name;
                const hp = player.hp
                playerArray.push({ player, uniqueId, name, hp });
            };
        });
        Array.from(document.getElementById("playerList").children).forEach(playerListItem=>{
            if (aimbot&&currentlyTargeting?.playing && currentlyTargeting?.name === playerListItem.textContent.slice(0, -3)) {//need to slice otherwise won't match properly
                playerListItem.style.backgroundColor = 'blue';
            } else {
                playerListItem.style.backgroundColor = '';
            };
            // console.log(playerArray.find(player => player.name === playerListItem.textContent.slice(0, -3))?.hp);
        });
    };
    const highlightCrossHairReticleDot = function (ss, bool) {
        let dot = document.getElementById("reticleDot");
        let crosshair = document.getElementById("crosshairContainer");
        let setTo='';
        if (bool===true) {
            setTo="green";
        } else if (bool===false) {
            setTo="red";
        };
        dot.style.backgroundColor = setTo;
        Array.from(crosshair.children).forEach(part=>{
            part.style.backgroundColor = setTo;
        });
    };
    const handleChat = function (textAfterLastColon) {
        const responses = {
            "report": "report me? pffft. i'm not even human",
            "aimbot": "what aimboot?",
            "bot": "you're a booooT",
            "stop": "u stop",
            "cheat": "oh youre gonna cheat accuse? keep yapping",
            "hack": "oh youre gonna cheat accuse? keep yapping",
            "hax": "oh youre gonna cheat accuse? keep yapping",
            "bro": "brooooo what",
            "spam": "me, spamming? im just chatting",
            "mute": "you dont want to listen to me talk? how weak hahaha",
            "ban": "ban me? no free speech these days",
            "lol": "lolzedong",
            "dude": "dudeinator3000: what is your request",
            "what": "dude what",
            "annoy": "im not that bad",
            "mock": "im not doing anything wrong",
            "wtf": "watch your profanity",
            "i'm": "yes you are",
            "im": "yes you are",
            "u r": "no im not. proof?",
            "you r": "no im not. proof?",
            "you are": "no im not. proof?",
            "you're": "no im not. proof?",
            "imagine": "imagine who asked",
            "f u": "funny uncleburger",
            "gg": "good grief",
            "shut up": "B͇͈͉͍͎̽̾̿̀́͂̓̈́͆͊͋͌͗ͅ͏͎͗͏͇͇̽̾̿̀́̽̿̀̀́̽̀͆̓̈́̓͋͌ͅ͏͌͏͎͉͗͗͌̓̓̓̓̓́̿",
            "chill": "you think i can just CALM DOWN?!?",
            "stfu": "just reported u for swearing",
            "look": "im looking but im not seeing",
            "nigg": "WHOA we cant have racism on our egg game! tone it down yo",
            "fuck": "pipe down with those swears boi",
            "shit": "pipe down with those swears boi",
            "piss": "pipe down with those swears boi",
            "dick": "pipe down with those swears boi",
            "loser": "ive been speccing u, cheater",
            "code": "A1BXDQ is the code",
            "rip": "rest in small pieces",
            "omg": "oh my GAWWWD!",
            "npc": "literally you rn:",
            "wth": "ur an npc",
            "yes": "no, what do you mean? elaborate you npc",
            "bruh": "did you just say bruh? that is a racist remark",
            "noob": "1v1 me you bot",
            "lmfao": "who is this LMFAO, and is he working with LMBAO?",
            "?": "ask a better question",
            "huh": "huh, are u bot?",
            "your mom": "Yo mama's so poor, she can't even afford to pay attention",
            "your mum": "Yo mama's so poor, she can't even afford to pay attention",
            "shut": "you shaddup you lil' twerrrrrrp",
            "dang": "ching chong bing bong wing wong",
            "trash": "you good sir, are rubbish",
            "damn": "damns are for the fishies",
            "care": "yes you do you bot",
            "go away": "no, you go away u bot",
            "...": "an ellipsis wooow you're so fancy i bet youre sooo smart",
            "leave": "i'll leave if you leave",
            "oh": "ohhhhhh yeahh!!!",
            "no": "ohhhhhh yeeesss",
            "hey": "hey is for horses",
            "client": "i am not using statefarm, definitely not on greasyfork",
            "script": "i am not using statefarm, definitely not on greasyfork",
            "troll": "yea i sometimes do trolling. but its not that funny",
            "well done": "thanks g",
            "that was": "was it though?",
            "how": "i want to know too",
            "esp ": "you think people can see thru walls? thats absurd",
            "shell": "thats what we're playing",
            "weird": "ur odd",
            "lag": "get better internet pooron lol",
            "wth": "watch your heckin profanity",
            "boy": "OH GOD YOU SAID BOY IM REPORTING YOU FOR SEXISM",
            "girl": "OH GOD YOU SAID GIRL IM REPORTING YOU FOR SEXISM",
            "monkey": "get outta ur rainforest",
            "trash": "nah ur father took the recycling with him when he left",
            "father": "look in a mirror for a lack of father figure",
            "dad": "look in a mirror for a lack of father figure",
            "mad": "imagine getting mad over an egg game",
            "angry": "imagine getting angry over an egg game",
            "sad": "imagine getting sad over an egg game",
            "happy": "imagine getting happy over an egg game",
            "cheater": "Ho Ho Ho! Santa's Here! And I'm gonna give you a present! A ban! <AdminSpoof enabled>",
            "tf": "toasted fries",
        };

        const foundKeywords = Object.keys(responses).filter(keyword =>
                                                            textAfterLastColon.toLowerCase().includes(keyword.toLowerCase())
                                                           );

        if (foundKeywords.length > 0) {
            const firstKeyword = foundKeywords[0];
            sendChatMessage(responses[firstKeyword]);
            // console.log(firstKeyword);
            return true;
        }
        return false;
    };
    const constructChatPacket = function (str) {
        if (str.length > 255) {
            console.log('%c UH OH UR PACKET IS TOO LONG!!!!', css);
            str.length = 255;
        };

        var arr = new Uint8Array(2 * str.length + 2);
        arr[0] = 4;
        arr[1] = str.length;

        for (var i = 0; i < str.length; i++) {
            arr[2 * i + 2] = str[i].charCodeAt(0) & 255;
            arr[2 * i + 3] = str[i].charCodeAt(0) >> 8 & 255; // ripped straight outta packInt16
        };
        //console.log(arr);
        return arr.buffer;
    };

    const extractChatPacket = function (packet) {
        if (!(packet instanceof ArrayBuffer)) {
            var pack_arr = new Uint8Array(packet);
        } else {
            var pack_arr = packet;
        };
        var str = "";
        for (var i = 0; i < pack_arr[1]; i++) {
            str += String.fromCharCode(pack_arr[2 * i + 2] + (pack_arr[2 * i + 3] << 8)); // ripped straight outta unpackInt16 (thanks github copilot)
        };
        return str;
    };

    const chatPacketHandler = function (packet) {
        return packet; //icl idk how this stuff works lol
        // if (extract("chatFilterBypass")) {
        //     string = extractChatPacket(packet);
        //     if ('AntiAFK' in string) {
        //         return packet;
        //     };
        //     new_str = ([UNICODE_RTL_OVERRIDE,].concat(reverse_string(string).split(""))).join("");
        //     var constructed =  constructChatPacket(new_str);
        //     //console.log('%c Chat packet sent: original str %s, reversed %s, list %s', css, string, reverse_string(string), new_str);
        //     return constructed;
        // };
    };

    const modifyPacket = function (data) {
        if (data instanceof String) { // avoid server comm, ping, etc. necessary to load
            return data;
        };

        if (data.byteLength == 0) {
            return data;
        };

        var arr = new Uint8Array(data);

        if (arr[0] == 49) { // comm code 49 = client to server grenade throw
            if (extract("grenadeMax")) {
                arr[1] = 255;
                console.log("StateFarm: modified a grenade packet to be at full power");
                return arr.buffer;
            } else {
                console.log("StateFarm: didn't modify grenade packet")
            };
        } else if (arr[0] == 4) {
            console.log('%c Chat packet sent, chat handler!!!', css);
            return chatPacketHandler(data);
        } else {

        };

        return data;
    };
    const is39Packet = function (packetData) { // packet only sent if we are in-game
        if (packetData instanceof String) { // avoid server comm, ping, etc. necessary to load
            return false;
        };

        if (packetData.byteLength == 0) {
            return false;
        };

        var arr = new Uint8Array(packetData);
        return arr[0] == 39;
    };
    const ghostSpamToggle = function () {}
    ghostSpamToggle.enabled = false;
    WebSocket.prototype._send = WebSocket.prototype.send;
    WebSocket.prototype.send = function (data) {

        var modified = modifyPacket(data);
        this._send(modified);

        if (is39Packet(data) && ghostSpamToggle.enabled) {
            for (var i = 0; i < 5; i++) {
                this._send(constructChatPacket("spammeroonie number #" + new Date().getTime() % 1000));
            };
        };
    };
    const predictBloom = function(ss,yaw,pitch) { //outputs the difference in yaw/pitch from the bloom
        let seed = ss.MYPLAYER.randomGen.seed;
        let numbers = [];
        const accuracy=ss.MYPLAYER.weapon.accuracy;
        for (var i = 0; i < 3; i++) { //generate from seed the values used to scatter shot
            seed = (seed * 9301 + 49297) % 233280;
            numbers.push(((seed/233280)-0.5)*accuracy);
        };
        const range = ss.WEAPONS.classes[ss.MYPLAYER.primaryWeaponItem.exclusive_for_class].weapon.range;
        const playerYPRMatrixThing = ss.BABYLONJS.Matrix.RotationYawPitchRoll(yaw, pitch, 0);
        const rangeMatrixThing = ss.BABYLONJS.Matrix.Translation(0, 0, range);
        const playerAndRangeMatrix = rangeMatrixThing.multiply(playerYPRMatrixThing);
        const bloomMatrix = ss.BABYLONJS.Matrix.RotationYawPitchRoll(numbers[0],numbers[1],numbers[2]);
        const finalBulletMatrix = playerAndRangeMatrix.multiply(bloomMatrix);
        const finalBulletTranslation = finalBulletMatrix.getTranslation();
        const bulletYaw = calculateYaw(finalBulletTranslation);
        const bulletPitch = calculatePitch(finalBulletTranslation);
        const yawBulletDiff = radianAngleDiff(yaw,bulletYaw)
        const pitchBulletDiff = radianAngleDiff(pitch,bulletPitch)
        //console.log("current accuracy: ",accuracy)
        //console.log("input yaw: ",yaw)
        //console.log("input pitch: ",pitch)
        //console.log("calculated bullet yaw: ",bulletYaw)
        //console.log("calculated bullet pitch: ",bulletPitch)
        //console.log("therefore yaw diff: ",yawBulletDiff)
        //console.log("therefore pitch diff: ",pitchBulletDiff)

        return [yawBulletDiff,pitchBulletDiff];
    };
    const applyBloom = function(dir,multiplier) { //multiplier can be set to -1 to invert
        const bloomValues=predictBloom(ss,dir.yaw,dir.pitch);
        return {
            yaw: dir.yaw+(bloomValues[0]*multiplier),
            pitch: dir.pitch+(bloomValues[1]*multiplier),
        };
    };
    const predictPosition = function(ss,player) { //outputs the prediction for where a player will be in the time it takes for a bullet to reach them
        let velocityVector = new ss.BABYLONJS.Vector3(player.dx, player.dy, player.dz);
        const bulletSpeed=ss.WEAPONS.classes[ss.MYPLAYER.primaryWeaponItem.exclusive_for_class].weapon.velocity;
        const timeDiff = ss.BABYLONJS.Vector3.Distance(ss.MYPLAYER,player) / bulletSpeed + 1;
        let newPos = new ss.BABYLONJS.Vector3(player.x,player.y,player.z).add(velocityVector.scale(timeDiff));
        newPos.y = player.y;
        const cappedVector = new ss.BABYLONJS.Vector3(velocityVector.x, 0.29, velocityVector.z);
        Math.capVector3(cappedVector);
        const terminalVelocity = -cappedVector.y;
        const timeAccelerating = Math.min(timeDiff, (terminalVelocity - velocityVector.y) / -0.012);
        const predictedY = velocityVector.y * timeAccelerating + timeAccelerating * (timeAccelerating) * -0.012 / 2 + newPos.y + terminalVelocity * Math.max(timeDiff - timeAccelerating, 0);
        const rayToGround = ss.RAYS.rayCollidesWithMap(newPos,new ss.BABYLONJS.Vector3(0,predictedY-1-newPos.y,0), ss.RAYS.grenadeCollidesWithCell);
        newPos.y=Math.max(rayToGround ? rayToGround.pick.pickedPoint.y:0,predictedY)-0.072;
        return newPos;
    };
    const getLineOfSight = function(ss,pos) { //returns true if no wall collisions
        let distance=distancePlayers(ss.MYPLAYER,pos);
        let dir = { yaw: ss.MYPLAYER.yaw, pitch: ss.MYPLAYER.pitch };
        if (extract("antiBloom")) { dir=applyBloom(dir,-1) };

        
        const playerRot = ss.BABYLONJS.Matrix.RotationYawPitchRoll(dir.yaw, dir.pitch, 0);
        let gunOffset = ss.BABYLONJS.Matrix.Translation(0, 0.1, 0);
        gunOffset = gunOffset.multiply(playerRot)
        gunOffset = gunOffset.add(ss.BABYLONJS.Matrix.Translation(ss.MYPLAYER.x, ss.MYPLAYER.y + 0.3, ss.MYPLAYER.z));
        const gunPosition = gunOffset.getTranslation();

        const myVector=new ss.BABYLONJS.Vector3(gunPosition.x, gunPosition.y, gunPosition.z);
        const directionVector=new ss.BABYLONJS.Vector3(Math.sin(dir.yaw)*distance,Math.sin(-dir.pitch)*distance,Math.cos(dir.yaw)*distance);

        const collisionWhereLooking=ss.RAYS.rayCollidesWithMap(myVector,directionVector,ss.RAYS.projectileCollidesWithCell);

        // console.log(!(!collisionWhereLooking));

        return (!collisionWhereLooking);
    };
    const getAimbot = function(ss,player) {
        let aimAt;
        if (extract("prediction")) {
            aimAt=predictPosition(ss,currentlyTargeting);
        } else {
            aimAt = new ss.BABYLONJS.Vector3(player.x, player.y, player.z);
        };

        let aimDirectionVector = {
            x: aimAt.x - ss.MYPLAYER.x,
            y: aimAt.y - ss.MYPLAYER.y - 0.05,
            z: aimAt.z - ss.MYPLAYER.z,
        };

        let finalDir = {
            yaw: calculateYaw(aimDirectionVector),
            pitch: calculatePitch(aimDirectionVector),
        };

        if (extract("antiBloom")) {
            finalDir=applyBloom(finalDir,1);
        };

        return finalDir;
    };
    const injectScript = function () {
        window.fixCamera = function () {
            return isKeyToggled[bindsArray.zoom] && (extract("zoom")*(Math.PI / 180)) || (extract("fov")*(Math.PI/180)) || 1.25;
        };
        window.getChatLimit = function () {
            return (extract("chatExtend")&&999999)||4;
        };
        window.getDisableChatFilter = function () {
            return extract("disableChatFilter");
        };
        window.getSkinHack = function () {
            return extract("unlockSkins");
        };
        window.beforeFiring = function (MYPLAYER) { //i kept this here, but do not use this. the delay is usually too great to do some kind of secret fire
            if (extract("aimbot") && (extract("aimbotRightClick") ? isRightButtonDown : true) && (targetingComplete||extract("silentAimbot")) && ss.MYPLAYER.playing && currentlyTargeting && currentlyTargeting.playing) {
                ss.MYPLAYER=MYPLAYER;
                const aimbot = getAimbot(ss,currentlyTargeting);
                ss.MYPLAYER.yaw = setPrecision(aimbot.yaw);
                ss.MYPLAYER.pitch = setPrecision(aimbot.pitch);
            };
        };
        window.modifyChat = function(msg) {
            if (msg!==lastSentMessage) { //not spammed or afked
                if (extract("chatFilterBypass")) {
                    const UNICODE_RTL_OVERRIDE = '\u202e'
                    msg = ([UNICODE_RTL_OVERRIDE,].concat(reverse_string(msg).split(""))).join("");
                };
            };
            if (extract("tallChat") && !(msg.includes("᥊"))) {
                msg = msg + "᥊";
            };
            return msg;
        };
        const originalXHROpen = XMLHttpRequest.prototype.open; //wtf??? libertymutual collab??????
        const originalXHRGetResponse = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'response');
        let shellshockjs
        XMLHttpRequest.prototype.open = function(...args) {
            const url = args[1];
            if (url && url.includes("js/shellshock.js")) {
                shellshockjs = this;
            };
            originalXHROpen.apply(this, args);
        };
        Object.defineProperty(XMLHttpRequest.prototype, 'response', {
            get: function() {
                if (this===shellshockjs) {
                    return applyStateFarm(originalXHRGetResponse.get.call(this));
                };
                return originalXHRGetResponse.get.call(this);
            }
        });
        const applyStateFarm = function(js) {
            console.log('%cATTEMPTING TO START STATEFARM', 'color: magenta; font-weight: bold; font-size: 1.5em; text-decoration: underline;');
            const allFuncName={};
            let vars=[];
            let injectionString="";
            let match;
            const getVar=function(name,regex){
                const varName=eval(new RegExp(regex)+`.exec(js)[1]`);
                vars[name]=varName;
                injectionString=injectionString+name+": "+varName+",";
                console.log('%cFound var! Saved '+varName+' as '+name, 'color: green; font-weight: bold;');
            };
            console.log('%cSTATEFARM INJECTION STAGE 1: GATHER VARS', 'color: yellow; font-weight: bold; font-size: 1.2em; text-decoration: underline;');
            try {
                getVar("PLAYERS", '=([a-zA-Z]+)\\[this\\.controlledBy\\]');
                getVar("MYPLAYER", '&&([a-zA-Z]+)\\.grenadeCountdown<=0\\)this\\.cancelGrenade');
                getVar("WEAPONS", ';([a-zA-Z]+)\\.classes=\\[\\{name:"Soldier"');
                getVar("BABYLONJS", ';([a-zA-Z]+)\\.TransformNode\\.prototype\\.setVisible');
                getVar("RENDERLIST", '&&([a-zA-Z]+\\.getShadowMap\\(\\)\\.renderList)');
                getVar("GAMEMAP", '>=([a-zA-Z]+)\\.height&&\\(this\\.climbing=!1\\)');
                getVar("TEAMCOLORS", '\\{([a-zA-Z_$]+)\\.themClass\\[');
                getVar("CAMERA", ',([a-zA-Z_$]+)=new T\\.TargetCamera\\("camera"'); //todo
                getVar("RAYS", '\\.25\\),([a-zA-Z_$]+)\\.rayCollidesWithPlayer');
                getVar("GAMECODE", 'gameCode:([a-zA-Z]+)\\|\\|');
                // getVar("vs", '(vs)'); //todo
                // getVar("switchTeam", 'switchTeam:([a-zA-Z]+),onChatKeyDown');
                // getVar("game", 'packInt8\\(([a-zA-Z]+)\\.explode\\),');

                createPopup("StateFarm Script injected!","success");
                console.log(injectionString,allFuncName);
            } catch (err) {
                createPopup("Error! Scipt injection failed! See console.","error")
                alert( 'Oh bollocks! Looks like the script is out of date. Report this data to the original developers and any errors in the console.\n' + JSON.stringify( allFuncName, undefined, 2 ) );
                console.log(err);
                return js;
            };
            console.log('%cSTATEFARM INJECTION STAGE 2: INJECT VAR RETRIEVAL FUNCTION AND MAIN LOOP', 'color: yellow; font-weight: bold; font-size: 1.2em; text-decoration: underline;');
            //hook for main loop function in render loop
            match=js.match(/\.engine\.runRenderLoop\(function\(\)\{([a-zA-Z]+)\(/);
            js = js.replace(`\.engine\.runRenderLoop\(function\(\)\{${match[1]}\(`,`.engine.runRenderLoop(function (){${match[1]}(),window["${functionNames.retrieveFunctions}"]({${injectionString}}`);
            console.log('%cSuccess! Variable retrieval and main loop hooked.', 'color: green; font-weight: bold;');
            console.log('%cSTATEFARM INJECTION STAGE 3: INJECT CULL INHIBITION', 'color: yellow; font-weight: bold; font-size: 1.2em; text-decoration: underline;');
            //stop removal of objects
            match=js.match(/playing&&!([a-zA-Z]+)&&/);
            js = js.replace(`if(${match[1]})`,`if(true)`);
            console.log('%cSuccess! Cull inhibition hooked.', 'color: green; font-weight: bold;');
            console.log('%cSTATEFARM INJECTION STAGE 4: INJECT OTHER FUNCTIONS', 'color: yellow; font-weight: bold; font-size: 1.2em; text-decoration: underline;');
            //hook for modifications just before firing
            js = js.replace('fire(){var','fire(){window.beforeFiring(this.player);var');
            //hook for fov mods
            js = js.replace(/\.fov\s*=\s*1\.25/g, '.fov = window.fixCamera()');
            js = js.replace(/\.fov\s*\+\s*\(1\.25/g, '.fov + (window.fixCamera()');
            //chat mods: disable chat culling
            const somethingLength=/\.length>4&&([a-zA-Z]+)\[0\]\.remove\(\),/.exec(js)[1];
            js = js.replace(new RegExp(`\\.length>4&&${somethingLength}\\[0\\]\\.remove\\(\\),`),`.length>window.getChatLimit()&&${somethingLength}[0].remove(),`);
            //chat mods: disable filter (credit to A3+++ for this finding)
            const filterFunction=/\|\|([a-zA-Z]+)\([a-zA-Z]+.normalName/.exec(js)[1];
            const thingInsideFilterFunction=new RegExp(`!${filterFunction}\\(([a-zA-Z]+)\\)`).exec(js)[1];
            js = js.replace(`!${filterFunction}(${thingInsideFilterFunction})`,`((!${filterFunction}(${thingInsideFilterFunction}))||window.getDisableChatFilter())`);
            //chat mods: make filtered text red
            const [_, elm, str] = js.match(/.remove\(\),([a-zA-Z]+).innerHTML=([a-zA-Z]+)/);
            js = js.replace(_, _ + `,${filterFunction}(${str})&&!arguments[2]&&(${elm}.style.color="red")`);
            //skins
            match = js.match(/inventory\[[A-z]\].id===[A-z].id\)return!0;return!1/);
            if (match) js = js.replace(match[0], match[0] + `||window.getSkinHack()`);
            //reset join/leave msgs
            js = js.replace(',console.log("joinGame()',',window.newGame=true,console.log("value changed, also joinGame()');
            //bypass chat filter
            match = new RegExp(`"&&\\s*([a-zA-Z]+)\\.indexOf\\("<"\\)<0`).exec(js)[1];
            js=js.replace('.value.trim()','.value.trim();'+match+'=window.modifyChat('+match+')')
            //admin spoof lol
            js=js.replace('isGameOwner(){return qr}','isGameOwner(){return true}')
            js=js.replace('get adminRoles(){return O.adminRoles}','get adminRoles(){return 255}')
            //sus
            js=js.replace('Wo(t){','Wo(t){console.log("Wo",t);')
            js=js.replace('Ts(t){','Ts(t){console.log("Ts",t);')
            //motion blue
            js=js.replace('._motionBlurEnabled=!1','._motionBlurEnabled=!0')



            //replace graveyard:
            // js=js.replace('et.booted','et.noboot')
            // js=js.replace('eu(t)','Bc(t)')
            // js=js.replace('vueApp.showPlayerActionsPopup(i)','vueApp.showPlayerActionsPopup(i);console.log(i)')
            //trajectories
            //bullet debugging
            // js = js.replace('.bulletPool.retrieve();i.fireThis(t,f,c,r)',`.bulletPool.retrieve();i.fireThis(t,f,c,r);
            //     //console.log("##################################################");
            //     //console.log("______PLAYER FIRED FUNCTION");
            //     //console.log("Player Name: ",t.name);
            //     //console.log("Actual Bullet Yaw: ",Math.radAdd(Math.atan2(c.x, c.z), 0));
            //     //console.log("Actual Bullet Pitch: ",-Math.atan2(c.y, Math.hypot(c.x, c.z)) % 1.5);
            // `);
            // js = js.replace('var s=n.getTranslation();',`var s=n.getTranslation();
            //     console.log("##################################################");
            //     console.log("______IN FIRE FUNCTION");
            //     console.log("Range Number: ",this.constructor.range);
            //     console.log("Accuracy: ",this.accuracy);
            //     console.log("Yaw/Pitch: ",this.player.yaw, this.player.pitch);
            //     console.log("Actual Bullet Yaw: ",Math.radAdd(Math.atan2(a.x, a.z), 0));
            //     console.log("Actual Bullet Pitch: ",-Math.atan2(a.y, Math.hypot(a.x, a.z)) % 1.5);
            // `);
            // js = js.replace('this.actor.fire(),this.fireMunitions','console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");console.log(r);var yaw = Math.atan2(r[4], r.elements[0]);var pitch = Math.asin(-r.elements[8]);console.log("Final Yaw/Pitch:", [yaw, pitch].map(angle => angle * (180 / Math.PI)));this.actor.fire(),this.fireMunitions');
            // js = js.replace('var o=Ce.getBuffer()',';console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA");console.log(s);var o=Ce.getBuffer()');
            // js = js.replace('var c=this.seed/233280','var c=this.seed/233280;console.log(c)');
            // js = js.replace('let i=this.accuracy','let i=0');
            // js = js.replace('T.Matrix.RotationYawPitchRoll((this.player.randomGen.getFloat()-.5)*l,(this.player.randomGen.getFloat()-.5)*l,(this.player.randomGen.getFloat()-.5)*l)','T.Matrix.RotationYawPitchRoll(-0.5*l,-0.5*l,0)');
            // js = js.replace('a=0;a<20;a++','a=0;a<200;a++');
            // js = js.replace("this.grenadeThrowPower=Math.clamp(t,0,1),","this.grenadeThrowPower=Math.clamp(t,0,1),console.log('hello',this.grenadeThrowPower),");
            // js = js.replace("s.packFloat(a.x)","s.packFloat(a.x),console.log('hello2',this.grenadeThrowPower,n,r,a)");
            //disable autopause
            // js = js.replace('&&(Li=null,Ue=0,q.controlKeys=0,q.releaseTrigger(),setTimeout(()=>{var f=Ce.getBuffer();f.packInt8(he.pause),f.send(we),q.resetCountdowns();let c=Gr&&!O.productBlockAds&&!pokiActive?10:5;ro(c)},100),ci=!0,vueApp.statsLoading(),Ei.set(function (){q.removeFromPlay(),as()},3e3),Sn!==void 0&&Tn!==void 0&&(aiptag=Sn,aipDisplay=Tn),console.log("pausing game via pointerlock exit"),to(),Nh(),crazyGamesActive&&crazysdk.gameplayStop())', '');
            //safe unfocus
            // js = js.replace('document.onpointerlockchange', 'document.dopausingstuff');
            // js = js.replace(',document.exitPointerLock())', ',document.exitPointerLock(),document.dopausingstuff())');
            // js = js.replace(',document.exitPointerLock())', ',document.exitPointerLock(),document.dopausingstuff())');
            // js = js.replace(',document.exitPointerLock())', ',document.exitPointerLock(),document.dopausingstuff())');
            // js = js.replace(',xc("down")', '');
            //adblock/vip spoof
            // js = js.replace(/z\.isUpgraded\(\)/g,'true');
            // js = js.replace(/aipAPItag\.sdkBlocked/g,'false');
            // js = js.replace(/this\.adBlockerDetected\(\)/,'false');

            js=js.replace("Not playing in iframe", "STATEFARM ACTIVE!");
            console.log(js)
            return js;
        };
    };

    JSON.safeStringify = (obj, indent = 2) => {
        let cache = [];
        const retVal = JSON.stringify(
          obj,
          (key, value) =>
            typeof value === "object" && value !== null
              ? cache.includes(value)
                ? undefined // Duplicate reference found, discard key
                : cache.push(value) && value // Store value in our collection
              : value,
          indent
        );
        cache = null;
        return retVal;
    };

    const deployBots = function() {
        if (!JSON.parse(localStorage.getItem("firstTimeBots"))) {
            localStorage.setItem("firstTimeBots",JSON.stringify(true));
            window.open("https://github.com/Hydroflame522/StateFarmClient/tree/main#botting");
        };
        console.log("Deploying "+extract("numberBots")+" bots...");
        for (let i = 0; i < extract("numberBots"); i++) {
            let leftOffset=((i%15)*100);
            // let topOffset=((i%3)*100);
            let topOffset=0;
            let proxyURL=proxyList[proxyListIndex];
            proxyListIndex=(proxyListIndex+1)%proxyList.length;
            let params="?AUTOMATED=true&StateFarm=";
            let name=extract("botUsername");
            if (extract("botCopyName")) {
                if (!currentlyInGame) {
                    alert("Cannot copy names if not in a game!")
                    return;
                } else {
                    const playerSlots = document.querySelectorAll('.playerSlot--name');
                    const mapNames = Array.from(playerSlots).map(playerSlot => playerSlot.textContent.trim());
                    name = mapNames[Math.floor(Math.random() * mapNames.length)];
                };
            };
            if (extract("botAntiDupe")) { name=name+String.fromCharCode(97 + Math.floor(Math.random() * 26)) };

            params=params+"usernameAutoJoin%3E"+JSON.stringify(name)+","

            params=params+"autoJoin%3E"+JSON.stringify(extract("botAutoJoin"))+","
            params=params+"mockMode%3E"+JSON.stringify(extract("botMock"))+","
            params=params+"autoRespawn%3E"+JSON.stringify(extract("botRespawn"))+","
            params=params+"autoShoot%3E"+JSON.stringify(extract("botAutoShoot"))+","
            params=params+"enableSeizureX%3E"+JSON.stringify(extract("botSeizure"))+","
            params=params+"enableSeizureY%3E"+JSON.stringify(extract("botSeizure"))+","

            if (extract("botAimbot")) {
                params=params+"aimbotTargeting%3E"+JSON.stringify(1)+","
                params=params+"prediction%3E"+JSON.stringify(true)+","
                params=params+"aimbot%3E"+JSON.stringify(true)+","
                params=params+"autoWeapon%3E"+JSON.stringify(5)+","
                params=params+"antiBloom%3E"+JSON.stringify(true)+","
                params=params+"grenadeMax%3E"+JSON.stringify(true)+","
                params=params+"enableSeizureX%3E"+JSON.stringify(false)+","
                params=params+"enableSeizureY%3E"+JSON.stringify(false)+","
            };

            params=params+"joinCode%3E%22"+extract("botJoinCode")+"%22";
            window.open("https://"+proxyURL+"/"+params, '_blank', 'width=450,height=300,left='+leftOffset+',top='+topOffset);
        };
    };

    const detectURLParams = function() {
        if (getSearchParam("AUTOMATED")=="true") {
            console.log("Automated Window!");
            AUTOMATED=true;
        };
        let customSettings = getSearchParam("StateFarm")
        if (customSettings!==null) {
            console.log("StateFarm Custom Settings!");
            createPopup("Custom StateFarm Settings Applying...")
            customSettings=customSettings.split("|");
            let setVars=[];
            let setBinds=[];
            if (customSettings[0]) {setVars=customSettings[0].split(",")};
            if (customSettings[1]) {setVars=customSettings[0].split(",")};
            console.log(setVars,setBinds);
            setVars.forEach(element=>{
                element=element.split(">");
                change(element[0],JSON.parse(element[1]));
            });
            // setBinds.forEach(element=>{ //not yet done
            // });
        };
    };

    function loggedGameMap() {}
    loggedGameMap.logged = false;

    const mainLoop = function () {
        const oneTime = function (ss) {
            crosshairsPosition=new ss.BABYLONJS.Vector3();
            Object.defineProperty(ss.MYPLAYER.scene, 'forceWireframe',  {
                get: () => {
                    return extract("wireframe");
                }
            });
            ranOneTime=true;
        };
        const initVars = function (ss) {
            if (window.newGame) {
                onlinePlayersArray=[];
            };
            if (extract("debug")&&(typeof playerLogger === 'undefined')) {
                playerLogger=[];
            };
            if (!loggedGameMap.logged) {
                // console.log(ss.GAMEMAP.width, ss.GAMEMAP.height, ss.GAMEMAP.data);
                loggedGameMap.logged = true;
            };
            username=ss.MYPLAYER?.name;

            crosshairsPosition.copyFrom(ss.MYPLAYER.actor.mesh.position);
            const horizontalOffset = Math.sin(ss.MYPLAYER.actor.mesh.rotation.y);
            const verticalOffset = Math.sin(-ss.MYPLAYER.pitch);
            crosshairsPosition.x += horizontalOffset;
            crosshairsPosition.z += Math.cos(ss.MYPLAYER.actor.mesh.rotation.y);
            crosshairsPosition.y += verticalOffset + 0.4;

            ammo=ss.MYPLAYER.weapon.ammo;

            whitelistPlayers=extract("whitelist").split(',');
            blacklistPlayers=extract("blacklist").split(',');

            const weaponBox = document.getElementById("weaponBox");
            const chatContainer = document.getElementById('chatOut');
            const chatItems = chatContainer.getElementsByClassName('chat-item');
            if ((weaponBox.style.display!=lastWeaponBox)||(chatItems.length!=lastChatItemLength)) {
                lastWeaponBox=weaponBox.style.display;
                lastChatItemLength=chatItems.length;

                const maxChat = extract("maxChat");
                const maxMessages = (weaponBox.style.display === "block" && maxChat) || 9999999;

                const startIndex = Math.max(0, chatItems.length - maxMessages);

                for (let i = chatItems.length - 1; i >= 0; i--) {
                    const chatIndex = i - startIndex;
                    const isInRange = chatIndex >= 0 && chatIndex < maxMessages;
                    chatItems[i].style.display = isInRange ? '' : 'none';
                };
            };
            // accuracyDiff=ss.MYPLAYER.weapon.accuracy-accuracy;
            yawDiff=radianAngleDiff(yawCache,ss.MYPLAYER.yaw);
            pitchDiff=radianAngleDiff(pitchCache,ss.MYPLAYER.pitch);
        };
        const updateLinesESP = function (ss) {
            const objExists=Date.now();

            //update playerESP boxes, tracer lines, colors
            if (extract("playerESP")||extract("tracers")||extract("chams")||extract("targets")||extract("nametags")||extract("joinMessages")||extract("leaveMessages")) {
                ss.PLAYERS.forEach(player=>{
                    if (player && (player!==ss.MYPLAYER) && player.playing && (player.hp>0) && ((!ss.MYPLAYER.team)||( player.team!==ss.MYPLAYER.team))) {
                        const whitelisted=(extract("whitelistESPType")=="highlight"||!extract("enableWhitelistTracers")||isPartialMatch(whitelistPlayers,player.name));
                        const blacklisted=(extract("blacklistESPType")=="justexclude"&&extract("enableBlacklistTracers")&&isPartialMatch(blacklistPlayers,player.name));
                        const passedLists=whitelisted&&(!blacklisted);
                        const tracersType=extract("tracersType");

                        let color,progress;
                        if (extract("enableWhitelistTracers") && extract("whitelistESPType")=="highlight" && isPartialMatch(whitelistPlayers,player.name) ) {
                            color=hexToRgb(extract("whitelistColor"));
                        } else if (extract("enableBlacklistTracers") && extract("blacklistESPType")=="highlight" && isPartialMatch(blacklistPlayers,player.name) ) {
                            color=hexToRgb(extract("blacklistColor"));
                        } else if ( tracersType=="proximity" ) {
                            const distance = distancePlayers(ss.MYPLAYER,player);
                            if (distance < extract("tracersColor1to2")) { //fade between first set
                                progress=(distance/extract("tracersColor1to2"));
                                color=fadeBetweenColors(extract("tracersColor1"),extract("tracersColor2"),progress);
                            } else if (distance < extract("tracersColor2to3")) { //fade between second set
                                progress=((distance-extract("tracersColor1to2"))/(extract("tracersColor2to3")-extract("tracersColor1to2")));
                                color=fadeBetweenColors(extract("tracersColor2"),extract("tracersColor3"),progress);
                            } else {
                                color=hexToRgb(extract("tracersColor3"));
                            };
                        } else if (tracersType=="static") {
                            color=hexToRgb(extract("tracersColor1"));
                        };

                        updateOrCreateLinesESP(ss,player,"playerESP",color);

                        player.tracerLines.visibility = player.playing && extract("tracers") && passedLists;
                        player.box.visibility = extract("playerESP") && passedLists;
                        player.target.visibility = extract("targets") && passedLists;

                        if (player.actor) {
                            eggSize=extract("eggSize")
                            player.actor.bodyMesh.scaling = {x:eggSize, y:eggSize, z:eggSize}
                        };

                        player.actor.bodyMesh.renderingGroupId = extract("chams") ? 1 : 0;

                        player.exists=objExists;
                    };
                    if (player) {
                        if (extract("nametags") && player.actor && player.actor.nameSprite) { //taken from shellshock.js, so var names are weird
                            player.actor.nameSprite._manager.renderingGroupId = 1;
                            player.actor.nameSprite.renderingGroupId = 1;
                            var h = Math.length3(player.x - ss.MYPLAYER.x, player.y - ss.MYPLAYER.y, player.z - ss.MYPLAYER.z),
                            d = Math.pow(h, 1.25)*2;
                            player.actor.nameSprite.width = d / 10 + .6, player.actor.nameSprite.height = d / 20 + .3;
                            ss.MYPLAYER.actor.scene.activeCamera.fov=0.75
                        };
                        if (!player.logged) {
                            player.logged=true;
                            if (extract("debug")) { playerLogger.push(player);console.log("Logged player: "+player.name,player) }
                            if (extract("joinMessages") && (!window.newGame)) {
                                if (extract("publicBroadcast")) {
                                    sendChatMessage((extract("joinLeaveBranding") ? "[SFC] " : "")+player.name+" joined.")
                                } else {
                                    processChatItem(ss,"joined.",player.name,player.team,"rgba(0, 255, 0, 0.2)");
                                };
                            };
                            onlinePlayersArray.push([player,player.name,player.team]);
                        };
                        player.isOnline=objExists;
                    };
                });
                for ( let i=0;i<onlinePlayersArray.length;i++) {
                    if (onlinePlayersArray[i][0] && onlinePlayersArray[i][0].isOnline==objExists) { //player still online
                        onlinePlayersArray[i][2]=onlinePlayersArray[i][0].team;
                    } else {
                        if (extract("leaveMessages") && (!window.newGame)) {
                            if (extract("publicBroadcast")) {
                                sendChatMessage((extract("joinLeaveBranding") ? "[SFC] " : "")+onlinePlayersArray[i][1]+" left.")
                            } else {
                                processChatItem(ss,"left.",onlinePlayersArray[i][1],onlinePlayersArray[i][2],"rgba(255, 0, 0, 0.2)");
                            };
                        };
                        onlinePlayersArray.splice(i,1);
                    };
                };
            };
            //update ammoESP boxes, tracer lines, colors
            if (extract("ammoESP")||extract("ammoTracers")||extract("grenadeESP")||extract("grenadeTracers")) {
                ss.RENDERLIST.forEach(item=>{
                    if ( item._isEnabled && item.sourceMesh && item.sourceMesh.name && (item.sourceMesh.name=="grenadeItem" || item.sourceMesh.name=="ammo") ) { //this is what we want
                        const itemType=item.sourceMesh.name;
                        let color=itemType=="ammo" && extract("ammoESPColor") || extract("grenadeESPColor");
                        color = hexToRgb(color);

                        updateOrCreateLinesESP(ss,item,"ammoESP",color)

                        let willBeVisible=false;

                        if (itemType=="ammo") { //ammo
                            const regime=extract("ammoESPRegime");
                            if (regime=="whendepleted" && ammo.store==0) {
                                willBeVisible=true;
                            } else if (regime=="whenlow" && ammo.store<=ammo.capacity) {
                                willBeVisible=true;
                            } else if (regime=="belowmax" && ammo.store<ammo.storeMax) {
                                willBeVisible=true;
                            } else if (regime=="alwayson") {
                                willBeVisible=true;
                            };
                        } else { //grenades
                            const regime=extract("grenadeESPRegime");
                            if (regime=="whendepleted" && ss.MYPLAYER.grenadeCount==0) {
                                willBeVisible=true;
                            } else if (regime=="whenlow" && ss.MYPLAYER.grenadeCount<=1) {
                                willBeVisible=true;
                            } else if (regime=="belowmax" && ss.MYPLAYER.grenadeCount<ss.MYPLAYER.grenadeCapacity) {
                                willBeVisible=true;
                            } else if (regime=="alwayson") {
                                willBeVisible=true;
                            };
                        };

                        item.box.visibility = willBeVisible && (itemType=="ammo" && extract("ammoESP") || extract("grenadeESP"));
                        item.tracerLines.visibility = willBeVisible && (itemType=="ammo" && extract("ammoTracers") || extract("grenadeTracers"));

                        item.exists=objExists;
                    };
                });
            };
            for ( let i=0;i<ESPArray.length;i++) {
                if (ESPArray[i][0] && ESPArray[i][0].exists==objExists) { //obj still exists and still relevant
                    //do nothing, lol
                } else {
                    if (ESPArray[i][0]) { //obj still exists but no longer relevant
                        console.log( '%cRemoving tracer line due to irrelevant object', 'color: white; background: red' );
                        ESPArray[i][0].generatedESP=false;
                    } else { //obj no longer exists
                        console.log( '%cRemoving tracer line due to no longer exists', 'color: white; background: red' );
                    };
                    ESPArray[i][1].dispose(); //tracer
                    ESPArray[i][2].dispose(); //esp box
                    if (ESPArray[i][3]) {ESPArray[i][3].dispose()}; //target
                    ESPArray.splice(i,1);
                };
            }; window.newGame=false;
        };
        createAnonFunction("retrieveFunctions",function(vars) { ss=vars ; F.STATEFARM() });
        createAnonFunction("STATEFARM",function(){
            currentlyInGame=true;
            if ( !ranOneTime ) { oneTime(ss) };
            initVars(ss);
            updateLinesESP(ss);
            if ( extract("freecam") ) {
                ss.MYPLAYER.actor.mesh.position.y = ss.MYPLAYER.actor.mesh.position.y + 1;
            };

            if (extract("spamChat")) {
                if (Date.now()>(lastSpamMessage+extract("spamChatDelay"))) {
                    sendChatMessage(extract("spamChatText")+String.fromCharCode(97 + Math.floor(Math.random() * 26)));
                    lastSpamMessage=Date.now()
                };
            };

            if (extract("autoEZ")||extract("cheatAccuse")) {
                if (ss.MYPLAYER.score !== yourPlayerKills) {
                    yourPlayerKills = ss.MYPLAYER.score;
                    if (ss.MYPLAYER?.playing && extract("autoEZ")) {
                        sendChatMessage(`imagine dying ${currentlyTargetingName}, couldn't be me`);
                    } else if (extract("cheatAccuse")) {
                        sendChatMessage(`are you cheating ${currentlyTargetingName}? everyone report`);
                    };
                }; //chatOnKill
            };

            if ( extract("showCoordinates") ) {
                const fonx = Number((ss.MYPLAYER.actor.mesh.position.x).toFixed(3));
                const fony = Number((ss.MYPLAYER.actor.mesh.position.y).toFixed(3));
                const fonz = Number((ss.MYPLAYER.actor.mesh.position.z).toFixed(3));
                const yaw = Number((ss.MYPLAYER.yaw).toFixed(3)); //could i function this? yea
                const pitch = Number((ss.MYPLAYER.pitch).toFixed(3));
                const personalCoordinate = `XYZ: ${fonx}, ${fony}, ${fonz} Rot: ${yaw}, ${pitch}`;
                coordElement.innerText = personalCoordinate;
                void coordElement.offsetWidth;
                coordElement.style.display = '';
            };
            if (extract("playerStats")) {
                let playerStates="";
                ss.PLAYERS.forEach(player=>{
                    if (player && (player!==ss.MYPLAYER) && player.playing && (player.hp>0) && ((!ss.MYPLAYER.team)||( player.team!==ss.MYPLAYER.team))) {
                        playerStates=playerStates+player.name+": "+Math.round(player.hp)+" HP\n";
                    };
                });
                if (playerStates=="") {playerStates="No Enemy Players"};
                playerstatsElement.innerText = playerStates;
                void playerstatsElement.offsetWidth;
                playerstatsElement.style.display = '';
            };
            if (extract("playerInfo")) {
                let playerInfoString="";
                const player=currentlyTargeting||playerLookingAt||undefined
                if (player && player.playing) {
                    playerInfoString=playerInfoString+player.name+"\n"
                    playerInfoString=playerInfoString+"HP: "+Math.round(player.hp)+"\n"
                    playerInfoString=playerInfoString+"Distance: "+player.distance.toFixed(3)+"\n"
                    playerInfoString=playerInfoString+"AngleDiff: "+player.angleDiff.toFixed(3)+"\n"
                };
                if (playerInfoString=="") {playerInfoString="Not Looking At Player"};
                playerinfoElement.innerText = playerInfoString;
                void playerinfoElement.offsetWidth;
                playerinfoElement.style.display = '';
            };
            if (extract("debug")) {
                globalPlayer=ss;
            };
            let reticle
            if (extract("showLOS")) {
                const player=currentlyTargeting||playerLookingAt||undefined
                if (player) {
                    reticle=getLineOfSight(ss,player)
                };
            }
            highlightCrossHairReticleDot(ss,reticle);
            if ( extract("chatHighlight") ) {
                document.getElementById("chatOut").style.userSelect="text"
            };
            if ( extract("autoRefill") ) {
                if (ammo.rounds==0) {
                    ss.MYPLAYER.reload();
                };
            };
            if (extract("holdToFire") && isLeftButtonDown) {
                ss.MYPLAYER.pullTrigger();
            };
            if (extract("autoShoot")) {
                if (ammo.capacity>0) {
                    ss.MYPLAYER.pullTrigger();
                } else {
                    ss.MYPLAYER.melee();
                };
            };
            if ((extract("autoWeapon")!=="disabled")&&(!ss.MYPLAYER.playing)) {
                const weaponArray={ //this could be done differently but i cba
                    eggk47: 0,
                    scrambler: 1,
                    freeranger: 2,
                    rpegg: 3,
                    whipper: 4,
                    crackshot: 5,
                    trihard: 6,
                };
                document.querySelectorAll('.weapon_img')[weaponArray[extract("autoWeapon")]].parentNode.click();
            };
            if (extract("revealBloom")) {
                redCircle.style.display='';
                const distCenterToOuter = 2 * (200 / ss.CAMERA.fov);
                const bloomValues=predictBloom(ss,ss.MYPLAYER.yaw,ss.MYPLAYER.pitch);
                // Set the new position of the circle
                const centerX = (window.innerWidth / 2);
                const centerY = (window.innerHeight / 2);
                const offsettedX = centerX + (2 * distCenterToOuter * bloomValues[0]);
                const offsettedY = centerY + (2 * distCenterToOuter * bloomValues[1]);
                redCircle.style.bottom = offsettedY + 'px';
                redCircle.style.right = offsettedX + 'px';
            } else {
                redCircle.style.display='none';
            };
            let enemyMinimumDistance=999999;
            let playerLookingAtMinimum=999999;
            playerNearest=undefined;
            playerLookingAt=undefined;
            enemyNearest=undefined;
            enemyLookingAt=undefined;
            let previousTarget=currentlyTargeting;
            let selectNewTarget=(!extract("antiSwitch")||!currentlyTargeting);
            let didAimbot
            // console.log(targetingComplete);

            const targetType=extract("aimbotTargeting");
            let enemyMinimumValue = 9999;
            ss.PLAYERS.forEach(player=>{
                if (player && (player!==ss.MYPLAYER) && player.playing && (player.hp>0)) {
                    const whitelisted=(!extract("enableWhitelistAimbot")||extract("enableWhitelistAimbot")&&isPartialMatch(whitelistPlayers,player.name));
                    const blacklisted=(extract("enableBlacklistAimbot")&&isPartialMatch(blacklistPlayers,player.name));
                    const passedLists=whitelisted&&(!blacklisted);
                    player.distance = distancePlayers(ss.MYPLAYER,player);
                    const directionVector=getDirectionVectorPlayer(ss,player);
                    player.angleDiff=getAngularDifference(ss.MYPLAYER, {yaw: calculateYaw(directionVector), pitch: calculatePitch(directionVector)});

                    if (player.angleDiff < playerLookingAtMinimum) {
                        playerLookingAtMinimum = player.angleDiff;
                        playerLookingAt = player;
                    };

                    if (passedLists && ((!ss.MYPLAYER.team)||( player.team!==ss.MYPLAYER.team))) { //is an an enemy
                        if (extract("aimbot") && (extract("aimbotRightClick") ? isRightButtonDown : true) && ss.MYPLAYER.playing) { //is doing aimbot
                            if (selectNewTarget) {
                                if (player.distance<enemyMinimumValue) { //for antisneak, not targeting
                                    enemyMinimumDistance = player.distance;
                                    enemyNearest = player;
                                };
                                if (targetType=="nearest") {
                                    if ( player.distance < enemyMinimumValue && (!extract("lineOfSight") || getLineOfSight(ss,player))) {
                                        enemyMinimumValue = player.distance;
                                        currentlyTargeting = player;
                                    };
                                } else if (targetType=="pointingat") {
                                    if (player.angleDiff < enemyMinimumValue && (!extract("lineOfSight") || getLineOfSight(ss,player))) {
                                        enemyMinimumValue = player.angleDiff;
                                        currentlyTargeting = player;
                                    };
                                };
                            };
                        };
                    };
                };
            });
            currentlyTargetingName = currentlyTargeting?.name;
            if (extract("aimbot") && (extract("aimbotRightClick") ? isRightButtonDown : true) && ss.MYPLAYER.playing) {
                if ( currentlyTargeting && currentlyTargeting.playing ) { //found a target
                    didAimbot=true
                    if (!extract("silentAimbot")) {
                        const distanceBetweenPlayers = distancePlayers(ss.MYPLAYER,currentlyTargeting);

                        const aimbot=getAimbot(ss,currentlyTargeting);

                        const antiSnap=(1-(extract("aimbotAntiSnap")||0));

                        if (previousTarget!==currentlyTargeting) { targetingComplete=false };

                        function lerp(start, end, alpha) {
                            let value = (1 - alpha ) * start + alpha * end;
                            if ((Math.abs(end - start) < (0.2/(distanceBetweenPlayers))) || (targetingComplete)) {
                                value = end; targetingComplete=true;
                            };
                            return value;
                        };

                        // Exponential lerp towards the target rotation
                        ss.MYPLAYER.yaw = setPrecision(lerp(ss.MYPLAYER.yaw, aimbot.yaw, antiSnap));
                        ss.MYPLAYER.pitch = setPrecision(lerp(ss.MYPLAYER.pitch, aimbot.pitch, antiSnap));
                    };

                    if (extract("antiSneak")!==0) {
                        let acceptableDistance = extract("antiSneak");
                        if ( enemyMinimumDistance < acceptableDistance) {
                            currentlyTargeting = enemyNearest;
                            if (ammo.rounds === 0) { //basically after MAGDUMP, switch to pistol, if that is empty reload and keep shootin'
                                if (ss.MYPLAYER.weaponIdx === 0){ss.MYPLAYER.swapWeapon(1);}
                                else {ss.MYPLAYER.reload();}
                            };
                            ss.MYPLAYER.pullTrigger();
                            // console.log("ANTISNEAK---->", enemyNearest?.name, enemyMinimumDistance);
                        };
                    };

                    if (extract("tracers")) {
                        currentlyTargeting.tracerLines.color = new ss.BABYLONJS.Color3(...hexToRgb(extract("aimbotColor")));
                    };
                    if (extract("playerESP")) {
                        currentlyTargeting.box.color = new ss.BABYLONJS.Color3(...hexToRgb(extract("aimbotColor")));
                    };
                } else {
                    if (extract("oneKill")) {
                        currentlyTargeting="dead";
                    } else {
                        currentlyTargeting=false;
                    };
                };
            } else {
                currentlyTargeting=false;
                targetingComplete=false;
                if (extract("enableSeizureX")) {
                    ss.MYPLAYER.yaw+=extract("amountSeizureX")
                };
                if (extract("enableSeizureY")) {
                    ss.MYPLAYER.pitch+=extract("amountSeizureY")
                };
            };
            highlightCurrentlyTargeting(ss, currentlyTargeting, didAimbot);
            yawCache=ss.MYPLAYER.yaw;
            pitchCache=ss.MYPLAYER.pitch;
            if (extract("upsideDown")) { //sorta useless
                if (ss.MYPLAYER.pitch<1.5 && ss.MYPLAYER.pitch>-1.5) {
                    ss.MYPLAYER.pitch=Math.PI;
                };
            };
            if (extract("silentRoll")) {
                ss.MYPLAYER.pitch+=2*Math.PI;
            };
        });
    };

    var css = "text-shadow: -1px -1px hsl(0,100%,50%), 1px 1px hsl(5.4, 100%, 50%), 3px 2px hsl(10.8, 100%, 50%), 5px 3px hsl(16.2, 100%, 50%), 7px 4px hsl(21.6, 100%, 50%), 9px 5px hsl(27, 100%, 50%), 11px 6px hsl(32.4, 100%, 50%), 13px 7px hsl(37.8, 100%, 50%), 14px 8px hsl(43.2, 100%, 50%), 16px 9px hsl(48.6, 100%, 50%), 18px 10px hsl(54, 100%, 50%), 20px 11px hsl(59.4, 100%, 50%), 22px 12px hsl(64.8, 100%, 50%), 23px 13px hsl(70.2, 100%, 50%), 25px 14px hsl(75.6, 100%, 50%), 27px 15px hsl(81, 100%, 50%), 28px 16px hsl(86.4, 100%, 50%), 30px 17px hsl(91.8, 100%, 50%), 32px 18px hsl(97.2, 100%, 50%), 33px 19px hsl(102.6, 100%, 50%), 35px 20px hsl(108, 100%, 50%), 36px 21px hsl(113.4, 100%, 50%), 38px 22px hsl(118.8, 100%, 50%), 39px 23px hsl(124.2, 100%, 50%), 41px 24px hsl(129.6, 100%, 50%), 42px 25px hsl(135, 100%, 50%), 43px 26px hsl(140.4, 100%, 50%), 45px 27px hsl(145.8, 100%, 50%), 46px 28px hsl(151.2, 100%, 50%), 47px 29px hsl(156.6, 100%, 50%), 48px 30px hsl(162, 100%, 50%), 49px 31px hsl(167.4, 100%, 50%), 50px 32px hsl(172.8, 100%, 50%), 51px 33px hsl(178.2, 100%, 50%), 52px 34px hsl(183.6, 100%, 50%), 53px 35px hsl(189, 100%, 50%), 54px 36px hsl(194.4, 100%, 50%), 55px 37px hsl(199.8, 100%, 50%), 55px 38px hsl(205.2, 100%, 50%), 56px 39px hsl(210.6, 100%, 50%), 57px 40px hsl(216, 100%, 50%), 57px 41px hsl(221.4, 100%, 50%), 58px 42px hsl(226.8, 100%, 50%), 58px 43px hsl(232.2, 100%, 50%), 58px 44px hsl(237.6, 100%, 50%), 59px 45px hsl(243, 100%, 50%), 59px 46px hsl(248.4, 100%, 50%), 59px 47px hsl(253.8, 100%, 50%), 59px 48px hsl(259.2, 100%, 50%), 59px 49px hsl(264.6, 100%, 50%), 60px 50px hsl(270, 100%, 50%), 59px 51px hsl(275.4, 100%, 50%), 59px 52px hsl(280.8, 100%, 50%), 59px 53px hsl(286.2, 100%, 50%), 59px 54px hsl(291.6, 100%, 50%), 59px 55px hsl(297, 100%, 50%), 58px 56px hsl(302.4, 100%, 50%), 58px 57px hsl(307.8, 100%, 50%), 58px 58px hsl(313.2, 100%, 50%), 57px 59px hsl(318.6, 100%, 50%), 57px 60px hsl(324, 100%, 50%), 56px 61px hsl(329.4, 100%, 50%), 55px 62px hsl(334.8, 100%, 50%), 55px 63px hsl(340.2, 100%, 50%), 54px 64px hsl(345.6, 100%, 50%), 53px 65px hsl(351, 100%, 50%), 52px 66px hsl(356.4, 100%, 50%), 51px 67px hsl(361.8, 100%, 50%), 50px 68px hsl(367.2, 100%, 50%), 49px 69px hsl(372.6, 100%, 50%), 48px 70px hsl(378, 100%, 50%), 47px 71px hsl(383.4, 100%, 50%), 46px 72px hsl(388.8, 100%, 50%), 45px 73px hsl(394.2, 100%, 50%), 43px 74px hsl(399.6, 100%, 50%), 42px 75px hsl(405, 100%, 50%), 41px 76px hsl(410.4, 100%, 50%), 39px 77px hsl(415.8, 100%, 50%), 38px 78px hsl(421.2, 100%, 50%), 36px 79px hsl(426.6, 100%, 50%), 35px 80px hsl(432, 100%, 50%), 33px 81px hsl(437.4, 100%, 50%), 32px 82px hsl(442.8, 100%, 50%), 30px 83px hsl(448.2, 100%, 50%), 28px 84px hsl(453.6, 100%, 50%), 27px 85px hsl(459, 100%, 50%), 25px 86px hsl(464.4, 100%, 50%), 23px 87px hsl(469.8, 100%, 50%), 22px 88px hsl(475.2, 100%, 50%), 20px 89px hsl(480.6, 100%, 50%), 18px 90px hsl(486, 100%, 50%), 16px 91px hsl(491.4, 100%, 50%), 14px 92px hsl(496.8, 100%, 50%), 13px 93px hsl(502.2, 100%, 50%), 11px 94px hsl(507.6, 100%, 50%), 9px 95px hsl(513, 100%, 50%), 7px 96px hsl(518.4, 100%, 50%), 5px 97px hsl(523.8, 100%, 50%), 3px 98px hsl(529.2, 100%, 50%), 1px 99px hsl(534.6, 100%, 50%), 7px 100px hsl(540, 100%, 50%), -1px 101px hsl(545.4, 100%, 50%), -3px 102px hsl(550.8, 100%, 50%), -5px 103px hsl(556.2, 100%, 50%), -7px 104px hsl(561.6, 100%, 50%), -9px 105px hsl(567, 100%, 50%), -11px 106px hsl(572.4, 100%, 50%), -13px 107px hsl(577.8, 100%, 50%), -14px 108px hsl(583.2, 100%, 50%), -16px 109px hsl(588.6, 100%, 50%), -18px 110px hsl(594, 100%, 50%), -20px 111px hsl(599.4, 100%, 50%), -22px 112px hsl(604.8, 100%, 50%), -23px 113px hsl(610.2, 100%, 50%), -25px 114px hsl(615.6, 100%, 50%), -27px 115px hsl(621, 100%, 50%), -28px 116px hsl(626.4, 100%, 50%), -30px 117px hsl(631.8, 100%, 50%), -32px 118px hsl(637.2, 100%, 50%), -33px 119px hsl(642.6, 100%, 50%), -35px 120px hsl(648, 100%, 50%), -36px 121px hsl(653.4, 100%, 50%), -38px 122px hsl(658.8, 100%, 50%), -39px 123px hsl(664.2, 100%, 50%), -41px 124px hsl(669.6, 100%, 50%), -42px 125px hsl(675, 100%, 50%), -43px 126px hsl(680.4, 100%, 50%), -45px 127px hsl(685.8, 100%, 50%), -46px 128px hsl(691.2, 100%, 50%), -47px 129px hsl(696.6, 100%, 50%), -48px 130px hsl(702, 100%, 50%), -49px 131px hsl(707.4, 100%, 50%), -50px 132px hsl(712.8, 100%, 50%), -51px 133px hsl(718.2, 100%, 50%), -52px 134px hsl(723.6, 100%, 50%), -53px 135px hsl(729, 100%, 50%), -54px 136px hsl(734.4, 100%, 50%), -55px 137px hsl(739.8, 100%, 50%), -55px 138px hsl(745.2, 100%, 50%), -56px 139px hsl(750.6, 100%, 50%), -57px 140px hsl(756, 100%, 50%), -57px 141px hsl(761.4, 100%, 50%), -58px 142px hsl(766.8, 100%, 50%), -58px 143px hsl(772.2, 100%, 50%), -58px 144px hsl(777.6, 100%, 50%), -59px 145px hsl(783, 100%, 50%), -59px 146px hsl(788.4, 100%, 50%), -59px 147px hsl(793.8, 100%, 50%), -59px 148px hsl(799.2, 100%, 50%), -59px 149px hsl(804.6, 100%, 50%), -60px 150px hsl(810, 100%, 50%), -59px 151px hsl(815.4, 100%, 50%), -59px 152px hsl(820.8, 100%, 50%), -59px 153px hsl(826.2, 100%, 50%), -59px 154px hsl(831.6, 100%, 50%), -59px 155px hsl(837, 100%, 50%), -58px 156px hsl(842.4, 100%, 50%), -58px 157px hsl(847.8, 100%, 50%), -58px 158px hsl(853.2, 100%, 50%), -57px 159px hsl(858.6, 100%, 50%), -57px 160px hsl(864, 100%, 50%), -56px 161px hsl(869.4, 100%, 50%), -55px 162px hsl(874.8, 100%, 50%), -55px 163px hsl(880.2, 100%, 50%), -54px 164px hsl(885.6, 100%, 50%), -53px 165px hsl(891, 100%, 50%), -52px 166px hsl(896.4, 100%, 50%), -51px 167px hsl(901.8, 100%, 50%), -50px 168px hsl(907.2, 100%, 50%), -49px 169px hsl(912.6, 100%, 50%), -48px 170px hsl(918, 100%, 50%), -47px 171px hsl(923.4, 100%, 50%), -46px 172px hsl(928.8, 100%, 50%), -45px 173px hsl(934.2, 100%, 50%), -43px 174px hsl(939.6, 100%, 50%), -42px 175px hsl(945, 100%, 50%), -41px 176px hsl(950.4, 100%, 50%), -39px 177px hsl(955.8, 100%, 50%), -38px 178px hsl(961.2, 100%, 50%), -36px 179px hsl(966.6, 100%, 50%), -35px 180px hsl(972, 100%, 50%), -33px 181px hsl(977.4, 100%, 50%), -32px 182px hsl(982.8, 100%, 50%), -30px 183px hsl(988.2, 100%, 50%), -28px 184px hsl(993.6, 100%, 50%), -27px 185px hsl(999, 100%, 50%), -25px 186px hsl(1004.4, 100%, 50%), -23px 187px hsl(1009.8, 100%, 50%), -22px 188px hsl(1015.2, 100%, 50%), -20px 189px hsl(1020.6, 100%, 50%), -18px 190px hsl(1026, 100%, 50%), -16px 191px hsl(1031.4, 100%, 50%), -14px 192px hsl(1036.8, 100%, 50%), -13px 193px hsl(1042.2, 100%, 50%), -11px 194px hsl(1047.6, 100%, 50%), -9px 195px hsl(1053, 100%, 50%), -7px 196px hsl(1058.4, 100%, 50%), -5px 197px hsl(1063.8, 100%, 50%), -3px 198px hsl(1069.2, 100%, 50%), -1px 199px hsl(1074.6, 100%, 50%), -1px 200px hsl(1080, 100%, 50%), 1px 201px hsl(1085.4, 100%, 50%), 3px 202px hsl(1090.8, 100%, 50%), 5px 203px hsl(1096.2, 100%, 50%), 7px 204px hsl(1101.6, 100%, 50%), 9px 205px hsl(1107, 100%, 50%), 11px 206px hsl(1112.4, 100%, 50%), 13px 207px hsl(1117.8, 100%, 50%), 14px 208px hsl(1123.2, 100%, 50%), 16px 209px hsl(1128.6, 100%, 50%), 18px 210px hsl(1134, 100%, 50%), 20px 211px hsl(1139.4, 100%, 50%), 22px 212px hsl(1144.8, 100%, 50%), 23px 213px hsl(1150.2, 100%, 50%), 25px 214px hsl(1155.6, 100%, 50%), 27px 215px hsl(1161, 100%, 50%), 28px 216px hsl(1166.4, 100%, 50%), 30px 217px hsl(1171.8, 100%, 50%), 32px 218px hsl(1177.2, 100%, 50%), 33px 219px hsl(1182.6, 100%, 50%), 35px 220px hsl(1188, 100%, 50%), 36px 221px hsl(1193.4, 100%, 50%), 38px 222px hsl(1198.8, 100%, 50%), 39px 223px hsl(1204.2, 100%, 50%), 41px 224px hsl(1209.6, 100%, 50%), 42px 225px hsl(1215, 100%, 50%), 43px 226px hsl(1220.4, 100%, 50%), 45px 227px hsl(1225.8, 100%, 50%), 46px 228px hsl(1231.2, 100%, 50%), 47px 229px hsl(1236.6, 100%, 50%), 48px 230px hsl(1242, 100%, 50%), 49px 231px hsl(1247.4, 100%, 50%), 50px 232px hsl(1252.8, 100%, 50%), 51px 233px hsl(1258.2, 100%, 50%), 52px 234px hsl(1263.6, 100%, 50%), 53px 235px hsl(1269, 100%, 50%), 54px 236px hsl(1274.4, 100%, 50%), 55px 237px hsl(1279.8, 100%, 50%), 55px 238px hsl(1285.2, 100%, 50%), 56px 239px hsl(1290.6, 100%, 50%), 57px 240px hsl(1296, 100%, 50%), 57px 241px hsl(1301.4, 100%, 50%), 58px 242px hsl(1306.8, 100%, 50%), 58px 243px hsl(1312.2, 100%, 50%), 58px 244px hsl(1317.6, 100%, 50%), 59px 245px hsl(1323, 100%, 50%), 59px 246px hsl(1328.4, 100%, 50%), 59px 247px hsl(1333.8, 100%, 50%), 59px 248px hsl(1339.2, 100%, 50%), 59px 249px hsl(1344.6, 100%, 50%), 60px 250px hsl(1350, 100%, 50%), 59px 251px hsl(1355.4, 100%, 50%), 59px 252px hsl(1360.8, 100%, 50%), 59px 253px hsl(1366.2, 100%, 50%), 59px 254px hsl(1371.6, 100%, 50%), 59px 255px hsl(1377, 100%, 50%), 58px 256px hsl(1382.4, 100%, 50%), 58px 257px hsl(1387.8, 100%, 50%), 58px 258px hsl(1393.2, 100%, 50%), 57px 259px hsl(1398.6, 100%, 50%), 57px 260px hsl(1404, 100%, 50%), 56px 261px hsl(1409.4, 100%, 50%), 55px 262px hsl(1414.8, 100%, 50%), 55px 263px hsl(1420.2, 100%, 50%), 54px 264px hsl(1425.6, 100%, 50%), 53px 265px hsl(1431, 100%, 50%), 52px 266px hsl(1436.4, 100%, 50%), 51px 267px hsl(1441.8, 100%, 50%), 50px 268px hsl(1447.2, 100%, 50%), 49px 269px hsl(1452.6, 100%, 50%), 48px 270px hsl(1458, 100%, 50%), 47px 271px hsl(1463.4, 100%, 50%), 46px 272px hsl(1468.8, 100%, 50%), 45px 273px hsl(1474.2, 100%, 50%), 43px 274px hsl(1479.6, 100%, 50%), 42px 275px hsl(1485, 100%, 50%), 41px 276px hsl(1490.4, 100%, 50%), 39px 277px hsl(1495.8, 100%, 50%), 38px 278px hsl(1501.2, 100%, 50%), 36px 279px hsl(1506.6, 100%, 50%), 35px 280px hsl(1512, 100%, 50%), 33px 281px hsl(1517.4, 100%, 50%), 32px 282px hsl(1522.8, 100%, 50%), 30px 283px hsl(1528.2, 100%, 50%), 28px 284px hsl(1533.6, 100%, 50%), 27px 285px hsl(1539, 100%, 50%), 25px 286px hsl(1544.4, 100%, 50%), 23px 287px hsl(1549.8, 100%, 50%), 22px 288px hsl(1555.2, 100%, 50%), 20px 289px hsl(1560.6, 100%, 50%), 18px 290px hsl(1566, 100%, 50%), 16px 291px hsl(1571.4, 100%, 50%), 14px 292px hsl(1576.8, 100%, 50%), 13px 293px hsl(1582.2, 100%, 50%), 11px 294px hsl(1587.6, 100%, 50%), 9px 295px hsl(1593, 100%, 50%), 7px 296px hsl(1598.4, 100%, 50%), 5px 297px hsl(1603.8, 100%, 50%), 3px 298px hsl(1609.2, 100%, 50%), 1px 299px hsl(1614.6, 100%, 50%), 2px 300px hsl(1620, 100%, 50%), -1px 301px hsl(1625.4, 100%, 50%), -3px 302px hsl(1630.8, 100%, 50%), -5px 303px hsl(1636.2, 100%, 50%), -7px 304px hsl(1641.6, 100%, 50%), -9px 305px hsl(1647, 100%, 50%), -11px 306px hsl(1652.4, 100%, 50%), -13px 307px hsl(1657.8, 100%, 50%), -14px 308px hsl(1663.2, 100%, 50%), -16px 309px hsl(1668.6, 100%, 50%), -18px 310px hsl(1674, 100%, 50%), -20px 311px hsl(1679.4, 100%, 50%), -22px 312px hsl(1684.8, 100%, 50%), -23px 313px hsl(1690.2, 100%, 50%), -25px 314px hsl(1695.6, 100%, 50%), -27px 315px hsl(1701, 100%, 50%), -28px 316px hsl(1706.4, 100%, 50%), -30px 317px hsl(1711.8, 100%, 50%), -32px 318px hsl(1717.2, 100%, 50%), -33px 319px hsl(1722.6, 100%, 50%), -35px 320px hsl(1728, 100%, 50%), -36px 321px hsl(1733.4, 100%, 50%), -38px 322px hsl(1738.8, 100%, 50%), -39px 323px hsl(1744.2, 100%, 50%), -41px 324px hsl(1749.6, 100%, 50%), -42px 325px hsl(1755, 100%, 50%), -43px 326px hsl(1760.4, 100%, 50%), -45px 327px hsl(1765.8, 100%, 50%), -46px 328px hsl(1771.2, 100%, 50%), -47px 329px hsl(1776.6, 100%, 50%), -48px 330px hsl(1782, 100%, 50%), -49px 331px hsl(1787.4, 100%, 50%), -50px 332px hsl(1792.8, 100%, 50%), -51px 333px hsl(1798.2, 100%, 50%), -52px 334px hsl(1803.6, 100%, 50%), -53px 335px hsl(1809, 100%, 50%), -54px 336px hsl(1814.4, 100%, 50%), -55px 337px hsl(1819.8, 100%, 50%), -55px 338px hsl(1825.2, 100%, 50%), -56px 339px hsl(1830.6, 100%, 50%), -57px 340px hsl(1836, 100%, 50%), -57px 341px hsl(1841.4, 100%, 50%), -58px 342px hsl(1846.8, 100%, 50%), -58px 343px hsl(1852.2, 100%, 50%), -58px 344px hsl(1857.6, 100%, 50%), -59px 345px hsl(1863, 100%, 50%), -59px 346px hsl(1868.4, 100%, 50%), -59px 347px hsl(1873.8, 100%, 50%), -59px 348px hsl(1879.2, 100%, 50%), -59px 349px hsl(1884.6, 100%, 50%), -60px 350px hsl(1890, 100%, 50%), -59px 351px hsl(1895.4, 100%, 50%), -59px 352px hsl(1900.8, 100%, 50%), -59px 353px hsl(1906.2, 100%, 50%), -59px 354px hsl(1911.6, 100%, 50%), -59px 355px hsl(1917, 100%, 50%), -58px 356px hsl(1922.4, 100%, 50%), -58px 357px hsl(1927.8, 100%, 50%), -58px 358px hsl(1933.2, 100%, 50%), -57px 359px hsl(1938.6, 100%, 50%), -57px 360px hsl(1944, 100%, 50%), -56px 361px hsl(1949.4, 100%, 50%), -55px 362px hsl(1954.8, 100%, 50%), -55px 363px hsl(1960.2, 100%, 50%), -54px 364px hsl(1965.6, 100%, 50%), -53px 365px hsl(1971, 100%, 50%), -52px 366px hsl(1976.4, 100%, 50%), -51px 367px hsl(1981.8, 100%, 50%), -50px 368px hsl(1987.2, 100%, 50%), -49px 369px hsl(1992.6, 100%, 50%), -48px 370px hsl(1998, 100%, 50%), -47px 371px hsl(2003.4, 100%, 50%), -46px 372px hsl(2008.8, 100%, 50%), -45px 373px hsl(2014.2, 100%, 50%), -43px 374px hsl(2019.6, 100%, 50%), -42px 375px hsl(2025, 100%, 50%), -41px 376px hsl(2030.4, 100%, 50%), -39px 377px hsl(2035.8, 100%, 50%), -38px 378px hsl(2041.2, 100%, 50%), -36px 379px hsl(2046.6, 100%, 50%), -35px 380px hsl(2052, 100%, 50%), -33px 381px hsl(2057.4, 100%, 50%), -32px 382px hsl(2062.8, 100%, 50%), -30px 383px hsl(2068.2, 100%, 50%), -28px 384px hsl(2073.6, 100%, 50%), -27px 385px hsl(2079, 100%, 50%), -25px 386px hsl(2084.4, 100%, 50%), -23px 387px hsl(2089.8, 100%, 50%), -22px 388px hsl(2095.2, 100%, 50%), -20px 389px hsl(2100.6, 100%, 50%), -18px 390px hsl(2106, 100%, 50%), -16px 391px hsl(2111.4, 100%, 50%), -14px 392px hsl(2116.8, 100%, 50%), -13px 393px hsl(2122.2, 100%, 50%), -11px 394px hsl(2127.6, 100%, 50%), -9px 395px hsl(2133, 100%, 50%), -7px 396px hsl(2138.4, 100%, 50%), -5px 397px hsl(2143.8, 100%, 50%), -3px 398px hsl(2149.2, 100%, 50%), -1px 399px hsl(2154.6, 100%, 50%); font-size: 40px;";

    //start init thingamajigs
    startUp();
})();

// display: none !important;
// console.log(aimbotBindButton.title);
// console.log(bindsArray);
