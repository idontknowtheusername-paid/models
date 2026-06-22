var SidebarEscorts = new Class({
    sp:null,
    holder:'.newest-escorts',
    initialize: function(){
        this.container = $$(this.holder);
        if(this.container.length){
            this.container = this.container[0];
            this.form = $('new-escorts-filter');
            this.sp = new Spinner(this.container);
            this.attachEvents();
        }
    },
    attachEvents: function(afterUpdate){
        var isUpdate = typeof afterUpdate != "undefined" ? afterUpdate : 0;
        if(!isUpdate) {
            var cityContainer = this.form.getElement('select[name="sidebar_city"]');
            cityContainer.addEvent('change', function(){
                this.sendRequest(translateGet(this.form));
            }.bind(this));
            var genderContainer = this.form.getElement('select[name="gender"]');
            genderContainer.addEvent('change', function(){
                this.sendRequest(translateGet(this.form));
            }.bind(this));
        }
        this.container.getElements('.pager a').each(function(el){
            el.addEvent('click', function(e){
                this.sendRequest(el.get('href'));
                e.stop();
            }.bind(this))
        }.bind(this));
        observeElementsInHolder(this.container, 'img[data-src]')
    },
    sendRequest: function(url) {
        this.sp.show(true);
        var req = new Request.HTML({
            url:url,
            update:this.container,
            onComplete: function(){
                this.attachEvents(1);
                scrollToOffset(this.container, 40, 200);
                this.sp.hide(true);
            }.bind(this)
        }).get();
    }
});
var SidebarComments = new Class({
    sp:null,
    holder:'.latest-comments',
    initialize: function(){
        this.container = $$(this.holder);
        if(this.container.length){
            this.container = this.container[0];
            this.sp = new Spinner(this.container);
            this.attachEvents();
        }
    },
    attachEvents: function(){
        this.container.getElements('.pager a').each(function(el){
            el.addEvent('click', function(e){
                this.sendRequest(el.get('href'));
                e.stop();
            }.bind(this))
        }.bind(this));
        observeElementsInHolder(this.container, 'img[data-src]')
    },
    sendRequest: function(url) {
        this.sp.show(true);
        var req = new Request.HTML({
            url:url,
            update:this.container,
            onComplete: function(){
                this.attachEvents();
                scrollToOffset(this.container, 40, 200);
                this.sp.hide(true);
            }.bind(this)
        }).get();
    }
});
var SidebarNews = new Class({
    sp:null,
    holder:'.news',
    initialize: function(){
        this.container = $$(this.holder);
        if(this.container.length){
            this.container = this.container[0];
            this.sp = new Spinner(this.container);
            this.attachEvents();
        }
    },
    attachEvents: function(){
        this.container.getElements('.pager a').each(function(el){
            el.addEvent('click', function(e){
                this.sendRequest(el.get('href'));
                e.stop();
            }.bind(this))
        }.bind(this));
        new Modal({
            linkSelector:'.news .show-more',
            closeBtnSelector: '.icon-close,.cancel-default',
            modalClass: 'modal modal-profile',
            modalId:'view_news_modal',
            width: 590,
            height:265
        });

    },
    sendRequest: function(url) {
        this.sp.show();
        var req = new Request.HTML({
            url:url,
            update:this.container,
            onComplete: function(){
                this.attachEvents();
                this.sp.hide();
            }.bind(this)
        }).get();
    }
});
