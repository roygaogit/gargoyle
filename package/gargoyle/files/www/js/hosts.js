/*
 * This program is copyright � 2008-2011 Eric Bishop and is distributed under the terms of the GNU GPL 
 * version 2.0 with a special clarification/exception that permits adapting the program to 
 * configure proprietary "back end" software provided that all modifications to the web interface
 * itself remain covered by the GPL. 
 * See http://gargoyle-router.com/faq.html#qfoss for more information
 */function resetData(){setSelectedValue("refresh_rate","10000"),resetVariables(),setInterval(checkForRefresh,500)}function checkForRefresh(){timeSinceUpdate+=500;var e=getSelectedValue("refresh_rate"),e=e=="never"?timeSinceUpdate+500:e;if(timeSinceUpdate<0||timeSinceUpdate>=e)timeSinceUpdate=0,reloadVariables()}function reloadVariables(){if(!updateInProgress){updateInProgress=!0;var param=getParameterDefinition("commands","sh /usr/lib/gargoyle/define_host_vars.sh")+"&"+getParameterDefinition("hash",document.cookie.replace(/^.*hash=/,"").replace(/[\t ;]+.*$/,"")),stateChangeFunction=function(req){if(req.readyState==4){var jsHostVars=req.responseText.replace(/Success/,"");eval(jsHostVars),resetVariables(),updateInProgress=!1}};runAjax("POST","utility/run_commands.sh",param,stateChangeFunction)}}function resetVariables(){if(uciOriginal.get("dhcp","lan","ignore")!="1"){document.getElementById("dhcp_data").style.display="block";var e=["Hostname","Host IP","Host MAC","Lease Expires"],t=createTable(e,parseDhcp(dhcpLeaseLines),"lease_table",!1,!1),n=document.getElementById("lease_table_container");n.firstChild!=null&&n.removeChild(n.firstChild),n.appendChild(t)}else document.getElementById("dhcp_data").style.display="none";var r=parseArp(arpLines,dhcpLeaseLines),i=!1,s=uciOriginal.getAllSectionsOfType("wireless","wifi-iface"),o=0;for(o=0;o<s.length;o++)i=uciOriginal.get("wireless",s[o],"mode")=="ap"?!0:i;var u=uciOriginal.getAllSectionsOfType("wireless","wifi-device");i=i&&uciOriginal.get("wireless",u[0],"disabled")!="1";if(i){document.getElementById("wifi_data").style.display="block";var e=["Hostname","Host IP","Host MAC","Bitrate","Signal"],t=createTable(e,parseWifi(r,wirelessDriver,wifiLines),"wifi_table",!1,!1),n=document.getElementById("wifi_table_container");n.firstChild!=null&&n.removeChild(n.firstChild),n.appendChild(t)}else document.getElementById("wifi_data").style.display="none";var e=["Hostname","Host IP","Host MAC","Active TCP Cxns","Recent TCP Cxns","UDP Cxns"],t=createTable(e,parseConntrack(r,currentWanIp,conntrackLines),"active_table",!1,!1),n=document.getElementById("active_table_container");n.firstChild!=null&&n.removeChild(n.firstChild),n.appendChild(t)}function getHostname(e){var t=ipToHostname[e]==null?"(unknown)":ipToHostname[e];return t=t.length<25?t:t.substr(0,22)+"...",t}function parseDhcp(e){var t=[],n=0;for(n=0;n<e.length;n++){var r=e[n],i=r.split(/[\t ]+/),s=i[0],o=i[1].toUpperCase(),u=i[2],a=getHostname(u),f=s-currentTime,l=Math.floor(f/3600),c=Math.floor((f-l*60*60)/60);c<10&&(c="0"+c);var h=l+"h "+c+"m";t.push([a,u,o,h])}return sort2dStrArr(t,1),t}function parseArp(e,t){var n=[];e.shift();var r=0;for(r=0;r<e.length;r++){var i=e[r],s=i.split(/[\t ]+/),o=s[3].toUpperCase(),u=s[0];n[o]=u,n[u]=o}for(r=0;r<t.length;r++){var a=t[r],f=a.split(/[\t ]+/),o=f[1].toUpperCase(),u=f[2];n[o]=u,n[u]=o}return n}function sort2dStrArr(e,t){var n=function(e,n){return e[t]==n[t]?0:e[t]<n[t]?-1:1};e.sort(n)}function parseWifi(e,t,n){if(t==""||n.length==0)return[];var r=[],i=0;t=="atheros"&&n.shift();for(i=0;i<n.length;i++){var s=n[i],o=s.split(/[\t ]+/),u=[[o[1],"0","0"],[o[0],o[3],o[5]],[o[0],o[2],o[1]]],a=t=="broadcom"?u[0]:t=="atheros"?u[1]:u[2];a[0]=a[0].toUpperCase(),a[1]=a[1]+" Mbit/s";var f=function(e){var t=parseInt(e).toString(16).toUpperCase();return t=t.length<2?"0"+t:t.substr(0,2),t},l=parseInt(a[2]),c=l<-80?"#AA0000":"";c=l>=-80&&l<-70?"#AA"+f(170*((l+80)/10))+"00":c,c=l>=-70&&l<-60?"#"+f(170-170*(l+70)/10)+"AA00":c,c=l>=-60?"#00AA00":c;var h=document.createElement("span");h.appendChild(document.createTextNode(a[2]+" dBm")),h.style.color=c,a[2]=h;var p=e[a[0]]==null?"unknown":e[a[0]],d=getHostname(p);r.push([d,p,a[0],a[1],a[2]])}return sort2dStrArr(r,1),r}function parseConntrack(e,t,n){var r=[],i=[],s=[],o=[],u=0;for(u=0;u<n.length;u++){var a=n[u],f=a.split(/src=/),l=f[1],c=l.split(/[\t ]+/),h=c[0];f=a.split(/dst=/);var p=f[1],d=p.split(/[\t ]+/),v=d[0];f=a.split(/[\t ]+/);var m=f[0].toLowerCase();if(m=="tcp"){var g=f[3].toUpperCase(),y=g=="TIME_WAIT"||g=="CLOSE"?"closed":"open";m=m+"-"+y}s[h+"-"+m]=s[h+"-"+m]==null?1:s[h+"-"+m]+1;if(m=="udp")var b=s[h+"-"+m];i[h]==null&&h!=t&&h!=currentLanIp&&v!=t&&h!="0.0.0.0"&&(o.push(h),i[h]=1)}var w=0;for(w=0;w<o.length;w++){var E=o[w],S=e[E]==null?"unknown":e[E],x=s[E+"-tcp-open"]==null?0:s[E+"-tcp-open"],T=s[E+"-tcp-closed"]==null?0:s[E+"-tcp-closed"],N=s[E+"-udp"]==null?0:s[E+"-udp"],C=getHostname(E);r.push([C,E,S,""+x,""+T,""+N])}return sort2dStrArr(r,1),r}var updateInProgress=!1,timeSinceUpdate=-5e3;