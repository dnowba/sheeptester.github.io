/* reference me and all of your worries about making everything perfect goes away! ;) */
(function(){
  var thisscript=document.querySelector('script[src$="sheep.js"]'),
  el=document.createElement("link");
  el.type="text/css";
  el.rel="stylesheet";
  if (thisscript) el.href=thisscript.getAttribute('src').replace('.js','.css');
  else el.href="https://sheeptester.github.io/sheep.css";
  document.head.insertBefore(el,document.head.firstChild);
  el=document.createElement("sheepmenu");
  var svg=document.createElementNS("http://www.w3.org/2000/svg","svg"); // http://stackoverflow.com/questions/8215021/create-svg-tag-with-javascript
  svg.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:xlink","http://www.w3.org/1999/xlink");
  svg.setAttributeNS(null,'viewBox','0 0 480 480');
  svg.draggable=false;
  var path=document.createElementNS("http://www.w3.org/2000/svg","path"); // http://stackoverflow.com/questions/16488884/add-svg-element-to-existing-svg-using-dom
  path.setAttributeNS(null,'d',`M90 90a50 50 0 0 0 0 100H98.579A150 150 0 1 0 381.421 190H390a50 50 0 0 0 0 -100a50 50 0 1 1 -100 0a50 50 0 1 1 -100 0a50 50 0 1 1 -100 0z`);
  svg.appendChild(path);
  el.appendChild(svg);
  document.body.appendChild(el);
  var touchedAlready=false;
  el.onmousedown=function(e){
    if (touchedAlready) return true;
    var mousemoved=false,
    merp=document.createElement("sheepmenu-dragcover"),
    merpies=el.getBoundingClientRect(),
    offset={x:e.clientX-merpies.left,y:e.clientY-merpies.top},
    mouseup=e=>{
      document.removeEventListener("mousemove",mousemove,false);
      document.removeEventListener("mouseup",mouseup,false);
      document.body.classList.remove('SHEEPDRAGGING');
      setTimeout(_=>document.body.removeChild(merp),200);
      if (!mousemoved) {
        el.id="SHEEPANIMATING";
        window.setTimeout(_=>window.location="https://sheeptester.github.io/",300);
      }
    },
    mousemove=e=>{
      mousemoved=true;
      document.body.classList.add('SHEEPDRAGGING');
      el.style.right=(innerWidth-merpies.width-e.clientX+offset.x)+'px';
      el.style.bottom=(innerHeight-merpies.height-e.clientY+offset.y)+'px';
      e.preventDefault();
      return false;
    };
    document.addEventListener("mousemove",mousemove,false);
    document.addEventListener("mouseup",mouseup,false);
    document.body.appendChild(merp);
  };
  el.ontouchstart=function(e){
    touchedAlready=true;
    var mousemoved=false,
    merp=document.createElement("sheepmenu-dragcover"),
    merpies=el.getBoundingClientRect(),
    offset={x:e.touches[0].clientX-merpies.left,y:e.touches[0].clientY-merpies.top},
    mouseup=e=>{
      document.removeEventListener("mousemove",mousemove,false);
      document.removeEventListener("mouseup",mouseup,false);
      document.body.classList.remove('SHEEPDRAGGING');
      setTimeout(_=>document.body.removeChild(merp),200);
      touchedAlready=false;
      if (!mousemoved) {
        el.id="SHEEPANIMATING";
        window.setTimeout(_=>window.location="https://sheeptester.github.io/",300);
      }
    },
    mousemove=e=>{
      mousemoved=true;
      document.body.classList.add('SHEEPDRAGGING');
      el.style.right=(innerWidth-merpies.width-e.touches[0].clientX+offset.x)+'px';
      el.style.bottom=(innerHeight-merpies.height-e.touches[0].clientY+offset.y)+'px';
      e.preventDefault();
      return false;
    };
    document.addEventListener("touchmove",mousemove,{passive:false});
    document.addEventListener("touchend",mouseup,{passive:false});
    document.body.appendChild(merp);
  };
  if (!window.localStorage.dismissed) {
    window.localStorage.dismissed='{}';
  }
})();
var SHEEP={
  notify(message,link) {
    var s=document.createElement("sheepnotify"),link;
    s.innerHTML=message;
    if (link) {
      s.classList.add('SHEEPLINKY');
      s.href=link;
      setTimeout(function(){
        s.classList.add('SHEEPDISAPPEAR');
        setTimeout(function(){
          document.body.removeChild(s);
        },300);
      },3000);
      s.onclick=function(e){
        window.location.href=link;
      };
    } else {
      s.onclick=function(e){
        e.target.classList.add('SHEEPDISAPPEAR');
        setTimeout(function(){
          document.body.removeChild(e.target);
        },300);
      };
    }
    document.body.appendChild(s);
  },
  dismissed:JSON.parse(window.localStorage.dismissed),
  dismiss(name) {
    SHEEP.dismissed[name]=1;
    window.localStorage.dismissed=JSON.stringify(SHEEP.dismissed);
  },
  undismiss(name) {
    SHEEP.dismissed[name]=0;
    window.localStorage.dismissed=JSON.stringify(SHEEP.dismissed);
  },
  textwidth(elem,text) {
    /*
      would
      (document.querySelector('input')) gets value of input using input's styling
      (document.querySelector('input'),'lol') uses input's style but a with custom value
      (document.querySelector('p')) uses text content of element using its styling
      (document.querySelector('p'),'lol') uses element's style but with custom text
      ('lol') uses text with inherit styling
      ('lol','15px monospace') uses text with custom styling
    */
    var text,font;
    if (typeof elem==='object') {
      font=document.defaultView.getComputedStyle(elem).font; // if its an element use its font
      if (!text) {
        if (elem.value) text=elem.value;
        else text=elem.textContent;
      }
    } else if (typeof elem==='string') {
      if (text) font=text;
      else {
        font='inherit';
        text=elem;
      }
    }
    let clone=document.createElement('sheepgettextwidth');
    clone.appendChild(document.createTextNode(text));
    clone.style.font=font;
    document.body.appendChild(clone);
    let smth=clone.offsetWidth;
    document.body.removeChild(clone);
    return smth;
  },
  search(input) {
    if (typeof input==='string') {
      var result={},search=input;
      for (var i=1;i<search.length;i++) {
        var nextAmpersand=search.indexOf('&',i);
        var name;
        if (nextAmpersand>-1) {
          name=search.slice(i,nextAmpersand);
          i=nextAmpersand;
        } else {
          name=search.slice(i);
          i=search.length;
        }
        if (name.indexOf('=')>-1) {
          var value=name.slice(name.indexOf('=')+1);
          name=name.slice(0,name.indexOf('='));
          if (!isNaN(Number(value))) value=Number(value);
          else if (value=='true'||value=='✔') value=true;
          else if (value=='false'||value=='✖') value=false;
          result[name]=value;
        } else {
          result[name]=true;
        }
      }
      return result;
    } else if (typeof input==='object') {
      var result='?',object=input;
      for (var key in object) {
        if (result[result.length-1]=='?') result+=key+'='+object[key];
        else result+='&'+key+'='+object[key];
      }
      return result;
    }
    else return undefined;
  },
  ajax(url,callback,error) {
    var xmlHttp=new XMLHttpRequest(),error;
    xmlHttp.onreadystatechange=function(){
      if (xmlHttp.readyState===4) {
        if (xmlHttp.status===200) callback(xmlHttp.responseText);
        else if (error) error(xmlHttp.status);
      }
    };
    xmlHttp.open("GET",url,true); // true for asynchronous
    xmlHttp.send(null);
  },
  draggable(elem,xwise,ywise,options) {
    /* OPTIONS: x y minx miny maxx maxy onchange parentdrag min max fitparent*/
    var drag={},
    x,y,min,max,
    idenifydrag=e=>{
      var x,y;
      if (xwise) x=Number(elem.style.left.slice(0,-2));
      if (ywise) y=Number(elem.style.top.slice(0,-2));
      if (xwise) x=e.clientX-drag.offx;
      if (ywise) y=e.clientY-drag.offy;
      if (min) {
        if (xwise) {
          var m=options.min||options.minx;
          if (m&&x<m) {drag.offx+=x-m;x=m;}
          else if (options.fitparent&&x<0) {drag.offx+=x;x=0;}
        }
        if (ywise) {
          var m=options.min||options.miny;
          if (m&&y<m) {drag.offy+=y-m;y=m;}
          else if (options.fitparent&&y<0) {drag.offy+=y;y=0;}
        }
      }
      if (max) {
        if (xwise) {
          var m=options.max||options.maxx||(options.fitparent?elem.parentNode.offsetWidth-elem.offsetWidth:0);
          if (m&&x>m) {drag.offx+=x-m;x=m;}
        }
        if (ywise) {
          var m=options.max||options.maxy||(options.fitparent?elem.parentNode.offsetHeight-elem.offsetHeight:0);
          if (m&&y>m) {drag.offy+=y-m;y=m;}
        }
      }
      if (xwise) elem.style.left=x+'px';
      if (ywise) elem.style.top=y+'px';
      if (options.onchange) {
        if (xwise) options.onchange(x,y);
        else options.onchange(y);
      }
    },
    mousedown=(touch,e)=>{
      if (!drag.dragging) {
        drag.dragging=true;
        if (xwise) drag.offx=e.clientX-Number(elem.style.left.slice(0,-2));
        if (ywise) drag.offy=e.clientY-Number(elem.style.top.slice(0,-2));
        if (touch) {
          move=e=>{
            if (drag.dragging) {
              idenifydrag(e.touches[0]);
              e.preventDefault();
              return false;
            }
          };
          end=e=>{
            if (drag.dragging) {
              drag.dragging=false;
              document.removeEventListener("touchmove",move,false);
              document.removeEventListener("touchend",end,false);
            }
          };
          document.addEventListener("touchmove",move,false);
          document.addEventListener("touchend",end,false);
        } else {
          move=e=>{
            if (drag.dragging) {
              idenifydrag(e);
            }
          };
          up=e=>{
            if (drag.dragging) {
              idenifydrag(e);
              drag.dragging=false;
              document.removeEventListener("mousemove",move,false);
              document.removeEventListener("mouseup",up,false);
            }
          };
          document.addEventListener("mousemove",move,false);
          document.addEventListener("mouseup",up,false);
        }
      }
    };
    if (options) {
      if (xwise) elem.style.left=(options.x||0)+'px';
      if (ywise) elem.style.top=(options.y||0)+'px';
      if (options.min||options.minx||options.miny||options.fitparent) min=true;
      if (options.max||options.maxx||options.maxy||options.fitparent) max=true;
    }
    if (document.defaultView.getComputedStyle(elem).position!='absolute') elem.style.position='absolute';
    if (elem.parentNode!==document.body&&document.defaultView.getComputedStyle(elem.parentNode).position=='static')
      elem.parentNode.style.position='relative';
    if (options.parentdrag) {
      elem.parentNode.addEventListener("mousedown",e=>mousedown(false,e),false);
      elem.parentNode.addEventListener("touchstart",e=>mousedown(true,e.touches[0]),false);
    } else {
      elem.addEventListener("mousedown",e=>mousedown(false,e),false);
      elem.addEventListener("touchstart",e=>mousedown(true,e.touches[0]),false);
    }
  },
  pixelratio() {
    // http://stackoverflow.com/questions/15661339/how-do-i-fix-blurry-text-in-my-html5-canvas
    var ctx=document.createElement("canvas").getContext("2d"),
    dpr=window.devicePixelRatio||1,
    bsr=ctx.webkitBackingStorePixelRatio||
      ctx.mozBackingStorePixelRatio||
      ctx.msBackingStorePixelRatio||
      ctx.oBackingStorePixelRatio||
      ctx.backingStorePixelRatio||1;
    return dpr/bsr;
  }
};
(function(){
  if (!SHEEP.dismissed.accounts) {
    SHEEP.dismiss('accounts');
    SHEEP.notify('A very insecure system of accounts has been introduced.','/?signin');
  }
  /*
                 _
        /\      | |
       /  \   __| |___
      / /\ \ / _` / __|
     / ____ \ (_| \__ \
    /_/    \_\__,_|___/
                           */
  // SHEEP.ajax('https://sheeptester.github.io/showads.js',e=>{},e=>window.location.replace('https://sheeptester.github.io?tryTurningOffYourAdblock'));
  if (!Math.floor(Math.random()*5)) {
    switch (true) {
      case !SHEEP.dismissed.leafism:
        SHEEP.dismiss('leafism');
        SHEEP.notify('Join the leaf cult!','https://sites.google.com/site/realaxolotls/members/michaela/triangle-bird-sign-ups/leafism');
        break;
      case !SHEEP.dismissed.gamepro5:
        SHEEP.dismiss('gamepro5');
        SHEEP.notify('Subscribe to Gamepro5!','/?gamepro5');
        break;
      case !SHEEP.dismissed.uselessbutwhatever:
        SHEEP.dismiss('uselessbutwhatever');
        SHEEP.notify('Visit the page you\'re already on!');
        break;
      case !SHEEP.dismissed.gaffachris:
        SHEEP.dismiss('gaffachris');
        SHEEP.notify('Watch quality trash!','/?gaffasaurus');
        break;
    }
  }
})();
