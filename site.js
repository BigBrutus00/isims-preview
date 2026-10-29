(function(){
  // Links from the old site (isims-uk.com/#/route) land on the matching section
  var h=location.hash||"";
  if(h.indexOf("#/")===0){
    var r=h.slice(2), map={ijacket:"ijacket",softdev:"software",sr:"software",brr:"services","contact-map":"contact"};
    var id=map[r]||"services"; history.replaceState(null,"",location.pathname+"#"+id);
    var t=document.getElementById(id); if(t) t.scrollIntoView();
  }

  // Header: slim sticky rail on desktop; on phones it hides on scroll down and returns on scroll up
  var head=document.querySelector(".head"), lastY=window.scrollY, narrow=window.matchMedia("(max-width:900px)");
  window.addEventListener("scroll",function(){
    var y=window.scrollY;
    if(narrow.matches){ head.classList.toggle("hidden", y>lastY && y>120); }
    else { head.classList.remove("hidden"); }
    lastY=y;
  },{passive:true});

  // Services explorer: tabs with arrow-key support
  var tabs=[].slice.call(document.querySelectorAll('[role="tab"]'));
  function show(tab,focus){
    tabs.forEach(function(t){var on=t===tab;t.setAttribute("aria-selected",on);t.tabIndex=on?0:-1;
      document.getElementById(t.getAttribute("aria-controls")).hidden=!on;});
    if(focus) tab.focus();
  }
  tabs.forEach(function(t,i){
    t.addEventListener("click",function(){show(t)});
    t.addEventListener("keydown",function(e){
      var k=e.key, n=null;
      if(k==="ArrowDown"||k==="ArrowRight") n=tabs[(i+1)%tabs.length];
      if(k==="ArrowUp"||k==="ArrowLeft") n=tabs[(i-1+tabs.length)%tabs.length];
      if(k==="Home") n=tabs[0]; if(k==="End") n=tabs[tabs.length-1];
      if(n){e.preventDefault();show(n,true);}
    });
  });

  // YouTube: load the player only when someone presses play
  document.querySelectorAll(".yt").forEach(function(b){
    b.addEventListener("click",function(){
      var f=document.createElement("iframe");
      f.src="https://www.youtube-nocookie.com/embed/"+b.dataset.id+"?autoplay=1&rel=0";
      f.title=b.getAttribute("aria-label").replace("Play video: ","");
      f.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      f.allowFullscreen=true; f.className="yt-frame";
      b.replaceWith(f);
    });
  });

  // Screenshot thumbnails open larger in a lightbox
  var lb=document.getElementById("lightbox");
  if(lb&&lb.showModal){
    var lbImg=lb.querySelector("img");
    document.querySelectorAll(".zoom").forEach(function(z){z.addEventListener("click",function(){lbImg.src=z.dataset.src;lbImg.alt=z.dataset.alt;lb.showModal();});});
    lb.querySelector(".lb-close").addEventListener("click",function(){lb.close();});
    lb.addEventListener("click",function(e){if(e.target===lb)lb.close();});
  }

  // Enquiry form opens the visitor's email app
  var form=document.getElementById("enquiry");
  if(form){form.addEventListener("submit",function(e){
    e.preventDefault(); if(!form.reportValidity()) return;
    var d=new FormData(form);
    var subj="Website enquiry: "+d.get("service")+" ("+(d.get("company")||d.get("name"))+")";
    var body="Name: "+d.get("name")+"\nCompany: "+(d.get("company")||"")+"\nEmail: "+d.get("email")+"\nNeeds: "+d.get("service")+"\n\n"+d.get("message");
    location.href="mailto:info@intellisims.com?subject="+encodeURIComponent(subj)+"&body="+encodeURIComponent(body);
    var s=document.getElementById("form-status"); s.hidden=false;
    s.textContent="Your email app should open with the enquiry ready to send. If it doesn't, email info@intellisims.com.";
  });}
})();
