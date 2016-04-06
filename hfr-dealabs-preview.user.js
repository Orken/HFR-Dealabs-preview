// ==UserScript== 
// @name [HFR] Dealabs preview 
// @version 0.1.0alpha
// @namespace http://lbc2rss.superfetatoire.com/
// @description Permet de voir une preview des deals sur Dealabs
// @updateURL https://raw.githubusercontent.com/Orken/HFR-Leboncoin-preview/master/hfr-leboncoin-preview.user.js
// @downloadURL https://raw.githubusercontent.com/Orken/HFR-Leboncoin-preview/master/hfr-leboncoin-preview.user.js
// @supportURL https://github.com/Orken/HFR-Leboncoin-preview/issues
// @include http://forum.hardware.fr/* 
// @homepage https://github.com/Orken/HFR-Leboncoin-preview
// @author Orken | Mr Marron Derriere
// @icon http://lbc2rss.superfetatoire.com/webroot/img/icon.png
// @grant GM_xmlhttpRequest
// @grant GM_addStyle
// ==/UserScript== 

var css = '#loader-wrapper{position:relative;top:10px;left:0;width:100%;height:100%;z-index:1000}#loader-wrapper p{position:absolute;text-align:center;left:0;right:0;color:#666;line-height:30px;top:50%;margin-top:-15px;font-size:30px}#loader{display:block;position:relative;left:50%;top:50%;width:150px;height:150px;margin:0 0 0 -75px;border-radius:50%;border:3px solid transparent;border-top-color:#f56b2a;-webkit-animation:spin 1.5s linear infinite;animation:spin 1.5s linear infinite}#loader:before{content:"";position:absolute;top:5px;left:5px;right:5px;bottom:5px;border-radius:50%;border:3px solid transparent;border-top-color:#4183d7;-webkit-animation:spin 2s linear infinite;animation:spin 2s linear infinite}#loader:after{content:"";position:absolute;top:15px;left:15px;right:15px;bottom:15px;border-radius:50%;border:3px solid transparent;border-top-color:#ccc;-webkit-animation:spin 1s linear infinite;animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0deg);-ms-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg);-ms-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes spin{0%{-webkit-transform:rotate(0deg);-ms-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg);-ms-transform:rotate(360deg);transform:rotate(360deg)}}';
var links;

var testLink = function (link) { 
    return link.href.match(/www.dealabs.com\/bons-plans/i); 
} 
 
var loading = function (element) { 
    var dyn = ""; 
    return  setInterval(function() { 
        dyn+= "."; 
        if(dyn.length == 4) dyn = ""; 
        element.innerHTML ="Chargement en cours" + dyn; 
    },500); 
} 

var emptyElement = function (element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
};

GM_addStyle(css);

links = Array.prototype.filter.call( document.querySelectorAll('#mesdiscussions a.cLink') , testLink );
links.forEach(function(link) {
    var container; 
    var loadingText; 
    var img; 
    var bePatient; 
    
    link.addEventListener('mouseover',function() { 
        
        loadingText = document.createElement('div');
        loadingText.id = 'loader-wrapper';
        var loader = document.createElement('div');
        loader.id = 'loader';
        var loadinginprogress = document.createElement('p');
        loadinginprogress.innerHTML = 'Chargement en cours';
        loadingText.appendChild(loadinginprogress);
        loadingText.appendChild(loader);
        bePatient = loading(loadinginprogress); 

        container = document.createElement('div'); 
        container.style.position = "absolute"; 
        container.style.background = "#fff"; 
        container.style.width = "400px";
        container.style.minHeight = '175px';
        container.style.padding = "0px";
        container.style.border = 'solid 2px #f56b2a'; 
        container.style.top = window.scrollY+10+"px"; 
        container.style.right = "10px"; 
        container.style.fontFamily = 'sans-serif'; 
         
        document.body.appendChild(container); 
        container.appendChild(loadingText); 
        var url = this.href; 
        GM_xmlhttpRequest({ 
                method: "GET", 
                url: url, 
                onload: function(response) 
                { 
                    emptyElement(container);
                    var texte = response.responseText; 
                    texte = texte.replace(/\n/g,"");
                    texte = texte.replace(/\r/g,"");
                    var text = texte.match(/<article\s*>(.*)<\/article/); 
                    container.innerHTML = text[1];
                    clearInterval(bePatient); 
                } 
            }); 
     },false); 
     
    link.addEventListener('mouseout',function() { 
        if(container) { 
           container.parentNode.removeChild(container); 
        } 
    },false); 
});
