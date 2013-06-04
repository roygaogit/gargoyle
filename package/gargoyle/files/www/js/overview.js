/*
 * This program is copyright © 2008-2013 Eric Bishop and is distributed under the terms of the GNU GPL
 * version 2.0 with a special clarification/exception that permits adapting the program to
 * configure proprietary "back end" software provided that all modifications to the web interface
 * itself remain covered by the GPL.
 * See http://gargoyle-router.com/faq.html#qfoss for more information
 */function secondsToString(e){var t=Math.floor(e/86400),n=Math.floor(e%86400/3600),r=Math.floor(e%86400%3600/60);return t+" days, "+n+" hours, "+r+" minutes"}function resetData(){var e=uptime.split(/[\t ]+/)[0],t=Math.floor((totalMemory-freeMemory)*100*10/totalMemory)/10,n=Math.floor(totalMemory*10/1024)/10,r=Math.floor((totalMemory-freeMemory)*10/1024)/10,i=Math.floor((totalSwap-freeSwap)*100*10/totalSwap)/10,s=Math.floor(totalSwap*10/1024)/10,o=Math.floor((totalSwap-freeSwap)*10/1024)/10;wirelessModes=[],wirelessModes.ap="Access Point (AP)",wirelessModes.sta="Client",wirelessModes["ap+sta"]="AP+Client",wirelessModes["ap+wds"]="AP+WDS",wirelessModes.adhoc="Ad Hoc",wirelessModes.disabled="Disabled";var u=getWirelessMode(uciOriginal),a=wirelessModes[u];qosUploadStatus=qosEnabled&&uciOriginal.get("qos_gargoyle","upload","total_bandwidth")!=""?"Enabled":"Disabled",qosDownloadStatus=qosEnabled&&uciOriginal.get("qos_gargoyle","download","total_bandwidth")!=""?"Enabled":"Disabled";var f=uciOriginal.getAllSectionsOfType("system","system");setChildText("device_model",model),setChildText("device_name",uciOriginal.get("system",f[0],"hostname")),setChildText("gargoyle_version",gargoyleVersion),setChildText("memory",""+r+"MB / "+n+"MB ("+t+"%)"),s>0?(document.getElementById("swap_container").style.display="block",setChildText("swap",""+o+"MB / "+s+"MB ("+i+"%)")):document.getElementById("swap_container").style.display="none",setChildText("load_avg",loadAvg),setChildText("connections",curConn+"/"+maxConn),setChildText("uptime",secondsToString(e)),setChildText("current_time",currentTime);var l=getBridgeSection(uciOriginal);setChildText("device_config",l==""?"Gateway":"Wireless Bridge/Repeater");if(l==""){document.getElementById("bridge_container").style.display="none",setChildText("lan_ip",currentLanIp),setChildText("lan_mask",currentLanMask),setChildText("lan_mac",currentLanMac),uciOriginal.get("network","wan","")==""&&(document.getElementById("wan_container").style.display="none"),setChildText("wan_ip",currentWanIp==""?"-":currentWanIp),setChildText("wan_mask",currentWanMask==""?"-":currentWanMask),setChildText("wan_mac",currentWanMac==""?"-":currentWanMac),setChildText("wan_gateway",currentWanGateway==""?"-":currentWanGateway);var c=wanDns.split(/[\t ]+/);c.length>0&&setChildText("wan_dns",c.shift()),wanDns==""&&setChildText("wan_dns","-");while(c.length>0){var h=document.createElement("br"),p=document.createElement("span"),d=document.createElement("span");p.className="leftcolumn",p.appendChild(document.createTextNode("invisible")),p.style.visibility="hidden",d.className="rightcolumn",d.appendChild(document.createTextNode(c.shift())),document.getElementById("wan_dns_container").appendChild(h),document.getElementById("wan_dns_container").appendChild(p),document.getElementById("wan_dns_container").appendChild(d)}uciOriginal.get("network","wan","proto")!="pppoe"?document.getElementById("wan_pppoe_container").style.display="none":setChildText("wan_pppoe_uptime",typeof pppoeUptime!="undefined"?secondsToString(pppoeUptime):"Disconnected"),uciOriginal.get("network","wan","proto")!="3g"&&(document.getElementById("wan_3g_container").style.display="none"),wifi_status.toString().length==0&&u!="disabled"?setChildText("wireless_mode",a+" (disabled)"):setChildText("wireless_mode",a);if(u!="disabled"){var v=uciOriginal.getAllSectionsOfType("wireless","wifi-iface"),m=[],g=null,y=!1,b;for(b=0;b<v.length;b++){var w=v[b],E=uciOriginal.get("wireless",w,"ssid"),S=uciOriginal.get("wireless",w,"mode");if(S=="ap"){var x=uciOriginal.get("wireless",w,"device"),T="G";x!=""&&uciOriginal.get("wireless",x,"hwmode")=="11na"&&(T="A"),m[T]==null&&(m[T]=E)}else otherIsSsid=S=="sta",g=E}m["G"]==null&&m["A"]==null?(document.getElementById("wireless_apssid_div").style.display="none",document.getElementById("wireless_apssid_5ghz_div").style.display="none"):m["G"]!=null&&m["A"]!=null?(document.getElementById("wireless_apssid_div").style.display="block",document.getElementById("wireless_apssid_5ghz_div").style.display="block",setChildText("wireless_apssid_label","2.4 GHz Access Point SSID:"),setChildText("wireless_apssid",m.G),setChildText("wireless_apssid_5ghz",m.A)):(document.getElementById("wireless_apssid_div").style.display="block",document.getElementById("wireless_apssid_5ghz_div").style.display="none",setChildText("wireless_apssid_label","Access Point SSID:"),setChildText("wireless_apssid",m["G"]==null?m.A:m.G)),g==null?document.getElementById("wireless_otherssid_div").style.display="none":(setChildText("wireless_otherssid",g),setChildText("wireless_otherssid_label",y?"SSID:":"SSID Joined by Client:"),currentWirelessMacs.length>0&&y&&setChildText("wan_mac",currentWirelessMacs[0])),setChildText("wireless_mac",currentWirelessMacs.length>0?currentWirelessMacs[0]:"-")}else document.getElementById("wireless_mac_div").style.display="none",document.getElementById("wireless_apssid_div").style.display="none",document.getElementById("wireless_apssid_5ghz_div").style.display="none",document.getElementById("wireless_otherssid_div").style.display="none"}else document.getElementById("wan_container").style.display="none",document.getElementById("lan_container").style.display="none",document.getElementById("wifi_container").style.display="none",setChildText("bridge_ip",currentLanIp),setChildText("bridge_mask",currentLanMask),setChildText("bridge_mac",currentLanMac),setChildText("bridge_gateway",uciOriginal.get("network","lan","gateway")),setChildText("bridge_mode",uciOriginal.get("wireless",l,"client_bridge")=="1"?"Client Bridge":"WDS"),setChildText("bridge_ssid",uciOriginal.get("wireless",l,"ssid"));setChildText("qos_upload",qosUploadStatus),setChildText("qos_download",qosDownloadStatus);var N=["Port","Status"],C,k=[];if(ports.length>0){for(C=0;C<ports.length;C++)k.push([ports[C][0],ports[C][1]]);var L=createTable(N,k,"ports_table",!1,!1),A=document.getElementById("ports_table_container");A.firstChild!=null&&A.removeChild(A.firstChild),A.appendChild(L)}};