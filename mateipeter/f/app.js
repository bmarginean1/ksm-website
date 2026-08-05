
try{


var LOGO = {"orizontal":"https://bmarginean1.github.io/ksm-website/mateipeter/f/a1.webp","principal":"https://bmarginean1.github.io/ksm-website/mateipeter/f/a2.webp","simplificat":"https://bmarginean1.github.io/ksm-website/mateipeter/f/a1.webp","emblema":"https://bmarginean1.github.io/ksm-website/mateipeter/f/a3.webp"};

/* logo peste tot */
['herologo','navlogo','filmimg','thumblogo'].forEach(function(id){
  var el=document.getElementById(id); if(!el) return;
  el.src = (id==='navlogo') ? LOGO.simplificat : LOGO.principal;
});
var fav=document.createElement('link'); fav.rel='icon'; fav.href=LOGO.emblema; document.head.appendChild(fav);

/* toast */
var toast=document.getElementById('toast'), tt;
function say(m){toast.textContent=m;toast.className='toast on';clearTimeout(tt);tt=setTimeout(function(){toast.className='toast'},1500)}

/* fonturi — încărcate doar dacă există internet; altfel rămâne fontul de sistem */
/* selectorul de fonturi a fost scos — sistemul e fix: Super Bouncer / Poppins / Comfortaa.
   Nu se mai cheama Google Fonts: pagina trebuie sa functioneze fara internet. */
/* comutator MAJUSCULE pe titluri, ca la Supari */
var upBtn=document.createElement('button');
upBtn.innerHTML='<b>MAJUSCULE</b><small>titluri, ca la Supari</small>';
upBtn.style.marginLeft='10px';
function setUp(on){
  document.documentElement.setAttribute('data-up',on?'1':'0');
  upBtn.className=on?'on':'';
  try{localStorage.setItem('mp-up',on?'1':'0')}catch(e){}
}
upBtn.onclick=function(){ setUp(document.documentElement.getAttribute('data-up')!=='1') };
/* selector de fonturi scos — sistemul e fix */
var su='0'; try{ su=localStorage.getItem('mp-up')||'0' }catch(e){}
setUp(su==='1');

/* ===== test real de diacritice: măsor lățimea glifelor ș ț ă â î ===== */
(function(){
  var cv=document.createElement('canvas'), cx=cv.getContext('2d');
  function w(txt,fam){ cx.font='700 40px '+fam; return cx.measureText(txt).width }
  function hasDiacritics(fam){
    // dacă fontul nu are glifa, browserul cade pe rezervă → lățimea e identică cu a rezervei singure
    var probe=['ș','ț','ă','â','î'], ok=0;
    probe.forEach(function(ch){
      var a=w(ch,"'"+fam+"', monospace"), b=w(ch,"monospace");
      var base=w('n',"'"+fam+"', monospace"), baseM=w('n',"monospace");
      // fontul e încărcat dacă 'n' diferă de monospace; glifa există dacă și diacritica diferă
      if(Math.abs(base-baseM)>0.1 && Math.abs(a-b)>0.1) ok++;
    });
    return ok>=4;
  }
})();


/* nav */
var secs=[].slice.call(document.querySelectorAll('.ch'));
document.getElementById('navnums').innerHTML='';
var links=[].slice.call(document.querySelectorAll('.navnums a'));

/* ============ SCENA: patru straturi care interacționează ============ */
var CH=[['apropierea','Camera se apropie de cabană. Norii trec pe lângă, pădurea se deschide.'],
['fereastra','Fereastra atelierului se mărește. Lumina caldă dinăuntru crește.'],
['pragul','Copacii din prim-plan trec pe lângă cameră. Intri în atelier.'],
['logo-ul','Plăcuța de lemn se așază în cadru. De aici începe orice material.']];
var scene=document.getElementById('scene'), stage=document.getElementById('stage'),
    L1=document.getElementById('l1'), L2=document.getElementById('l2'),
    L4=document.getElementById('l4'), cabin=document.getElementById('cabin'),
    fimg=document.getElementById('filmimg'), chars=document.getElementById('charsimg'),
    rail=document.getElementById('rail'), fcap=document.getElementById('fcap'),
    pct=document.getElementById('pct'), stitle=document.getElementById('scenetitle');
if(fimg)fimg.src=LOGO.principal;
if(chars)chars.src=LOGO.simplificat;
if(rail)rail.innerHTML=CH.map(function(c){return '<div>'+c[0]+'</div>'}).join('');
var railEls=rail?[].slice.call(rail.children):[], lastIdx=-1;
var reduceM=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;

function sceneAt(p){
  p=Math.max(0,Math.min(1,p));
  var e=Math.pow(p,1.35);
  if(pct)pct.textContent=Math.round(p*100)+'%';
  var idx=Math.min(CH.length-1,Math.floor(p*CH.length));
  if(idx!==lastIdx){ lastIdx=idx;
    railEls.forEach(function(d,i){d.className=(i===idx?'on':'')});
    if(fcap)fcap.innerHTML='<b>0'+(idx+1)+' / '+CH[idx][0]+'</b><p>'+CH[idx][1]+'</p>'; }
  if(reduceM)return;

  /* fiecare strat trece pe lângă cameră cu viteza lui — punctul de fugă e fereastra */
  var org=window.__VP||'50% 46%';
  if(L1){ L1.style.transformOrigin=org;
    L1.style.transform='scale('+(1+e*0.55)+') translateY('+(e*40)+'px)';
    L1.style.opacity=String(Math.max(0,1-Math.max(0,e-.45)*2.2)); }
  if(L2){ L2.style.transformOrigin=org;
    L2.style.transform='scale('+(1+e*1.5)+') translateY('+(e*130)+'px)';
    L2.style.opacity=String(Math.max(0,1-Math.max(0,e-.5)*2.6)); }
  if(L4){ L4.style.transformOrigin=org;
    L4.style.transform='scale('+(1+e*4.6)+') translateY('+(e*280)+'px)';
    L4.style.opacity=String(Math.max(0,1-Math.max(0,e-.42)*2.6)); }
  /* cabana crește exact cât trebuie ca fereastra să umple ecranul — calculat, nu ghicit */
  var win=document.getElementById('window');
  if(cabin&&win){
    if(!cabin._base){                       /* măsor abia când layout-ul e gata */
      var t=cabin.style.transform; cabin.style.transform='translate(-50%,-50%) scale(1)';
      var r=win.getBoundingClientRect();
      /* pragul era 60px: pe telefon fereastra masoara ~54px, deci masuratoarea
         nu trecea niciodata si zoom-ul nu pornea deloc. 20px e destul. */
      if(r.width>20 && r.height>20) cabin._base={w:r.width,h:r.height};
      cabin.style.transform=t;
    }
    if(!cabin._base){ return; }            /* încă nu e gata — încerc la următorul cadru */
    var need=Math.max(window.innerWidth/cabin._base.w, window.innerHeight/cabin._base.h)*1.06;
    var sc=1+e*(need-1);
    cabin._sc=sc;
    cabin.style.transformOrigin=window.__VP||'50% 46%';
    cabin.style.transform='translate(-50%,-50%) scale('+sc+')';
  }
  /* logo-ul din fereastră: îi impun lățimea în pixeli, contra-scalată — rămâne mereu încadrat */
  if(fimg&&cabin&&cabin._base&&cabin._sc){
    var q=Math.max(0,Math.min(1,(e-.12)/.62));
    var startW=cabin._base.w*0.76;                       /* cât ocupă în fereastră la început */
    var endW=Math.min(window.innerWidth*0.62,1000);      /* cât ocupă pe ecran la final */
    var apparent=startW*(1+q*0.10);          /* abia se mareste - nu are rezolutie sa creasca */
    fimg.style.width=(apparent/cabin._sc)+'px';
    var fade=Math.max(0,1-Math.max(0,(e-.34)/.14));   /* dispare inainte sa se vada blurat */
    fimg.style.opacity=String((0.30+q*0.60)*fade);
    fimg.style.filter='blur('+((1-q)*3)+'px)';
  }
  var full=document.getElementById('interiorFull');
  if(full){
    var t=Math.max(0,Math.min(1,(e-.30)/.44));
    full.style.opacity=String(t);
    full.style.transform='scale('+(1.14-t*0.14)+')';
    var lg=document.getElementById('fullLogo');
    if(lg){ var lt=Math.max(0,Math.min(1,(t-.62)/.32));
      lg.style.opacity=String(lt);
      lg.style.transform='translate(-50%,-50%) scale('+(0.9+lt*0.1)+')'; }
    if(cabin) cabin.style.opacity=String(1-Math.max(0,(t-.55)/.45));
  }
  if(stitle){ stitle.style.transform='translateY('+(-e*70)+'px)';
    stitle.style.opacity=String(Math.max(0,1-e*4.4)); }
  var cue=stage&&stage.querySelector('.scrollcue');
  if(cue)cue.style.opacity=String(Math.max(0,.55-e*3));
  var ch=document.getElementById('chars');
  if(ch)ch.style.opacity=String(Math.max(0,Math.min(1,1-Math.max(0,e-0.44)/0.13)));
  /* HUD-ul trece pe alb când suntem înăuntru */
  if(scene)scene.className=(e>.5?'scene dark-hud':'scene');
}

/* scroll: nav lipit, progres, secțiunea activă, scena */
function onScroll(){
  var y=window.pageYOffset||document.documentElement.scrollTop;
  var nav=document.getElementById('nav');
  if(nav)nav.className=(y>60?'nav stuck':'nav');
  var h=document.body.scrollHeight-window.innerHeight;
  var pr=document.getElementById('prog');
  if(pr)pr.style.width=(h>0?(y/h*100):0)+'%';
  var cur=null;
  secs.forEach(function(s){ if(s.offsetTop-150<=y) cur=s.id });
  links.forEach(function(a){ a.className=(a.getAttribute('href')==='#'+cur?'on':'') });
  if(scene){ var top=scene.offsetTop, len=scene.offsetHeight-window.innerHeight;
    sceneAt(len>0?(y-top)/len:0); }
}
window.addEventListener('scroll',onScroll);
window.addEventListener('resize',function(){var c=document.getElementById('cabin');if(c)c._base=null;onScroll()});

/* reveal — abia aici marcăm html.js, ca o eroare de mai sus să nu lase pagina goală */
document.documentElement.className='js';

function showAll(){ Array.prototype.forEach.call(document.querySelectorAll('.r'),function(e){e.className+=' in'}) }
var IO=window.IntersectionObserver;
if(IO){
  var io=new IO(function(es){es.forEach(function(en){
    if(en.isIntersecting){ en.target.className+=' in'; io.unobserve(en.target); }})},
    {threshold:.02,rootMargin:'0px 0px 12% 0px'});
  Array.prototype.forEach.call(document.querySelectorAll('.r'),function(e,i){
    e.style.transitionDelay=((i%4)*70)+'ms'; io.observe(e)});
  setTimeout(function(){ // plasă de siguranță: dacă ceva nu se declanșează, arată tot
    Array.prototype.forEach.call(document.querySelectorAll('.r'),function(e){
      if(e.getBoundingClientRect().top < window.innerHeight) e.className+=' in'})},400);
}else showAll();

onScroll();
sceneAt(0);
window.addEventListener('load',function(){var c=document.getElementById('cabin');if(c)c._base=null;onScroll()});
setTimeout(function(){var c=document.getElementById('cabin');if(c)c._base=null;onScroll()},600);

/* ============ LOADER ============ */
(function(){
  var ld=document.getElementById('loader'), bar=document.getElementById('lbar'),
      pc=document.getElementById('lpct'), lg=document.getElementById('loaderlogo');
  lg.src=LOGO.principal; ld.className='loader show';
  var p=0;
  var t=setInterval(function(){
    p+=Math.random()*17+7; if(p>100)p=100;
    bar.style.width=p+'%'; pc.textContent=Math.round(p)+'%';
    if(p>=100){ clearInterval(t);
      setTimeout(function(){ ld.className='loader gone'; },380); }
  },110);
})();

/* ============ MENIU FULLSCREEN ============ */
(function(){
  var m=document.getElementById('menu'), b=document.getElementById('burger'), c=document.getElementById('menuclose');
  document.getElementById('menulinks').innerHTML='';
  function open(){m.className='menu on'} function close(){m.className='menu'}
  b.onclick=open; c.onclick=close;
  Array.prototype.forEach.call(m.querySelectorAll('a'),function(a){a.onclick=close});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
})();






/* ============ LUMEA: straturi care se mișcă pe toată pagina ============ */
(function(){
  var world=document.getElementById('world'), fg=document.getElementById('fg');
  if(!world)return;
  var wl=[].slice.call(world.querySelectorAll('.wl[data-w]'));
  var cl=[].slice.call(fg.querySelectorAll('.cl[data-c]'));
  var trees=[].slice.call(fg.querySelectorAll('.t'));
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  function move(){
    var y=window.pageYOffset||document.documentElement.scrollTop;
    if(reduce)return;
    wl.forEach(function(l){
      var w=parseFloat(l.getAttribute('data-w'))||0;
      l.style.transform='translate3d(0,'+(y*w)+'px,0)';
    });
    cl.forEach(function(c,i){
      var w=parseFloat(c.getAttribute('data-c'))||0;
      c.style.transform='translate3d('+(y*w*(i%2?-1:1))+'px,'+(y*w*.4)+'px,0)';
    });
    trees.forEach(function(t,i){
      t.style.transform='translate3d('+(i?1:-1)*Math.min(60,y*0.012)+'px,'+(y*0.02)+'px,0)';
    });
  }
  window.addEventListener('scroll',move); window.addEventListener('resize',move); move();
})();





/* ============ SISTEM DOSARELE — animatii, fara dependinte externe ============ */
(function(){
  var PANS=[].slice.call(document.querySelectorAll('.xpan'));
  if(!PANS.length) return;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* --- meniu + numerotare din sectiuni --- */
  var items=PANS.map(function(p){
    var n=p.querySelector('.xtag .xmono:first-child'), t=p.querySelectorAll('.xtag .xmono')[1];
    return {id:p.id, n:(n?n.textContent:'').replace(/[()\s]/g,''), t:t?t.textContent:p.id};
  });
  var nn=document.getElementById('navnums');
  if(nn) nn.innerHTML=items.map(function(i){return '<a href="#'+i.id+'">'+i.n+'</a>'}).join('');
  var ml=document.getElementById('menulinks');
  if(ml) ml.innerHTML=items.map(function(i){
    return '<a href="#'+i.id+'"><i>'+i.n+'</i>'+i.t+'</a>'}).join('');

  /* --- swatch-uri --- */
  var PAL=[['Crem','#F6EEDF','hârtia lumii'],['Galben ochelari','#FFB703','semnul seriei'],
   ['Lemn','#965515','masa, cabana'],['Apricot','#D98B31','blana lui Peter'],
   ['Teal','#147C97','accentul rece'],['Verde pădure','#49603A','natura'],
   ['Umbră','#5E1B05','umbre calde'],['Contur','#1A0F09','linia groasă'],
   ['Ten','#EAA191','pielea copiilor'],
   ['Teal randat','#327A84','teal pe textil, în lumină']];
  var sw=document.getElementById('swatches');
  if(sw) sw.innerHTML=PAL.map(function(c){
    return '<div class="xswatch"><div class="c" style="background:'+c[1]+'"></div>'+
      '<div class="m"><b>'+c[0]+'</b><span>'+c[1]+' · '+c[2]+'</span></div></div>'}).join('');

  /* --- pictograme, din simbolurile deja definite --- */
  var PIC=[['ic-ochelari','ochelarii'],['ic-soare','soarele'],['ic-labuta','lăbuța'],['ic-stea','steaua'],
   ['ic-lemn','lemnul'],['ic-sfoara','sfoara'],['ic-vopsea','vopseaua']];
  var ph=document.getElementById('pictos');
  if(ph) ph.innerHTML=PIC.map(function(p){
    return '<div class="picto"><i style="background-image:url(layers/'+p[0]+'.webp)"></i><span>'+p[1]+'</span></div>'}).join('');

  /* --- logo in casete --- */
  [].slice.call(document.querySelectorAll('.lgbox')).forEach(function(b){
    var k=b.getAttribute('data-logo'); if(!k||!window.LOGO||!LOGO[k])return;
    var im=new Image(); im.alt=''; im.src=LOGO[k]; b.appendChild(im);
  });

  /* --- sloturi de imagine: se incarca doar daca fisierul exista --- */
  [].slice.call(document.querySelectorAll('.xslot[data-src]')).forEach(function(s){
    var u=s.getAttribute('data-src'); var im=new Image();
    im.onload=function(){ s.style.backgroundImage='url('+u+')'; s.className+=' hasimg'; };
    im.src=u;
  });

  /* --- aparitie mascata de jos, cu decalaj --- */
  var groups=[].slice.call(document.querySelectorAll('.xg2,.xg3,.xg4,.xsw,.xrr'));
  groups.forEach(function(g){
    [].slice.call(g.children).forEach(function(k){
      if(k.parentNode.classList.contains('xrise'))return;
      var w=document.createElement('div'); w.className='xrise';
      g.replaceChild(w,k); w.appendChild(k);
    });
  });
  var risers=[].slice.call(document.querySelectorAll('.xrise'));
  risers.forEach(function(w,i){
    var g=w.parentNode, idx=[].slice.call(g.children).indexOf(w);
    w.firstChild.style.transitionDelay=(idx*110)+'ms';
  });

  /* --- titluri si lead-uri care urca o data --- */
  var ups=[].slice.call(document.querySelectorAll('.xup'));
  ups.forEach(function(u,i){ u.style.transitionDelay=(i%3*90)+'ms' });

  function fire(el){ if(el.className.indexOf('go')<0) el.className+=' go'; }
  if(window.IntersectionObserver && !reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){ fire(e.target); io.unobserve(e.target); }})},
      {threshold:.05,rootMargin:'0px 0px -8% 0px'});
    risers.concat(ups).forEach(function(e){io.observe(e)});
    setTimeout(function(){ risers.concat(ups).forEach(function(e){
      if(e.getBoundingClientRect().top<innerHeight) fire(e); })},350);
  } else { risers.concat(ups).forEach(fire); }
  window.__xrev=function(){ risers.concat(ups).forEach(function(e){
    if(e.className.indexOf('go')<0 && e.getBoundingClientRect().top<innerHeight*.95) fire(e); }); };

  /* --- masina de scris --- */
  [].slice.call(document.querySelectorAll('[data-type]')).forEach(function(el){
    var full=el.getAttribute('data-type'), i=0, done=false;
    var caret=document.createElement('span'); caret.className='xcaret';
    function step(){ if(i<=full.length){ el.textContent=full.slice(0,i); el.appendChild(caret); i++;
      setTimeout(step, 55+Math.random()*70);} }
    if(window.IntersectionObserver){
      var o=new IntersectionObserver(function(es){es.forEach(function(e){
        if(e.isIntersecting&&!done){done=true;step();}})},{threshold:.4});
      o.observe(el);
    } else step();
  });

  /* --- pe touch, demo-urile de hover se declanseaza la scroll --- */
  if(window.matchMedia&&matchMedia('(hover:none)').matches&&window.IntersectionObserver){
    var o2=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){ [].slice.call(e.target.querySelectorAll('.xredact')).forEach(function(r){
        r.style.color='inherit'; var st=document.createElement('style'); r.classList.add('open');
      }); e.target.classList.add('hovered'); }})},{threshold:.5});
    [].slice.call(document.querySelectorAll('.xmdemo')).forEach(function(d){o2.observe(d)});
  }

  /* --- filele se ridica usor la scroll (ca in dosarele) --- */
  if(!reduce){
    var ticking=false;
    function lift(){
      ticking=false;
      var vh=innerHeight;
      PANS.forEach(function(p,i){
        if(i===PANS.length-1||p.classList.contains('tall')){p.style.transform='';return;}
        var r=p.getBoundingClientRect();
        var k=Math.max(0,Math.min(1,-r.top/Math.max(1,r.height)));
        p.style.transform='translate3d(0,'+(-40*k)+'px,0)';
      });
      if(window.__xrev) window.__xrev();
      var cards=[].slice.call(document.querySelectorAll('.xcard .im'));
      cards.forEach(function(c){
        var r=c.getBoundingClientRect();
        if(r.bottom<0||r.top>vh)return;
        var q=(r.top+r.height/2-vh/2)/vh;
        c.style.backgroundPosition='center calc(50% + '+(q*-14)+'px)';
      });
    }
    addEventListener('scroll',function(){ if(!ticking){ticking=true;requestAnimationFrame(lift)} },{passive:true});
    addEventListener('resize',lift); lift();
  }
})();



/* ============ panouri prea inalte: nu pot ramane lipite ============ */
(function(){
  var PANS=[].slice.call(document.querySelectorAll('.xpan'));
  if(!PANS.length) return;
  function fit(){
    var vh=window.innerHeight;
    PANS.forEach(function(p){
      var inn=p.querySelector('.xin'); if(!inn) return;
      var was=p.classList.contains('tall');
      p.classList.remove('tall');
      var cs=getComputedStyle(p);
      var need=inn.scrollHeight+parseFloat(cs.paddingTop)+parseFloat(cs.paddingBottom);
      if(need>vh-8){
        p.classList.add('tall');
        /* se lipeste de fund: partea de jos ramane vizibila pana trece complet */
        p.style.top = (vh-need-2)+'px';
        p.style.transform='';
      } else { p.style.top='0px'; }
    });
  }
  fit();
  addEventListener('resize',function(){clearTimeout(window.__ft);window.__ft=setTimeout(fit,180)});
  addEventListener('orientationchange',function(){setTimeout(fit,300)});
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(function(){setTimeout(fit,120)});
  setTimeout(fit,900); setTimeout(fit,2200);
  window.__fitPans=fit;
})();


/* ============ bara de sus + meniu, refacute ============ */
(function(){
  var PANS=[].slice.call(document.querySelectorAll('.xpan'));
  var items=PANS.map(function(p){
    var t=p.querySelectorAll('.xtag .xmono')[1];
    return {id:p.id, t:t?t.textContent.trim():p.id};
  });
  /* bara: logo + titlu discret + buton */
  var b=document.getElementById('burger');
  if(b){ b.innerHTML='<i><b></b><b></b><b></b></i><span>meniu</span>'; }
  var nn=document.getElementById('navnums'); if(nn) nn.innerHTML='';
  var mark=document.querySelector('.navmark');
  if(mark && !document.querySelector('.navtitle')){
    var ttl=document.createElement('span'); ttl.className='navtitle';
    ttl.textContent='sistem de brand · ediția 2026';
    mark.parentNode.insertBefore(ttl, mark.nextSibling);
  }
  /* meniu: doar nume, pe doua coloane */
  var ml=document.getElementById('menulinks');
  if(ml){
    ml.className='mwrap';
    ml.innerHTML=items.map(function(i){return '<a href="#'+i.id+'">'+i.t+'</a>'}).join('')+
      '<div class="mfoot"><span>Matei &amp; Peter</span><span>canon 30.07.2026</span><span>© KSM Production</span></div>';
    [].slice.call(ml.querySelectorAll('a')).forEach(function(a){
      a.onclick=function(){ document.getElementById('menu').className='menu'; };
    });
  }
  /* lista laterala din hero — oprita */
  var r=document.getElementById('rail'); if(r) r.innerHTML='';
  var fc=document.getElementById('fcap'); if(fc) fc.innerHTML='';
})();


/* ============ straturile din hero, compuse ============ */
(function(){
  function img(src,cb){ var i=new Image(); i.onload=function(){cb(i)}; i.src=src; }

  /* --- CER: stratul cel mai departat --- */
  img('layers/01-cer.webp',function(i){
    var h=document.getElementById('l1'); if(!h)return;
    [].slice.call(h.children).forEach(function(x){x.style.display='none'});
    var e=document.createElement('img'); e.src=i.src; e.alt='';
    e.style.cssText='position:absolute;left:50%;top:4%;transform:translateX(-50%);'+
      'width:96%;min-width:1000px;height:auto;pointer-events:none';
    h.appendChild(e);
  });

  /* --- DEALURI SI PADURE --- */
  img('layers/02-dealuri.webp',function(i){
    var h=document.getElementById('l2'); if(!h)return;
    [].slice.call(h.children).forEach(function(x){x.style.display='none'});
    var e=document.createElement('img'); e.src=i.src; e.alt='';
    e.style.cssText='position:absolute;left:50%;bottom:0;transform:translateX(-50%);'+
      'width:124%;min-width:1300px;max-height:64%;height:auto;object-fit:contain;'+
      'object-position:bottom center;pointer-events:none';
    h.appendChild(e);
  });

  /* --- CABANA, cu interiorul in fereastra --- */
  img('layers/03-cabana.webp',function(i){
    var cab=document.getElementById('cabin'); if(!cab)return;
    var WIN={l:40.2,t:53.6,w:17.8,h:35.4};      /* masurat pe casa noua */
    var e=document.createElement('img'); e.src=i.src; e.alt='';
    e.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:fill;'+
      'pointer-events:none;z-index:3';
    cab.appendChild(e);
    cab.style.aspectRatio=(i.naturalWidth/i.naturalHeight); cab.style.height='auto';
    cab.style.setProperty('--sink','7%');
    [].slice.call(cab.querySelectorAll('.roof,.planks,.door,.mull,.frameline'))
      .forEach(function(x){x.style.display='none'});
    var walls=cab.querySelector('.walls');
    if(walls) walls.style.cssText+=';background:none!important;border:0!important;box-shadow:none!important';

    var w=document.getElementById('window');
    if(w){ cab.appendChild(w);
      w.style.cssText='position:absolute;left:'+WIN.l+'%;top:'+WIN.t+'%;width:'+WIN.w+'%;height:'+WIN.h+'%;'+
        'border:0;background:#3A2412;box-shadow:none;overflow:hidden;z-index:2;'+
        'border-radius:46% 46% 6% 6%/34% 34% 4% 4%'; }
    var sc=document.getElementById('screen');
    if(sc) sc.style.cssText='position:absolute;inset:0;display:flex;align-items:center;'+
      'justify-content:center;background:none;overflow:hidden';

    /* interiorul atelierului, la rezolutie mare, in spatele logo-ului */
    img('layers/06-interior.webp',function(ii){
      var back=document.createElement('img'); back.src=ii.src; back.alt='';
      back.id='interior';
      back.style.cssText='position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);'+
        'width:118%;height:auto;min-height:100%;object-fit:cover;pointer-events:none;z-index:0';
      if(sc) sc.insertBefore(back, sc.firstChild);
      var f=document.getElementById('filmimg');
      if(f) f.style.display='none';   /* prin geam se vede atelierul, nu logo-ul */
      /* acelasi cadru, dar pe tot ecranul: preia la final, cand rama marita ar fi blurata */
      var full=document.createElement('div'); full.id='interiorFull';
      full.style.cssText='position:absolute;inset:0;z-index:8;opacity:0;pointer-events:none;'+
        'background-image:url('+ii.src+');background-size:cover;background-position:center 42%';
      var stage=document.getElementById('stage'); if(stage) stage.appendChild(full);
      var lg=document.createElement('img'); lg.src='';
      lg.id='fullLogo'; lg.style.display='none';
      lg.style.cssText='position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(.9);'+
        'width:min(52vw,760px);height:auto;opacity:0;'+
        'filter:drop-shadow(0 18px 40px rgba(26,15,9,.45))';
      full.appendChild(lg);
    });

    window.__VP=(WIN.l+WIN.w/2).toFixed(2)+'% '+(WIN.t+WIN.h/2).toFixed(2)+'%';
    cab._base=null;
    requestAnimationFrame(function(){requestAnimationFrame(function(){
      cab._base=null; if(typeof onScroll==='function') onScroll(); })});
  });

  /* --- PRIM-PLAN: iarba, copacii si bufnita --- */
  img('layers/04-prim-plan.webp',function(i){
    var h=document.getElementById('l4'); if(!h)return;
    [].slice.call(h.querySelectorAll('.ground,.tree')).forEach(function(x){x.style.display='none'});
    var e=document.createElement('img'); e.src=i.src; e.alt='';
    /* scalat dupa inaltime: altfel coroanele copacilor ies din cadru si se taie */
    e.style.cssText='position:absolute;left:50%;bottom:0;transform:translateX(-50%);'+
      'height:100%;width:auto;min-width:100%;max-width:none;object-fit:contain;'+
      'object-position:bottom center;pointer-events:none;z-index:2';
    h.insertBefore(e,h.firstChild);
    /* aceeasi iarba, inca o data, DEASUPRA personajelor - le intra peste talpi */
    var g=e.cloneNode(); g.className='grassfront';
    g.style.cssText=e.style.cssText.replace('z-index:2','z-index:6');
    g.style.clipPath='inset(84% 0 0 0)';
    g.style.webkitClipPath='inset(84% 0 0 0)';
    h.appendChild(g);
  });

  /* --- MATEI, PETER SI LUCA, in fata cabanei --- */
  img('layers/05-personaje.webp',function(i){
    var ch=document.getElementById('chars'), im=document.getElementById('charsimg');
    if(!ch||!im)return;
    im.src=i.src;
    /* umbra proiectata: fara ea par lipiti peste iarba, nu asezati in ea */
    if(!ch.querySelector('.contact')){
      var sh=document.createElement('i'); sh.className='contact'; ch.insertBefore(sh, im);
    }
    im.style.cssText='width:auto;height:34vh;max-width:52vw;object-fit:contain;display:block';
    ch.style.cssText='position:absolute;left:50%;bottom:9%;transform:translateX(-50%);'+
      'z-index:3;pointer-events:none;display:block';
    ch.className='chars on';
  });
})();


/* fiecare caseta primeste lumina de fereastra si ochelarii care coboara */
(function(){
  var G='<svg viewBox="0 0 100 100" aria-hidden="true"><use href="#i-goggles"/></svg>';
  [].slice.call(document.querySelectorAll('.xvbox')).forEach(function(b){
    if(b.querySelector('.lum')) return;
    var l=document.createElement('i'); l.className='lum'; b.appendChild(l);
    var g=document.createElement('i'); g.className='gog'; g.innerHTML=G; b.appendChild(g);
  });
})();

}catch(err){
  document.documentElement.className='';
  Array.prototype.forEach.call(document.querySelectorAll('.r'),function(e){
    e.style.opacity=1; e.style.transform='none';});
  var l=document.getElementById('loader'); if(l)l.className='loader gone';
  console.error('Brandbook:',err);
}
