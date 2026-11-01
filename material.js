import * as THREE from './vendor/three.module.js';
// One scene owns every visible surface. DOM buttons remain the interaction layer.
// In particular, no CSS sticker plane is composited outside the physical pouch.
const stage=document.querySelector('#stage'),pack=document.querySelector('#pack');
try {
const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});
renderer.setClearColor(0,0);renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
renderer.domElement.className='pouch-material';renderer.domElement.setAttribute('aria-hidden','true');stage.append(renderer.domElement);
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(30,1,500,3000);camera.position.z=1600;
const root=new THREE.Group();root.matrixAutoUpdate=false;scene.add(root);
const shell=new THREE.Group();root.add(shell);
const uniforms={fade:{value:1}};
const film=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.FrontSide,uniforms,
vertexShader:`varying vec3 n;varying vec3 p;varying vec2 uvFilm;void main(){vec4 world=modelMatrix*vec4(position,1.);p=world.xyz;n=normalize(mat3(modelMatrix)*normal);uvFilm=uv;gl_Position=projectionMatrix*viewMatrix*world;}`,
fragmentShader:`uniform float fade;varying vec3 n;varying vec3 p;varying vec2 uvFilm;
void main(){vec3 N=normalize(n),V=normalize(cameraPosition-p);vec3 R=reflect(-V,N);
float a=exp(-pow((R.x+.38)/.065,2.))*smoothstep(-.9,-.25,R.y);
float b=exp(-pow((R.x-.61)/.10,2.))*.8;
float c=exp(-pow((R.y-.66)/.075,2.))*.7;
float white=max(a,max(b,c));float dark=exp(-pow((R.x+.04)/.13,2.))*.055;
float fres=pow(1.-abs(dot(N,V)),2.8);float edge=1.-smoothstep(0.,.025,min(min(uvFilm.x,1.-uvFilm.x),min(uvFilm.y,1.-uvFilm.y)));
float band=1.-smoothstep(.008,.026,min(min(uvFilm.x,1.-uvFilm.x),1.-uvFilm.y));
float ribs=band*(.5+.5*sin((uvFilm.x<.026||uvFilm.x>.974?uvFilm.y*366.:uvFilm.x*744.)*2.4));
float alpha=clamp(.045+white*.60+dark+fres*.64+edge*.12+ribs*.12,0.,.92)*fade;
vec3 color=mix(vec3(.48,.71,.88),vec3(.94,.985,1.),clamp(white*2.+fres+edge,0.,1.));
gl_FragColor=vec4(color,alpha);}`});
const folds=[];
for(let i=0;i<58;i++){
 const side=i%4,t=((i*.6180339)%1),len=30+(i*47%112);let x,y,dx,dy;
 if(side===0){x=-372;y=129-t*366;dx=len;dy=Math.sin(i*3.7)*65;}
 if(side===1){x=372;y=129-t*366;dx=-len;dy=Math.sin(i*2.7)*65;}
 if(side===2){x=-372+t*744;y=-237;dx=Math.sin(i*4.1)*65;dy=len*.7;}
 if(side===3){x=-372+t*744;y=129;dx=Math.sin(i*4.1)*60;dy=-len*.7;}
 folds.push({x,y,dx,dy,w:2.3+i%4,h:1.4+i%3*.75});
}
function height(x,y,u,v,back){
 const envelope=Math.pow(Math.max(0,Math.sin(Math.PI*u)*Math.sin(Math.PI*v)),.55);
 // A clamped 8px neck meets the folded header; the body encloses 36–110px of depth.
 const neck=Math.min(1,v/.055),ease=neck*neck*(3-2*neck);
 const puff=4+14*ease+37*envelope+4*envelope*Math.sin(x/84+.5)*Math.cos(y/70);
 let ridge=0;
 for(const f of folds){const t=((x-f.x)*f.dx+(y-f.y)*f.dy)/(f.dx*f.dx+f.dy*f.dy);if(t<=0||t>=1)continue;const d=Math.hypot(x-f.x-t*f.dx,y-f.y-t*f.dy);ridge+=Math.exp(-d*d/(f.w*f.w))*Math.sin(Math.PI*t)*f.h;}
 const edge=Math.min(u,1-u,v,1-v),fade=Math.min(1,edge*150);
 const wrinkle=(ridge+.025*Math.sin(x*.61+y*.23)*Math.sin(y*.71-x*.17))*fade;
 const rib=Math.exp(-edge*170)*.55*Math.sin((u<.02||u>.98?y:x)*2.4);
 return (back?-1:1)*(puff+wrinkle+rib);
}
function geometry(vertices,uv,indices){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g;}
function surface(back){const nx=248,ny=122,vertices=[],uv=[],indices=[];
 for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){const u=i/nx,v=j/ny,x=-372+744*u,y=129-366*v;vertices.push(x,y,height(x,y,u,v,back));uv.push(u,v);}
 for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const a=j*(nx+1)+i,b=a+1,c=a+nx+1,d=c+1;indices.push(...(back?[a,b,c,b,d,c]:[a,c,b,b,c,d]));}
 const mesh=new THREE.Mesh(geometry(vertices,uv,indices),film);mesh.renderOrder=back?1:3;shell.add(mesh);
}
surface(false);surface(true);
// Continuous, outward-facing side gussets join matching front and rear vertices.
// Six curved depth strips give the seam a soft inflated shoulder, including side-on.
const gussets=[];
for(let edge=0;edge<4;edge++){
 const vs=[],uv=[],ix=[],n=edge%2?122:248,depth=8;
 for(let j=0;j<=depth;j++)for(let i=0;i<=n;i++){
  const t=i/n,k=j/depth;let u,v;
  if(edge===0){u=t;v=0;}if(edge===1){u=1;v=t;}if(edge===2){u=1-t;v=1;}if(edge===3){u=0;v=1-t;}
  let x=-372+744*u,y=129-366*v;
  const shoulder=Math.sin(Math.PI*k)*Math.sin(Math.PI*t)*4;
  if(edge===0)y+=shoulder;if(edge===1)x+=shoulder;if(edge===2)y-=shoulder;if(edge===3)x-=shoulder;
  const front=height(-372+744*u,129-366*v,u,v,false),rear=height(-372+744*u,129-366*v,u,v,true);
  vs.push(x,y,front+(rear-front)*k);uv.push(u,v);
 }
 for(let j=0;j<depth;j++)for(let i=0;i<n;i++){const a=j*(n+1)+i,b=a+1,c=a+n+1,d=c+1;ix.push(a,b,c,b,d,c);}
 const mesh=new THREE.Mesh(geometry(vs,uv,ix),film);mesh.renderOrder=2;gussets.push(mesh);shell.add(mesh);
}
const lipPoints=[];for(let i=0;i<=248;i++){const u=i/248,x=-372+744*u;lipPoints.push(new THREE.Vector3(x,129,height(x,129,u,0,false)));}for(let i=248;i>=0;i--){const u=i/248,x=-372+744*u;lipPoints.push(new THREE.Vector3(x,129,height(x,129,u,0,true)));}
const lip=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(lipPoints),new THREE.LineBasicMaterial({color:0xe0f6ff,transparent:true,opacity:.65}));shell.add(lip);
function canvasTexture(canvas){const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());return t;}
const paperSides=[0xc8badb,0xe9d8ec,0xf8ecfa,0xb7a3c7].map(color=>new THREE.MeshBasicMaterial({color,transparent:true}));
const placeholder=new THREE.MeshBasicMaterial({color:0xe7c6e4,transparent:true});
const paper=new THREE.Mesh(new THREE.BoxGeometry(740,110,8),[...paperSides,placeholder,placeholder]);paper.position.set(0,180,0);root.add(paper);
async function load(src){const img=new Image();img.src=src;await img.decode();return img;}
async function printHeader(){const [title,charms]=await Promise.all([load('assets/shalom-balloon-v1.png'),load('assets/candy-charms-v1.png')]);
 const make=back=>{const c=document.createElement('canvas');c.width=1480;c.height=220;const x=c.getContext('2d');x.scale(2,2);const g=x.createLinearGradient(0,0,740,110);g.addColorStop(0,'#f8dff0');g.addColorStop(.46,'#dce7f2');g.addColorStop(1,'#e3bfe8');x.fillStyle=g;x.fillRect(0,0,740,110);x.strokeStyle='#fff9';x.strokeRect(5,5,730,100);x.fillStyle='#b2a2c255';x.beginPath();x.roundRect(343,10,54,7,3.5);x.fill();
 if(!back){const ratio=Math.min(250/title.width,78/title.height);x.drawImage(title,370-title.width*ratio/2,60-title.height*ratio/2,title.width*ratio,title.height*ratio);const w=charms.width/2,h=charms.height/2;for(const [sx,sy,dx,dy,size] of [[0,0,84,22,65],[1,0,590,19,65],[0,1,179,66,33],[1,1,527,18,32]])x.drawImage(charms,sx*w,sy*h,w,h,dx,dy,size,size);}
 return new THREE.MeshBasicMaterial({map:canvasTexture(c),transparent:true});};
 paper.material=[...paperSides,make(false),make(true)];
}
printHeader().catch(error=>console.warn('Header artwork could not load.',error));
const stickerMeshes=[];
function createSticker(el,index){const image=el.querySelector('img');if(!image?.complete||!image.naturalWidth)return null;
 const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d'),s=Math.min(256/image.naturalWidth,256/image.naturalHeight);x.drawImage(image,(256-image.naturalWidth*s)/2,(256-image.naturalHeight*s)/2,image.naturalWidth*s,image.naturalHeight*s);
 const front=new THREE.MeshBasicMaterial({map:canvasTexture(c),alphaTest:.035,alphaToCoverage:true,side:THREE.FrontSide});
 x.globalCompositeOperation='source-in';const g=x.createLinearGradient(0,0,256,256);g.addColorStop(0,'#fffefc');g.addColorStop(1,'#e5e4f0');x.fillStyle=g;x.fillRect(0,0,256,256);
 const rear=new THREE.MeshBasicMaterial({map:canvasTexture(c),alphaTest:.035,alphaToCoverage:true,side:THREE.FrontSide});
 // CanvasTexture uploads lazily: give the front its own immutable source canvas.
 const frontCanvas=document.createElement('canvas');frontCanvas.width=frontCanvas.height=256;const fc=frontCanvas.getContext('2d');fc.drawImage(image,(256-image.naturalWidth*s)/2,(256-image.naturalHeight*s)/2,image.naturalWidth*s,image.naturalHeight*s);front.map.dispose();front.map=canvasTexture(frontCanvas);
 const group=new THREE.Group();group.matrixAutoUpdate=false;const a=new THREE.Mesh(new THREE.PlaneGeometry(104,104),front),b=new THREE.Mesh(a.geometry,rear);a.position.z=.55;b.position.z=-.55;b.rotation.y=Math.PI;group.add(a,b);root.add(group);return{el,group,index};
}
const flip=new THREE.Matrix4().makeScale(1,-1,1),matrix=new THREE.Matrix4();
function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.fov=2*Math.atan(h/3200)*180/Math.PI;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(stage);resize();
stage.classList.add('material-ready','scene-ready');
function frame(){requestAnimationFrame(frame);if(document.hidden)return;
 const m=new DOMMatrix(getComputedStyle(pack).transform);matrix.fromArray(Array.from(m.toFloat64Array()));matrix.setPosition(0,0,0);root.matrix.copy(matrix).premultiply(flip).multiply(flip);
 if(stickerMeshes.length<20){for(const [index,el] of [...document.querySelectorAll('.sticker')].entries())if(!stickerMeshes.some(s=>s.el===el)){const item=createSticker(el,index);if(item)stickerMeshes.push(item);}}
 // Catalog identity never depends on image decode completion order. Rank matches DOM
 // stacking, stays bounded through repeated drags, and has resolvable depth spacing.
 const drawings=stickerMeshes.map(item=>({...item,cs:getComputedStyle(item.el)}));
 const ordered=drawings.slice().sort((a,b)=>(Number(a.cs.zIndex)||0)-(Number(b.cs.zIndex)||0)||a.index-b.index);
 const ranks=new Map(ordered.map((item,rank)=>[item.el,rank]));
 drawings.forEach(({el,group,cs})=>{const sm=new DOMMatrix(cs.transform);matrix.fromArray(Array.from(sm.toFloat64Array()));matrix.setPosition(0,0,0);group.matrix.copy(matrix).premultiply(flip).multiply(flip);const z=(ranks.get(el)-9.5)*.25;group.matrix.setPosition(-370+sm.m41+52,235-sm.m42-52,z);});
 const f=getComputedStyle(document.querySelector('#plastic')),fm=new DOMMatrix(f.transform);shell.position.set(fm.m41,-fm.m42,fm.m43-23);uniforms.fade.value=f.visibility==='hidden'?0:Number(f.opacity);shell.visible=uniforms.fade.value>.001;lip.material.opacity=.65*uniforms.fade.value;
 gussets[0].visible=!pack.classList.contains('repacking')||pack.classList.contains('closing');
 const h=getComputedStyle(document.querySelector('#header')),hm=new DOMMatrix(h.transform);paper.position.set(hm.m41,180-hm.m42,hm.m43-6);paper.rotation.z=-Math.atan2(hm.m12,hm.m11);paper.visible=h.visibility!=='hidden'&&Number(h.opacity)>.001;paper.material.forEach(mat=>mat.opacity=Number(h.opacity));
 renderer.render(scene,camera);
}frame();
renderer.domElement.addEventListener('webglcontextlost',()=>stage.classList.remove('scene-ready','material-ready'));
} catch(error){stage.classList.remove('scene-ready','material-ready');console.warn('Using CSS pouch fallback.',error);}
