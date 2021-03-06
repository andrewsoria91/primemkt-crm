GO.billing.ExportIncomeDialog = Ext.extend(GO.Window,{

	exportController : "billing/exportIncome",
	
	initComponent : function(){

		Ext.applyIf(this,{
			title:GO.billing.lang.exportIncome,
			modal:false,			
			height: 120,
			width: 220,		
			layout:'form',
			closeAction:'hide',
			buttons: [
				{				
					text: GO.lang['cmdOk'],
					handler: function(){this.submitForm()},
					scope:this
				},{				
					text: GO.lang['cmdClose'],
					handler: function(){this.hide()},
					scope:this
				}
			]
    });

		this.yearStore = new Ext.data.ArrayStore({
			fields: ['year'],
			idIndex: 0
		});
		
		var currentTime = new Date();
		this.thisYear = currentTime.getFullYear();
		
		var data = [];
		for(var i=this.thisYear-5; i < this.thisYear+5; i++){
			data.push([i]);
		}
		
		this.yearStore.loadData(data);
		
		this.yearCombo = new GO.form.ComboBox({
			fieldLabel: GO.lang.strYear,
			hiddenName:'year',
			anchor:'100%',
			value: this.thisYear,
			store: this.yearStore,
			valueField:'year',
			displayField:'year',
			mode: 'local',
			triggerAction: 'all',
			editable: true,
			selectOnFocus:true,
			forceSelection: true,
			allowBlank: false
		});

//		this.yearSelect = new Ext.form.DateField({
//			name: 'year',
//			format: 'Y',
//			allowBlank:false,
//			fieldLabel: GO.lang.strYear
//		});

		this.formPanel = new Ext.form.FormPanel({
			standardSubmit:true,
			cls:'go-form-panel',
			labelWidth:30,
			autoHeight:true,
			url:GO.url(this.exportController+'/export'),
			items:this.yearCombo
		});
		
		this.items=[
			this.formPanel
		]
		 
		GO.dialog.ExportDialog.superclass.initComponent.call(this);
	},

	submitForm : function(){
		this.formPanel.form.getEl().dom.target='_blank';
		
		this.formPanel.form.submit(
		{
			failure: function(form, action) {
				if(action.failureType == 'client')			
					Ext.MessageBox.alert(GO.lang['strError'], GO.lang['strErrorsInForm']);			
			 
			},
			scope: this
		});			
	}
	
});