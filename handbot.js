const login = require("facebook-chat-api");
var request = require("request");

const HadThreads = new Object();
var ThreadInfos = [];
var ownName = "Anh Vinh";
var auth = { email: "sangkhanhvinhit@gmail.com", password: "250959807Vinh@" };
var reps = [
  {
    que: "best,vãi",
    rep: "có j đâu,cx thường thôi,bình thường,ez vc"
  },{
	que:".,..,...,....",
	rep:". ccj,. cái cc,.,...,...."
  },{
	  que:"mấy h rồi,mấy giờ rồi,mấy h,mấy giờ",
	  rep:'nt éo coi j đc ak'
  },{
	  que:"học,siêng",
	  rep:"chơi game sml đây,học hành m j"
  }
];
var randomrep = ["hihi", "haha", "yeah", "có j hot", "tập trung vào", "rảnh ko", "mấy h rồi", "ghê"];
var repeat = false;
const KEYSIM = "66dfdc38-1bc4-43e3-a8a8-5a9d0b7d7a0f";

login(auth, (err, api) => {
  api.setOptions({
    forceLogin: true, // phê duyệt mọi thông tin đăng nhập :: default-false
    logLevel: "silent", // mức ghi nhận log
    selfListen: false // api tự nhận tin nhắn chính nó :: default=false
    // listenEvents: false, // api.listen handle event
    // updatePresence: false, // Will make api.listen also return presence : default:false
    // pageID: '', // gắn bot này cho page nào
  });
  if (err) return console.error(err);
  // var stopListening = api.listen((err, event)=>{
  api.listen((err, event)=>{
	  // switch(event.type){
		// case "message":
			// if(event.attachments){
			// 	console.log(JSON.parse(event.attachments));
			// }
			if (typeof event.body === "string") {
				if(event.body === '/stop'){
					api.sendMessage("Oke dừng chơi...", event.threadID);
					return stopListening();
				}
        if(event.body === 'nghỉ chơi') {
          api.sendMessage("Oke thì nghỉ chơi...", event.threadID);
          return stopListening();
        }
				api.markAsRead(event.threadID, (err) => {
					if(err) console.log(err);
				});

				if (!HadThreads.hasOwnProperty(event.threadID)) {
					api.getUserInfo(event.threadID, (err, obj) => {
						if (err) return;
						var info = getInfo(obj);
						collectInfo(info);
						if (event.isGroup) {
							api.sendMessage(` Xin chào \n ${ownName} Bận rồi .\n Tôi là robot của ảnh.\n Có gì hot cứ hỏi em .`,
								event.threadID,
								() => {
								addHadThreads(event.threadID);
								addThreadInfos({ id: event.threadID, name: info.name });});
						} else {
							api.sendMessage(` Xin chào .\n ${ownName} Bận rồi .\n Tôi là robot của ảnh.\n Có gì hot cứ hỏi em.`,
							event.threadID,
							() => {
							addHadThreads(event.threadID);
							addThreadInfos({ id: event.threadID, name: info.name });});
						}
					});
				} else {
					if(repeat){
					  try {
						  api.sendMessage(event.body, event.threadID);
					  } catch (error) {}
					}else{
						try {
							var options = {
							  method: 'GET',
							  url: 'http://sandbox.api.simsimi.com/request.p',
							  qs: { key: KEYSIM,
									lc: 'vn',
									ft: '0.0',
									text: encodeURI(event.body) },
							  headers: { 'cache-control': 'no-cache' }};
						  	request(options, function (error, response, body){
								if (!error){
									var rs = JSON.parse(body);
									if(rs.result == "100"){
										api.sendMessage(rs.response, event.threadID);
									}else{
										api.sendMessage(event.body, event.threadID);
									}
								}
						  });
						} catch (error) {}
					}
				}
			};
			// break;
		// case "event":
		// 	console.log(event);
		// 	break;
		// case "typ":
		// 	if(event.isTyping)
		// 	api.sendMessage("đang gõ luôn...", event.threadID);
		// 	break;
		// case "message_reaction":
		// 	break;
	  // }
  })
});

function repSimsimi(que){
	var options = {
		method: 'GET',
		url: 'http://sandbox.api.simsimi.com/request.p',
		qs:
			{ 	key: KEYSIM,
				lc: 'vn',
				ft: '0.0',
				text: encodeURI(que) },
		headers: { 'cache-control': 'no-cache' } };
	var mes = "yeah";
	request(options, function (error, response, body){
		if (error) throw new Error(error);
		var rs = JSON.parse(body);
		if(rs.result == "100"){
			console.log(rs.response);
			mes = rs.response;
		}
	});
	return mes;
}
function rep(question){
	for(let item in reps){
		let qs = item.que.split(',');
		for(let q in qs){
			if(q == question){
				let rs = item.rep.split(',');
				return rs[Math.floor(Math.random() * rs.length)];
			}
		}
	}
	return randomrep[Math.floor(Math.random() * randomrep.length)];
}
function getInfo(obj) {
  let rs = {};
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop) && obj[prop].name) {
      rs.name = obj[prop].name;
    }
    if (obj.hasOwnProperty(prop) && obj[prop].firstName) {
      rs.firstName = obj[prop].firstName;
    }
    if (obj.hasOwnProperty(prop) && obj[prop].thumbSrc) {
      rs.thumbSrc = obj[prop].thumbSrc;
    }
    if (obj.hasOwnProperty(prop) && obj[prop].profileUrl) {
      rs.profileUrl = obj[prop].profileUrl;
    }
    if (obj.hasOwnProperty(prop) && obj[prop].gender) {
      rs.gender = obj[prop].gender;
    }
    if (obj.hasOwnProperty(prop) && obj[prop].alternateName) {
      rs.alternateName = obj[prop].alternateName;
    }
  }
  return rs;
}
function collectInfo(obj) {}
function addThreadInfos(obj) {
  ThreadInfos.push(obj);
}
function addHadThreads(id) {
  HadThreads[id] = true;
}
