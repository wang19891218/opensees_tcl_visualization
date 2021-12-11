import{R as e,L as t,S as n,C as o,F as i,P as s,W as r,H as a,G as l,O as d,a as c,M as p,b as u,A as f,V as m,c as y,t as g}from"./vendor.0778452d.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const n of e)if("childList"===n.type)for(const e of n.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),"use-credentials"===e.crossorigin?t.credentials="include":"anonymous"===e.crossorigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();function w(e,t=5){return(" ".repeat(t)+e.toString()).slice(-t)}function h(e,t=2,n=5){return(" ".repeat(n)+e.toFixed(t)).slice(-n)}const v=new e;var x=new m(0,0);let b,E,I,z,L,C,H,S,W,j;var F="#ff0000",M=[],k=.1;const A=new t("rainbow",512);A.setMin(0),A.setMax(1),window.addEventListener("resize",(function(){let e=document.getElementById("buildingVisualization"),t=e.parentElement.clientWidth,n=e.parentElement.clientHeight;b.aspect=t/n,b.updateProjectionMatrix(),z.setSize(t,n)}),!1),window.addEventListener("pointermove",(function(e){let t=z.getContext().canvas.getBoundingClientRect();x.x=(e.clientX-t.left)/(t.right-t.left)*2-1,x.y=-(e.clientY-t.top)/(t.bottom-t.top)*2+1,C.style.left=e.clientX+15+"px",C.style.top=e.clientY-5+"px"}),!1),window.addEventListener("mousedown",(function(e){}),!1),window.addEventListener("mouseup",(function(e){}),!1),function(){I=new n,I.background=new o(10526880),I.fog=new i(10526880,200,1e3),b=new s(45,window.innerWidth/window.innerHeight,.001,100),b.position.set(0,1,1),E=document.getElementById("buildingVisualization");let e=E.parentElement.clientWidth,t=E.parentElement.clientHeight;z=new r({antialias:!0,canvas:E}),z.setSize(e,t),W=new a(16777215,526368,.8),W.position.set(0,200,20),I.add(W),H=new l(1,10),I.add(H),L=new d(b,z.domElement),L.target.set(0,0,0),L.enableZoom=!0,L.update()}(),C=document.createElement("div"),document.body.appendChild(C),C.style.position="absolute",C.style.top="0px",C.style.left="0px",C.style.width="60px",C.style.height="20px",C.style.borderRadius="1px",C.style.borderWidth="1px",C.style.borderStyle="solid",C.style.backgroundColor="white",C.style.opacity="0.9",C.innerText="Hello World",C.zIndex="1000",C.style.fontSize="12px",C.style.display="none",C.style.textAlign="center",function(){let e=new y(0,0,0);var t=new y(1,0,0),n=new y(0,1,0),o=new y(0,0,1),i=new f(t,e,1,16711680,.003,.003);I.add(i);var s=new f(n,e,1,65280,.003,.003);I.add(s);var r=new f(o,e,1,255,.003,.003);I.add(r),console.log(r),M.push(i),M.push(i),M.push(i)}(),function e(){requestAnimationFrame(e),L.update(),function(){if(v.setFromCamera(x,b),j){const t=v.intersectObjects(j,!1);t.length>0?S!=t[0].object&&(S=t[0].object,intersectedObjectColor=S.material.color.getHex(),S.material.color.setHex(16777215)):(e=F,j.forEach((function(t){t.material.color.set(e)})),S=null)}var e;S?(C.innerText=S.displayInfo,C.style.display="block"):C.style.display="none",z.render(I,b)}()}();const B=new g.exports.Pane({container:document.getElementById("controlPanel")}),O={model_name:"",showData:!1,nodeScale:1,nodeColor:"#ffffff",rotation_y:0,color:"#0f0"};B.addInput(O,"model_name"),B.addInput(O,"showData");var P=B.addInput(O,"nodeScale",{min:.001,max:1}),_=B.addInput(O,"nodeColor",{});P.on("change",(e=>{var t;t=e.value,j&&j.forEach((function(e){e.scale.set(t,t,t)}))})),_.on("change",(e=>{var t;t=e.value,F=t}));const R=document.getElementById("file-selector");R.addEventListener("change",(e=>{const t=e.target.files,n=new FileReader;var o;n.onload=(o=n,function(){for(var e=o.result.split("\n"),[t,n]=function(e){for(var t={},n=0;n<e.length;n++){let l=e[n];if(l.startsWith("model")){var o=l.match(/-ndm\s\d*.*-/)[0];parseInt(o.slice(4,-1)),o=l.match(/-ndf\s\d*/)[0],parseInt(o.slice(4))}if(l.startsWith("node")){var i=l.split(/\s+/).slice(1),s=parseInt(i[0]),r=i.slice(1).map((function(e){return parseFloat(e)}));t[s]={coordinate:r}}if(l.startsWith("mass")){i=l.split(/\s+/).slice(1),s=parseInt(i[0]);var a=i.slice(1).map((function(e){return parseFloat(e)}));t[s].directional_mass=a,t[s].mass=(a[0]+a[1]+a[2])/3}}return[t,{}]}(e),i="<p>",s=9;s<e.length;s++)i+=e[s]+"<br>";document.getElementById("tcl_txt").innerHTML=i,function(e){var t=Object.keys(e);j=[];for(var n=new y,o=0;o<t.length;o++){let a=t[o],l=e[a].coordinate;e[a].mass;var i=new c(.001,10,10);i.center();var s=new p({color:F,opacity:.5}),r=new u(i,s);r.position.x=.01*l[0],r.position.y=.01*l[2],r.position.z=.01*l[1],r.name="node number: "+w(a)+" Coord: "+h(l[0])+", "+h(l[1])+", "+h(l[2]),r.targetColor=F,r.displayInfo="node number: "+w(a),j.push(r),I.add(r),n.x+=r.position.x/t.length,n.y+=r.position.y/t.length,n.z+=r.position.z/t.length}L.target.set(n.x,n.y,n.z),b.position.set(3*n.x,3*n.y,3*n.z),k=2*Math.hypot(...n.toArray()),console.log("arrowHelperLength: "+k),M[0].scale.set(k,1,1),M[1].scale.set(1,k,1),M[2].scale.set(1,1,k),console.log(M[2])}(t),R.value=""}),n.readAsText(t[0])}));