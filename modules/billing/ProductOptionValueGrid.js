GO.billing.ProductOptionValueGrid = Ext.extend(GO.grid.GridPanel,{
	changed : false,
	
	initComponent : function(){
		
		Ext.apply(this,{
      title: GO.billing.lang.optionSelections,
			standardTbar:true,
			standardTbarDisabled:!GO.settings.modules.billing.write_permission,
			hideSearchField:true,
			store: GO.billing.productOptionValueStore,
			border: false,
			paging:true,
			view:new Ext.grid.GridView({
				autoFill: true,
				forceFit: true,
				emptyText: GO.lang['strNoItems']		
			}),
			cm:new Ext.grid.ColumnModel({
				defaults:{
					sortable:false
				},
				columns:[
          {
            header: GO.billing.lang.optionSelections,
            dataIndex: 'name'
          },
					{
            header: GO.billing.lang.price,
            dataIndex: 'value',
						align:'right'
          }
        ]
			})
		});
		
		GO.billing.ProductOptionValueGrid.superclass.initComponent.call(this);
		
		GO.billing.productOptionValueStore.load();	
	},
	
	dblClick : function(grid, record, rowIndex){
		this.showProductOptionValueDialog(record.id);
	},
	
	btnAdd : function(){				
		this.showProductOptionValueDialog();	  	
	},
	showProductOptionValueDialog : function(id){
		if(!this.productOptionValueDialog){
			this.productOptionValueDialog = new GO.billing.ProductOptionValueDialog();

			this.productOptionValueDialog.on('save', function(){   
				this.store.load();
				this.changed=true;	    			    			
			}, this);	
		}
		this.productOptionValueDialog.setProductOptionId(this.store.baseParams.product_option_id);
		this.productOptionValueDialog.show(id);	  
	},
	deleteSelected : function(){
		GO.billing.ProductOptionValueGrid.superclass.deleteSelected.call(this);
		this.changed=true;
	}
});