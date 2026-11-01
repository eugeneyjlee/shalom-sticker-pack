import * as THREE from './vendor/three.module.js';
// A transparent, physically shaped film shell. DOM artwork remains underneath,
// so exported stickers and accessible controls do not depend on WebGL.
const stage=document.querySelector('#stage'),pack=document.querySelector('#pack');
try {
const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});
renderer.setClearColor(0,0);renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
renderer.domElement.className='pouch-material';renderer.domElement.setAttribute('aria-hidden','true');stage.append(renderer.domElement);
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(30,1,1,4000);camera.position.z=1600;
const root=new THREE.Group();root.matrixAutoUpdate=false;scene.add(root);
const shell=new THREE.Group();root.add(shell);
const uniforms={fade:{value:1}};
const film=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.FrontSide,uniforms,
vertexShader:`varying vec3 n;varying vec3 p;varying vec2 uvFilm;void main(){vec4 world=modelMatrix*vec4(position,1.);p=world.xyz;n=normalize(mat3(modelMatrix)*normal);uvFilm=uv;gl_Position=projectionMatrix*viewMatrix*world;}`,
fragmentShader:`uniform float fade;varying vec3 n;varying vec3 p;varying vec2 uvFilm;
void main(){vec3 N=normalize(n),V=normalize(cameraPosition-p);vec3 R=reflect(-V,N);
float a=exp(-pow((R.x+.38)/.075,2.))*smoothstep(-.9,-.25,R.y);
float b=exp(-pow((R.x-.61)/.10,2.))*.8;
float c=exp(-pow((R.y-.66)/.09,2.))*.7;
float white=max(a,max(b,c));float dark=exp(-pow((R.x+.04)/.13,2.))*.10;
float fres=pow(1.-abs(dot(N,V)),3.5);float edge=1.-smoothstep(0.,.025,min(min(uvFilm.x,1.-uvFilm.x),min(uvFilm.y,1.-uvFilm.y)));
float band=1.-smoothstep(.008,.026,min(min(uvFilm.x,1.-uvFilm.x),1.-uvFilm.y));
float ribs=band*(.5+.5*sin((uvFilm.x<.026||uvFilm.x>.974?uvFilm.y*366.:uvFilm.x*744.)*2.4));
float alpha=clamp(.009+white*.68+dark+fres*.45+edge*.20+ribs*.15,0.,.86)*fade;
vec3 color=mix(vec3(.49,.44,.57),vec3(.99,.98,1.),clamp(white*3.+fres+edge,0.,1.));
gl_FragColor=vec4(color,alpha);}`});
const folds=[];
for(let i=0;i<34;i++){
 const side=i%4,t=((i*0.6180339)%1),len=38+(i*47%112);
 let x,y,dx,dy;
 if(side===0){x=-372;y=129-t*366;dx=len;dy=Math.sin(i*3.7)*65;}
 if(side===1){x=372;y=129-t*366;dx=-len;dy=Math.sin(i*2.7)*65;}
 if(side===2){x=-372+t*744;y=-237;dx=Math.sin(i*4.1)*65;dy=len*.7;}
 if(side===3){x=-372+t*744;y=129;dx=Math.sin(i*4.1)*60;dy=-len*.7;}
 folds.push({x,y,dx,dy,w:2.3+i%4,h:1.5+i%3*.65});
}
function height(x,y,u,v,back){
 const envelope=Math.pow(Math.max(0,Math.sin(Math.PI*u)*Math.sin(Math.PI*v)),.64);
 let z=back?-1.2-10*envelope:1.2+23*envelope;
 let ridge=0;
 for(const f of folds){const t=((x-f.x)*f.dx+(y-f.y)*f.dy)/(f.dx*f.dx+f.dy*f.dy);if(t<=0||t>=1)continue;const d=Math.hypot(x-f.x-t*f.dx,y-f.y-t*f.dy);ridge+=Math.exp(-d*d/(f.w*f.w))*Math.sin(Math.PI*t)*f.h;}
 const edge=Math.min(u,1-u,v,1-v),fade=Math.min(1,edge*150);
 const wrinkle=(ridge+.025*Math.sin(x*.61+y*.23)*Math.sin(y*.71-x*.17))*fade;
 const rib=Math.exp(-edge*170)*.52*Math.sin((u<.02||u>.98?y:x)*2.4);
 return z+(back?-1:1)*(wrinkle+rib);
}
function surface(back){const nx=248,ny=122,vertices=[],uv=[],indices=[];
 for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){const u=i/nx,v=j/ny,x=-372+744*u,y=129-366*v;vertices.push(x,y,height(x,y,u,v,back));uv.push(u,v);}
 for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const a=j*(nx+1)+i,b=a+1,c=a+nx+1,d=c+1;indices.push(...(back?[a,b,c,b,d,c]:[a,c,b,b,c,d]));}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();shell.add(new THREE.Mesh(g,film));
}
surface(false);surface(true);
// Sealed perimeter: the two membranes meet along a thin, ribbed lip.
const rim=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(744,366,2.4)),new THREE.LineBasicMaterial({color:0xf6edf9,transparent:true,opacity:.20}));rim.position.y=-54;shell.add(rim);
const invisible=new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false});
const paperMats=[0xe1bed9,0xf8e6f4,0xfff4fc,0xc9acc8].map(color=>new THREE.MeshBasicMaterial({color,transparent:true}));
const paper=new THREE.Mesh(new THREE.BoxGeometry(740,110,4),[...paperMats,invisible,invisible]);paper.position.set(0,180,4);root.add(paper);
const flip=new THREE.Matrix4().makeScale(1,-1,1),matrix=new THREE.Matrix4();
function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.fov=2*Math.atan(h/3200)*180/Math.PI;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(stage);resize();
stage.classList.add('material-ready');
function frame(){requestAnimationFrame(frame);if(document.hidden)return;
 const cs=getComputedStyle(pack),m=new DOMMatrix(cs.transform);matrix.fromArray(Array.from(m.toFloat64Array()));matrix.setPosition(0,0,0);root.matrix.copy(matrix).premultiply(flip).multiply(flip);
 const f=getComputedStyle(document.querySelector('#plastic')),fm=new DOMMatrix(f.transform);shell.position.set(fm.m41,-fm.m42,fm.m43-23);uniforms.fade.value=f.visibility==='hidden'?0:Number(f.opacity);shell.visible=uniforms.fade.value>.001;rim.material.opacity=.20*uniforms.fade.value;
 const h=getComputedStyle(document.querySelector('#header')),hm=new DOMMatrix(h.transform);paper.position.set(hm.m41,180-hm.m42,4+hm.m43-6);paper.rotation.z=-Math.atan2(hm.m12,hm.m11);paper.visible=h.visibility!=='hidden'&&Number(h.opacity)>.001;paperMats.forEach(mat=>mat.opacity=Number(h.opacity));
 renderer.render(scene,camera);
}frame();
} catch(error){console.warn('Using CSS pouch material fallback.',error);}
