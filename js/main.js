const menu=document.querySelector('.menu'),nav=document.querySelector('nav');
menu.addEventListener('click',()=>{const open=menu.classList.toggle('open');nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',open)});
addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){menu.classList.remove('open');nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.focus()}});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
const progress=document.querySelector('.reading-progress'),sections=[...document.querySelectorAll('main section[id]')],navLinks=[...nav.querySelectorAll('a')];
const updateReading=()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.setProperty('--progress',`${max?scrollY/max*100:0}%`);let current='';sections.forEach(s=>{if(scrollY>=s.offsetTop-150)current=s.id});navLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${current}`))};
addEventListener('scroll',updateReading,{passive:true});updateReading();
// Subtle scroll-driven depth for featured visual groups.
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
  const depthItems=[...document.querySelectorAll('[data-scroll-depth]')];let depthQueued=false;
  const updateDepth=()=>{depthItems.forEach(item=>{const box=item.getBoundingClientRect(),depth=Number(item.dataset.scrollDepth),distance=(box.top+box.height/2-innerHeight/2)/innerHeight;const move=Math.max(-1,Math.min(1,distance))*-innerHeight*depth;const rotate=Math.max(-1,Math.min(1,distance))*-2.5;item.style.transform=`translate3d(0,${move}px,0) rotateX(${rotate}deg)`});depthQueued=false};
  addEventListener('scroll',()=>{if(!depthQueued){requestAnimationFrame(updateDepth);depthQueued=true}},{passive:true});addEventListener('resize',updateDepth);updateDepth();
}
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));
const paperObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('paper-open');paperObserver.unobserve(e.target)}}),{threshold:.1});document.querySelectorAll('.paper-reveal').forEach(e=>paperObserver.observe(e));
if(matchMedia('(pointer:fine)').matches){
  const orbit=document.querySelector('.cursor-orbit'),dot=document.querySelector('.cursor-dot');let tx=-100,ty=-100,ox=-100,oy=-100;
  document.addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY;dot.style.transform=`translate(${tx}px,${ty}px)`});
  const trail=()=>{ox+=(tx-ox)*.16;oy+=(ty-oy)*.16;orbit.style.transform=`translate(${ox}px,${oy}px)`;requestAnimationFrame(trail)};trail();
  document.querySelectorAll('a,button,input,textarea,.tilt').forEach(el=>{el.addEventListener('mouseenter',()=>orbit.classList.add('active'));el.addEventListener('mouseleave',()=>orbit.classList.remove('active'))});
  document.querySelectorAll('.tilt').forEach(card=>{card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;card.style.setProperty('--mx',`${x*100}%`);card.style.setProperty('--my',`${y*100}%`);card.style.transform=`rotateX(${-(y-.5)*10}deg) rotateY(${(x-.5)*10}deg)`});card.addEventListener('mouseleave',()=>card.style.transform='')});
}
const form=document.querySelector('#contact-form'),status=document.querySelector('#form-status');
const PUBLIC_KEY='YOUR_EMAILJS_PUBLIC_KEY',SERVICE_ID='YOUR_EMAILJS_SERVICE_ID',TEMPLATE_ID='YOUR_EMAILJS_TEMPLATE_ID';
if(window.emailjs&&PUBLIC_KEY!=='YOUR_EMAILJS_PUBLIC_KEY')emailjs.init({publicKey:PUBLIC_KEY});
form.addEventListener('submit',async e=>{e.preventDefault();if(!form.checkValidity())return form.reportValidity();const data=new FormData(form),button=form.querySelector('button');button.disabled=true;status.textContent='Sending…';status.className='';try{const db=fetch('php/contact.php',{method:'POST',body:data});const mail=window.emailjs&&PUBLIC_KEY!=='YOUR_EMAILJS_PUBLIC_KEY'?emailjs.send(SERVICE_ID,TEMPLATE_ID,{from_name:data.get('name'),from_email:data.get('email'),message:data.get('message')}):Promise.resolve();const [response]=await Promise.all([db,mail]);const result=await response.json();if(!response.ok||!result.success)throw Error(result.message);status.textContent=PUBLIC_KEY==='YOUR_EMAILJS_PUBLIC_KEY'?'Message saved. Add EmailJS keys to enable notifications.':'Message received. I’ll be in touch soon.';status.className='success';form.reset()}catch(error){status.textContent=error.message||'Unable to send. Please email me directly.';status.className='error'}finally{button.disabled=false}});
