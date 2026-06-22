var InitEntry = Class({
    initialize: function (params){
        var body = document.getElement('body');
        this.modal = new Entry({
            width: 640,
            height: 700,
            overlayCloseable: false,
            closeBtnSelector: '',
            overlayClass: 'blurred-overlay',
            modalId: 'windiv-confirm',
            modalClass:'modal advertisement',
            getContent: function (){
                var winsz = window.getSize();
                var frm_title = 'Attention: Le site internet '+ seoHostName +' est reserve e un public majeur';
                var frm_body = '';
                var demogr_div_ext = document.createElement('div');
                demogr_div_ext.setAttribute('class', 'modal advertisement');
                
                var header = document.createElement('div');
                header.setAttribute('class', 'header');
                var txt = document.createTextNode(frm_title);
                header.appendChild(txt);
                header.innerText = frm_title;
                demogr_div_ext.appendChild(header);

                var demogr_div = document.createElement('div');
                demogr_div.setAttribute('id', 'demogr_div');
                demogr_div_ext.appendChild(demogr_div);

              
                var xclose = document.createElement('a');
                xclose.setAttribute('class', 'icon close decline');
                xclose.setAttribute('href', '#');
                demogr_div_ext.appendChild(xclose);
                

                var dv = document.createElement('div');
                dv.setAttribute('id', 'text_more');
                var txt = document.createTextNode(frm_body);
                dv.appendChild(txt);
                demogr_div.appendChild(dv);

                var selects = '<select name="day" class="customized size--sm"><option value="">Jour</option>';
                for(var i=1; i < 32; i++){
                    selects += '<option value="'+i+'">'+i+'</option>';
                }
                selects += '</select>';
                selects += '<select name="month" class="customized size--md"><option value="">Mois</option>';

                let months = Locale.get('Date').months;
                for(i=0; i < 12; i++){
                    selects += '<option value="'+i+'">'+months[i]+'</option>';
                }
                selects += '</select>';
                var today = new Date();
                var maxYear = today.getFullYear();
                selects += '<select name="year" class="customized size--sm"><option value="">Année</option>';
                for(i=maxYear; i > maxYear - 90; i--){
                    selects += '<option value="'+i+'">'+i+'</option>';
                }
                selects += '</select>';

                var newSpan = document.createElement("div");
                newSpan.innerHTML = '<div class="content"><h2>Avertissement</h2>Cette partie du site est un service réservé à un public majeur et averti. Ce service peut contenir des textes et des photos qui peuvent être choquants pour certaines sensibilités.<br><br><b>Je certifie sur l\'honneur :</b><br>- être majeur selon la loi en vigueur dans mon pays de résidence,<br>- être informé du caractère pour adultes de cette partie du site,<br>- que mon pays de résidence m\'autorise à consulter ce service,<br>- consulter ce service à titre personnel sans impliquer de quelque manière que ce soit une société privée ou un organisme public.<br><br><b>Je m\'engage sur l\'honneur à :</b><br>- ne pas faire état de l\'existence de ce service et à ne pas en diffuser le contenu à des mineurs,<br>- utiliser tous les moyens permettant d\'empécher l\'accès de ce service à tout mineur,<br>- ne pas poursuivre la société éditrice de toute action judiciaire,<br>- assumer ma responsabilité si un mineur accède à ce service à cause de ma négligence,<br>- assumer ma responsabilité si une ou plusieurs de mes présentes déclarations sont inexactes.<br><br><b>Censure et respect des lois internationales</b><br>Toute annonce ne respectant pas les législations internationales sera immédiatement censurée par nos modérateurs. Les services sexuels tarifés sont strictement interdits. Le site '+ seoHostName +' ne peut en aucun cas être tenu pour responsable du contenu des annonces. En cas de plainte, l\'éditeur de ' + seoHostName + ' se réserve le droit de transmettre vos coordonnées numériques et autres éventuelles informations aux autorités compétentes. Pour plus d\'informations, nous vous invitons à consulter nos conditions générales d\'utilisation.<br><br><b>Protection des mineurs et filtre parental</b><br>Aux parents soucieux que leur enfant soit facilement confronté à du contenu pornographique sur Internet, nous vous recommandons l\'installation de filtres. Faites une recherche sur les termes « contrôle parental » à partir de votre moteur de recherche habituel.	</div> ' +
                    '<div class="confirm-text">Je certifie être d\'accord avec les règles qui précèdent et je signe électroniquement mon accord :' +
                    '<input type="checkbox" class="customized" name="accept" id="accept-conditions" value="1"><label for="accept-conditions" class="red">J\'ai lu les ' +
                    '<a href="/tos/" target="_blank">terms and conditions</a></label>' +
                    '<div class="inline--rows start--position"><label class="right--offset--sm">Veuillez saisir votre date de naissance</label><div class="input-holder">' + selects + '</div></div>' +
                    '</div><div class="red error-accept hidden">Veuillez accepter les termes et conditions</div>' +
                    '<div class="red error-age hidden">Vous devez avoir au moins 18 ans.</div>';


                dv.appendChild(newSpan);

                var buttonHolder = document.createElement('div');
                buttonHolder.setAttribute('class', 'button-holder');
                demogr_div.appendChild(buttonHolder);

                var cancelLink = document.createElement('a');
                cancelLink.setAttribute('href', '#');
                cancelLink.setAttribute('class', 'cancel decline');
                var txt = document.createTextNode('ANNULER');
                cancelLink.appendChild(txt);
                buttonHolder.appendChild(cancelLink);



                var okLink = document.createElement('a');
                okLink.setAttribute('href', '#');
                okLink.setAttribute('class', 'save');
                var txt = document.createTextNode('OK');
                okLink.appendChild(txt);
                buttonHolder.appendChild(okLink);

                var cl = document.createElement('div');
                cl.style.clear = 'left';
                demogr_div.appendChild(cl);

                return demogr_div_ext.get('html');
            },
            afterContentLoaded: function (){
                body.setStyles({'overflow': 'hidden'});
                var errorAccept = this.windiv.getElement('.error-accept');
                var errorAge = this.windiv.getElement('.error-age');
                
                new CustomForm({container:this.windiv});
                this.windiv.getElement('.save').addEvent('click', function(e){
                    var today = new Date();
                    errorAccept.addClass('hidden');
                    errorAge.addClass('hidden');
                    if (!e) e = window.event;
                    e.stop();
                    if(!this.windiv.getElement('[name="accept"]').get('checked')) {
                        errorAccept.removeClass('hidden');
                        return;
                    }
                    var day = this.windiv.getElement('[name="day"]').get('value');
                    var month = this.windiv.getElement('[name="month"]').get('value');
                    var year = this.windiv.getElement('[name="year"]').get('value');
                    if(day === '' || month === '' || year === ''){
                        return;
                    }
                    month = parseInt(month) + 1;
                    var birdthdateStr = year + '-' + month.toString() + '-' + day;
                    var birdthdate = new Date(birdthdateStr);
                    var diffYears = today.getFullYear() - birdthdate.getFullYear();
                    var diffMonths = today.getMonth() - birdthdate.getMonth();
                    var diffDays = today.getDate() - birdthdate.getDate();
                    if (diffYears < 18 || (diffYears === 18 && (diffMonths < 0 || (diffMonths === 0 && diffDays < 0)))) {
                        errorAge.removeClass('hidden');
                        return;
                    }
                    body.setStyles({'overflow': 'auto'});
                    Cookie.write('displd', '1', {
                        duration: 365,
                        path: '/'
                    });
                    this.close();
                }.bind(this));
                this.windiv.getElements('.decline').each(function(link){
                    link.addEvent('click', function (e){
                        document.location = 'http://google.fr/';
                    })
                });
            }
        });
        
    }
})




