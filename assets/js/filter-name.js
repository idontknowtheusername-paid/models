var FilterByName = new Class({
    options:{
        filterForm: '#filter form'
    },
	initialize: function(options){
        if(options){
            this.options = $merge(this.options, options);
        }
        var form = $$(this.options.filterForm);
        if(form.length)
            this.form = form[0];
        this.timeout = null;
        this.attachEvents();
	},
	attachEvents: function(){
        if(this.form)
            this.form.addEvent('submit', function() {
                this.sendRequest();
            }.bind(this));
        var search = $('search-by-name');
        if(search)
            search.addEvent('keyup', function() {
                this.sendRequest();
            }.bind(this));
        var searchAbout = $('search_about');
        this.timeout = null;
        if(searchAbout)
            searchAbout.addEvent('keyup', function() {
                this.sendRequest();
            }.bind(this));
        new Tips($$('.tooltip'),{'className':'filter-tooltip'});
        var checkFilter = $$('.check-filter');
        if(checkFilter.length){
            checkFilter[0].getElements('input[type="checkbox"]').addEvent('change', function(e){
                this.frmsend(e);
            }.bind(this))
        }
	},
    sendRequest: function() {
        if (this.timeout != null)
            clearTimeout(this.timeout);
        var bindFrmSend = function(){
            this.frmsend();
        }.bind(this);
        this.timeout = setTimeout(bindFrmSend, 500);
    },
	frmsend:function(e) {
        var url = translateGet(this.form);
		History.push(url);
		if(e) {e.stop()};
		return;
	}
});