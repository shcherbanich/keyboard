$.keyboard ={
	en:{
		1:['`',{number:'1'},{number:'2'},{number:'3'},{number:'4'},{number:'5'},{number:'6'},{number:'7'},{number:'8'},{number:'9'},{number:'0'},{simbol:'-'},{backspace:'backspace'}],
		2:[{simbol:'"'},'q','w','e','r','t','y','u','i','o','p','','',{enter:'enter'}],
		3:[{simbol:'/'},{simbol:';'},'a','s','d','f','g','h','j','k','l','',''],
		4:[{shift:'shift'},'z','x','c','v','b','n','m','','',{simbol:"_"},{delete:"delete"}],
		5:[{lang:'lang'},{simbol:'@'},{space:" "},{simbol:'.'},{simbol:','},{simbol:'<'},{simbol:'>'}]
	},
	ru:{
		1:['ё',{number:'1'},{number:'2'},{number:'3'},{number:'4'},{number:'5'},{number:'6'},{number:'7'},{number:'8'},{number:'9'},{number:'0'},{simbol:'-'},{backspace:'backspace'}],
		2:[{simbol:'"'},'й','ц','у','к','е','н','г','ш','щ','з','х','ъ',{enter:'enter'}],
		3:[{simbol:'/'},{simbol:';'},'ф','ы','в','а','п','р','о','л','д','ж','э'],
		4:[{shift:'shift'},'я','ч','с','м','и','т','ь','б','ю',{simbol:"_"},{delete:"delete"}],
		5:[{lang:'lang'},{simbol:'@'},{space:" "},{simbol:'.'},{simbol:','},{simbol:'<'},{simbol:'>'}]
	}
};
(function($,undefined){
	var methods = {
		build:function(){
			var o=this.data('keyboard'),display='<div class="display">'+this.keyboard('_getDisplay')+'</div>',key,i=0,name='',d;
			for(var c in $.keyboard[o.lang])
				$.keyboard[o.lang][c].forEach(function(b){
					typeof b == "object"?(key = Object.keys(b),name=b[key]):(key='button',name=b)
					d=o.disabled[o.lang]&&o.disabled[o.lang][c]&&~o.disabled[o.lang][c].indexOf(i),!o.showDisabled&&d?'':display+='<div class="'+key+(d?' disabled':'')+'">'+name+'</div>',++i		
				}),i=0
			return $(o.selector).children('div').html(display),this;
		},
		lang:function(n){
			return this.data('keyboard').lang=n,this.keyboard('build');
		},
		theme:function(n){
			return this.data('keyboard').theme=n,this.keyboard('_setTheme');
		},
		disable:function(obj){
			var o=this.data('keyboard');
			return o.disabled=$.extend(obj,o.disabled),this.keyboard('build');			
		},
		getDisabled:function(){
			return this.data('keyboard').disabled
		},
		enable:function(obj){
			var o=this.data('keyboard'),tmp={},j=0;
			for(var c in o.disabled)
				for(var i in o.disabled[c])
					for(j;j<o.disabled[c][i].length;j++)
						obj[c]&&obj[c][i]&&~obj[c][i].indexOf(o.disabled[c][i][j])?0:(((tmp[c]?0:tmp[c]={}),tmp[c][i]?0:tmp[c][i]=[]),tmp[c][i][j]=o.disabled[c][i][j]);				
			return o.disabled=tmp,this.keyboard('build');			
		},
		addLetter:function(l){
			var o=this.data('keyboard'),c=o.caretPosition;
			o.display.length+1<=o.maxLetter&&!~o.prohibited.indexOf(l.toLowerCase())?o.display.splice(c++,0,o.capsLock?l.toUpperCase():l):0;
			return this.keyboard('caretPosition',c);
		},
		deleteLetter:function(l){
			var o=this.data('keyboard'),i=0;
			for(i;i<o.display.length;i++)
				o.display[i]==l?delete o.display[i]:0;
			return o.display=o.display.sort(),this.keyboard('caretPosition',o.caretPosition);
		},
		delete:function(){
			var o=this.data('keyboard'),c=o.caretPosition;
			return o.display.splice(c,1),this.keyboard('caretPosition',c);
		},
		backspace:function(){
			var o=this.data('keyboard'),c=o.caretPosition;
			--c<0?++c:o.display.splice(c,1);
			return this.keyboard('caretPosition',c);
		},
		clear:function(){
			return this.data('keyboard').display=[],this.keyboard('_setDisplay')
		},
		caretPosition:function(num){
			var o=this.data('keyboard'),num=Math.abs(+num),m=o.display.length,c=this.keyboard('_realCaretPosition'),l=o.displayLetter,s=o.startDisplay,r;
			o.caretPosition=num>m?m:num;o.startDisplay=(r=++c-l,c<s+l?(s>c-1?s:(r>=0?r:0)):r)
			return this.keyboard('_setDisplay');
		},
		getCaret:function(){
			return this.data('keyboard').caretPosition;
		},
		left:function(){
			var o=this.data('keyboard'),c=o.caretPosition;
			c?--c:0;
			return this.keyboard('caretPosition',c);
		},
		right:function(){
			var o=this.data('keyboard'),c=o.caretPosition;
			c<o.display.length?++c:0;
			return this.keyboard('caretPosition',c);
		},
		display:function(arr){
			return this.data('keyboard').display=arr,this.keyboard('_removeProhibited').keyboard('_setDisplay');
		},
		maxLetter:function(n){
			return this.data('keyboard').maxLetter=+n,this;
		},
		getText:function(type,s){
			var o=this.data('keyboard'),r,display=[],i=j=0;
			if(o.mask.enter&&o.mask.use)
				for(i;i<o.mask.tpl.length;i++)
					display.push(o.mask.tpl[i]&&o.mask.tpl[i]!='#'?o.mask.tpl[i]:o.display[j++]);
			else
				display=o.display;
			switch(type){
				case 'array':r = display; break;
				case 'implode':r = display.join(s); break;
				default :r = display.join(''); break;
			}
			return r
		},
		enter:function(){
			return this.val(this.keyboard('getText')),this
		},
		capsLock:function(){
			var o=this.data('keyboard');
			return o.capsLock=!o.capsLock,this;
		},
		selector:function(sel){
			return this.data('keyboard').selector=sel,$(sel).html('<div></div>'),this.keyboard('build');
		},
		addProhibited:function(el){
			var o=this.data('keyboard'),i=0;
			(typeof el=='object')?0:el=[el];
			for(i;i<el.length;i++)
				o.prohibited.push(el[i]);
			return this.keyboard('_removeProhibited').keyboard('_setDisplay');
		},
		deleteProhibited:function(el){
			var o=this.data('keyboard'),t,arr=o.prohibited;o.prohibited=[];
			(typeof el=='object')?0:el=[el];
			for(var i in el)
				t=arr.indexOf(el[i]),~t?delete arr[t]:0;
			return o.prohibited = arr.sort(),this;
		},
		changeTextLang:function(pLang,lang){
			var o=this.data('keyboard'),i=0,t;
			lang?0:(lang=pLang,pLang=o.lang);
			if(!$.keyboard[pLang]||!$.keyboard[lang])
				return this;
			for(i;i<o.display.length;i++)
				for(var c in $.keyboard[pLang])
					t=$.keyboard[pLang][c].indexOf(o.display[i]),~t?o.display[i]=$.keyboard[lang][c][t]:0;
			return this.keyboard('_removeProhibited').keyboard('_setDisplay');
		},
		toLower:function(){
			var o=this.data('keyboard'),i=0;
			for(i;i<o.display.length;i++)
				o.display[i]=o.display[i].toLowerCase();
			return this.keyboard('_setDisplay');
		},
		toUpper:function(){
			var o=this.data('keyboard'),i=0;
			for(i;i<o.display.length;i++)
				o.display[i]=o.display[i].toUpperCase();
			return this.keyboard('_setDisplay');
		},
		merge:function(start,end){
			var o=this.data('keyboard'),l=o.display.length;
			!end&&!start?(start=0,end=l-1):((start<0?start=0:0),end>l?end=l-1:0);
			if(start<end){
				for(var i=start+1;i<=end;i++)
					(o.display[start]+=''+o.display[i]);
				o.display.splice(++start,++end-start);
			}
			else
				return this;		
			return this.keyboard('caretPosition',o.caretPosition);		
		},
		separation:function(num){
			var o=this.data('keyboard'),arr = o.display[num].split(''),tmp=[],i=0,c=o.caretPosition;
			for(i;i<o.display.length;i++)
				i==num&&arr.length>1?((tmp=tmp.concat(arr)),c>num?c+=arr.length:0):tmp.push(o.display[i])
			return o.display=tmp,this.keyboard('caretPosition',c);
		},
		_realCaretPosition:function(){
			var o=this.data('keyboard'),n=i=j=0,e=i+o.displayLetter,pos=0;/*?*/
			if(o.mask.use){	
				for(i;i<o.mask.tpl.length;i++){
					if(o.mask.tpl[i]!='#'){
						++n;
					}
					else if(o.caretPosition==j++){
						pos = n+o.caretPosition;
						console.log('поз: '+pos,n,o.caretPosition)
						break;
					}
				}
			}
			else
				pos=o.caretPosition;
				console.log(pos)
			return pos;				
		},
		_removeProhibited:function(){
			var o=this.data('keyboard'),i=0,arr=[];
			for(i;i<o.display.length;i++)
				~o.prohibited.indexOf(o.display[i])?0:arr.push(o.display[i]);
			return o.display=arr,this;	
		},
		_setCaretPosition:function(obj){
			var pos = 0;
			obj.focus(); 
			if(obj.selectionStart) 
				pos = obj.selectionStart; 
			else if (document.selection) 
				try{
					var sel = document.selection.createRange(),clone = sel.duplicate();sel.collapse(true);
					clone.moveToElementText(obj),clone.setEndPoint('EndToEnd', sel),pos = clone.text.length; 
				}catch(e){
					pos=0;
				}
			return this.keyboard('caretPosition',pos);
		},
		_setDisplay:function(){
			return $(this.data('keyboard').selector).find('.display').html(this.keyboard('_getDisplay')),this;
		},
		_getDisplay:function(){
			var o=this.data('keyboard'),i=j=o.startDisplay,e=i+o.displayLetter,max=i+o.displayLetter,l=o.display.length,display='',d;max>l?max=l:0;
			if(o.mask.use)	
				for(i;i<e;i++)
					o.mask.tpl[i]!='#'?display+="<div class='letter mask'>"+o.mask.tpl[i]+"</div>":((o.caretPosition==j?display+=o.caretTemplate:0),d=o.display[j++],d?(!~o.prohibited.indexOf(d)?display+="<div class='letter'>"+d+"</div>":--i):display+="<div class='letter maskSpace'>_</div>");
			else
				for(i;i<=max;i++)
					(o.caretPosition==i?display+=o.caretTemplate:0),d=o.display[i],d&&!~o.prohibited.indexOf(d)?display+="<div class='letter'>"+d+"</div>":0;
			return display;
		},
		_setTheme:function(){
			var o=this.data('keyboard');
			return o.selector?$(o.selector).children('div').removeClass().addClass(o.theme):0,this;
		},
		init:function(object){
			var settings = $.extend({
										selector:'',
										lang:'en',
										display:[],
										theme:'default',
										maxLetter:1000,
										displayLetter:17,
										capsLock:false,
										disabled:{},
										showDisabled:true,
										prohibited:[],
										showDisplay:['button','number','simbol'],
										caretPosition:0,
										startDisplay:0,
										mask:{
												use:true,
												enter:true,
												number:9,
												tpl:"+7(###)###-##-##"
										},
										caretTemplate:"<div class='letter caret'>|</div>",
										onClick:function(self,selector,data){},
										onInit:function(self){}
							},object),obj=this;this.data('keyboard',settings),$(settings.selector).html('<div></div>'),this.keyboard('build'),
							this.keyboard('_setTheme'),settings.onInit.call(this,$(this));settings.display?$(this).val(settings.display.join('')):0;return $(this).click(function(){obj.keyboard('_setCaretPosition',this)})
		} 
	}
	$.fn.keyboard=function(name){
		return methods[name]?methods[name].apply(this,Array.prototype.slice.call(arguments,1)):typeof name=='object'||!name?methods.init.apply(this,arguments):0
	}
})(jQuery);
console.time('start')
$('input').keyboard({selector:'.for-cards',lang:'en',disabled:{en:{1:[2,3,8,0],2:[6,3]}},display:['3','п','р','и','в','е','т','!'],prohibited:['a','f','h','i'],displayLetter:5})
console.timeEnd('start')
