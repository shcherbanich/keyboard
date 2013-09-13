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
			var o=this.data('keyboard');
			return o.lang=n,this.keyboard('build');
		},
		theme:function(n){
			var o=this.data('keyboard');
			return o.theme=n,this.keyboard('_setTheme');
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
			var o=this.data('keyboard');
			return o.display.splice(o.caretPosition,0,l),++o.caretPosition,this.keyboard('_setDisplay');
		},
		caretPosition:function(num){
			var o=this.data('keyboard'),num=Math.abs(+num),m=o.display.length;
			return (o.caretPosition=num>m?m:num),this.keyboard('_setDisplay');
		},
		display:function(arr){
			var o=this.data('keyboard');
			return o.display=arr,this.keyboard('_setDisplay');
		},
		_setDisplay:function(){
			return this.keyboard('_getDisplay'),$(this.data('keyboard').selector).find('.display').html(this.keyboard('_getDisplay')),this;
		},
		_getDisplay:function(){
			var o=this.data('keyboard'),i=o.startDisplay,max=i+o.displayLetter,l=o.display.length,display='';max>l?max=l:0;
			for(i;i<max;i++)
				(o.caretPosition==i?display+=o.caretTemplate:0),display+="<div class='letter'>"+o.display[i]+"</div>";
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
										disabled:{},
										showDisabled:true,
										prohibited:['undefined'],
										showDisplay:['button','number','simbol'],
										caretPosition:0,
										startDisplay:0,
										caretTemplate:"<div class='caret'>|</div>",
										onClick:function(){},
										onInit:function(){}
							},object);this.data('keyboard',settings),$(settings.selector).html('<div></div>'),this.keyboard('build'),
							this.keyboard('_setTheme'),settings.onInit.call(this,$(this));return this
		} 
	}
	$.fn.keyboard=function(name){
		return methods[name]?methods[name].apply(this,Array.prototype.slice.call(arguments,1)):typeof name=='object'||!name?methods.init.apply(this,arguments):0
	}
})(jQuery);

$('input').keyboard({selector:'.for-cards',lang:'en',disabled:{en:{1:[2,3,8,0],2:[6,3]}},display:['3','tete','w']})
