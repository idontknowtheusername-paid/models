var NeedLogin = new Class({
    Extends: Modal,
    linkSelector: '.need-login',
    closeBtnSelector: '.cancel-default,.icon-close',
    modalId: 'login_modal',
    modalClass: 'modal',
    width: 376,
    height:432,
    afterContentLoaded: function() {
        new CustomForm({container:this.windiv});
    },
    frmsend:function(form) {
        new Request.HTML({
            url:form.action,
            update: this.modalId,
            useSpinner: true,
            onRequest: function(){
            }.bind(this),
            onComplete:function(ret){
                if(this.windiv.getElements('form').length) {
                    this.attachEvents();
                    if(typeof this.afterContentLoaded == 'function')
                        this.afterContentLoaded.bind(this)();
                } else {
                    var link = this.windiv.getElement('#redirect');
                    if(link) {
                        location.href = link.get('href');
                    }
                    else{
                        location.href = location.href;
                    }

                    this.close();
                }
            }.bind(this)
        }).send(form.toQueryString());
    },
});