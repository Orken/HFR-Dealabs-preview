// ==UserScript== 
// @name [HFR] Dealabs preview 
// @version 0.1.3
// @namespace http://lbc2rss.superfetatoire.com/
// @description Permet de voir une preview des deals sur Dealabs
// @updateURL https://raw.githubusercontent.com/Orken/HFR-Dealabs-preview/master/hfr-dealabs-preview.user.js
// @downloadURL https://raw.githubusercontent.com/Orken/HFR-Dealabs-preview/master/hfr-dealabs-preview.user.js
// @supportURL https://github.com/Orken/HFR-Dealabs-preview/issues
// @include http://forum.hardware.fr/* 
// @icon https://pbs.twimg.com/profile_images/479273552596574209/Udxh8Fq-.png
// @homepage https://github.com/Orken/HFR-Dealabs-preview
// @author Orken | Mr Marron Derriere
// @grant GM_xmlhttpRequest
// @grant GM_addStyle
// ==/UserScript== 

var css = '#loader-wrapper{position:relative;top:10px;left:0;width:100%;height:100%;z-index:1000}#loader-wrapper p{position:absolute;text-align:center;left:0;right:0;color:#666;line-height:30px;top:50%;margin-top:-15px;font-size:30px}#loader{display:block;position:relative;left:50%;top:50%;width:150px;height:150px;margin:0 0 0 -75px;border-radius:50%;border:3px solid transparent;border-top-color:#f56b2a;-webkit-animation:spin 1.5s linear infinite;animation:spin 1.5s linear infinite}#loader:before{content:"";position:absolute;top:5px;left:5px;right:5px;bottom:5px;border-radius:50%;border:3px solid transparent;border-top-color:#4183d7;-webkit-animation:spin 2s linear infinite;animation:spin 2s linear infinite}#loader:after{content:"";position:absolute;top:15px;left:15px;right:15px;bottom:15px;border-radius:50%;border:3px solid transparent;border-top-color:#ccc;-webkit-animation:spin 1s linear infinite;animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0deg);-ms-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg);-ms-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes spin{0%{-webkit-transform:rotate(0deg);-ms-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg);-ms-transform:rotate(360deg);transform:rotate(360deg)}}';
css += '#mydeal * {box-sizing: border-box;}';
var links;
var primaryColor = '#02A5C1';
var successColor = 'rgb(96, 179, 92)';
var dangerColor = 'rgb(244, 67, 67)';
var clearfix = document.createElement('div');
clearfix.style.clear = 'both';

var testLink = function (link) { 
    return link.href.match(/www.dealabs.com\/bons-plans/i); 
};

var shortUrl = function (match, p1, p2, p3, offset, string) {
    return p1.substring(0,20) + '...' + p1.substring(p1.length - 10);
};

var loading = function (element) { 
    var dyn = ""; 
    return  setInterval(function() { 
        dyn+= "."; 
        if(dyn.length == 4) dyn = ""; 
        element.innerHTML ="Chargement en cours" + dyn; 
    },500); 
}; 

var emptyElement = function (element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
};

var display = function (content) {
    var div = document.createElement('div');
    var header = document.createElement('h1');
    header.style.margin = 0;
    header.style.padding = '5px';
    header.style.fontSize = '1.2rem';
    header.style.fontWeight = 'normal';
    header.style.backgroundColor = 'white';
    header.style.borderBottom = 'solid 1px #eee';
    header.style.color = 'black';
    header.style.marginBottom = '8px';
    header.innerHTML = content.title;
    div.appendChild(header);

    var numbersContainer = document.createElement('div');
    numbersContainer.style.marginTop = '8px';
    var prix = document.createElement('div');
    prix.style.padding = '5px';
    prix.style.backgroundColor = primaryColor;
    prix.innerHTML = content.price;
    prix.style.color = 'white';
    prix.style.fontSize = '1.6rem';
    prix.style.lineHeight = '1.75rem';
    prix.style.textAlign = 'center';
    prix.style.width = '50%';
    prix.style.float = 'left';
    var livraison = document.createElement('small');
    livraison.innerText = content.livraison;
    livraison.style.display = 'block';
    livraison.style.fontSize = '0.7rem';
    livraison.style.lineHeight = '0.75rem';
    prix.appendChild(livraison);
    
    var hot = document.createElement('div');
    hot.style.padding = '5px';
    hot.style.color = 'white';
    hot.style.fontSize = '1.5rem';
    hot.style.lineHeight = '2.5rem';
    hot.style.textAlign = 'center';
    hot.style.width = '50%';
    hot.style.float = 'left';
    hot.innerHTML = content.hot;
    hot.style.backgroundColor = (parseInt(content.hot) > 0)?successColor:dangerColor;
    numbersContainer.appendChild(prix);
    numbersContainer.appendChild(hot);
    numbersContainer.appendChild(clearfix);
    
    var description = document.createElement('div');
    var contentImg = document.createElement('div');
    contentImg.style.float = 'left';
    contentImg.style.padding = '0 5px';
    var img = new Image();
    img.src = content.image;
    contentImg.appendChild(img);
    var contentDesc = document.createElement('div');
    var p = document.createElement('p');
    p.style.color = '#bbb';
    p.style.margin = '3px 0';
    p.style.padding = '0 5px';
    p.style.textAlign = 'left';
    p.innerHTML = content.infosup;
    var texte = document.createElement('div');
    texte.style.padding = '0 5px';
    texte.style.fontSize = '1rem';
    texte.innerHTML = content.description.replace(/\n/g,'<br>').replace(/(http:[^\s]*)/g,shortUrl);
    contentDesc.appendChild(p);
    contentDesc.appendChild(texte);
 
    description.appendChild(contentImg);
    description.appendChild(contentDesc);
    div.appendChild(description);
    div.appendChild(clearfix);
    div.appendChild(numbersContainer);


    return div;
};

HTMLElement.prototype.getValue = function (selector) {
    var el = this.querySelector(selector);
    if (el !== null ) {
        return el.innerText.trim();
    }
    return false;
};
HTMLElement.prototype.getSrc = function (selector) {
    var el = this.querySelector(selector);
    if (el !== null ) {
        return el.src;
    }
    return false;
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
        container.id = 'mydeal';
        container.style.position = "absolute"; 
        container.style.background = "#fff"; 
        container.style.width = "400px";
        container.style.minHeight = '175px';
        container.style.padding = "0px";
        container.style.border = 'solid 1px #eee'; 
        container.style.borderTop = 'solid 4px ' + primaryColor; 
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
                    var article = document.createElement('div');
                    article.innerHTML = text[1].trim();
                    var contenu = {
                        price: article.getValue('.price'),
                        hot: article.getValue('.temperature_div'),
                        title: article.getValue('#title_contener h1'),
                        description: article.getValue('.description'),
                        infosup: article.getValue('.info_sup'),
                        livraison: article.getValue('.livraison'),
                        image: article.getSrc('.contener_image_deal img')
                    };
                    container.appendChild(display(contenu));
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

