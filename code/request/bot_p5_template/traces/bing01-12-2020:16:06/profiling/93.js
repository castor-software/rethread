var pah_cf,pah_c;(function(n){function i(n,i){t[n]=i}function r(n){return t[n]}var t={};n.register=i;n.create=r})(pah_cf||(pah_cf={})),function(n){function t(n,t){var e,r,u,o=n.getElementsByClassName("pa_img")[0],s=t.getElementsByTagName("img")[0],i,f;return e=s.offsetHeight-o.offsetHeight,i=n.parentElement,i.getBoundingClientRect?(f=i.getBoundingClientRect(),r=f.left+_w.pageXOffset,u=f.top+_w.pageYOffset):(r=sj_go(i,"Left"),u=sj_go(i,"Top")),r=r-(t.offsetWidth-i.offsetWidth)/2,u=u-e,{l:r,t:u}}n("getCoordinates",t)}(pah_cf.register),function(n,t){function f(){r&&i.children.length>0&&r.appendChild(i.children[0])}function s(n,t){i=t;f();r=n.h;i.appendChild(r.children[0]);i.setAttribute("pah-id",n.t.id);i.style.display="block";i.style.width=r.style.width;i.style.minHeight=r.style.minHeight;var e=o(n.t,i);i.style.left=e.l+u;i.style.top=e.t+u}function h(){f();i.style.display="none"}function e(n){var t=n.getElementsByTagName("img"),i;t&&t.length>0&&t[0].getAttribute("src")==null&&(i=t[0].getAttribute("data-src"),t[0].setAttribute("src",i))}function c(){var n=_d.getElementsByClassName("pa_hover"),t;if(n&&n.length>0)for(t=0;t<n.length;t++)e(n[t])}var u="px",i,r,o=t("getCoordinates");n("display",s);n("hide",h);n("updateImageSrc",e);n("updateAllImageSrc",c)}(pah_cf.register,pah_cf.create),function(n){function tt(n){var h;r?(sb_ct(t),t=null,n!=u&&n!=f&&(h=i[u.id],t=sb_st(function(){h!=null&&o("CI.Hover","PAD",h.k,"Duration",(sb_gt()-e).toString());t=null;h=i[n.id];h!=null&&(u=n,l(h,f),o("CI.Show","PAH",h.k),e=sb_gt())},v))):t||(h=i[n.id],h!=null&&(s||g(h.h),t=sb_st(function(){r=!0;t=null;u=n;l(h,f);o("CI.Show","PAH",h.k);e=sb_gt();s||(nt(),s=!0)},a)))}function it(n){if(sb_ct(t),t=null,r){var u;u=n.hasAttribute("pah-id")?i[n.attributes["pah-id"].value]:i[n.id];u!=null&&(t=sb_st(function(){r=!1;t=null;d();o("CI.Hover","PAD",u.k,"Duration",(sb_gt()-e).toString())},200))}}function y(n,t){return n.className.indexOf(t)!=-1}function h(n,t){var u=[],f,e,r,i,o;if(n.getElementsByClassName)for(f=n.getElementsByClassName(t),e=f.length;e--;u.push(f[e]));else for(r=n.getElementsByTagName("div"),i=0,o=r.length;i<o;i++)y(r[i],t)&&u.push(r[i]);return u}function rt(){var f,r,e,n;for(i=[],f=h(_d.body,b),r=0,e=f.length;r<e;r++){var u=f[r],o="pah"+r.toString(),t=new function(){};t.h=u.nextSibling;t.t=y(u,c)?u:h(u,c)[0];t.k=u.getAttribute("data-kValue");t.t.id=o;i[o]=t;p(t.t)}n=h(_d.body,k);n.length>1&&n[1].getAttribute("timeout")!=""&&(a=parseInt(n[1].getAttribute("timeout")));n.length>1&&n[1].getAttribute("hoverover")!=""&&(v=parseInt(n[1].getAttribute("hoverover")))}function p(n){sj_be(n,"mouseover",function(){tt(n)});sj_be(n,"mouseout",function(){it(n)})}function ut(){var n=sj_ce("div",null,"pa_hover ad_scpah");return n.setAttribute("data-priority","2"),n.setAttribute("onclick","pah_c(event)"),_d.body.appendChild(n),p(n),n}function o(n,t,i){for(var f,u=[],r=3;r<arguments.length;r++)u[r-3]=arguments[r];i&&(f=[n,i+w,t,!1].concat(u),Log.Log.apply(Log.Log,f))}function ft(){f=ut();rt()}var t,r,u,f,w=".1",b="pa_item",c="pa_hover_target",k="pa_hover",e,i,s,l=n("display"),d=n("hide"),g=n("updateImageSrc"),nt=n("updateAllImageSrc"),a=500,v=200;ft()}(pah_cf.create);pah_c=function(n){function i(n){var t,i=_d.getElementsByClassName("pa_hover_target"),r;if(i&&i.length>0){for(r=0;r<i.length;r++)if(n.hasAttribute("pah-id")&&i[r].id==n.attributes["pah-id"].value){t=i[r].parentElement;break}t&&t.tagName=="A"&&(si_ct(t),_w.open(t.getAttribute("href"),"_blank"))}}n=sj_ev(n);for(var t=sj_et(n);t;){if(t.tagName=="A")return!0;if(t.className.indexOf("ad_scpah")!=-1)break;t=t.parentNode}return t?(i(t),sj_sp(n),!1):!1}