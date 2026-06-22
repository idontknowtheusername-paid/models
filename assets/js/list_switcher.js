Cubix={};
Cubix.PhotoRoller = {};
Cubix.PhotoRoller.thumb = 'thumb';
Cubix.PhotoRoller.Clear = function() {
    $$('#list_escort .search_user_container .avatar').each(function(el) {
        el.eliminate('photo-roller');
        var img = el.getElement('img');
        img.eliminate('photo');
        img.eliminate('current');
        img.removeEvents('mouseenter');
        img.removeEvents('mouseleave');
    });
};
Cubix.PhotoRoller.Init = function() {
    $$('#list_escort .search_user_container .avatar, .sidebar__gotm .img-container').each(function(el) {
        if (el.retrieve('photo-roller-' + Cubix.PhotoRoller.thumb)) return;
        el.store('photo-roller-' + Cubix.PhotoRoller.thumb, true);
        var img = el.getElement('img');
        if (!img.getAttribute('data-user-id')) return;
        var e_id = img.getAttribute('data-user-id');
        if (!img.retrieve('photo-' + Cubix.PhotoRoller.thumb)) img.store('photo-' + Cubix.PhotoRoller.thumb, img.hasAttribute('data-src')? img.get('data-src') : img.get('src'));

        img.photos = null;
        img.removeEvents('mouseenter');
        img.addEvent('mouseenter', function() {
            img.stop = false;
            $clear(img.timer);
            var handler = function() {
                if(img.hasAttribute('data-src')) {
                    handler.delay(500)
                    return
                }

                if (!img.photos) {
                    var partsSrc = img.get('src').split('/');
                    partsSrc.splice(0, 5);
                    var type = partsSrc.shift();
                    var picture = partsSrc.join('/');
                    new Request({
                        url: '/profiles/escort_pictures/',
                        method: 'post',
                        data:{
                            data:{
                                'id':e_id,
                                'img':picture.split('?').shift(),
                                'type':type,
                            }
                        },
                        onSuccess: function(resp) {
                            resp = JSON.decode(resp, true);
                            if (!resp) {} else if (resp.result == 'error') {
                            } else if (resp.result == 'success') {
                                img.photos =  resp.data;
                                $clear(img.timer);
                                img.timer = (function() {
                                    Cubix.PhotoRoller.Roll(img, img.photos);
                                }).delay(500);
                            }
                        }
                    }).send();
                }
                else{
                    Cubix.PhotoRoller.Roll(img, img.photos);
                }

            };
            img.timer = handler.delay(500);
        });
        img.removeEvents('mouseleave');
        img.addEvent('mouseleave', function(e) {
            $clear(img.timer);
            img.stop = true;
            img.set('src', img.retrieve('photo-' + Cubix.PhotoRoller.thumb));
            return;
        });
    });
};
Cubix.PhotoRoller.Roll = function(img, photos, rollback) {
    rollback = $defined(rollback, false);
    var current = img.retrieve('current-' + Cubix.PhotoRoller.thumb);
    if (!current) current = 2;
    current++;
    if (current > photos.length) current = 1;
    $clear(img.timer);
    var src = photos[current - 1];
    var image = img.image = new Asset.image(src, {
        onload: function() {
            if (img.stop) return;
            img.set('src', src);
            img.timer = (function() {
                Cubix.PhotoRoller.Roll(img, photos);
            }).delay(700);
            image.destroy();
        }
    });
    img.store('current-' + Cubix.PhotoRoller.thumb, current);
};
Cubix.ListSwitcher = {};
Cubix.ListSwitcher.Init = function() {
    window.addEvent('domready', function() {
        Cubix.PhotoRoller.Init();
        if ($defined($$('.switch-view'))) {
            var links = $$('.switch-view a');
            if(links.length){
                var link = links[0];
                var listType = new Element('input',{
                    'type':'hidden',
                    'name':'list_type'
                }).inject(link.getParent());
                links.addEvent('click', function(e) {
                    e.stop();
                    if(!this.hasClass('active')) {
                        links.removeClass('active');
                        var trimmed = this.get('class').trim();
                        listType.set('value', trimmed);
                        Cookie.write('list_type', trimmed, {
                            duration: 30,
                            path: '/'
                        });
                        History.push(translateGet(this.getParent('form')));
                        this.addClass('active');
                    }
                });
            }
        }
    });
};