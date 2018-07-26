GO.moduleManager.onModuleReady('projects2', function() {
	Ext.override(GO.projects2.IncomeDialog, {
		width:800,
		
		buildForm : GO.projects2.IncomeDialog.prototype.buildForm.createSequence(function(){
			
			this.exactShowInvoiceButton = new Ext.Button({
				text: GO.exactonline.lang['showExactInvoice'],
				handler: function() {
					window.open(GO.url('exactonline/invoice/exportExact',{invoiceNumber:this.txtInvoiceNo.getValue(),'incomeId':this.remoteModelId,'toPDF':true}));
					
				},
				
				
				scope: this
			});
			
			this.exactAddInvoiceButton = new Ext.Button({
				text: GO.exactonline.lang['addExactInvoice'],
				handler: function() {
					this.setDisabled(true);
					GO.request({
	//					timeout:300000,
	//					maskEl:Ext.getBody(),
						url:'exactonline/invoice/add',
						params:{
							invoiceNumber:this.txtInvoiceNo.getValue(),
							incomeId:this.remoteModelId
						},
						success: function(options, response, result) {
							this.setDisabled(false);
						},
						callback:function(options, success, response){
							this.setDisabled(false);
						},
						scope:this
					});
//				
				},
				
				
				scope: this
			});
			
			

			// Get the index of the "Old" txtInvoiceNo input.
			var currentFieldIndex = this.propertiesPanel.items.indexOf(this.txtInvoiceNo);

			this.invoiceComp = new Ext.form.CompositeField({
				items:[
					this.txtInvoiceNo,
					this.exactShowInvoiceButton,
					this.exactAddInvoiceButton
				]
			});

			// Replace the "Old" txtInvoiceNo with the new invoiceComp
			this.propertiesPanel.insert(currentFieldIndex,this.invoiceComp);
		})
	});
	
	Ext.override(GO.projects2.TemplateDialog, {
		buildForm: GO.projects2.TemplateDialog.prototype.buildForm.createSequence(function(){	
//			
//			if (GO.util.empty(this.pluginPropertiesFields))
//				this.pluginPropertiesFields = new Array();
			
			this.propertiesPanel.add({
				xtype: 'textfield',
				name: 'exactonline_division_number',
				anchor: '-20',
				fieldLabel: GO.exactonline.lang['divisionNumber']
			});
		})
	});
}, this);


GO.exactonline.downloadSalesInvoice = function(projectId,invoiceNumber) {
	
	
	window.open(GO.url('exactonline/invoice/exportExact',{invoiceNumber:invoiceNumber,'projectId':projectId,'toPDF':true}));
}