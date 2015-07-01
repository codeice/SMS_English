function PicturesShow(opt){
	this.pictureBox = null;
	this.boxHeight = null;
	this.pictureList = null;
	this.listClone = null;
	this.listHeight = 0;
	this.imgs = null;
	this.offset = 0;
	this.cloneOffset = 0;
	this.sibling = null;
	//动画方向，只接受两个值'down','up'
	this.direction = null;
	this.interval = null;
	this.timeoutid = null;
	this.isMove =null;
	this.count = 0;
	this.init(opt);
}
PicturesShow.prototype = {
	bindEvents:function(){
		var that = this;
		$(window).on('resize',function(){
			clearTimeout(this.timeoutid);
			this.timeoutid = setTimeout(function(){
				that.setBoxHeight();
			},100);
		});
		this.imgs.load(function(){
			that.count++;
			var h = $(this).height();
			var pNode = $(this).parent();
			var liNode = pNode.parent();
			liNode.prop('data-height',h);
			var small;
			if(h>=180){
				small = parseInt(h/2);
			}
			else if(h<=90){
				small = h;
			}else{
				small = 90;
			}
			liNode.css('height',small).prop('data-small',small);	
			pNode.css('margin-top',-h/2);
			//当图片加载完成后获取列表高度，设置列表容器的高度	
			if(that.count == that.imgs.length){
				that.pictureList.css('visibility','visible');
				that.listHeight = that.pictureList.height();
				that.cloneUl();
				that.setBoxHeight();
			}
		});
		this.imgs.hover(function(){
			that.removeInterval();
			setTimeout(function(){
				that.removeInterval();
			},250);
			
			var liNode = $(this).parent().parent();
			var small = liNode.prop('data-small');
			var bigger = liNode.prop('data-height');
			that.sibling = that.getUlNode(liNode);
			var offset,h,move=false;
			if(that.sibling.hasClass('clone')){
				if(that.cloneOffset>that.offset){
					move = true;
					offset = that.cloneOffset;
				}	
			}else{
				if(that.offset>that.cloneOffset){
					move = true;
					offset = that.offset;
				}	
			}
			h = offset+bigger-small;
			liNode.stop().animate({'height':bigger},250);
			if(move){
				that.sibling.stop().animate({'top':h},250);
			}			
		},function(){
			var liNode = $(this).parent().parent();
			var small = liNode.prop('data-small');
			var bigger = liNode.prop('data-height');
			// var sibling = that.getUlNode(liNode);
			var offset,h,move=false;
			if(that.sibling.hasClass('clone')){
				if(that.cloneOffset>that.offset){
					move = true;
					offset = that.cloneOffset;
				}	
			}else{
				if(that.offset>that.cloneOffset){
					move = true;
					offset = that.offset;
				}	
			}
			h = offset;
			liNode.stop().animate({'height':small},250);
			if(move){
				that.sibling.stop().animate({'top':h},250);
			}
			if(that.isMove){
				setTimeout(function(){
					that.setIntervaler();
				},250);
			}
		});
		this.imgs.each(function(i,v){
			var src =v.getAttribute('data-src');
			v.setAttribute('src',src);
		});
	},
	getUlNode:function(node){
		return node.parent().siblings();
	},
	setBoxHeight:function(){
		var bh = document.documentElement.clientHeight || document.body.clientHeight
		this.boxHeight = bh-200>600?bh-200:600;
		this.pictureBox.css('height',this.boxHeight);
		// 判断是否需要执行动画	
		if(this.listHeight>600){
			this.isMove = true;
			this.setIntervaler();
		}else{
			this.isMove = false;
		}
	},
	animating:function(){
		if(this.direction=='up'){
			this.offset -= 1;
			this.cloneOffset -= 1;
		}
		else{
			this.offset += 1;
			this.cloneOffset += 1;
		}
		if(this.offset < -this.listHeight){
			this.offset = this.listHeight;

		}
		else if(this.offset > this.listHeight){
			this.offset = -this.listHeight;
		}
		if(this.cloneOffset < -this.listHeight){
			this.cloneOffset = this.listHeight;
		}
		else if(this.cloneOffset > this.listHeight){
			this.cloneOffset = -this.listHeight
		}
		this.pictureList.css('top',this.offset + 'px');
		this.listClone.css('top',this.cloneOffset +'px');
	},
	setIntervaler: function() {
		this.removeInterval();
		var that = this;
		this.interval = setInterval(function() {
			that.animating.call(that)
		}, 20);
	},
	removeInterval: function() {
		if (this.interval) {
			clearInterval(this.interval);
		}
	},
	cloneUl: function(){
		this.listClone = this.pictureList.clone(true);
		this.listClone.addClass('clone');
		this.cloneOffset = this.direction == 'up'?this.listHeight:-this.listHeight;
		this.pictureBox.append(this.listClone);
	},
	init:function(opt){
		this.pictureBox = $('#'+opt.box);
		this.pictureList = this.pictureBox.children('ul');
		if(opt.direction && opt.direction == 'up'){
			this.direction = opt.direction;
		}else{
			this.direction = 'down';
		}
		this.imgs = this.pictureList.find('img');
		this.bindEvents();
	}
}


var rightBox = new PicturesShow({'box':'rightBox','direction':'up'});
var leftBox = new PicturesShow({'box':'leftBox'});