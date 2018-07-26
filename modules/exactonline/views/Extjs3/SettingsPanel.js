
Ext.namespace('GO.exactonline');

GO.exactonline.SettingsPanel = Ext.extend(Ext.Panel, {
	
	constructor: function() {
		
		
		this.apiParamsFieldSet = new Ext.form.FieldSet({
			title: 'API',
//			title:GO.exactonline.lang.name,
			items:[
				new Ext.Container({
					html: GO.exactonline.lang.exactonlineAPIDescription +"<hr/>"
				}),
				this.exactOnlineApi = new Ext.Panel({
					labelWidth: 200,
					layout: 'form',
					items: [
						
						this.clientIdField = new Ext.form.TextField({
							name : 'clientId',
							allowBlank : true,
							fieldLabel : GO.exactonline.lang.clientId,
							anchor:'100%'
						}),

						this.clientSecretField = new Ext.form.TextField({
							name : 'clientSecret',
							allowBlank : true,
							fieldLabel : GO.exactonline.lang.clientSecret,
							anchor:'100%'
						}),
						
						this.usernameField = new Ext.form.TextField({
							name : 'username',
							allowBlank : true,
							fieldLabel : GO.exactonline.lang.username,
							anchor:'100%'
						}),
						this.productsIdField = new Ext.form.TextField({
							name : 'productsId',
							allowBlank : true,
							fieldLabel : GO.exactonline.lang.productsId,
							anchor:'100%'
						}),
						
						this.expiresInField = new Ext.form.DisplayField({
//							name : 'expirationtoken',
							name : 'expiresIn',
							allowBlank : true,
							fieldLabel : GO.exactonline.lang.expirationtoken,
							anchor:'100%'
						})
						
						
					],
					buttons: [
						this.connect = new Ext.Button({
							text: GO.exactonline.lang.connect,
							handler: function() {
//								GO.request({
//									url:'exactonline/oauth/getAccessToken',
//									params:{
//										
//									},
//									scope:this
//								});
//reset: true
								window.open(GO.url('exactonline/oauth/getAccessToken',{}));
							},
							scope:this
						})
					]
				})
				
			]
		});
		
		
		
		
//		this.add(this.apiParamsFieldSet);

	Ext.apply(this, {
//			cls : 'go-form-panel',
			border : false,
//			layout:'form',
			title: GO.exactonline.lang.name,
			items:[
				this.apiParamsFieldSet
			]
		});
		
		GO.exactonline.SettingsPanel.superclass.constructor.call(this);
	}

	
	
})



