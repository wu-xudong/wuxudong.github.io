$(function(){
	//设计“word对象”的数据结构，并用对象的方法实现初步的代码组织
	//en6为全局变量，由大学英语6级词汇形成字符串，组成数组，结构如下：
	//var en6=["a/ei/art.一(个)；每一(个)；(同类事物中)任一个", ...]
	 var myWord = {
		  id: 0 ,
		  en: "" ,
		  pn: "" ,
		  cn: "" ,
	    getWord: function(id){
		    var id = id || this.id ;
			var wordArr = en6[id].split("/") ;
			this.en = wordArr[0];
			this.pn = wordArr[1];
			this.cn = "" ;
	      for (var i=2 ; i < wordArr.length; i++){
	         this.cn += wordArr[i] ;
	       }
		  } ,//end of getWord Method
		 showWord : function(id){
	       var id = id || this.id ;
			      this.getWord(id);
			 var  enDom = $("article#word input#en")[0] ;
	       var  pnDom = $("article#word p#pn")[0]  ;
		     var  cnDom = $("article#word p#cn")[0] ;
		     enDom.value = this.en ;
			 pnDom.textContent = "【" + this.pn + "】";
			 cnDom.textContent = this.cn ;
		 } //end of showWord Method
	 };//end of myWord Object
	
	//建立一个模型对象，模拟和记录APP的运行状态
	var Model = {
	  learnWords : [] , //学习单词的id组成的数组
		learnId : 0 ,
		status: "" ,
		myImages: null ,
	  showHelp: function(){
		 var helpInfoDom = $("article#help p#textInfo")[0] ;
		 var helpInfo = "" ;
		 switch (this.status){
		  case "" : helpInfo = "You have not set any button of the Menu Bar . " ; break ;
	    case "read" : helpInfo = "你选择了 " + "读一读" + "模式  . 已经为您选择10个单词，点击单词区下一个按钮继续……" ; break ;
		  case "write" : helpInfo = "你选择了 " + "写一写" + " 模式 . 输入单词后，点击确认按钮查看结果，点击下一个按钮，切换单词。" ; break ;
	    case "select" : helpInfo = "你选择了 " + "选一选" + " 模式 . 点击中文选项回答，点击下一个切换单词……" ; break ;
		  case "search" : helpInfo =  "你选择了 " + "\"搜一搜\"模式！" + "输入你要搜的英文，点击确认按钮，确认搜索词，" + "再点击下一个按钮，就可逐个查看搜到的类似单词。" ; break ;
	    case "listen" : helpInfo = "你选择了 " + "听一听" + " 模式！.这个功能正在开发中,目前只能听傲慢与偏见的原文朗读…… " ; break ;
		 }
		 helpInfoDom.textContent = helpInfo ;
		 //为每次反馈的帮助，换一个图片背景
		 var backPicDom =  $("article#help div#backPic")[0] ;
	   var randInt =  Math.floor(Math.random()*7) ;
		 var childDom = $("img")[0];
	   backPicDom.removeChild(childDom);
	   backPicDom.appendChild(this.myImages[randInt]);
		},//End of showHelp
	 similarWords: [],
		nowSimilarId: 0,
	}; //End of  Model 
	
	 for (var i=0; i < 10 ; i++){
		   var randInt = Math.floor(Math.random()*en6.length) ;
	     Model.learnWords.push(randInt);
	 }//每次循环产生10个随机单词放在 Model 模型中
	
	
	// //动态控制UI，包括：针对不同屏幕的字体大小设置，主区域的高度设置
	//   var fontSize =  Math.floor(window.innerWidth/100) ;
		
	// 	switch (fontSize){
	//    case 17 :	 case 16 :	 case 15 : 
	// 	 case 14 :	 case 13 : 	 case 12 :
	// 	 case 11 : fontSize =  fontSize*1.5 ; break;
	//    case 10 : 
	//    case 9 :  fontSize =  fontSize*1.8 ; break;
	//    case 8 :  
	//    case 7 :  fontSize =  fontSize*2 ; break;
	//    case 6 :  
	//    case 5 :  fontSize =  fontSize*2.5 ; break;
	//    case 4 : 
	// 	 case 3 : fontSize =  fontSize*3 ; break;
	// 	 default: fontSize =  fontSize*3; 
	// 	}
	// 	document.body.style.fontSize = fontSize + "px" ;
	/*自适应屏幕高度 让footer正好在底部 */
	var sectionHeight =  window.innerHeight - 180 - 40;//让section尽量填满剩余的纵向空间，最后的30这个数字没有依据，仅凭经验来设置为30px。
	$("section").css("height",sectionHeight+"px");
	
	
	
	//将图片文件导入内存变量，用Model对象的属性实现访问，每次打开页面或用户点击菜单按钮，则随机在帮助区显现一张图片。
	var myImages = [] ;//图像对象 组成的 数组
	for (var i=1; i<8; i++ ){
	  	   var img = new Image();
	  	   img.src = "images/" + i + ".jpg" ;
	  	   //img.style.opacity = "0.5" ;
	  	   myImages.push(img) ;
	}
	    Model.myImages = myImages ;//把图片集传给Model对象，提供使用
	var backPicDom =  $("article#help div#backPic")[0] ;
	var randInt =  Math.floor(Math.random()*7) ;
	backPicDom.appendChild(myImages[randInt]);
	
	
	
	/*
	 下面统一使用Dom元素的addEventListener API方法，实现事件监听，这是现代Web 浏览器的标准。
	 与给Dom元素属性事件赋值相比，addEventListener方法可以对一个事件，反复叠加使用多个函数监听。
	 代码在前面使用了对按钮的onclick事件赋值，实现交互样式变化，下面若再对按钮使用onclick事件赋值，则会清除变化样式的函数。
	*/
	
	$("nav span#read")[0].addEventListener("click", function(){
		 Model.status = this.id ;
		 Model.showHelp();
		 $("article#word h1").text("当前单词");
		 $("article#word input#en").val("ability");
		 $("article#word p#pn").text("/ ə'biliti /");
		 $("article#word p#cn").text("n.能力；本领；才能，才干；专门技能，天资");
		 
		 
		 var okDom = $("section article#word nav span#ok")[0];
	 	 okDom.onclick = function(){};//读一读没有确认需求，清除其他模式的，确认按钮代码
	
		$("nav span#next").click(function(){
			var learn = Model.learnWords ;
			var id = learn[Model.learnId] ;
			
			//console.log("en6:" + id);
			$("article#word h1").text("NO. " + (Model.learnId+1) + " / " + "单词 ID : "+ id) ;
			myWord.showWord(id);
			if (Model.learnId + 1 === learn.length){
				Model.learnId  = 0 ;
			}else{
			   Model.learnId ++ ;
			}
		}); //end of function nextDom.onclick
		 },false);//End nav span#read".addEventListener "click"
		 
		 
		 $("nav span#write")[0].addEventListener("click", function(){
		 	 Model.status = this.id ;
		 	 Model.showHelp();
		 	
		    Model.learnId  = 0 ;
		    $("article#word h1").text("请输入英文单词！" ) ;
		    myWord.getWord(Model.learnWords[Model.learnId]);
		    myWord.showWord(Model.learnWords[Model.learnId]);
		    $("article#word input#en").val("") ;
		    var nextDom = $("section article#word nav span#next")[0];
		    var okDom = $("section article#word nav span#ok")[0];
		 
		  	 okDom.onclick = function(){
		      var inputEnDom = $("section article#word input#en")[0];
		 	   var inputs = inputEnDom.value.trim() ;
		 	   if (inputs === myWord.en){
		      $("article#word h1")[0].textContent = "非常正确： " + inputs ;
		 	  }else{
		 	   $("article#word h1")[0].textContent = "错误, 正确： " + myWord.en ;
		 	  }
		 	 }//处理okDom.onclick结束
		    nextDom.onclick = function(){
		     Model.learnId < Model.learnWords.length - 1 ?  Model.learnId ++ : Model.learnId = 0 ;
		     $("article#word h1")[0].textContent = "请输入英文单词！" ;
		     myWord.getWord(Model.learnWords[Model.learnId]);
		     myWord.showWord(Model.learnWords[Model.learnId]);
		     $("article#word input#en")[0].value = "" ;
		     }//处理空格键结束
		 	 },//end of nav span#write click
		 	false);//end of 写一写 nav span#write
		  
		 
		 $("nav span#select")[0].addEventListener("click", function(){
		 	 Model.status = this.id ;
		 	 Model.showHelp();
		    
		 	 Model.learnId = 0 ;
		 	 myWord.showWord(Model.learnWords[Model.learnId]);
		 	 //Model.learnWords是一个数组，存放抽取的10个单词用于的id，（id可以通过myWord对象的getWord(id)和showWord(id)方法使用）
		 	 $("article#word h1")[0].textContent = "为英文单词，选择正确中文含义！" ;
		    var nextDom = $("section article#word nav span#next")[0];
		    var okDom = $("section article#word nav span#ok")[0];
		    okDom.onclick = function(){} ;
		    showSelection() ;
		   function showSelection(){
		 	  var parent = $("article#word p#cn")[0] ;
		     parent.textContent = "" ;//清除单词中文区的所有内容
		     for (var i=0; i<3 ; i++) {
		 		  var pDom = document.createElement("p");
		         pDom.textContent = "临时文字内容" ;
		         parent.appendChild(pDom);
		     }
		 	 var cn = $("section article#word p#cn p");
		    var bingo = Math.floor(Math.random()*3) ;
		 	 for (var i=0; i<3 ; i++){
		 		 if (bingo ===i){
		 			 myWord.getWord(Model.learnWords[Model.learnId]);
		 			 cn[i].textContent = myWord.cn ;
					 cn[i].bingo = "ok" ;
		 			 en.textContent = myWord.en ;
		 		 }else{
		 			 var j = Math.floor(en6.length*Math.random());
		 			 myWord.getWord(j);
		 		     cn[i].textContent = myWord.cn ; 
		            cn[i].bingo = "wrong" ;
		 		 }
		 		 cn[i].onclick = function(){
		 		    if (this.bingo ==="ok"){
		 				$("article#word h1")[0].textContent ="Congratulation! 答对了。";
		 		    }else{
		 			    $("article#word h1")[0].textContent ="Sorry, you are wrong!";
		 			}
		 		 };//end of 选项 的click
		 	  }//end of for loop
		 	}////end of showSelection function
		    nextDom.onclick = function(){
		 	  if (Model.learnId === Model.learnWords.length -1){
		      Model.learnId = 0 ;
		 	  }else{
		 		  Model.learnId ++ ;
		 	   }
		 	   myWord.showWord(Model.learnWords[Model.learnId]);
		 	   $("article#word h1")[0].textContent = "为英文单词，选择正确中文含义！" ;
		      showSelection();
		 	  }//nextDom.onclick切换到下一单词
		 	}//end of select menu 
		 	,false);//end of 选一选 nav span#select
			
			
			
			$("nav span#listen")[0].addEventListener("click", function(){
				 Model.status = this.id ;
				 Model.showHelp();
				 $("article#word h1")[0].textContent = "点击确认钮，可实现音频播放的开/关！" ;
			    $("article#word input#en")[0].value = "Jane Autin" ;
			    $("article#word p#pn")[0].textContent = "Pride And Prejudice" ;
			    $("article#word p#cn")[0].textContent = "原文音频，点击确认" ;
				 var nextDom = $("section article#word nav span#next")[0];
			   var okDom = $("section article#word nav span#ok")[0];
				var voice = new Audio();
				var i = 1 ;
				var path ="http://lijianhong.top/mp3/pride and prejudice 0" ;
				voice.src = path + i + ".mp3";
				var playing = false;
				var timer = (new Date()).getTime();
				voice.addEventListener("canplaythrough",function(){
				   var timer1 = (new Date()).getTime();
				   var costTime = timer1 - timer ;
				   console.log("canplaythrough 事件发生在 " + costTime +" ms .");
				    },false);
				okDom.onclick = function(){
					    if (!playing) {
			            voice.play();
					    }else{
						  voice.pause();
						}
			          playing = ! playing ;
					};
			  nextDom.onclick = function(){
				  i++ ;
			    voice.src = path + i + ".mp3";
				  timer = (new Date()).getTime();
				};
				},false);//听一听傲慢与偏见的原文朗读音频
				
				
				//  my$("nav span#search").addEventListener("click", function(){
				  // 	 Model.status = this.id ;
				  // 	 Model.showHelp();
					 
				     var inputEnDom = $("header nav .box input#search_text")[0];
				//   inputEnDom.value = "" ;
				  
				
				//     my$("article#word h1").textContent = "请输入3个字母以上的搜索词" ;
				//     my$("article#word input#en").value = "" ;
				     var nextDom = $("section article#word nav span#next")[0];
				     var okDom = $("header nav .box #search_ok")[0];
				
				 	 okDom.onclick = function(){
						Model.status = this.id ;
						Model.showHelp();
					 $("article#word input#en")[0].value = ""
					$("section article#word p#pn")[0].textContent = "";
					$("section article#word p#cn")[0].textContent = "";
				  	 var inputs = inputEnDom.value.trim() ;
				  	  $("article#word h1")[0].textContent = "你正在搜: " + inputs ;
				  	  var  similar = [] ;
				  	  for (var i=0; i<en6.length ; i++){
				  		  myWord.getWord(i);
				 		 
						  if (myWord.en === inputs || ( inputs.length >=3 && myWord.en.search(inputs)!==-1 ) ) {
				  		      //与输入完全匹配      或者  输入3个以上字母的关键字，并能部分匹配
				  			  similar.push(i) ;
				  		  }
				  	  }//end of en6 loop
				      Model.similarWords = similar ;
						next.onclick = function(){} ;
				     }//处理okDom.onclick结束
					 
					 
				 
				      nextDom.onclick = function(){
				       	 var i =  Model.nowSimilarId ;
				  		 var id = Model.similarWords[i] ;
				  		 myWord.showWord(id);  
					 	if (Model.nowSimilarId <Model.similarWords.length -1){
				          Model.nowSimilarId ++ ;
				         }else{
				  		  Model.nowSimilarId = 0 ;
				  		 }
				  	    }//处理nextDom.onclick结束
						
						
				   	 // }//end of 匿名函数onclick
				//  	,false);// 搜一搜
			
			//实现脚步信息，对当前时间反馈
			var myDate = new Date();
			$("footer")[0].textContent += myDate.getFullYear() +'年' + (myDate.getMonth()+1) +'月' + myDate.getDate() +'日'; 
			
	
})
	

