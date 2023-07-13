(function(window){if(window.BX.frameCache)return;var BX=window.BX;var localStorageKey="compositeCache";var lolalStorageTTL=1440;var compositeMessageIds=["bitrix_sessid","USER_ID","SERVER_TIME","USER_TZ_OFFSET","USER_TZ_AUTO"];var compositeDataFile="/bitrix/tools/composite_data.php";var sessidWasUpdated=false;BX.frameCache=function(){};if(BX.browser.IsIE8()){BX.frameCache.localStorage=new BX.localStorageIE8}else if(typeof localStorage!=="undefined"){BX.frameCache.localStorage=new BX.localStorage}else{BX.frameCache.localStorage={set:BX.DoNothing,get:function(){return null},remove:BX.DoNothing}}BX.frameCache.localStorage.prefix=function(){return"bx-"};BX.frameCache.init=function(){this.cacheDataBase=null;this.tableParams={tableName:"composite",fields:[{name:"id",unique:true},"content","hash","props"]};this.frameDataReceived=false;this.frameDataInserted=false;if(BX.type.isString(window.frameDataString)&&window.frameDataString.length>0){BX.frameCache.onFrameDataReceived(window.frameDataString)}this.vars=window.frameCacheVars?window.frameCacheVars:{dynamicBlocks:{},page_url:"",params:{},storageBlocks:[]};var e=BX.frameCache.localStorage.get(localStorageKey)||{};for(var a=0;a<compositeMessageIds.length;a++){var t=compositeMessageIds[a];if(typeof BX.message[t]!="undefined"){e[t]=BX.message[t]}}BX.frameCache.localStorage.set(localStorageKey,e,lolalStorageTTL);BX.addCustomEvent("onBXMessageNotFound",(function(e){if(BX.util.in_array(e,compositeMessageIds)){var a=BX.frameCache.localStorage.get(localStorageKey);if(a&&typeof a[e]!="undefined"){BX.message[e]=a[e]}else{BX.frameCache.getCompositeMessages()}}}));if(!window.frameUpdateInvoked){this.update(false);window.frameUpdateInvoked=true}if(window.frameRequestStart){BX.ready((function(){BX.onCustomEvent("onCacheDataRequestStart");BX.frameCache.tryUpdateSessid()}))}if(window.frameRequestFail){BX.ready((function(){setTimeout((function(){BX.onCustomEvent("onFrameDataRequestFail",[window.frameRequestFail])}),0)}))}BX.frameCache.insertBanner()};BX.frameCache.getCompositeMessages=function(){try{BX.ajax({method:"GET",dataType:"json",url:compositeDataFile,async:false,data:"",onsuccess:function(e){BX.frameCache.setCompositeVars(e)}})}catch(e){BX.debug("Composite sync request failed.")}};BX.frameCache.setCompositeVars=function(e){if(!e){return}else if(e.lang){e=e.lang}var a=BX.frameCache.localStorage.get(localStorageKey)||{};for(var t in e){if(e.hasOwnProperty(t)){BX.message[t]=e[t];if(BX.util.in_array(t,compositeMessageIds)){a[t]=e[t]}}}BX.frameCache.localStorage.set(localStorageKey,a,lolalStorageTTL)};BX.frameCache.insertBlock=function(e,a){if(!BX.type.isFunction(a)){a=function(){}}if(!e){a();return}var t=null;var r=null;var s=null;var i="bxdynamic_";if(e.ID.substr(0,i.length)===i){r=BX(e.ID+"_start");s=BX(e.ID+"_end");if(!r||!s){BX.debug("Dynamic area "+e.ID+" was not found");a();return}}else{t=BX(e.ID);if(!t){BX.debug("Container "+e.ID+" was not found");a();return}}var n=false;var o=false;var c=u();f(l);h();m(d);function f(a){var t=c.styles;if(BX.type.isArray(e.PROPS.CSS)&&e.PROPS.CSS.length>0){t=BX.util.array_merge(e.PROPS.CSS,t)}t.length>0?BX.load(t,a):a()}function l(){if(t){if(e.PROPS.USE_ANIMATION){t.style.opacity=0;t.innerHTML=e.CONTENT;new BX.easing({duration:1500,start:{opacity:0},finish:{opacity:100},transition:BX.easing.makeEaseOut(BX.easing.transitions.quart),step:function(e){t.style.opacity=e.opacity/100},complete:function(){t.style.cssText=""}}).animate()}else{t.innerHTML=e.CONTENT}}else{BX.frameCache.removeNodes(r,s);r.insertAdjacentHTML("afterEnd",e.CONTENT)}n=true;if(o){d()}}function h(){if(BX.Type.isStringFilled(c.html)){document.head.insertAdjacentHTML("beforeend",c.html)}BX.evalGlobal(c.inlineJS.join(";"))}function u(){var a={styles:[],inlineJS:[],externalJS:[],html:""};if(!BX.type.isArray(e.PROPS.STRINGS)||e.PROPS.STRINGS.length<1){return a}var t=BX.processHTML(e.PROPS.STRINGS.join(""),false);for(var r=0,s=t.SCRIPT.length;r<s;r++){var i=t.SCRIPT[r];if(i.isInternal){a.inlineJS.push(i.JS)}else{a.externalJS.push(i.JS)}}a.styles=t.STYLE;a.html=t.HTML;return a}function m(a){var t=c.externalJS;if(BX.type.isArray(e.PROPS.JS)&&e.PROPS.JS.length>0){t=BX.util.array_merge(t,e.PROPS.JS)}t.length>0?BX.load(t,a):a()}function d(){o=true;if(n){BX.ajax.processRequestData(e.CONTENT,{scriptsRunFirst:false,dataType:"HTML"});if(BX.type.isArray(e.PROPS.BUNDLE_JS)){BX.setJSList(e.PROPS.BUNDLE_JS)}if(BX.type.isArray(e.PROPS.BUNDLE_CSS)){BX.setCSSList(e.PROPS.BUNDLE_CSS)}a()}}};BX.frameCache.removeNodes=function(e,a){var t=false;var r=e.parentNode;var s=Array.prototype.slice.call(r.childNodes);for(var i=0,n=s.length;i<n;i++){if(t){if(s[i]===a){break}else{r.removeChild(s[i])}}else if(s[i]===e){t=true}}};BX.frameCache.update=function(e,a){a=!!a;e=typeof e=="undefined"?true:e;if(e){this.requestData()}if(!a){BX.ready(BX.proxy((function(){if(!this.frameDataReceived){this.invokeCache()}}),this))}};BX.frameCache.invokeCache=function(){if(this.vars.storageBlocks&&this.vars.storageBlocks.length>0){BX.onCustomEvent(this,"onCacheInvokeBefore",[this.vars.storageBlocks]);this.readCacheWithID(this.vars.storageBlocks,BX.proxy(this.insertFromCache,this))}};BX.frameCache.handleResponse=function(e){if(e==null)return;BX.onCustomEvent("onFrameDataReceivedBefore",[e]);if(e.dynamicBlocks&&e.dynamicBlocks.length>0){this.insertBlocks(e.dynamicBlocks,false);this.writeCache(e.dynamicBlocks)}BX.onCustomEvent("onFrameDataReceived",[e]);if(e.isManifestUpdated=="1"&&this.vars.CACHE_MODE==="APPCACHE"&&window.applicationCache&&(window.applicationCache.status==window.applicationCache.IDLE||window.applicationCache.status==window.applicationCache.UPDATEREADY)){window.applicationCache.update()}if(e.htmlCacheChanged===true&&this.vars.CACHE_MODE==="HTMLCACHE"){BX.onCustomEvent("onHtmlCacheChanged",[e])}if(BX.type.isArray(e.spread)){for(var a=0;a<e.spread.length;a++){(new Image).src=e.spread[a]}}};BX.frameCache.requestData=function(){var e=[{name:"BX-ACTION-TYPE",value:"get_dynamic"},{name:"BX-REF",value:document.referrer},{name:"BX-CACHE-MODE",value:this.vars.CACHE_MODE},{name:"BX-CACHE-BLOCKS",value:this.vars.dynamicBlocks?JSON.stringify(this.vars.dynamicBlocks):""}];if(this.vars.AUTO_UPDATE===false&&this.vars.AUTO_UPDATE_TTL&&this.vars.AUTO_UPDATE_TTL>0){var a=Date.parse(document.lastModified);if(!isNaN(a)){var t=(new Date).getTime();if(a+this.vars.AUTO_UPDATE_TTL*1e3<t){e.push({name:"BX-INVALIDATE-CACHE",value:"Y"})}}}if(this.vars.CACHE_MODE==="APPCACHE"){e.push({name:"BX-APPCACHE-PARAMS",value:JSON.stringify(this.vars.PARAMS)});e.push({name:"BX-APPCACHE-URL",value:this.vars.PAGE_URL?this.vars.PAGE_URL:""})}BX.onCustomEvent("onCacheDataRequestStart");var r=window.location.href;var s=r.indexOf("#");if(s>0){r=r.substring(0,s)}r+=(r.indexOf("?")>=0?"&":"?")+"bxrand="+(new Date).getTime();BX.ajax({timeout:60,method:"GET",url:r,data:{},headers:e,skipBxHeader:true,processData:false,onsuccess:BX.proxy(BX.frameCache.onFrameDataReceived,this),onfailure:function(){window.frameRequestFail={error:true,reason:"bad_response",url:r,xhr:this.xhr,status:this.xhr?this.xhr.status:0};BX.onCustomEvent("onFrameDataRequestFail",[window.frameRequestFail])}})};BX.frameCache.onFrameDataReceived=function(response){var result=null;try{eval("result = "+response)}catch(e){var error={error:true,reason:"bad_eval",response:response};window.frameRequestFail=error;BX.ready((function(){setTimeout((function(){BX.onCustomEvent("onFrameDataRequestFail",[error])}),0)}));return}this.frameDataReceived=true;if(result&&BX.type.isNotEmptyString(result.redirect_url)){window.location=result.redirect_url;return}if(result&&result.error===true){window.frameRequestFail=result;BX.ready(BX.proxy((function(){setTimeout(BX.proxy((function(){BX.onCustomEvent("onFrameDataRequestFail",[result])}),this),0)}),this));return}BX.frameCache.setCompositeVars(result);BX.ready(BX.proxy((function(){this.handleResponse(result);this.tryUpdateSessid()}),this))};BX.frameCache.insertFromCache=function(e,a){if(!this.frameDataReceived){var t=e.items;if(t.length>0){for(var r=0;r<t.length;r++){t[r].PROPS=JSON.parse(t[r].PROPS)}this.insertBlocks(t,true)}BX.onCustomEvent(this,"onCacheInvokeAfter",[this.vars.storageBlocks,e])}};BX.frameCache.insertBlocks=function(e,a){var t=new Set;for(var r=0;r<e.length;r++){var s=e[r];BX.onCustomEvent("onBeforeDynamicBlockUpdate",[s,a]);if(s.PROPS.AUTO_UPDATE===false){continue}t.add(s)}var i=0;var n=function(){if(window.performance){var t=performance.getEntries();for(var r=0;r<t.length;r++){var s=t[r];if(s.initiatorType==="xmlhttprequest"&&s.name&&s.name.match(/bxrand=[0-9]+/)){this.requestTiming=s}}if(window.performance.measure){window.performance.measure("Composite:LCP");var i=performance.getEntriesByName("Composite:LCP");if(i.length>0&&i[0].duration){this.lcp=Math.ceil(i[0].duration)}}}BX.onCustomEvent("onFrameDataProcessed",[e,a]);this.frameDataInserted=true}.bind(this);var o=function(){if(++i===t.size){n()}}.bind(this);if(t.size===0){n()}else{t.forEach((function(e){if(e&&e.HASH&&e.PROPS&&e.PROPS.ID){this.vars.dynamicBlocks[e.PROPS.ID]=e.HASH}this.insertBlock(e,o)}),this)}};BX.frameCache.writeCache=function(e){for(var a=0;a<e.length;a++){if(e[a].PROPS.USE_BROWSER_STORAGE===true){this.writeCacheWithID(e[a].ID,e[a].CONTENT,e[a].HASH,JSON.stringify(e[a].PROPS))}}};BX.frameCache.openDatabase=function(){var e=this.cacheDataBase!=null;if(!e){this.cacheDataBase=new BX.Dexie("composite");if(this.cacheDataBase!=null){this.cacheDataBase.version(1).stores({composite:"&ID,CONTENT,HASH,PROPS"});e=true}}return e};BX.frameCache.writeCacheWithID=function(e,a,t,r){if(BX.frameCache.openDatabase()){if(typeof r=="object"){r=JSON.stringify(r)}this.cacheDataBase.composite.put({ID:e,CONTENT:a,HASH:t,PROPS:r})}};BX.frameCache.readCacheWithID=function(e,a){if(BX.frameCache.openDatabase()){this.cacheDataBase.composite.where("ID").anyOf(e).toArray().then(function(e){a({items:e})}.bind(this))}else if(typeof a!="undefined"){a({items:[]})}};BX.frameCache.insertBanner=function(){if(!this.vars.banner||!BX.type.isNotEmptyString(this.vars.banner.text)){return}BX.ready(BX.proxy((function(){var e=BX.create("a",{props:{className:"bx-composite-btn"+(BX.type.isNotEmptyString(this.vars.banner.style)?" bx-btn-"+this.vars.banner.style:""),href:this.vars.banner.url},attrs:{target:"_blank"},text:this.vars.banner.text});if(BX.type.isNotEmptyString(this.vars.banner.bgcolor)){e.style.backgroundColor=this.vars.banner.bgcolor;if(BX.util.in_array(this.vars.banner.bgcolor.toUpperCase(),["#FFF","#FFFFFF","WHITE"])){BX.addClass(e,"bx-btn-border")}}var a=BX("bx-composite-banner");if(a){a.appendChild(e)}else{BX.addClass(e,"bx-composite-btn-fixed");document.body.appendChild(BX.create("div",{style:{position:"relative"},children:[e]}))}}),this))};BX.frameCache.tryUpdateSessid=function(){if(sessidWasUpdated){return}var e="bitrix_sessid";var a=false;if(typeof BX.message[e]!="undefined"){a=BX.message[e]}else{var t=BX.frameCache.localStorage.get(localStorageKey)||{};if(typeof t[e]!="undefined"){a=t[e]}}if(a!==false){sessidWasUpdated=true;this.updateSessid(a)}};BX.frameCache.updateSessid=function(e){var a=document.getElementsByName("sessid");for(var t=0;t<a.length;t++){a[t].value=e}};BX.frameCache.init()})(window);
//# sourceMappingURL=core_frame_cache.map.js