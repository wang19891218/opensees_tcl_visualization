import{R as e,L as t,S as n,C as o,F as i,P as r,W as s,H as l,G as a,O as d,a as c,M as u,b as p,V as f,A as g,c as m}from"./vendor.c80bc50e.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const n of e)if("childList"===n.type)for(const e of n.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),"use-credentials"===e.crossorigin?t.credentials="include":"anonymous"===e.crossorigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();function y(e,t=5){return(" ".repeat(t)+e.toString()).slice(-t)}function w(e,t=2,n=5){return(" ".repeat(n)+e.toFixed(t)).slice(-n)}const h=new e;var v=new m(0,0);let b,x,E,C,I,L,z,j,W,H;const M=new t("rainbow",512);function S(e){return M.getColor(e)}M.setMin(0),M.setMax(1),window.addEventListener("resize",(function(){let e=document.getElementById("buildingVisualization"),t=e.parentElement.innerWidth,n=e.parentElement.innerHeight;b.aspect=t/n,b.updateProjectionMatrix(),C.setSize(t,n)}),!1),window.addEventListener("pointermove",(function(e){let t=C.getContext().canvas.getBoundingClientRect();v.x=(e.clientX-t.left)/(t.right-t.left)*2-1,v.y=-(e.clientY-t.top)/(t.bottom-t.top)*2+1,L.style.left=e.clientX+15+"px",L.style.top=e.clientY-5+"px"}),!1),window.addEventListener("mousedown",(function(e){}),!1),window.addEventListener("mouseup",(function(e){}),!1),function(){E=new n,E.background=new o(10526880),E.fog=new i(10526880,200,1e3),b=new r(45,window.innerWidth/window.innerHeight,.001,100),b.position.set(0,1,1),x=document.getElementById("buildingVisualization");let e=x.parnetElement.innerWidth,t=x.parnetElement.innerHeight;C=new s({antialias:!0,canvas:x}),C.setSize(e,t),W=new l(16777215,526368,.8),W.position.set(0,200,20),E.add(W),z=new a(10,10),E.add(z),I=new d(b,C.domElement),I.target.set(0,0,0),I.enableZoom=!0,I.update()}(),L=document.createElement("div"),document.body.appendChild(L),L.style.position="absolute",L.style.top="0px",L.style.left="0px",L.style.width="60px",L.style.height="20px",L.style.borderRadius="1px",L.style.borderWidth="1px",L.style.borderStyle="solid",L.style.backgroundColor="white",L.style.opacity="0.9",L.innerText="Hello World",L.zIndex="1000",L.style.fontSize="12px",L.style.display="none",L.style.textAlign="center",function(){length=30,origin=new f(0,0,0);var e=new f(1,0,0),t=new f(0,1,0),n=new f(0,0,1),o=new g(e,origin,30,16711680,.003,.003);E.add(o);var i=new g(t,origin,30,65280,.003,.003);E.add(i);var r=new g(n,origin,30,255,.003,.003);E.add(r)}(),function e(){requestAnimationFrame(e),I.update(),function(){if(h.setFromCamera(v,b),console.log("listMeshNode",H),H){const e=h.intersectObjects(H,!1);console.log("intersects",e),e.length>0?j!=e[0].object&&(console.log(e[0].object.name),j=e[0].object,intersectedObjectColor=j.material.color.getHex(),j.material.color.setHex(16777215)):(functionResetColor(),j=null)}j?(L.innerText=j.displayInfo,L.style.display="block"):L.style.display="none",C.render(E,b)}()}(),console.log("functions imported");document.getElementById("file-selector").addEventListener("change",(e=>{console.log(e);const t=e.target.files;console.log(t);const n=new FileReader;var o;console.log("start define reader"),n.onload=(o=n,function(){var e=o.result.split("\n"),[t,n]=function(e){for(var t=[],n=0;n<e.length;n++){let r=e[n];if(r.startsWith("model")){var o=r.match(/-ndm\s\d*.*-/)[0];parseInt(o.slice(4,-1)),o=r.match(/-ndf\s\d*/)[0],parseInt(o.slice(4))}if(r.startsWith("node")){var i=r.split(/\s+/).slice(1);t.push(i)}}var r={};for(let a=0;a<t.length;a++){var s=parseInt(t[a][0]),l=t[a].splice(1).map((function(e){}));r[s]={coordinate:l}}return[r,{}]}(e);console.log(t),console.log(n),function(e){console.log("start initializeNodeMesh");var t=Object.keys(e);H=[];for(var n=0;n<t.length;n++){let s=t[n],l=e[s].coordinate;var o=new c(.2,10,10);o.center();var i=new u({color:S(0)}),r=new p(o,i);r.position.x=.01*l[0],r.position.y=.01*l[2],r.position.z=.01*l[1],r.name="node number: "+y(s)+" Coord: "+w(l[0])+", "+w(l[1])+", "+w(l[2]),r.targetColor=S(0),r.displayInfo="node number: "+y(s),H.push(r),E.add(r)}}(t)}),n.readAsText(t[0]),console.log(n),console.log(n.result)}));