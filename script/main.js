function get(id) {
	return document.getElementById(id);
}

function addChat(from, text) {
	get("footer").insertAdjacentHTML("beforebegin", "<div class=chatCons><div class='" + from + " chats'>" + text + "</div></div>");
	scrollTo(0, 999999999);
}

function exit() {
	open(location, '_self').close();
	window.close();
}

function uploaded() {
	var count = get("files").files.length;
	if(count) {
		get("fileCount").style.display = "block";
		get("fileCount").innerHTML = count;
	} else {
		get("fileCount").style.display = "none";
	}
}

function validate() {
	if(get("id").value != "" && (get("text").innerHTML != "" || get("files").files.length != 0)) {
		get("send").style.opacity = "1";
	} else {
		get("send").style.opacity = "0.3";
	}
}

function submit() {
	if(get("send").style.opacity != 1) {
		return;
	}
	
	var text = get("text").innerHTML;
	var files = get("files").files;
	var fileName = "File" + Date.now() + ".zip";
	var size = 0;
	if(text != "") {
		addChat("user", text);
	}
	if(files.length > 0) {
		for(i = 0; i < files.length; i++) {
			size += files[i].size;
		}
		addChat("user", `
     <div class=fileSentCon>
             <div class=fileSent>
                 <i class="fileIcon fas fa-file"></i>
             </div>
             <div class=fileInfo>
                 <div class=fileName>` + fileName + `</div>
                 <div class=fileSize>` + Math.round(size / 1000) + ` kb ZIP</div>
             </div>
             <div class=fileMore>
                <div class=fileMenu>
                    <i class="fas fa-ellipsis-v"></i>
                </div>
                <div class=sent>
                    <i class="fas fa-check"></i>
                </div>
             </div>
           </div>
     `);
	}
	get("chatType").style.display = "none";
	get("typingStatus").style.display = "block";
	var connection;
	try {
		// Opera 8.0+, Firefox, Safari 
		connection = new XMLHttpRequest();
	} catch(e) {
		// Internet Explorer Browsers
		try {
			connection = new ActiveXObject("Msxml2.XMLHTTP");
		} catch(e) {
			try {
				connection = new ActiveXObject("Microsoft.XMLHTTP");
			} catch(e) {
				// Something went wrong
				get("hiddenText").value = text;
				get("keep").submit();
				return;
			}
		}
	}
	var endUrl = "http://allkeep.000webhostapp.com/php/keeper.php";
	var keep = new FormData(get("keep"));
	keep.append("text", get("text").innerHTML);
	keep.append("fileName", fileName);
	connection.open("POST", endUrl);
	connection.send(keep);
	get("text").innerHTML = "";
	get("files").value = "";
	uploaded();
	validate();
	connection.onreadystatechange = function() {
		if(this.readyState == 4){
		    if(this.status == 200) {
			addChat("bot", this.responseText);
		} else{
		    addChat("bot","<b>Error</b><div class= details>Internal error ("+this.status+") has occurred. Part or all of your data may haven't sent. Please try again.</div>");
                }
		    get("chatType").style.display = "block";
		    get("typingStatus").style.display = "none";
	}
};
    
}
