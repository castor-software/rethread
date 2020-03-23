var __extends=this&&this.__extends||function(){var n=function(t,i){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,t){n.__proto__=t}||function(n,t){for(var i in t)t.hasOwnProperty(i)&&(n[i]=t[i])},n(t,i)};return function(t,i){function r(){this.constructor=t}n(t,i);t.prototype=i===null?Object.create(i):(r.prototype=i.prototype,new r)}}(),Sharing=function(n){function t(){var t=n.call(this)||this;return t.musCard=Utils.getElement(HomepageSelectors._MUSEUM_CARD),t.enabledSharingNetworks=["Facebook","Twitter","Skype"],t.mobileEnabledSharingNetworks=["Facebook","WhatsApp","Skype","Sms","Email","GetUrl","Twitter"],t.serviceName="Homepage",t.museumScenario="museum",t.vsScenario="vs",t.shareDialogScenario="sharedialog",t.formCodes={Facebook:"HPSHFB",Twitter:"HPSHTW",Skype:"HPSHSK"},t.bootstrapDone=!1,t.urlParameters=function(){return{mkt:_G.Mkt,ssd:t.model.getCurrentMediaContent().Ssd,sbin:"museum"}},t.attachHandlers=function(){addEventListener("scroll",t.setupShareDialog);t.musCard.addEventListener("mouseover",t.setupShareDialog);Utils.getElement(HomepageSelectors._MUSEUM_CARD_FB).addEventListener("click",t.onShareClick.bind(t,"Facebook",t.museumScenario));Utils.getElement(HomepageSelectors._MUSEUM_CARD_TW).addEventListener("click",t.onShareClick.bind(t,"Twitter",t.museumScenario));Utils.getElement(HomepageSelectors._MUSEUM_CARD_SK).addEventListener("click",t.onShareClick.bind(t,"Skype",t.museumScenario));var n=Utils.getElement(HomepageSelectors._VS_CONTROL_SHARE);n&&n.addEventListener("click",t.onShareClick.bind(t,"",t.vsScenario))},t.attachMobileHandlers=function(){Utils.getElement("#ShareFB_csc").addEventListener("click",t.onShareClick.bind(t,"Facebook",t.museumScenario));Utils.getElement("#ShareWhatsApp_csc").addEventListener("click",t.onShareClick.bind(t,"WhatsApp",t.museumScenario));Utils.getElement("#ShareSkype_csc").addEventListener("click",t.onShareClick.bind(t,"Skype",t.museumScenario));Utils.getElement("#ShareMore").addEventListener("click",t.onShareClick.bind(t,"",t.shareDialogScenario))},t.onShareClick=function(n,i){if(typeof ShareDialog!="undefined"){t.setupShareDialog();Log.Log("DHTMLClick","HP","musCard"+n,!0);var r={eType:0,url:t.model.getCurrentMediaContent().ImageContent.Image.Url,width:1920,height:1080},u={invokeShare:n,service:t.serviceName,scenario:i,sharemethods:t.model.isMobile()?t.mobileEnabledSharingNetworks:t.enabledSharingNetworks,formcodes:t.formCodes},f={customShareUrl:"https://www.bing.com/",urlParameters:t.urlParameters(),title:"",description:"",shareHashKey:"n/a",twitter:{text:"Check out today's homepage on Bing"},shareElements:t.model.isMobile()?null:[r]};ShareDialog.show(u,f)}},t.setupShareDialog=function(){typeof ShareDialog=="undefined"||t.bootstrapDone||(ShareDialog.bootstrap(),t.bootstrapDone=!0)},t.model.isMobile()?addEventListener("MobileCardsLoaded",function(){Utils.getElement(".hc_card #scOptionsContainer")&&t.attachMobileHandlers()}):t.musCard&&t.attachHandlers(),t}return __extends(t,n),t.prototype.onModelUpdate=function(){},t}(UpdatableComponent),Trivia,SearchByImage,VerticalScroll,ImageModule,ContentControls;new Sharing;__extends=this&&this.__extends||function(){var n=function(t,i){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,t){n.__proto__=t}||function(n,t){for(var i in t)t.hasOwnProperty(i)&&(n[i]=t[i])},n(t,i)};return function(t,i){function r(){this.constructor=t}n(t,i);t.prototype=i===null?Object.create(i):(r.prototype=i.prototype,new r)}}();Trivia=function(n){function t(){var t=n.call(this)||this;return t.triviaContainer=Utils.getElement(HomepageSelectors._TRIVIA_INNER),t.onModelUpdate=function(){var r=t.triviaContainer.getAttribute("data-iid"),n=[],i;n.push("id="+t.model.getCurrentMediaContent().ImageContent.TriviaId);n.push("IG="+_G.IG);n.push("IID="+r);n.push(Utils.getCurrentQueryParams());i="/hp/api/v1/trivia?"+n.join("&");Instrument.logTime("TriviaReq");Utils.ajax(i,t.handleTriviaLoad,t.handleTriviaError)},t.attachHandlers=function(){t.triviaContainer.addEventListener("mouseenter",t.onTriviaHover,{once:!0});t.triviaContainer.addEventListener("mouseout",t.onTriviaOut,{once:!0});Utils.getElement(HomepageSelectors._MUSEUM_CARD_QUIZ_LINK).addEventListener("click",t.resetTriviaULC)},t.handleTriviaLoad=function(n){n.status==200&&t.insertTrivia(n.response)},t.handleTriviaError=function(){Instrument.logError("other","trivia","loadError")},t.insertTrivia=function(n){var r=Utils.getElement(HomepageSelectors._TRIVIA_OUTER),u,i;r.classList.remove("show");Utils.clearChildren(t.triviaContainer);u=t.model.getClientSettings();n&&(u.Qz.St>0?(i=Utils.getElement(HomepageSelectors._MUSEUM_CARD_QUIZ_LINK),i.href=t.model.getCurrentMediaContent().ImageContent.TriviaUrl,Utils.show(i)):(Utils.addDocumentExtract(n,".trivia",t.triviaContainer),r.classList.add("show")),Instrument.logTime("TriviaLoad"))},t.onTriviaHover=function(){Instrument.logInfo("other","trivia","hover");Instrument.log("Show","OnTriviaHover",!1);var n=t.model.getClientSettings();n.Qz.Cn=0;t.model.updateClientSettings()},t.onTriviaOut=function(){t.triviaContainer.classList.remove("show")},t.resetTriviaULC=function(){var n=t.model.getClientSettings();n.Qz.Cn=0;n.Qz.St=0;t.model.updateClientSettings()},t.triviaContainer&&(t.attachHandlers(),t.onModelUpdate()),t}return __extends(t,n),t}(UpdatableComponent);new Trivia;__extends=this&&this.__extends||function(){var n=function(t,i){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,t){n.__proto__=t}||function(n,t){for(var i in t)t.hasOwnProperty(i)&&(n[i]=t[i])},n(t,i)};return function(t,i){function r(){this.constructor=t}n(t,i);t.prototype=i===null?Object.create(i):(r.prototype=i.prototype,new r)}}();SearchByImage=function(n){function t(){var t=n.call(this)||this;return t.camera=Utils.getElement(HomepageSelectors._CAMERA),t.insertId=t.camera&&t.camera.getAttribute("data-iid")||"SBI",t.onModelUpdate=function(){},t.init=function(){var n=[],i;n.push("IG="+_G.IG);t.insertId&&n.push("IID="+t.insertId);i="/images/sbi?mmasync=1&ptn=Homepage&"+n.join("&");Utils.ajax(i,t.onDialogFetched)},t.onDialogFetched=function(n){n&&n.response&&t.camera&&Utils.addDocumentExtract(n.response,"#sbiarea",t.camera,!0,!0)},t.init(),t}return __extends(t,n),t}(UpdatableComponent);new SearchByImage;__extends=this&&this.__extends||function(){var n=function(t,i){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,t){n.__proto__=t}||function(n,t){for(var i in t)t.hasOwnProperty(i)&&(n[i]=t[i])},n(t,i)};return function(t,i){function r(){this.constructor=t}n(t,i);t.prototype=i===null?Object.create(i):(r.prototype=i.prototype,new r)}}();VerticalScroll=function(n){function t(){var t=n.call(this)||this;return t.searchBoxScrollDistanceRatio=.15,t.minBackgroundOpacity=.3,t.scrollCont=Utils.getElement(HomepageSelectors._SCROLL_CONT),t.verticalScroll=Utils.getElement(HomepageSelectors._VS),t.sbox=Utils.getElement(HomepageSelectors._SBOX),t.searchForm=Utils.getElement(HomepageSelectors._SBOX_FORM),t.headline=Utils.getElement(HomepageSelectors._HEADLINE_CONT),t.image=Utils.getElement(HomepageSelectors._IMAGE_CONT),t.museumCard=Utils.getElement(HomepageSelectors._MUSEUM_CARD),t.hiddenVSLink=Utils.getElement(HomepageSelectors._VS_HIDDEN_LINK),t.hpBody=Utils.getElement(HomepageSelectors._HP_BODY),t.iotdModule=Utils.getElement(HomepageSelectors._IOTD_MODULE),t.moduleCont=Utils.getElement(HomepageSelectors._MODULE_CONT),t.scrollInstPoints=[1,25,50,100,200,300,400,500,600,700,800],t.fetched=!1,t.mobileScrolled=!1,t.sboxBottom=-1,t.lastScrollPosition=0,t.maxScrollPosition=0,t.scrollInstIndex=0,t.unviewedModulesHalf=[],t.unviewedModulesFull=[],t.onModelUpdate=function(){t.verticalScroll&&t.fetchChunks(t.model.getCurrentMediaContent().Ssd)},t.fetchChunks=function(n){Utils.getElements(HomepageSelectors._VS_MODULE).forEach(function(i){var o=i.getAttribute("data-refresh")=="true",u,e;if((o||!t.fetched)&&(u=i.getAttribute("data-url"),u)){var r=[],s=i.getAttribute("data-iid"),f=Utils.getCurrentQueryParams();r.push(f);f.toLowerCase().indexOf("ssd=")<0&&f.toLowerCase().indexOf("currentdate=")<0&&r.push("ssd="+n);r.push("IG="+_G.IG);r.push("IID="+s);e=u+"&"+r.join("&");Utils.ajax(e,t.handleChunkLoad,t.handleChunkError,i)}});t.fetched=!0},t.attachHandlers=function(){t.verticalScroll&&(t.scrollCont.addEventListener("scroll",t.handleScrollWrapper,{passive:!0}),addEventListener("unload",t.handleUnload),t.iotdModule&&t.pushModule(t.iotdModule));t.model.isMobile()&&addEventListener("resize",t.handleMobileOrientationChange)},t.handleScrollWrapper=function(n){requestAnimationFrame(t.handleScroll.bind(t,n))},t.handleScroll=function(n){t.fireEvent("VerticalScrolled",n);t.fetched||t.fetchChunks(t.model.getCurrentMediaContent().Ssd);var i=n.target,r=i.scrollTop-t.lastScrollPosition>0?"down":"up";t.model.isMobile()?t.handleScrollMobile(i.scrollTop):t.handleScrollDesktop(i.scrollTop,r);t.lastScrollPosition=i.scrollTop;t.maxScrollPosition<t.lastScrollPosition&&setTimeout(t.logScrollingEvents,10);t.maxScrollPosition=Math.max(t.lastScrollPosition,i.scrollTop)},t.handleScrollDesktop=function(n,i){if(!t.model.isBingAtWorkHomepage()&&(!t.sbox.classList.contains("fix")||i!="down")){var r=n*t.searchBoxScrollDistanceRatio,u=t.sbox.getBoundingClientRect().bottom,f=Math.max(t.headline.getBoundingClientRect().top,t.museumCard.getBoundingClientRect().top);u>=f?t.sbox.classList.add("fix"):(t.sbox.classList.remove("fix"),t.sbox.style.transform="translate3d(0, -"+r+"px, 0)");t.image.style.opacity=Math.max(t.minBackgroundOpacity,1-n/t.image.clientHeight).toString()}},t.handleMobileOrientationChange=function(){t.sboxBottom==-1;t.handleScrollMobile(t.scrollCont.scrollTop)},t.handleScrollMobile=function(n){if(t.verticalScroll){var i=t.verticalScroll.getBoundingClientRect().top;t.sboxBottom==-1&&(t.sboxBottom=t.searchForm.getBoundingClientRect().bottom);i<=t.sboxBottom||t.searchForm.classList.contains("as_on")?(t.sbox.classList.add("fix"),Utils.getElement(HomepageSelectors._BNP_DIV_SHOWN)&&(t.sbox.style.top=Utils.getElement(HomepageSelectors._BNP_DIV_SHOWN).clientHeight+t.sboxFixHeight+"px")):(t.sbox.classList.remove("fix"),t.sbox.style.top="");t.mobileScrolled||(Utils.getElement(HomepageSelectors._BNP_DIV_SHOWN)&&(t.scrollCont.style.height="calc(100% - "+Utils.getElement(HomepageSelectors._BNP_DIV_SHOWN).clientHeight+"px)"),Utils.getElement(HomepageSelectors._BNP_ARROW)&&Utils.hide(Utils.getElement(HomepageSelectors._BNP_CONT)),t.hpBody.classList.add("scroll"),t.mobileScrolled=!0,Instrument.logShow("MobileScroll"));setTimeout(function(){t.image.style.opacity=Math.max(0,1-n/t.image.clientHeight).toString()},100)}},t.handleUnload=function(){Instrument.logLegacy("Show","HPVS","MaxScroll","Time",t.maxScrollPosition.toString());Instrument.logTime("DwellTime")},t.logScrollingEvents=function(){t.scrollInstIndex<t.scrollInstPoints.length&&t.maxScrollPosition>t.scrollInstPoints[t.scrollInstIndex]&&(Instrument.logLegacy("Show","HPVS","Scroll"+t.scrollInstPoints[t.scrollInstIndex]),t.scrollInstIndex++,t.scrollInstIndex==1&&t.hiddenVSLink&&si_T(t.hiddenVSLink.getAttribute("h")));t.instrumentModuleViewed(t.unviewedModulesHalf,.5);t.instrumentModuleViewed(t.unviewedModulesFull,1,"_full")},t.cleanExistingNode=function(n){if(n&&n.children)while(n.hasChildNodes())n.removeChild(n.firstChild)},t.handleChunkLoad=function(n,i){t.cleanExistingNode(i);var u=i.getAttribute("data-sel"),r=Utils.addDocumentExtract(n.response,u,i);r.elements&&r.elements.length>0&&(i.classList.add("show"),t.pushModule(i),r.root.querySelector(HomepageSelectors._BAW_CRS)&&t.createBingAtWorkCarousel(i));i.getAttribute("data-iid")=="MobileCards"&&(t.downloadImageLink=Utils.getElement(HomepageSelectors._MOBILE_DOWNLOAD_IMAGE_LINK),t.downloadImageText=Utils.getElement(HomepageSelectors._MOBILE_DOWNLOAD_IMAGE_TEXT),t.mobLangSwitcherSelect=Utils.getElement(HomepageSelectors._MOBILE_LANG_SWITCH_SELECT),t.downloadImageLink&&t.downloadImageLink.addEventListener("click",t.toggleMobileImageDownloadNotif),t.mobLangSwitcherSelect&&t.mobLangSwitcherSelect.addEventListener("change",t.handleMobileLangSwitcher),t.fireEvent("MobileCardsLoaded",null))},t.handleChunkError=function(){console.log("Error")},t.createBingAtWorkCarousel=function(){var n=Utils.getElement(HomepageSelectors._BAW_ITEMS),t=Utils.getElement(HomepageSelectors._BAW_NAV_LEFT),i=Utils.getElement(HomepageSelectors._BAW_NAV_RIGHT),u=Array.prototype.slice.call(n.querySelectorAll(HomepageSelectors._BAW_TILE)),r;n&&t&&i&&(r={container:n,leftNav:t,rightNav:i,tiles:u,callback:null},new Carousel(r))},t.toggleMobileImageDownloadNotif=function(){t.downloadImageText.classList.contains("show")?t.downloadImageText.classList.remove("show"):t.downloadImageText.classList.add("show")},t.handleMobileLangSwitcher=function(){if(t.mobLangSwitcherSelect.children!==null&&t.mobLangSwitcherSelect.selectedIndex>=0&&t.mobLangSwitcherSelect.children[t.mobLangSwitcherSelect.selectedIndex]!==null){var n=t.mobLangSwitcherSelect.children[t.mobLangSwitcherSelect.selectedIndex].getAttribute("data-dataurl");n!==null&&typeof n!="undefined"&&(Instrument.logClick("LanguageSwitch",!0,"Language",n),window.open(n,"_parent"))}},t.pushModule=function(n){t.unviewedModulesHalf.push(n);t.unviewedModulesFull.push(n)},t.instrumentModuleViewed=function(n,i,r){r===void 0&&(r="");var u=[];n.forEach(function(n){n.offsetTop-t.moduleCont.offsetTop+i*n.offsetHeight<t.maxScrollPosition&&(Instrument.logLegacy("Show","HPVS","View_"+(n.getAttribute("data-vsname")||"Unknown")+r),u.push(n))});u.forEach(function(t){var i=n.indexOf(t);i>=0&&n.splice(i,1)})},t.attachHandlers(),t.onModelUpdate(),t}return __extends(t,n),t}(UpdatableComponent);new VerticalScroll;__extends=this&&this.__extends||function(){var n=function(t,i){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,t){n.__proto__=t}||function(n,t){for(var i in t)t.hasOwnProperty(i)&&(n[i]=t[i])},n(t,i)};return function(t,i){function r(){this.constructor=t}n(t,i);t.prototype=i===null?Object.create(i):(r.prototype=i.prototype,new r)}}();ImageModule=function(n){function t(){var t=n.call(this)||this;return t.imageControl=Utils.getElement(HomepageSelectors._IOTD_IMG),t.imageControlLink=Utils.getElement(HomepageSelectors._IOTD_IMG_LINK),t.titleControl=Utils.getElement(HomepageSelectors._IOTD_TITLE),t.copyrightControl=Utils.getElement(HomepageSelectors._IOTD_CREDIT),t.imageDate=Utils.getElement(HomepageSelectors._IOTD_DATE),t.descriptionControl=Utils.getElement(HomepageSelectors._IOTD_DESC),t.mapModule=Utils.getElement(HomepageSelectors._IOTD_MOD_MAP),t.plusOneModule=Utils.getElement(HomepageSelectors._IOTD_MOD_P1),t.plusOneMainText=Utils.getElement(HomepageSelectors._IOTD_MOD_P1_MAIN_TEXT),t.plusOneTitle=Utils.getElement(HomepageSelectors._IOTD_MOD_P1_TITLE),t.plusOneLink=Utils.getElement(HomepageSelectors._IOTD_MOD_P1_LABEL),t.factAriaLabel=t.plusOneTitle&&t.plusOneTitle.getAttribute("data-aria-fact")+" ",t.sgAriaLabel=t.plusOneTitle&&t.plusOneTitle.getAttribute("data-aria-sg")+" ",t.onModelUpdate=function(){var n=t.model.getCurrentMediaContent();t.isContentValid(n)&&(t.imageControl.style.backgroundImage='url("'+n.ImageContent.Image.Url+'")',t.imageControlLink.href=n.ImageContent.BackstageUrl,t.titleControl.textContent=n.ImageContent.Caption,t.descriptionControl.textContent=n.ImageContent.Description,t.copyrightControl.textContent=n.ImageContent.Copyright,t.imageDate.textContent=n.FullDateString,t.plusOneMainText.textContent="",t.plusOneTitle.textContent="",t.plusOneLink.classList.remove("sg"),n.ImageContent.MapLink&&n.ImageContent.MapLink.Url?(t.mapModule.style.backgroundImage='url("'+n.ImageContent.MapLink.Url+'")',t.mapModule.href=n.ImageContent.MapLink.Link,t.mapModule.classList.remove("text"),t.setAriaLabel(t.plusOneModule,"Map of "+n.ImageContent.Caption),Utils.hide(t.plusOneLink),Utils.show(t.mapModule)):n.ImageContent.QuickFact?(t.plusOneTitle.textContent=t.factAriaLabel,t.plusOneMainText.textContent=n.ImageContent.QuickFact.MainText,t.setAriaLabel(t.plusOneModule,n.ImageContent.QuickFact.MainText),n.ImageContent.QuickFact.LinkText?(t.plusOneLink.innerHTML=n.ImageContent.QuickFact.LinkText,t.plusOneLink.href=n.ImageContent.QuickFact.LinkUrl,Utils.show(t.plusOneLink)):Utils.hide(t.plusOneLink),t.plusOneLink.classList.remove("p1l"),t.plusOneLink.classList.add("p1qf"),Utils.show(t.plusOneMainText),Utils.show(t.plusOneTitle),Utils.hide(t.mapModule)):n.ImageContent.SocialGood&&(t.plusOneTitle.textContent=t.sgAriaLabel,t.plusOneMainText.textContent=n.ImageContent.SocialGood.MainText,t.plusOneTitle.classList.add("sg"),t.setAriaLabel(t.plusOneModule,n.ImageContent.SocialGood.MainText),t.plusOneLink.href=n.ImageContent.SocialGood.ButtonUrl,t.plusOneLink.innerHTML=n.ImageContent.SocialGood.IsDonate?t.plusOneLink.getAttribute("data-dn"):t.plusOneLink.getAttribute("data-lm"),t.plusOneLink.classList.add("p1l"),t.plusOneLink.classList.remove("p1qf"),Utils.show(t.plusOneMainText),Utils.show(t.plusOneTitle),Utils.hide(t.mapModule),Utils.show(t.plusOneLink)))},t.isContentValid=function(n){return(n&&t.imageControl&&t.titleControl&&t.copyrightControl&&t.descriptionControl&&t.plusOneModule&&t.plusOneTitle&&t.plusOneMainText&&t.plusOneLink)!=null},t.onModelUpdate(),t}return __extends(t,n),t}(UpdatableComponent);new ImageModule;__extends=this&&this.__extends||function(){var n=function(t,i){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,t){n.__proto__=t}||function(n,t){for(var i in t)t.hasOwnProperty(i)&&(n[i]=t[i])},n(t,i)};return function(t,i){function r(){this.constructor=t}n(t,i);t.prototype=i===null?Object.create(i):(r.prototype=i.prototype,new r)}}();ContentControls=function(n){function t(){var t=n.call(this)||this;return t.imgCont=Utils.getElement(HomepageSelectors._IMAGE_CONT),t.imgContUhd=Utils.getElement(HomepageSelectors._IMAGE_CONT_UHD),t.leftNavControl=Utils.getElement(HomepageSelectors._LEFT_NAV),t.rightNavControl=Utils.getElement(HomepageSelectors._RIGHT_NAV),t.museumCard=Utils.getElement(HomepageSelectors._MUSEUM_CARD),t.preloadImageLink=Utils.getElement(HomepageSelectors._PRELOAD_IMAGE_LINK),t.video=Utils.getElement(HomepageSelectors._VIDEO),t.videoControl=Utils.getElement(HomepageSelectors._VIDEO_CONTROL),t.audio=Utils.getElement(HomepageSelectors._AUDIO),t.audioControl=Utils.getElement(HomepageSelectors._AUDIO_CONTROL),t.attachHandlers=function(){Utils.getElement(HomepageSelectors._VIDEO_CONTROL).addEventListener("click",t.toggleVideoPlayState);Utils.getElement(HomepageSelectors._AUDIO_CONTROL).addEventListener("click",t.toggleMute);t.leftNavControl.addEventListener("click",function(){t.model.movePrev()});t.rightNavControl.addEventListener("click",function(){t.model.moveNext()});t.museumCard.addEventListener("mouseenter",t.showMuseumCard);t.museumCard.addEventListener("mouseleave",t.hideMuseumCard);t.handleMediaEnded(t.video,t.videoControl);t.handleMediaEnded(t.audio,t.audioControl)},t.handleMediaEnded=function(n,t){n&&!n.loop&&t&&n.addEventListener("ended",function(){t.classList.remove("on")})},t.toggleVideoPlayState=function(){var n=t.model.getCurrentMediaContent();t.toggleMedia(n.VideoContent,t.video,t.videoControl)},t.toggleMute=function(){var n=t.model.getClientSettings();n.Mute=!n.Mute;t.model.updateClientSettings()},t.toggleMedia=function(n,i,r){i.paused?t.playMedia(n,i,r):t.pauseMedia(n,i,r)},t.playMedia=function(n,i,r){if(i&&r&&n&&n.Enabled){i.paused&&(i.loop=n.Loop,i.play(),Instrument.logInfo("media","state","play"),Instrument.logClick("HpMedia","Play",!1));var u=t.model.getClientSettings();r.classList.add("on");n.PlayState=!0;i.muted=u.Mute;u.Ap=!0;t.model.updateClientSettings(!1)}},t.pauseMedia=function(n,i,r){if(i&&r&&n){(!i.paused||i.autoplay)&&(i.loop=n.Loop,i.pause(),Instrument.logInfo("media","state","pause"),Instrument.logClick("HpMedia","Pause",!1));var u=t.model.getClientSettings();r.classList.remove("on");n.PlayState=!1;i.muted=u.Mute;u.Ap=!1;t.model.updateClientSettings(!1)}},t.onModelUpdate=function(){if(t.museumCard){var n=t.model.getCurrentMediaContent();Utils.fetchImageUrl(n,t.updateImageContent);t.updateAudioContent(n);t.updateVideoContent(n);t.updateNavigation()}},t.updateImageContent=function(n,i,r){var c;r===void 0&&(r=!1);var u=n.ImageContent,o=Utils.getElement(HomepageSelectors._HEADLINE),y=Utils.getElement(HomepageSelectors._HEADLINELINK),s=Utils.getElement(HomepageSelectors._MUSEUM_CARD_TITLE),p=Utils.getElement(HomepageSelectors._COPYRIGHT),l=Utils.getElement(HomepageSelectors._DOWNLOAD_TEXT),f=Utils.getElement(HomepageSelectors._DOWNLOAD_LINK),e=Utils.getElement(HomepageSelectors._VS_DOWNLOAD_LINK),a=Utils.getElement(HomepageSelectors._LEARN_MORE);if(u&&t.imgCont&&t.imgContUhd&&o&&s&&l&&f){var h=r?t.imgContUhd:t.imgCont,w=n.VideoContent&&(n.VideoContent.Enabled||!n.VideoContent.Poster),v=w?"":'url("'+i+'")';h.style.backgroundImage!=v&&(h.style.backgroundImage=v);r&&(h.style.opacity="1");o.innerText=u.Headline?u.Headline:o.innerText;y.href=u.BackstageUrl;s.innerText=u.Title;s.href=u.BackstageUrl;p.innerText=u.Copyright;t.model.hasVerticalScroll()&&a&&(a.href=u.BackstageUrl);f&&(c=f.getAttribute(u.Image.Downloadable?"data-alt":"data-disalt"),f.href=u.Image.Downloadable?u.Image.Wallpaper:"#",l.innerText=c,u.Image.Downloadable?f.classList.remove("disabled"):f.classList.add("disabled"),e&&(e.setAttribute("aria-label",c),e.href=u.Image.Downloadable?u.Image.Wallpaper:"#",u.Image.Downloadable?e.classList.remove("disabled"):e.classList.add("disabled")))}},t.updateAudioContent=function(n){t.updateMediaContent(n.AudioContent,t.audio,t.audioControl)},t.updateVideoContent=function(n){var i=n.VideoContent;t.updateMediaContent(i,t.video,t.videoControl);i&&i.PlayState?t.playMedia(i,t.video,t.videoControl):t.pauseMedia(i,t.video,t.videoControl)},t.updateMediaContent=function(n,i,r){if(i&&r)if(i.pause(),n&&n.Enabled){var u=n.Url||"";i.src!=u&&(i.src=n.Url);i.classList.remove("hide");r.classList.remove("hide");n.HasAudio?(t.audio.classList.remove("hide"),t.audioControl.classList.remove("hide")):n.HasAudio===!1&&(t.audio.classList.add("hide"),t.audioControl.classList.add("hide"))}else i.src="",i.classList.add("hide"),r.classList.add("hide")},t.updateNavigation=function(){t.model.isLast()?Utils.disable(t.leftNavControl):Utils.enable(t.leftNavControl);t.model.isFirst()?Utils.disable(t.rightNavControl):Utils.enable(t.rightNavControl)},t.showMuseumCard=function(){Instrument.logInfo("other","museumCard","show");Instrument.log("Show","MuseumCard");si_T(Utils.getElement(HomepageSelectors._MUSEUM_CARD_HIDDEN_LINK).getAttribute("h"))},t.hideMuseumCard=function(){Instrument.logInfo("other","museumCard","hide");Instrument.log("Hide","MuseumCard")},t.loadMobileImage=function(){if(t.preloadImageLink){var n=new Image;n.onload=function(){Instrument.logImageTimingLegacy(t.preloadImageLink.href)};t.imgCont.style.backgroundImage="url(".concat(t.preloadImageLink.href,")");n.src=t.preloadImageLink.href}},t.onClientSettingsUpdate=function(){var i=t.model.getCurrentMediaContent(),n=null,u=!1,r;i.VideoContent&&i.VideoContent.HasAudio?n=t.video:(n=t.audio,u=n&&n.src!=null);r=t.model.getClientSettings();n&&(n.muted=r.Mute,r.Mute?t.audioControl.classList.remove("on"):(t.audioControl.classList.add("on"),u&&t.playMedia(i.AudioContent,n,t.audioControl)))},t.museumCard&&!_model.IsMobile?(t.attachHandlers(),t.onModelUpdate(),Instrument.logImageTimingLegacy(t.model.getCurrentMediaContent().ImageContent.Image.Url)):_model.IsMobile&&t.loadMobileImage(),t}return __extends(t,n),t}(UpdatableComponent);new ContentControls